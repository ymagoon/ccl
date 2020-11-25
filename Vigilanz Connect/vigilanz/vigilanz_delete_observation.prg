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
      Source file name:     snsro_delete_observation.prg
      Object name:          vigilanz_delete_observation
      Program purpose:      In Error an observation in millennium
      Executing from:       MPages Discern Web Service
*************************************************************************
                    MODIFICATION CONTROL LOG
 ************************************************************************
 Mod Date     Engineer             Comment
 ------------------------------------------------------------------------
 000 10/02/18 RJC					Initial Write
 ************************************************************************/
drop program vigilanz_delete_observation go
create program vigilanz_delete_observation
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        		;required
		, "Observation ID:" = ""		;required
		, "Status Id:" = ""				;required - In Error is the only option
		, "Reason:" = ""				;required - could be a code value or freetext
		, "Comment:" = ""				;optional unless ReasonId of 'Other' is chosen
		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, USERNAME, OBS_ID, STATUS_ID, REASON, COMMENT, DEBUG_FLAG
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
;1000011 event_detail_query
free record 1000011_req
record 1000011_req (
  1 query_mode  = i4
  1 query_mode_ind = i2
  1 event_id = f8
  1 contributor_system_cd = f8
  1 reference_nbr = vc
  1 dataset_uid = vc
  1 subtable_bit_map = i4
  1 subtable_bit_map_ind = i2
  1 valid_from_dt_tm = dq8
  1 valid_from_dt_tm_ind = i2
  1 decode_flag = i2
  1 ordering_provider_id = f8
  1 action_prsnl_id = f8
  1 event_id_list [*]
    2 event_id = f8
  1 action_type_cd_list [*]
    2 action_type_cd = f8
  1 src_event_id_ind = i2
  1 action_prsnl_group_id = f8
  1 query_mode2  = i4
  1 event_uuid = vc
)
 
free record 1000011_rep
record 1000011_rep (
  1 sb
    2 severityCd = i4
    2 statusCd = i4
    2 statusText = vc
  1 rb_list [*]
    2 clinical_event_id = f8
    2 event_id = f8
    2 valid_until_dt_tm = dq8
    2 valid_until_dt_tm_ind = i2
    2 clinsig_updt_dt_tm = dq8
    2 clinsig_updt_dt_tm_ind = i2
    2 view_level = i4
    2 view_level_ind = i2
    2 order_id = f8
    2 catalog_cd = f8
    2 catalog_cd_disp = vc
    2 series_ref_nbr = vc
    2 person_id = f8
    2 encntr_id = f8
    2 encntr_financial_id = f8
    2 accession_nbr = vc
    2 contributor_system_cd = f8
    2 contributor_system_cd_disp = vc
    2 reference_nbr = vc
    2 parent_event_id = f8
    2 valid_from_dt_tm = dq8
    2 valid_from_dt_tm_ind = i2
    2 event_class_cd = f8
    2 event_class_cd_disp = vc
    2 event_cd = f8
    2 event_cd_disp = vc
    2 event_cd_desc = vc
    2 event_tag = vc
    2 event_reltn_cd = f8
    2 event_reltn_cd_disp = vc
    2 event_start_dt_tm = dq8
    2 event_start_dt_tm_ind = i2
    2 event_end_dt_tm = dq8
    2 event_end_dt_tm_ind = i2
    2 event_end_dt_tm_os = f8
    2 event_end_dt_tm_os_ind = i2
    2 task_assay_cd = f8
    2 record_status_cd = f8
    2 record_status_cd_disp = vc
    2 result_status_cd = f8
    2 result_status_cd_disp = vc
    2 authentic_flag = i2
    2 authentic_flag_ind = i2
    2 publish_flag = i2
    2 publish_flag_ind = i2
    2 qc_review_cd = f8
    2 qc_review_cd_disp = vc
    2 normalcy_cd = f8
    2 normalcy_cd_disp = vc
    2 normalcy_cd_mean = vc
    2 normalcy_method_cd = f8
    2 normalcy_method_cd_disp = vc
    2 inquire_security_cd = f8
    2 inquire_security_cd_disp = vc
    2 resource_group_cd = f8
    2 resource_group_cd_disp = vc
    2 resource_cd = f8
    2 resource_cd_disp = vc
    2 subtable_bit_map = i4
    2 subtable_bit_map_ind = i2
    2 event_title_text = vc
    2 collating_seq = vc
    2 result_val = vc
    2 result_units_cd = f8
    2 result_units_cd_disp = vc
    2 result_time_units_cd = f8
    2 result_time_units_cd_disp = vc
    2 verified_dt_tm = dq8
    2 verified_dt_tm_ind = i2
    2 verified_prsnl_id = f8
    2 performed_dt_tm = dq8
    2 performed_dt_tm_ind = i2
    2 performed_prsnl_id = f8
    2 normal_low = vc
    2 normal_high = vc
    2 critical_low = vc
    2 critical_high = vc
    2 expiration_dt_tm = dq8
    2 expiration_dt_tm_ind = i2
    2 note_importance_bit_map = i2
    2 event_tag_set_flag = i2
    2 updt_dt_tm = dq8
    2 updt_dt_tm_ind = i2
    2 updt_id = f8
    2 updt_task = i4
    2 updt_task_ind = i2
    2 updt_cnt = i4
    2 updt_cnt_ind = i2
    2 updt_applctx = i4
    2 updt_applctx_ind = i2
    2 io_result [*]
      3 ce_io_result_id = f8
      3 event_id = f8
      3 person_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 io_dt_tm = dq8
      3 io_dt_tm_ind = i2
      3 type_cd = f8
      3 type_cd_disp = vc
      3 type_cd_mean = vc
      3 group_cd = f8
      3 group_cd_disp = vc
      3 group_cd_mean = vc
      3 volume = f8
      3 volume_ind = i2
      3 authentic_flag = i2
      3 authentic_flag_ind = i2
      3 record_status_cd = f8
      3 record_status_cd_disp = vc
      3 record_status_cd_mean = vc
      3 io_comment = vc
      3 system_note = vc
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
    2 specimen_coll [*]
      3 event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 specimen_id = f8
      3 container_id = f8
      3 container_type_cd = f8
      3 container_type_cd_disp = vc
      3 container_type_cd_mean = vc
      3 specimen_status_cd = f8
      3 specimen_status_cd_disp = vc
      3 specimen_status_cd_mean = vc
      3 collect_dt_tm = dq8
      3 collect_dt_tm_ind = i2
      3 collect_method_cd = f8
      3 collect_method_cd_disp = vc
      3 collect_method_cd_mean = vc
      3 collect_loc_cd = f8
      3 collect_loc_cd_disp = vc
      3 collect_loc_cd_mean = vc
      3 collect_prsnl_id = f8
      3 collect_volume = f8
      3 collect_volume_ind = i2
      3 collect_unit_cd = f8
      3 collect_unit_cd_disp = vc
      3 collect_unit_cd_mean = vc
      3 collect_priority_cd = f8
      3 collect_priority_cd_disp = vc
      3 collect_priority_cd_mean = vc
      3 source_type_cd = f8
      3 source_type_cd_disp = vc
      3 source_type_cd_mean = vc
      3 source_text = vc
      3 body_site_cd = f8
      3 body_site_cd_disp = vc
      3 body_site_cd_mean = vc
      3 danger_cd = f8
      3 danger_cd_disp = vc
      3 danger_cd_mean = vc
      3 positive_ind = i2
      3 positive_ind_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 specimen_trans_list [*]
        4 event_id = f8
        4 sequence_nbr = i4
        4 sequence_nbr_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 transfer_dt_tm = dq8
        4 transfer_dt_tm_ind = i2
        4 transfer_prsnl_id = f8
        4 transfer_loc_cd = f8
        4 transfer_loc_cd_disp = vc
        4 receive_dt_tm = dq8
        4 receive_dt_tm_ind = i2
        4 receive_prsnl_id = f8
        4 receive_loc_cd = f8
        4 receive_loc_cd_disp = vc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
      3 collect_tz = i4
      3 recvd_dt_tm = dq8
      3 recvd_tz = i4
    2 blob_result [*]
      3 event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 max_sequence_nbr = i4
      3 max_sequence_nbr_ind = i2
      3 checksum = i4
      3 checksum_ind = i2
      3 succession_type_cd = f8
      3 succession_type_cd_disp = vc
      3 sub_series_ref_nbr = vc
      3 storage_cd = f8
      3 storage_cd_disp = vc
      3 format_cd = f8
      3 format_cd_disp = vc
      3 device_cd = f8
      3 device_cd_disp = vc
      3 blob_handle = vc
      3 blob_attributes = vc
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 blob [*]
        4 event_id = f8
        4 blob_seq_num = i4
        4 blob_seq_num_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 blob_length = i4
        4 blob_length_ind = i2
        4 compression_cd = f8
        4 compression_cd_disp = vc
        4 blob_contents = gvc
        4 blob_contents_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
      3 blob_summary [*]
        4 ce_blob_summary_id = f8
        4 blob_summary_id = f8
        4 blob_length = i4
        4 blob_length_ind = i2
        4 format_cd = f8
        4 compression_cd = f8
        4 checksum = i4
        4 checksum_ind = i2
        4 long_blob = gvc
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 event_id = f8
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_id = f8
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
    2 string_result [*]
      3 event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 string_result_text = vc
      3 string_result_format_cd = f8
      3 string_result_format_cd_disp = vc
      3 equation_id = f8
      3 last_norm_dt_tm = dq8
      3 last_norm_dt_tm_ind = i2
      3 unit_of_measure_cd = f8
      3 unit_of_measure_cd_disp = vc
      3 feasible_ind = i2
      3 feasible_ind_ind = i2
      3 inaccurate_ind = i2
      3 inaccurate_ind_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 interp_comp_list [*]
        4 event_id = f8
        4 comp_idx = i4
        4 comp_idx_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 comp_event_id = f8
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 comp_name = vc
      3 calculation_equation = vc
      3 string_long_text_id = f8
    2 blood_transfuse [*]
      3 event_id = f8
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 transfuse_start_dt_tm = dq8
      3 transfuse_start_dt_tm_ind = i2
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 transfuse_end_dt_tm = dq8
      3 transfuse_end_dt_tm_ind = i2
      3 transfuse_note = vc
      3 transfuse_route_cd = f8
      3 transfuse_site_cd = f8
      3 transfuse_pt_loc_cd = f8
      3 initial_volume = f8
      3 total_intake_volume = f8
      3 transfusion_rate = f8
      3 transfusion_unit_cd = f8
      3 transfusion_time_cd = f8
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
    2 apparatus [*]
      3 event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 apparatus_type_cd = f8
      3 apparatus_type_cd_disp = vc
      3 apparatus_serial_nbr = vc
      3 apparatus_size_cd = f8
      3 apparatus_size_cd_disp = vc
      3 body_site_cd = f8
      3 body_site_cd_disp = vc
      3 insertion_pt_loc_cd = f8
      3 insertion_pt_loc_cd_disp = vc
      3 insertion_prsnl_id = f8
      3 removal_pt_loc_cd = f8
      3 removal_pt_loc_cd_disp = vc
      3 removal_prsnl_id = f8
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 assistant_list [*]
        4 event_id = f8
        4 assistant_type_cd = f8
        4 assistant_type_cd_disp = vc
        4 assistant_type_cd_mean = vc
        4 sequence_nbr = i4
        4 sequence_nbr_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 assistant_prsnl_id = f8
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
    2 product [*]
      3 event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 product_id = f8
      3 product_nbr = vc
      3 product_cd = f8
      3 product_cd_disp = vc
      3 product_cd_mean = vc
      3 abo_cd = f8
      3 abo_cd_disp = vc
      3 abo_cd_mean = vc
      3 rh_cd = f8
      3 rh_cd_disp = vc
      3 rh_cd_mean = vc
      3 product_status_cd = f8
      3 product_status_cd_disp = vc
      3 product_status_cd_mean = vc
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 product_antigen_list [*]
        4 event_id = f8
        4 prod_ant_seq_nbr = i4
        4 prod_ant_seq_nbr_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 antigen_cd = f8
        4 antigen_cd_disp = vc
        4 antigen_cd_mean = vc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 attribute_ind = i2
      3 product_volume = f8
      3 product_volume_unit_cd = f8
      3 product_quantity = f8
      3 product_quantity_unit_cd = f8
      3 product_strength = f8
      3 product_strength_unit_cd = f8
    2 date_result [*]
      3 event_id = f8
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 result_dt_tm = dq8
      3 result_dt_tm_ind = i2
      3 result_dt_tm_os = f8
      3 result_dt_tm_os_ind = i2
      3 date_type_flag = i2
      3 date_type_flag_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 result_tz = i4
      3 result_tz_ind = i2
    2 med_result_list [*]
      3 event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 admin_note = vc
      3 admin_prov_id = f8
      3 admin_start_dt_tm = dq8
      3 admin_start_dt_tm_ind = i2
      3 admin_end_dt_tm = dq8
      3 admin_end_dt_tm_ind = i2
      3 admin_route_cd = f8
      3 admin_route_cd_disp = vc
      3 admin_route_cd_mean = vc
      3 admin_site_cd = f8
      3 admin_site_cd_disp = vc
      3 admin_site_cd_mean = vc
      3 admin_method_cd = f8
      3 admin_method_cd_disp = vc
      3 admin_method_cd_mean = vc
      3 admin_pt_loc_cd = f8
      3 admin_pt_loc_cd_disp = vc
      3 admin_pt_loc_cd_mean = vc
      3 initial_dosage = f8
      3 initial_dosage_ind = i2
      3 admin_dosage = f8
      3 admin_dosage_ind = i2
      3 dosage_unit_cd = f8
      3 dosage_unit_cd_disp = vc
      3 dosage_unit_cd_mean = vc
      3 initial_volume = f8
      3 initial_volume_ind = i2
      3 total_intake_volume = f8
      3 total_intake_volume_ind = i2
      3 diluent_type_cd = f8
      3 diluent_type_cd_disp = vc
      3 diluent_type_cd_mean = vc
      3 ph_dispense_id = f8
      3 infusion_rate = f8
      3 infusion_rate_ind = i2
      3 infusion_unit_cd = f8
      3 infusion_unit_cd_disp = vc
      3 infusion_unit_cd_mean = vc
      3 infusion_time_cd = f8
      3 infusion_time_cd_disp = vc
      3 infusion_time_cd_mean = vc
      3 medication_form_cd = f8
      3 medication_form_cd_disp = vc
      3 medication_form_cd_mean = vc
      3 reason_required_flag = i2
      3 reason_required_flag_ind = i2
      3 response_required_flag = i2
      3 response_required_flag_ind = i2
      3 admin_strength = i4
      3 admin_strength_ind = i2
      3 admin_strength_unit_cd = f8
      3 admin_strength_unit_cd_disp = vc
      3 admin_strength_unit_cd_mean = vc
      3 substance_lot_number = vc
      3 substance_exp_dt_tm = dq8
      3 substance_exp_dt_tm_ind = i2
      3 substance_manufacturer_cd = f8
      3 substance_manufacturer_cd_disp = vc
      3 substance_manufacturer_cd_mean = vc
      3 refusal_cd = f8
      3 refusal_cd_disp = vc
      3 refusal_cd_mean = vc
      3 system_entry_dt_tm = dq8
      3 system_entry_dt_tm_ind = i2
      3 iv_event_cd = f8
      3 infused_volume = f8
      3 infused_volume_unit_cd = f8
      3 infused_volume_unit_cd_disp = vc
      3 infused_volume_unit_cd_mean = vc
      3 remaining_volume = f8
      3 remaining_volume_unit_cd = f8
      3 remaining_volume_unit_cd_disp = vc
      3 remaining_volume_unit_cd_mean = vc
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 synonym_id = f8
      3 immunization_type_cd = f8
      3 immunization_type_cd_disp = vc
      3 immunization_type_cd_mean = vc
      3 admin_start_tz = i4
      3 admin_end_tz = i4
      3 contributor_link_list [*]
        4 event_id = f8
        4 contributor_event_id = f8
        4 ce_valid_from_dt_tm = dq8
        4 type_flag = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 ce_valid_until_dt_tm = dq8
        4 ce_result_value = vc
        4 ce_performed_prsnl_id = f8
        4 ce_event_end_dt_tm = dq8
        4 ce_event_cd = f8
        4 ce_event_cd_disp = vc
        4 ce_clinical_event_id = f8
        4 ce_event_class_cd = f8
        4 ce_event_class_cd_disp = vc
        4 string_result_list [*]
          5 event_id = f8
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 string_result_text = vc
          5 string_result_format_cd = f8
          5 string_result_format_cd_disp = vc
          5 equation_id = f8
          5 last_norm_dt_tm = dq8
          5 last_norm_dt_tm_ind = i2
          5 unit_of_measure_cd = f8
          5 unit_of_measure_cd_disp = vc
          5 feasible_ind = i2
          5 feasible_ind_ind = i2
          5 inaccurate_ind = i2
          5 inaccurate_ind_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 interp_comp_list [*]
            6 event_id = f8
            6 comp_idx = i4
            6 comp_idx_ind = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 comp_event_id = f8
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 comp_name = vc
          5 calculation_equation = vc
          5 string_long_text_id = f8
        4 coded_result_list [*]
          5 event_id = f8
          5 sequence_nbr = i4
          5 sequence_nbr_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 nomenclature_id = f8
          5 result_set = i4
          5 result_set_ind = i2
          5 result_cd = f8
          5 result_cd_disp = vc
          5 acr_code_str = vc
          5 proc_code_str = vc
          5 pathology_str = vc
          5 group_nbr = i4
          5 group_nbr_ind = i2
          5 mnemonic = vc
          5 short_string = vc
          5 descriptor = vc
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 unit_of_measure_cd = f8
          5 source_string = vc
        4 date_result_list [*]
          5 event_id = f8
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 result_dt_tm = dq8
          5 result_dt_tm_ind = i2
          5 result_dt_tm_os = f8
          5 result_dt_tm_os_ind = i2
          5 date_type_flag = i2
          5 date_type_flag_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 result_tz = i4
          5 result_tz_ind = i2
        4 ce_result_status_cd = f8
        4 ce_result_status_cd_disp = vc
        4 ce_event_end_tz = i4
      3 weight_value = f8
      3 weight_unit_cd = f8
    2 event_note_list [*]
      3 ce_event_note_id = f8
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 event_note_id = f8
      3 event_id = f8
      3 note_type_cd = f8
      3 note_type_cd_disp = vc
      3 note_type_cd_mean = vc
      3 note_format_cd = f8
      3 note_format_cd_disp = vc
      3 note_format_cd_mean = vc
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 entry_method_cd = f8
      3 entry_method_cd_disp = vc
      3 entry_method_cd_mean = vc
      3 note_prsnl_id = f8
      3 note_dt_tm = dq8
      3 note_dt_tm_ind = i2
      3 record_status_cd = f8
      3 record_status_cd_disp = vc
      3 record_status_cd_mean = vc
      3 compression_cd = f8
      3 compression_cd_disp = vc
      3 compression_cd_mean = vc
      3 checksum = i4
      3 checksum_ind = i2
      3 long_blob = gvc
      3 long_text = vc
      3 long_text_id = f8
      3 non_chartable_flag = i2
      3 importance_flag = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 note_tz = i4
    2 event_prsnl_list [*]
      3 ce_event_prsnl_id = f8
      3 event_prsnl_id = f8
      3 person_id = f8
      3 event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 action_type_cd = f8
      3 action_type_cd_disp = vc
      3 request_dt_tm = dq8
      3 request_dt_tm_ind = i2
      3 request_prsnl_id = f8
      3 request_prsnl_ft = vc
      3 request_comment = vc
      3 action_dt_tm = dq8
      3 action_dt_tm_ind = i2
      3 action_prsnl_id = f8
      3 action_prsnl_ft = vc
      3 proxy_prsnl_id = f8
      3 proxy_prsnl_ft = vc
      3 action_status_cd = f8
      3 action_status_cd_disp = vc
      3 action_comment = vc
      3 change_since_action_flag = i2
      3 change_since_action_flag_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 long_text_id = f8
      3 long_text = vc
      3 linked_event_id = f8
      3 request_tz = i4
      3 action_tz = i4
      3 system_comment = vc
      3 event_action_modifier_list [*]
        4 ce_event_action_modifier_id = f8
        4 event_action_modifier_id = f8
        4 event_id = f8
        4 event_prsnl_id = f8
        4 action_type_modifier_cd = f8
        4 action_type_modifier_cd_disp = vc
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
      3 digital_signature_ident = vc
      3 action_prsnl_group_id = f8
      3 request_prsnl_group_id = f8
      3 receiving_person_id = f8
      3 receiving_person_ft = vc
    2 microbiology_list [*]
      3 event_id = f8
      3 micro_seq_nbr = i4
      3 micro_seq_nbr_ind = i2
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 organism_cd = f8
      3 organism_cd_disp = vc
      3 organism_cd_desc = vc
      3 organism_cd_mean = vc
      3 organism_occurrence_nbr = i4
      3 organism_occurrence_nbr_ind = i2
      3 organism_type_cd = f8
      3 organism_type_cd_disp = vc
      3 organism_type_cd_mean = vc
      3 observation_prsnl_id = f8
      3 biotype = vc
      3 probability = f8
      3 positive_ind = i2
      3 positive_ind_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 susceptibility_list [*]
        4 event_id = f8
        4 micro_seq_nbr = i4
        4 micro_seq_nbr_ind = i2
        4 suscep_seq_nbr = i4
        4 suscep_seq_nbr_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 susceptibility_test_cd = f8
        4 susceptibility_test_cd_disp = vc
        4 susceptibility_test_cd_mean = vc
        4 detail_susceptibility_cd = f8
        4 detail_susceptibility_cd_disp = vc
        4 detail_susceptibility_cd_mean = vc
        4 panel_antibiotic_cd = f8
        4 panel_antibiotic_cd_disp = vc
        4 panel_antibiotic_cd_mean = vc
        4 antibiotic_cd = f8
        4 antibiotic_cd_disp = vc
        4 antibiotic_cd_desc = vc
        4 antibiotic_cd_mean = vc
        4 diluent_volume = f8
        4 diluent_volume_ind = i2
        4 result_cd = f8
        4 result_cd_disp = vc
        4 result_cd_mean = vc
        4 result_text_value = vc
        4 result_numeric_value = f8
        4 result_numeric_value_ind = i2
        4 result_unit_cd = f8
        4 result_unit_cd_disp = vc
        4 result_unit_cd_mean = vc
        4 result_dt_tm = dq8
        4 result_dt_tm_ind = i2
        4 result_prsnl_id = f8
        4 susceptibility_status_cd = f8
        4 susceptibility_status_cd_disp = vc
        4 susceptibility_status_cd_mean = vc
        4 abnormal_flag = i2
        4 abnormal_flag_ind = i2
        4 chartable_flag = i2
        4 chartable_flag_ind = i2
        4 nomenclature_id = f8
        4 antibiotic_note = vc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 result_tz = i4
    2 coded_result_list [*]
      3 event_id = f8
      3 sequence_nbr = i4
      3 sequence_nbr_ind = i2
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 nomenclature_id = f8
      3 result_set = i4
      3 result_set_ind = i2
      3 result_cd = f8
      3 result_cd_disp = vc
      3 acr_code_str = vc
      3 proc_code_str = vc
      3 pathology_str = vc
      3 group_nbr = i4
      3 group_nbr_ind = i2
      3 mnemonic = vc
      3 short_string = vc
      3 descriptor = vc
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 unit_of_measure_cd = f8
      3 source_string = vc
    2 linked_result_list [*]
      3 linked_event_id = f8
      3 order_id = f8
      3 encntr_id = f8
      3 accession_nbr = vc
      3 contributor_system_cd = f8
      3 contributor_system_cd_disp = vc
      3 reference_nbr = vc
      3 event_class_cd = f8
      3 event_class_cd_disp = vc
      3 series_ref_nbr = vc
      3 sub_series_ref_nbr = vc
      3 succession_type_cd = f8
      3 succession_type_cd_disp = vc
      3 child_event [*]
      3 event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_id = f8
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
    2 event_modifier_list [*]
      3 modifier_cd = f8
      3 modifier_cd_disp = vc
      3 modifier_value_cd = f8
      3 modifier_value_cd_disp = vc
      3 modifier_val_ft = vc
      3 modifier_value_person_id = f8
      3 event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_id = f8
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 group_sequence = i4
      3 item_sequence = i4
    2 suscep_footnote_r_list [*]
      3 event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 micro_seq_nbr = i4
      3 micro_seq_nbr_ind = i2
      3 suscep_seq_nbr = i4
      3 suscep_seq_nbr_ind = i2
      3 suscep_footnote_id = f8
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 suscep_footnote [*]
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 ce_suscep_footnote_id = f8
        4 suscep_footnote_id = f8
        4 checksum = i4
        4 checksum_ind = i2
        4 compression_cd = f8
        4 format_cd = f8
        4 contributor_system_cd = f8
        4 blob_length = i4
        4 blob_length_ind = i2
        4 reference_nbr = vc
        4 long_blob = gvc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
    2 inventory_result_list [*]
      3 item_id = f8
      3 serial_nbr = vc
      3 serial_mnemonic = vc
      3 description = vc
      3 item_nbr = vc
      3 quantity = f8
      3 quantity_ind = i2
      3 body_site = vc
      3 reference_entity_id = f8
      3 reference_entity_name = vc
      3 implant_result [*]
        4 item_id = f8
        4 item_size = vc
        4 harvest_site = vc
        4 culture_ind = i2
        4 culture_ind_ind = i2
        4 tissue_graft_type_cd = f8
        4 tissue_graft_type_cd_disp = vc
        4 explant_reason_cd = f8
        4 explant_reason_cd_disp = vc
        4 explant_disposition_cd = f8
        4 explant_disposition_cd_disp = vc
        4 reference_entity_id = f8
        4 reference_entity_name = vc
        4 manufacturer_cd = f8
        4 manufacturer_cd_disp = vc
        4 manufacturer_ft = vc
        4 model_nbr = vc
        4 lot_nbr = vc
        4 other_identifier = vc
        4 expiration_dt_tm = dq8
        4 expiration_dt_tm_ind = i2
        4 ecri_code = vc
        4 batch_nbr = vc
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_id = f8
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
      3 inv_time_result_list [*]
        4 item_id = f8
        4 start_dt_tm = dq8
        4 start_dt_tm_ind = i2
        4 end_dt_tm = dq8
        4 end_dt_tm_ind = i2
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_id = f8
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
      3 event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_id = f8
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
    2 child_event_list [*]
      3 clinical_event_id = f8
      3 event_id = f8
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 clinsig_updt_dt_tm = dq8
      3 clinsig_updt_dt_tm_ind = i2
      3 view_level = i4
      3 view_level_ind = i2
      3 order_id = f8
      3 catalog_cd = f8
      3 catalog_cd_disp = vc
      3 series_ref_nbr = vc
      3 person_id = f8
      3 encntr_id = f8
      3 encntr_financial_id = f8
      3 accession_nbr = vc
      3 contributor_system_cd = f8
      3 contributor_system_cd_disp = vc
      3 reference_nbr = vc
      3 parent_event_id = f8
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 event_class_cd = f8
      3 event_class_cd_disp = vc
      3 event_cd = f8
      3 event_cd_disp = vc
      3 event_cd_desc = vc
      3 event_tag = vc
      3 event_reltn_cd= f8
      3 event_reltn_cd_disp = vc
      3 event_start_dt_tm = dq8
      3 event_start_dt_tm_ind = i2
      3 event_end_dt_tm = dq8
      3 event_end_dt_tm_ind = i2
      3 event_end_dt_tm_os = f8
      3 event_end_dt_tm_os_ind = i2
      3 task_assay_cd = f8
      3 record_status_cd = f8
      3 record_status_cd_disp = vc
      3 result_status_cd = f8
      3 result_status_cd_disp = vc
      3 authentic_flag = i2
      3 authentic_flag_ind = i2
      3 publish_flag = i2
      3 publish_flag_ind = i2
      3 qc_review_cd = f8
      3 qc_review_cd_disp = vc
      3 normalcy_cd = f8
      3 normalcy_cd_disp = vc
      3 normalcy_cd_mean = vc
      3 normalcy_method_cd = f8
      3 normalcy_method_cd_disp = vc
      3 inquire_security_cd = f8
      3 inquire_security_cd_disp = vc
      3 resource_group_cd = f8
      3 resource_group_cd_disp = vc
      3 resource_cd = f8
      3 resource_cd_disp = vc
      3 subtable_bit_map = i4
      3 subtable_bit_map_ind = i2
      3 event_title_text = vc
      3 collating_seq = vc
      3 result_val = vc
      3 result_units_cd = f8
      3 result_units_cd_disp = vc
      3 result_time_units_cd = f8
      3 result_time_units_cd_disp = vc
      3 verified_dt_tm = dq8
      3 verified_dt_tm_ind = i2
      3 verified_prsnl_id = f8
      3 performed_dt_tm = dq8
      3 performed_dt_tm_ind = i2
      3 performed_prsnl_id = f8
      3 normal_low = vc
      3 normal_high = vc
      3 critical_low = vc
      3 critical_high = vc
      3 expiration_dt_tm = dq8
      3 expiration_dt_tm_ind = i2
      3 note_importance_bit_map = i2
      3 event_tag_set_flag = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 blob_result [*]
      	4 event_id = f8
      	4 event_id = f8
      	4 valid_from_dt_tm = dq8
      	4 valid_from_dt_tm_ind = i2
      	4 valid_until_dt_tm = dq8
      	4 valid_until_dt_tm_ind = i2
      	4 max_sequence_nbr = i4
      	4 max_sequence_nbr_ind = i2
      	4 checksum = i4
      	4 checksum_ind = i2
      	4 succession_type_cd = f8
      	4 succession_type_cd_disp = vc
      	4 sub_series_ref_nbr = vc
      	4 storage_cd = f8
      	4 storage_cd_disp = vc
      	4 format_cd = f8
      	4 format_cd_disp = vc
      	4 device_cd = f8
      	4 device_cd_disp = vc
      	4 blob_handle = vc
      	4 blob_attributes = vc
      	4 updt_dt_tm = dq8
      	4 updt_dt_tm_ind = i2
      	4 updt_id = f8
      	4 updt_task = i4
      	4 updt_task_ind = i2
      	4 updt_cnt = i4
      	4 updt_cnt_ind = i2
      	4 updt_applctx = i4
      	4 updt_applctx_ind = i2
      	4 blob [*]
        	5 event_id = f8
        	5 blob_seq_num = i4
        	5 blob_seq_num_ind = i2
        	5 valid_from_dt_tm = dq8
        	5 valid_from_dt_tm_ind = i2
        	5 valid_until_dt_tm = dq8
        	5 valid_until_dt_tm_ind = i2
        	5 blob_length = i4
        	5 blob_length_ind = i2
        	5 compression_cd = f8
        	5 compression_cd_disp = vc
        	5 blob_contents = gvc
        	5 blob_contents_ind = i2
        	5 updt_dt_tm = dq8
        	5 updt_dt_tm_ind = i2
        	5 updt_id = f8
        	5 updt_task = i4
        	5 updt_task_ind = i2
        	5 updt_cnt = i4
        	5 updt_cnt_ind = i2
        	5 updt_applctx = i4
        	5 updt_applctx_ind = i2
      	4 blob_summary [*]
        	5 ce_blob_summary_id = f8
        	5 blob_summary_id = f8
        	5 blob_length = i4
        	5 blob_length_ind = i2
        	5 format_cd = f8
        	5 compression_cd = f8
        	5 checksum = i4
        	5 checksum_ind = i2
        	5 long_blob = gvc
        	5 valid_from_dt_tm = dq8
        	5 valid_from_dt_tm_ind = i2
        	5 valid_until_dt_tm = dq8
        	5 valid_until_dt_tm_ind = i2
        	5 event_id = f8
        	5 updt_dt_tm = dq8
        	5 updt_dt_tm_ind = i2
        	5 updt_task = i4
        	5 updt_task_ind = i2
        	5 updt_id = f8
        	5 updt_cnt = i4
        	5 updt_cnt_ind = i2
        	5 updt_applctx = i4
        	5 updt_applctx_ind = i2
   	  3 event_note_list [*]
      	4 ce_event_note_id = f8
      	4 valid_until_dt_tm = dq8
      	4 valid_until_dt_tm_ind = i2
      	4 event_note_id = f8
      	4 event_id = f8
      	4 note_type_cd = f8
      	4 note_type_cd_disp = vc
      	4 note_type_cd_mean = vc
      	4 note_format_cd = f8
      	4 note_format_cd_disp = vc
      	4 note_format_cd_mean = vc
      	4 valid_from_dt_tm = dq8
      	4 valid_from_dt_tm_ind = i2
      	4 entry_method_cd = f8
      	4 entry_method_cd_disp = vc
      	4 entry_method_cd_mean = vc
      	4 note_prsnl_id = f8
      	4 note_dt_tm = dq8
      	4 note_dt_tm_ind = i2
      	4 record_status_cd = f8
      	4 record_status_cd_disp = vc
      	4 record_status_cd_mean = vc
      	4 compression_cd = f8
      	4 compression_cd_disp = vc
      	4 compression_cd_mean = vc
      	4 checksum = i4
      	4 checksum_ind = i2
      	4 long_blob = gvc
      	4 long_text = vc
      	4 long_text_id = f8
      	4 non_chartable_flag = i2
      	4 importance_flag = i2
      	4 updt_dt_tm = dq8
      	4 updt_dt_tm_ind = i2
      	4 updt_id = f8
      	4 updt_task = i4
      	4 updt_task_ind = i2
      	4 updt_cnt = i4
      	4 updt_cnt_ind = i2
      	4 updt_applctx = i4
      	4 updt_applctx_ind = i2
      	4 note_tz = i4
      3 event_prsnl_list [*]
      	4 ce_event_prsnl_id = f8
      	4 event_prsnl_id = f8
      	4 person_id = f8
      	4 event_id = f8
      	4 valid_from_dt_tm = dq8
      	4 valid_from_dt_tm_ind = i2
      	4 valid_until_dt_tm = dq8
      	4 valid_until_dt_tm_ind = i2
      	4 action_type_cd = f8
      	4 action_type_cd_disp = vc
      	4 request_dt_tm = dq8
      	4 request_dt_tm_ind = i2
      	4 request_prsnl_id = f8
      	4 request_prsnl_ft = vc
      	4 request_comment = vc
      	4 action_dt_tm = dq8
      	4 action_dt_tm_ind = i2
      	4 action_prsnl_id = f8
      	4 action_prsnl_ft = vc
      	4 proxy_prsnl_id = f8
      	4 proxy_prsnl_ft = vc
      	4 action_status_cd = f8
      	4 action_status_cd_disp = vc
      	4 action_comment = vc
      	4 change_since_action_flag = i2
      	4 change_since_action_flag_ind = i2
      	4 updt_dt_tm = dq8
      	4 updt_dt_tm_ind = i2
      	4 updt_id = f8
      	4 updt_task = i4
      	4 updt_task_ind = i2
      	4 updt_cnt = i4
      	4 updt_cnt_ind = i2
      	4 updt_applctx = i4
      	4 updt_applctx_ind = i2
      	4 long_text_id = f8
      	4 long_text = vc
      	4 linked_event_id = f8
      	4 request_tz = i4
      	4 action_tz = i4
      	4 system_comment = vc
      	4 event_action_modifier_list [*]
        	5 ce_event_action_modifier_id = f8
        	5 event_action_modifier_id = f8
        	5 event_id = f8
        	5 event_prsnl_id = f8
        	5 action_type_modifier_cd = f8
        	5 action_type_modifier_cd_disp = vc
        	5 valid_from_dt_tm = dq8
        	5 valid_from_dt_tm_ind = i2
        	5 valid_until_dt_tm = dq8
        	5 valid_until_dt_tm_ind = i2
        	5 updt_dt_tm = dq8
        	5 updt_dt_tm_ind = i2
        	5 updt_id = f8
        	5 updt_task = i4
        	5 updt_task_ind = i2
        	5 updt_cnt = i4
        	5 updt_cnt_ind = i2
        	5 updt_applctx = i4
        	5 updt_applctx_ind = i2
      	4 digital_signature_ident = vc
      	4 action_prsnl_group_id = f8
      	4 request_prsnl_group_id = f8
      	4 receiving_person_id = f8
      	4 receiving_person_ft = vc
      3 order_action_sequence = i4
      3 entry_mode_cd = f8
      3 source_cd = f8
      3 source_cd_disp = vc
      3 source_cd_mean = vc
      3 clinical_seq = vc
      3 event_start_tz = i4
      3 event_end_tz = i4
      3 verified_tz = i4
      3 performed_tz = i4
      3 task_assay_version_nbr = f8
      3 modifier_long_text = vc
      3 modifier_long_text_id = f8
      3 endorse_ind = i2
      3 new_result_ind = i2
      3 organization_id = f8
      3 src_event_id = f8
      3 src_clinsig_updt_dt_tm = dq8
      3 nomen_string_flag = i2
      3 ce_dynamic_label_id = f8
      3 device_free_txt = vc
      3 trait_bit_map = i4
      3 event_order_link_list [*]
      	4 event_id = f8
      	4 order_id = f8
      	4 order_action_sequence = i4
      	4 valid_from_dt_tm = dq8
      	4 valid_from_dt_tm_ind = i2
      	4 valid_until_dt_tm = dq8
      	4 valid_until_dt_tm_ind = i2
      	4 updt_dt_tm = dq8
      	4 updt_dt_tm_ind = i2
      	4 updt_id = f8
      	4 updt_task = f8
      	4 updt_task_ind = i2
      	4 updt_cnt = i4
      	4 updt_cnt_ind = i2
      	4 updt_applctx = i4
      	4 updt_applctx_ind = i2
      	4 template_order_id = f8
      	4 event_end_dt_tm = dq8
      	4 parent_order_ident = f8
      	4 person_id = f8
      	4 encntr_id = f8
      	4 catalog_type_cd = f8
      	4 ce_event_order_link_id = f8
      	4 event_id = f8
      	4 order_id = f8
	3 linked_result_list [*]
		4 linked_event_id = f8
		4 order_id = f8
		4 encntr_id = f8
		4 accession_nbr = vc
		4 contributor_system_cd = f8
		4 contributor_system_cd_disp = vc
		4 reference_nbr = vc
		4 event_class_cd = f8
		4 event_class_cd_disp = vc
		4 succession_type_cd = f8
		4 event_id = f8
		4 valid_from_dt_tm = dq8
		4 valid_from_dt_tm_ind = i2
		4 valid_until_dt_tm = dq8
		4 valid_until_dt_tm_ind = i2
		4 updt_dt_tm = dq8
		4 updt_dt_tm_ind = i2
		4 updt_task = i4
		4 updt_task_ind = i2
		4 updt_id = f8
		4 updt_cnt = i4
		4 updt_cnt_ind = i2
		4 updt_applctx = i4
		4 updt_applctx_ind = i2
		4 clinical_event_id = f8
	 3 child_event_list [*]
	      4 clinical_event_id = f8
	      4 event_id = f8
	      4 valid_until_dt_tm = dq8
	      4 valid_until_dt_tm_ind = i2
	      4 clinsig_updt_dt_tm = dq8
	      4 clinsig_updt_dt_tm_ind = i2
	      4 view_level = i4
	      4 view_level_ind = i2
	      4 order_id = f8
	      4 catalog_cd = f8
	      4 catalog_cd_disp = vc
	      4 series_ref_nbr = vc
	      4 person_id = f8
	      4 encntr_id = f8
	      4 encntr_financial_id = f8
	      4 accession_nbr = vc
	      4 contributor_system_cd = f8
	      4 contributor_system_cd_disp = vc
	      4 reference_nbr = vc
	      4 parent_event_id = f8
	      4 valid_from_dt_tm = dq8
	      4 valid_from_dt_tm_ind = i2
	      4 event_class_cd = f8
	      4 event_class_cd_disp = vc
	      4 event_cd = f8
	      4 event_cd_disp = vc
	      4 event_cd_desc = vc
	      4 event_tag = vc
	      4 event_reltn_cd= f8
	      4 event_reltn_cd_disp = vc
	      4 event_start_dt_tm = dq8
	      4 event_start_dt_tm_ind = i2
	      4 event_end_dt_tm = dq8
	      4 event_end_dt_tm_ind = i2
	      4 event_end_dt_tm_os = f8
	      4 event_end_dt_tm_os_ind = i2
	      4 task_assay_cd = f8
	      4 record_status_cd = f8
	      4 record_status_cd_disp = vc
	      4 result_status_cd = f8
	      4 result_status_cd_disp = vc
	      4 authentic_flag = i2
	      4 authentic_flag_ind = i2
	      4 publish_flag = i2
	      4 publish_flag_ind = i2
	      4 qc_review_cd = f8
	      4 qc_review_cd_disp = vc
	      4 normalcy_cd = f8
	      4 normalcy_cd_disp = vc
	      4 normalcy_cd_mean = vc
	      4 normalcy_method_cd = f8
	      4 normalcy_method_cd_disp = vc
	      4 inquire_security_cd = f8
	      4 inquire_security_cd_disp = vc
	      4 resource_group_cd = f8
	      4 resource_group_cd_disp = vc
	      4 resource_cd = f8
	      4 resource_cd_disp = vc
	      4 subtable_bit_map = i4
	      4 subtable_bit_map_ind = i2
	      4 event_title_text = vc
	      4 collating_seq = vc
	      4 result_val = vc
	      4 result_units_cd = f8
	      4 result_units_cd_disp = vc
	      4 result_time_units_cd = f8
	      4 result_time_units_cd_disp = vc
	      4 verified_dt_tm = dq8
	      4 verified_dt_tm_ind = i2
	      4 verified_prsnl_id = f8
	      4 performed_dt_tm = dq8
	      4 performed_dt_tm_ind = i2
	      4 performed_prsnl_id = f8
	      4 normal_low = vc
	      4 normal_high = vc
	      4 critical_low = vc
	      4 critical_high = vc
	      4 expiration_dt_tm = dq8
	      4 expiration_dt_tm_ind = i2
	      4 note_importance_bit_map = i2
	      4 event_tag_set_flag = i2
	      4 updt_dt_tm = dq8
	      4 updt_dt_tm_ind = i2
	      4 updt_id = f8
	      4 updt_task = i4
	      4 updt_task_ind = i2
	      4 updt_cnt = i4
	      4 updt_cnt_ind = i2
	      4 updt_applctx = i4
	      4 updt_applctx_ind = i2
	      4 blob_result [*]
	      	5 event_id = f8
	      	5 event_id = f8
	      	5 valid_from_dt_tm = dq8
	      	5 valid_from_dt_tm_ind = i2
	      	5 valid_until_dt_tm = dq8
	      	5 valid_until_dt_tm_ind = i2
	      	5 max_sequence_nbr = i4
	      	5 max_sequence_nbr_ind = i2
	      	5 checksum = i4
	      	5 checksum_ind = i2
	      	5 succession_type_cd = f8
	      	5 succession_type_cd_disp = vc
	      	5 sub_series_ref_nbr = vc
	      	5 storage_cd = f8
	      	5 storage_cd_disp = vc
	      	5 format_cd = f8
	      	5 format_cd_disp = vc
	      	5 device_cd = f8
	      	5 device_cd_disp = vc
	      	5 blob_handle = vc
	      	5 blob_attributes = vc
	      	5 updt_dt_tm = dq8
	      	5 updt_dt_tm_ind = i2
	      	5 updt_id = f8
	      	5 updt_task = i4
	      	5 updt_task_ind = i2
	      	5 updt_cnt = i4
	      	5 updt_cnt_ind = i2
	      	5 updt_applctx = i4
	      	5 updt_applctx_ind = i2
	      	5 blob [*]
	        	6 event_id = f8
	        	6 blob_seq_num = i4
	        	6 blob_seq_num_ind = i2
	        	6 valid_from_dt_tm = dq8
	        	6 valid_from_dt_tm_ind = i2
	        	6 valid_until_dt_tm = dq8
	        	6 valid_until_dt_tm_ind = i2
	        	6 blob_length = i4
	        	6 blob_length_ind = i2
	        	6 compression_cd = f8
	        	6 compression_cd_disp = vc
	        	6 blob_contents = gvc
	        	6 blob_contents_ind = i2
	        	6 updt_dt_tm = dq8
	        	6 updt_dt_tm_ind = i2
	        	6 updt_id = f8
	        	6 updt_task = i4
	        	6 updt_task_ind = i2
	        	6 updt_cnt = i4
	        	6 updt_cnt_ind = i2
	        	6 updt_applctx = i4
	        	6 updt_applctx_ind = i2
	      	5 blob_summary [*]
	        	6 ce_blob_summary_id = f8
	        	6 blob_summary_id = f8
	        	6 blob_length = i4
	        	6 blob_length_ind = i2
	        	6 format_cd = f8
	        	6 compression_cd = f8
	        	6 checksum = i4
	        	6 checksum_ind = i2
	        	6 long_blob = gvc
	        	6 valid_from_dt_tm = dq8
	        	6 valid_from_dt_tm_ind = i2
	        	6 valid_until_dt_tm = dq8
	        	6 valid_until_dt_tm_ind = i2
	        	6 event_id = f8
	        	6 updt_dt_tm = dq8
	        	6 updt_dt_tm_ind = i2
	        	6 updt_task = i4
	        	6 updt_task_ind = i2
	        	6 updt_id = f8
	        	6 updt_cnt = i4
	        	6 updt_cnt_ind = i2
	        	6 updt_applctx = i4
	        	6 updt_applctx_ind = i2
   	  	4 event_note_list [*]
	      	5 ce_event_note_id = f8
	      	5 valid_until_dt_tm = dq8
	      	5 valid_until_dt_tm_ind = i2
	      	5 event_note_id = f8
	      	5 event_id = f8
	      	5 note_type_cd = f8
	      	5 note_type_cd_disp = vc
	      	5 note_type_cd_mean = vc
	      	5 note_format_cd = f8
	      	5 note_format_cd_disp = vc
	      	5 note_format_cd_mean = vc
	      	5 valid_from_dt_tm = dq8
	      	5 valid_from_dt_tm_ind = i2
	      	5 entry_method_cd = f8
	      	5 entry_method_cd_disp = vc
	      	5 entry_method_cd_mean = vc
	      	5 note_prsnl_id = f8
	      	5 note_dt_tm = dq8
	      	5 note_dt_tm_ind = i2
	      	5 record_status_cd = f8
	      	5 record_status_cd_disp = vc
	      	5 record_status_cd_mean = vc
	      	5 compression_cd = f8
	      	5 compression_cd_disp = vc
	      	5 compression_cd_mean = vc
	      	5 checksum = i4
	      	5 checksum_ind = i2
	      	5 long_blob = gvc
	      	5 long_text = vc
	      	5 long_text_id = f8
	      	5 non_chartable_flag = i2
	      	5 importance_flag = i2
	      	5 updt_dt_tm = dq8
	      	5 updt_dt_tm_ind = i2
	      	5 updt_id = f8
	      	5 updt_task = i4
	      	5 updt_task_ind = i2
	      	5 updt_cnt = i4
	      	5 updt_cnt_ind = i2
	      	5 updt_applctx = i4
	      	5 updt_applctx_ind = i2
	      	5 note_tz = i4
      	4 event_prsnl_list [*]
	      	5 ce_event_prsnl_id = f8
	      	5 event_prsnl_id = f8
	      	5 person_id = f8
	      	5 event_id = f8
	      	5 valid_from_dt_tm = dq8
	      	5 valid_from_dt_tm_ind = i2
	      	5 valid_until_dt_tm = dq8
	      	5 valid_until_dt_tm_ind = i2
	      	5 action_type_cd = f8
	      	5 action_type_cd_disp = vc
	      	5 request_dt_tm = dq8
	      	5 request_dt_tm_ind = i2
	      	5 request_prsnl_id = f8
	      	5 request_prsnl_ft = vc
	      	5 request_comment = vc
	      	5 action_dt_tm = dq8
	      	5 action_dt_tm_ind = i2
	      	5 action_prsnl_id = f8
	      	5 action_prsnl_ft = vc
	      	5 proxy_prsnl_id = f8
	      	5 proxy_prsnl_ft = vc
	      	5 action_status_cd = f8
	      	5 action_status_cd_disp = vc
	      	5 action_comment = vc
	      	5 change_since_action_flag = i2
	      	5 change_since_action_flag_ind = i2
	      	5 updt_dt_tm = dq8
	      	5 updt_dt_tm_ind = i2
	      	5 updt_id = f8
	      	5 updt_task = i4
	      	5 updt_task_ind = i2
	      	5 updt_cnt = i4
	      	5 updt_cnt_ind = i2
	      	5 updt_applctx = i4
	      	5 updt_applctx_ind = i2
	      	5 long_text_id = f8
	      	5 long_text = vc
	      	5 linked_event_id = f8
	      	5 request_tz = i4
	      	5 action_tz = i4
	      	5 system_comment = vc
	      	5 event_action_modifier_list [*]
	        	6 ce_event_action_modifier_id = f8
	        	6 event_action_modifier_id = f8
	        	6 event_id = f8
	        	6 event_prsnl_id = f8
	        	6 action_type_modifier_cd = f8
	        	6 action_type_modifier_cd_disp = vc
	        	6 valid_from_dt_tm = dq8
	        	6 valid_from_dt_tm_ind = i2
	        	6 valid_until_dt_tm = dq8
	        	6 valid_until_dt_tm_ind = i2
	        	6 updt_dt_tm = dq8
	        	6 updt_dt_tm_ind = i2
	        	6 updt_id = f8
	        	6 updt_task = i4
	        	6 updt_task_ind = i2
	        	6 updt_cnt = i4
	        	6 updt_cnt_ind = i2
	        	6 updt_applctx = i4
	        	6 updt_applctx_ind = i2
	      	5 digital_signature_ident = vc
	      	5 action_prsnl_group_id = f8
	      	5 request_prsnl_group_id = f8
	      	5 receiving_person_id = f8
	      	5 receiving_person_ft = vc
	      4 order_action_sequence = i4
	      4 entry_mode_cd = f8
	      4 source_cd = f8
	      4 source_cd_disp = vc
	      4 source_cd_mean = vc
	      4 clinical_seq = vc
	      4 event_start_tz = i4
	      4 event_end_tz = i4
	      4 verified_tz = i4
	      4 performed_tz = i4
	      4 task_assay_version_nbr = f8
	      4 modifier_long_text = vc
	      4 modifier_long_text_id = f8
	      4 endorse_ind = i2
	      4 new_result_ind = i2
	      4 organization_id = f8
	      4 src_event_id = f8
	      4 src_clinsig_updt_dt_tm = dq8
	      4 nomen_string_flag = i2
	      4 ce_dynamic_label_id = f8
	      4 device_free_txt = vc
	      4 trait_bit_map = i4
    2 hla_list [*]
    2 order_action_sequence = i4
    2 entry_mode_cd = f8
    2 source_cd = f8
    2 source_cd_disp = vc
    2 source_cd_mean = vc
    2 clinical_seq = vc
    2 event_start_tz = i4
    2 event_end_tz = i4
    2 verified_tz = i4
    2 performed_tz = i4
    2 calculation_result_list [*]
      3 event_id = f8
      3 equation = vc
      3 calculation_result = vc
      3 calculation_result_frmt_cd = f8
      3 calculation_result_frmt_cd_disp = vc
      3 last_norm_dt_tm = dq8
      3 last_norm_dt_tm_ind = i2
      3 unit_of_measure_cd = f8
      3 unit_of_measure_cd_disp = vc
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 contributor_link_list [*]
        4 event_id = f8
        4 contributor_event_id = f8
        4 ce_valid_from_dt_tm = dq8
        4 type_flag = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 ce_valid_until_dt_tm = dq8
        4 ce_result_value = vc
        4 ce_performed_prsnl_id = f8
        4 ce_event_end_dt_tm = dq8
        4 ce_event_cd = f8
        4 ce_event_cd_disp = vc
        4 ce_clinical_event_id = f8
        4 ce_event_class_cd = f8
        4 ce_event_class_cd_disp = vc
        4 string_result_list [*]
          5 event_id = f8
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 string_result_text = vc
          5 string_result_format_cd = f8
          5 string_result_format_cd_disp = vc
          5 equation_id = f8
          5 last_norm_dt_tm = dq8
          5 last_norm_dt_tm_ind = i2
          5 unit_of_measure_cd = f8
          5 unit_of_measure_cd_disp = vc
          5 feasible_ind = i2
          5 feasible_ind_ind = i2
          5 inaccurate_ind = i2
          5 inaccurate_ind_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 interp_comp_list [*]
            6 event_id = f8
            6 comp_idx = i4
            6 comp_idx_ind = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 comp_event_id = f8
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 comp_name = vc
          5 calculation_equation = vc
          5 string_long_text_id = f8
        4 coded_result_list [*]
          5 event_id = f8
          5 sequence_nbr = i4
          5 sequence_nbr_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 nomenclature_id = f8
          5 result_set = i4
          5 result_set_ind = i2
          5 result_cd = f8
          5 result_cd_disp = vc
          5 acr_code_str = vc
          5 proc_code_str = vc
          5 pathology_str = vc
          5 group_nbr = i4
          5 group_nbr_ind = i2
          5 mnemonic = vc
          5 short_string = vc
          5 descriptor = vc
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 unit_of_measure_cd = f8
          5 source_string = vc
        4 date_result_list [*]
          5 event_id = f8
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 result_dt_tm = dq8
          5 result_dt_tm_ind = i2
          5 result_dt_tm_os = f8
          5 result_dt_tm_os_ind = i2
          5 date_type_flag = i2
          5 date_type_flag_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 result_tz = i4
          5 result_tz_ind = i2
        4 ce_result_status_cd = f8
        4 ce_result_status_cd_disp = vc
        4 ce_event_end_tz = i4
    2 task_assay_version_nbr = f8
    2 modifier_long_text = vc
    2 modifier_long_text_id = f8
    2 result_set_link_list [*]
      3 event_id = f8
      3 result_set_id = f8
      3 entry_type_cd = f8
      3 entry_type_cd_disp = vc
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 relation_type_cd = f8
    2 event_order_link_list [*]
      3 event_id = f8
      3 order_id = f8
      3 order_action_sequence = i4
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 template_order_id = f8
      3 event_end_dt_tm = dq8
      3 parent_order_ident = f8
      3 person_id = f8
      3 encntr_id = f8
      3 catalog_type_cd = f8
      3 ce_event_order_link_id = f8
    2 scd_modifier_list [*]
      3 event_id = f8
      3 concept_cki = vc
      3 phrase = vc
      3 display = vc
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 valid_from_dt_tm = dq8
    2 endorse_ind = i2
    2 new_result_ind = i2
    2 organization_id = f8
    2 intake_output_result [*]
      3 ce_io_result_id = f8
      3 io_result_id = f8
      3 event_id = f8
      3 person_id = f8
      3 encntr_id = f8
      3 io_start_dt_tm = dq8
      3 io_start_dt_tm_ind = i2
      3 io_end_dt_tm = dq8
      3 io_end_dt_tm_ind = i2
      3 io_type_flag = i2
      3 io_volume = f8
      3 io_status_cd = f8
      3 io_status_cd_disp = vc
      3 io_status_cd_mean = vc
      3 reference_event_id = f8
      3 reference_event_cd = f8
      3 reference_event_cd_disp = vc
      3 valid_from_dt_tm = dq8
      3 valid_from_dt_tm_ind = i2
      3 valid_until_dt_tm = dq8
      3 valid_until_dt_tm_ind = i2
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
    2 io_total_result_list [*]
      3 ce_io_total_result_id = f8
      3 io_total_definition_id = f8
      3 event_id = f8
      3 encntr_id = f8
      3 encntr_focused_ind = i2
      3 person_id = f8
      3 io_total_start_dt_tm = dq8
      3 io_total_end_dt_tm = dq8
      3 io_total_value = f8
      3 io_total_unit_cd = f8
      3 io_total_unit_disp = vc
      3 io_total_unit_mean = vc
      3 suspect_flag = i2
      3 last_io_result_clinsig_dt_tm = dq8
      3 valid_from_dt_tm = dq8
      3 valid_until_dt_tm = dq8
      3 updt_dt_tm = dq8
      3 updt_dt_tm_ind = i2
      3 updt_id = f8
      3 updt_task = i4
      3 updt_task_ind = i2
      3 updt_cnt = i4
      3 updt_cnt_ind = i2
      3 updt_applctx = i4
      3 updt_applctx_ind = i2
      3 contributor_link_list [*]
        4 event_id = f8
        4 contributor_event_id = f8
        4 ce_valid_from_dt_tm = dq8
        4 type_flag = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 ce_valid_until_dt_tm = dq8
        4 ce_result_value = vc
        4 ce_performed_prsnl_id = f8
        4 ce_event_end_dt_tm = dq8
        4 ce_event_cd = f8
        4 ce_event_cd_disp = vc
        4 ce_clinical_event_id = f8
        4 ce_event_class_cd = f8
        4 ce_event_class_cd_disp = vc
        4 string_result_list [*]
          5 event_id = f8
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 string_result_text = vc
          5 string_result_format_cd = f8
          5 string_result_format_cd_disp = vc
          5 equation_id = f8
          5 last_norm_dt_tm = dq8
          5 last_norm_dt_tm_ind = i2
          5 unit_of_measure_cd = f8
          5 unit_of_measure_cd_disp = vc
          5 feasible_ind = i2
          5 feasible_ind_ind = i2
          5 inaccurate_ind = i2
          5 inaccurate_ind_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 interp_comp_list [*]
            6 event_id = f8
            6 comp_idx = i4
            6 comp_idx_ind = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 comp_event_id = f8
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 comp_name = vc
          5 calculation_equation = vc
          5 string_long_text_id = f8
        4 coded_result_list [*]
          5 event_id = f8
          5 sequence_nbr = i4
          5 sequence_nbr_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 nomenclature_id = f8
          5 result_set = i4
          5 result_set_ind = i2
          5 result_cd = f8
          5 result_cd_disp = vc
          5 acr_code_str = vc
          5 proc_code_str = vc
          5 pathology_str = vc
          5 group_nbr = i4
          5 group_nbr_ind = i2
          5 mnemonic = vc
          5 short_string = vc
          5 descriptor = vc
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 unit_of_measure_cd = f8
          5 source_string = vc
        4 date_result_list [*]
          5 event_id = f8
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 result_dt_tm = dq8
          5 result_dt_tm_ind = i2
          5 result_dt_tm_os = f8
          5 result_dt_tm_os_ind = i2
          5 date_type_flag = i2
          5 date_type_flag_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 result_tz = i4
          5 result_tz_ind = i2
        4 ce_result_status_cd = f8
        4 ce_result_status_cd_disp = vc
        4 ce_event_end_tz = i4
      3 io_total_result_val = vc
    2 src_event_id = f8
    2 src_clinsig_updt_dt_tm = dq8
    2 nomen_string_flag = i2
    2 ce_dynamic_label_id = f8
    2 dynamic_label_list [*]
      3 ce_dynamic_label_id = f8
      3 label_name = vc
      3 label_prsnl_id = f8
      3 label_status_cd = f8
      3 label_seq_nbr = i4
      3 valid_from_dt_tm = dq8
      3 label_comment = vc
    2 device_free_txt = vc
    2 trait_bit_map = i4
  1 person_list [*]
    2 person_id = f8
    2 name_full_formatted = vc
    2 prsnl_name_full_formatted = vc
)
 
; 680501 - MSVC_CheckPrivileges
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
 
 record cv_atr (
   1 stat = i4
   1 app_nbr = i4
   1 task_nbr = i4
   1 step_nbr = i4
   1 happ = i4
   1 htask = i4
   1 hstep = i4
   1 hrequest = i4
   1 hreply = i4
 ) with protect
 
if ((validate (reply->status_data.status ) = 0 ) )
	free set reply
	record reply (
		1 sb_severity = i4
		1 sb_status = i4
		1 sb_statustext = vc
		1 event_id = f8
		1 status_data
			2 status = c1
			2 subeventstatus [*]
				3 operationname = c25
				3 operationstatus = c1
				3 targetobjectname = c25
				3 targetobjectvalue = vc
	)
endif
 
free record observation_reply_out
record observation_reply_out(
  1 observation_id            	= f8
  1 audit
    2 user_id             		= f8
    2 user_firstname			= vc
    2 user_lastname 			= vc
    2 patient_id 				= f8
    2 patient_firstname         = vc
    2 patient_lastname          = vc
    2 service_version         	= vc
  1 status_data
    2 status 					= c1
    2 subeventstatus[1]
      3 OperationName 			= c25
      3 OperationStatus 		= c1
      3 TargetObjectName 		= c25
      3 TargetObjectValue 		= vc
      3 Code 					= c4
      3 Description 			= vc
)
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
 ;Inputs
declare sUserName					= vc with protect, noconstant("")
declare dObservationId				= f8 with protect, noconstant(0.0)
declare dStatusCd					= f8 with protect, noconstant(0.0)
declare sReason						= vc with protect, noconstant("")
declare sComments					= vc with protect, noconstant("")
declare iDebugFlag					= i2 with protect, noconstant(0)
 
;Other
declare dPatientId  				= f8 with protect, noconstant(0.0)
declare dPrsnlId					= f8 with protect, noconstant(0.0)
declare dEncounterId  				= f8 with protect, noconstant(0.0)
declare dEventCd					= f8 with protect, noconstant(0.0)
declare dReasonCd					= f8 with protect, noconstant(0.0)
 
; Constants
declare c_error_handler				= vc with protect, constant("DELETE OBSERVATION")
declare c_inerror_status_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",8,"INERROR"))
 
declare c_action_type_perform 		= f8 with protect ,constant (uar_get_code_by ("MEANING" ,21 ,"PERFORM" ) )
declare c_action_type_verify 		= f8 with protect ,constant (uar_get_code_by ("MEANING" ,21 ,"VERIFY" ) )
declare c_action_type_sign 			= f8 with protect ,constant (uar_get_code_by ("MEANING" ,21 ,"SIGN" ) )
declare c_action_type_modify 		= f8 with protect ,constant (uar_get_code_by ("MEANING" ,21 ,"MODIFY" ) )
declare c_action_status_completed 	= f8 with protect ,constant (uar_get_code_by ("MEANING" ,103 ,"COMPLETED" ) )
declare c_action_status_pending 	= f8 with protect ,constant (uar_get_code_by ("MEANING" ,103 ,"PENDING" ) )
declare c_entry_mode_cd 			= f8 with protect ,constant (uar_get_code_by ("MEANING" ,29520 ,"UNDEFINED" ) )
declare c_source_cd 				= f8 with protect, constant(uar_get_code_by("MEANING",30200,"UNSPECIFIED"))
declare c_io_status_confirmed 		= f8 with protect, constant (uar_get_code_by("MEANING",4000160,"CONFIRMED"))
declare c_rescomment_note_type_cd 	= f8 with protect, constant (uar_get_code_by("MEANING",14,"RES COMMENT"))
declare c_ah_note_format_cd 		= f8 with protect, constant (uar_get_code_by("MEANING",23,"AH"))
declare c_unknown_entry_method_cd 	= f8 with protect, constant (uar_get_code_by("MEANING",13,"UNKNOWN"))
declare c_nocomp_compression_cd 	= f8 with protect, constant (uar_get_code_by("MEANING",120,"NOCOMP"))
declare c_active_rec_status_cd		= f8 with protect, constant(uar_get_code_by("MEANING",48,"ACTIVE"))
 
declare applicationid 				= i4 WITH constant (600005) ,protect
declare taskid 						= i4 WITH constant (600108) ,protect
declare requestid 					= i4 WITH constant (1000071) ,protect
declare hce 						= i4 WITH protect
declare hce2 						= i4 WITH protect
declare hprsnl 						= i4 WITH protect
declare hce_type 					= i4 WITH protect
declare hce_struct 					= i4 WITH protect
declare hstatus 					= i4 WITH protect
declare hrb_list 					= i4 WITH protect
declare hrb 						= i4 WITH protect
declare rb_cnt 						= i4 WITH protect
declare rb_idx 						= i4 WITH protect
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Inputs
set sUserName						= trim($USERNAME, 3)
set dObservationId					= cnvtreal($OBS_ID)
set dStatusCd						= cnvtreal($STATUS_ID)
set sReason							= trim($REASON,3)
set sComments						= trim($COMMENT,3)
set iDebugFlag						= cnvtint($DEBUG_FLAG)
 
;Other
set dPrsnlId						= GetPrsnlIDfromUserName(sUserName)
set reqinfo->updt_id				= dPrsnlId
set sPrsnlName						= GetNameFromPrsnlID(dPrsnlId)
 
if(iDebugFlag > 0)
	call echo(build2("dObservationId -> ",dObservationId))
	call echo(build2("dStatusCd -> ",dStatusCd))
	call echo(build2("dReasonCd -> ",dReasonCd))
	call echo(build2("sComments -> ",sComments))
	call echo(build2("dPrsnlId -> ",dPrsnlId))
	call echo(build2("sPrsnlName -> ",sPrsnlName))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetEventDetails(null)			= i4 with protect		; 1000011 event_detail_query
declare VerifyPrivs(null)				= i4 with protect  		; 680501 MSVC_CheckPrivileges
declare DeleteObservation(null)			= null with protect		; 1000071 event_batch_ensure
declare cvbeginatr((p_app_nbr = i4),(p_task_nbr = i4),(p_step_nbr = i4)) = i4 WITH protect
declare cvperformatr(null) 				= i4 WITH protect
declare cvendatr(null) 					= null WITH protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate ObservationId exists
if(dObservationId = 0)
   	call ErrorHandler2(c_error_handler, "F", "Validate", "Missing required field: ObservationId.",
   	"2055", "Missing required field: ObservationId", observation_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate StatusId
if(dStatusCd != c_inerror_status_cd)
	call ErrorHandler2(c_error_handler, "F", "Validate", "Invalid StatusId.",
	"2006","Invalid StatusId.", observation_reply_out)
	go to exit_script
endif
 
;Validate Reason exists and if it is a code value
if(sReason > " ")
	set dReasonCd = cnvtreal(sReason)
	if(dReasonCd > 0)
		set sReason = ""
 
		select into "nl:"
		from code_value cv,
			code_value_extension cve
		plan cv where cv.code_set = 6014
			and cv.code_value = dReasonCd
			and cv.active_ind = 1
		join cve where cve.code_value = cv.code_value
			and cve.field_name = "UNCHART"
			and cve.field_value > " "
		detail
			sReason = cv.display
		with nocounter
 
		if(curqual = 0)
			call ErrorHandler2(c_error_handler, "F", "Validate", "Invalid ReasonId.",
   			"2005", "Invalid ReasonId", observation_reply_out)
			go to EXIT_SCRIPT
		endif
	else
		set sReason = build2("Other: ",sReason)
	endif
else
	call ErrorHandler2(c_error_handler, "F", "Validate", "Missing required field: Reason.",
   	"2005", "Missing required field: Reason", observation_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate EventId and get necessary details
set iRet = GetEventDetails(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler, "F", "Validate", "Invalid observation id",
	"2051",build2("Invalid observation Id: ",dObservationId), observation_reply_out)
	go to exit_script
endif
 
; Validate username
set iRet = PopulateAudit(sUserName, dPatientId, observation_reply_out, sVersion)
if(iRet = 0)
  call ErrorHandler2(c_error_handler, "F", "Validate", "Invalid User for Audit.",
  "1001",build("Invalid user: ",sUserName), observation_reply_out)
  go to exit_script
endif
 
; Verify user has privileges to Delete Observation
set iRet = VerifyPrivs(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler, "F", "Validate", "User does not have privileges to update observation id.",
	"9999","User does not have privileges for observation id.", observation_reply_out)
	go to exit_script
endif
 
; Execute Server calls
EXECUTE crmrtl
EXECUTE srvrtl
 
; Post the observation
call DeleteObservation(null)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(observation_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	call echorecord(observation_reply_out)
	call echo(JSONout)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_delete_observation.json")
	call echo(build2("_file : ", _file))
	call echojson(observation_reply_out, _file, 0)
endif
 
#EXIT_VERSION
/*************************************************************************
; SUBROUTINES
**************************************************************************/
 
 /*************************************************************************
;  Name: GetEventDetails(null) - 1000011 - event_detail_query
;  Description:  Gets the details based on the event id (observation id)
**************************************************************************/
subroutine GetEventDetails(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetEventDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 600107
	set iRequest = 1000011
 
	;Setup request
 	set 1000011_req->query_mode = 269615107
 	set 1000011_req->event_id = dObservationId
 	set 1000011_req->subtable_bit_map_ind = 1
	set 1000011_req->valid_from_dt_tm_ind = 1
 
	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",1000011_req,"REC",1000011_rep)
 
	if(size(1000011_rep->rb_list,5) > 0)
		set iValidate = 1
 
		set dPatientId = 1000011_rep->rb_list[1].person_id
		set dEncounterId = 1000011_rep->rb_list[1].encntr_id
		set dEventCd = 1000011_rep->rb_list[1].event_cd
 
		;Verify if result status is already "In Error"
		if(1000011_rep->rb_list[1].result_status_cd = c_inerror_status_cd)
			call ErrorHandler2(c_error_handler, "F", "Validate", "ObservationId status is already InError.",
			"9999","ObservationId status is already InError.", observation_reply_out)
			go to exit_script
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetEventDetails Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
 	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: VerifyPrivs(null)
;  Description:  Verify user has privileges to update observation
**************************************************************************/
subroutine VerifyPrivs(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("VerifyPrivs Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	; Get personnel relationship to patient
	declare dPrsnlRelCd = f8
	select into "nl:"
	from encntr_prsnl_reltn epr
	where epr.encntr_id = dEncounterId
		and epr.prsnl_person_id = dPrsnlId
	detail
		dPrsnlRelCd = epr.encntr_prsnl_r_cd
	with nocounter
 
	set iAPPLICATION = 600005
	set iTASK = 3202004
 	set iREQUEST = 680501
 
	declare iValidate = i2
	set 680501_req->user_id = dPrsnlId
	set 680501_req->patient_user_relationship_cd = dPrsnlRelCd
	set stat = alterlist(680501_req->event_codes,1)
	set 680501_req->event_codes[1].event_cd = dEventCd
	set 680501_req->event_privileges->event_code_level.add_documentation_ind = 1
	set 680501_req->event_privileges->event_code_level.unchart_documentation_ind = 1
	set 680501_req->event_privileges->event_code_level.modify_documentation_ind = 1
 
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",680501_req,"REC",680501_rep)
	set iValidate = 680501_rep->event_privileges->add_documentation.status.success_ind
	set iValidate = iValidate + 680501_rep->event_privileges->unchart_documentation.status.success_ind
	set iValidate = iValidate + 680501_rep->event_privileges->modify_documentation.status.success_ind
 
	if(iDebugFlag > 0)
		call echo(concat("VerifyPrivs Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
	if(iValidate = 3)
		return(1)
	else
		return(0)
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: cvbeginatr (p_app_nbr ,p_task_nbr ,p_step_nbr )
;  Description:
**************************************************************************/
subroutine  cvbeginatr (p_app_nbr ,p_task_nbr ,p_step_nbr )
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("cvbeginatr Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set cv_atr->app_nbr = p_app_nbr
	set cv_atr->task_nbr = p_task_nbr
	set cv_atr->step_nbr = p_step_nbr
	set cv_atr->stat = uar_crmbeginapp (cv_atr->app_nbr ,cv_atr->happ )
 
	if ((cv_atr->stat != 0 ) )
		call ErrorHandler2("VALIDATE", "F", " uar_CrmBeginApp ", cnvtstring (cv_atr->stat ),
		"9999", build("Invalid uar_CrmBeginApp Status: ",cnvtstring (cv_atr->stat)),observation_reply_out)
		return (1 )
	endif
	set cv_atr->stat = uar_crmbegintask (cv_atr->happ ,cv_atr->task_nbr ,cv_atr->htask )
	if ((cv_atr->stat != 0 ) )
		call ErrorHandler2("VALIDATE", "F", " uar_CrmBeginTask ", cnvtstring (cv_atr->stat ),
		"9999", build("Invalid uar_CrmBeginTask: ",cnvtstring (cv_atr->htask)),observation_reply_out)
		return (2 )
	endif
	set cv_atr->stat = uar_crmbeginreq (cv_atr->htask ,"" ,cv_atr->step_nbr ,cv_atr->hstep )
	if ((cv_atr->stat != 0 ) )
		call ErrorHandler2("VALIDATE", "F", " uar_CrmBeginReq ", cnvtstring (cv_atr->stat ),
		"9999", build("Invalid uar_CrmBeginReq: ", cnvtstring(cv_atr->step_nbr)), observation_reply_out)
		return (3 )
	endif
	set cv_atr->hrequest = uar_crmgetrequest (cv_atr->hstep )
	if ((cv_atr->hrequest = 0 ) )
		call ErrorHandler2("VALIDATE", "F", " UAR_CrmGetRequest ", "Failed to allocate hrequest" ,
		"9999", "Invalid uar_CrmBeginRequest: Failed to allocate hrequest", observation_reply_out)
		return (4 )
	endif
	if(iDebugFlag > 0)
		call echo( "CvBeginAtr completed successfully" )
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("cvbeginatr Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
	return (0)
end ;subroutine
 
/*************************************************************************
;  Name: cvperformatr (null )
;  Description:
**************************************************************************/
subroutine cvperformatr (null )
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("cvperformatr Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set cv_atr->stat = uar_crmperform (cv_atr->hstep )
	if ((cv_atr->stat != 0 ) )
		call errorhandler2("VALIDATE", "F", " UAR_CRMPERFORM ", cnvtstring (cv_atr->stat ),
		"9999", build("Invalid uar_crmperform: ", cnvtstring(cv_atr->stat)), observation_reply_out)
		return (1 )
	endif
	set cv_atr->hreply = uar_crmgetreply (cv_atr->hstep )
	if ((cv_atr->hreply = 0 ) )
		call errorhandler2("VALIDATE", "F", " UAR_CRMGETREPLY ", "Failed to allocate hreply",
		"9999", "Failed to allocate hreply.", observation_reply_out)
		return (2 )
	endif
 
	if(iDebugFlag > 0)
		call echo( "CVPERFORMATR completed succesfully" )
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("cvbeginatr Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
	return(0)
end ;Subroutine
 
/*************************************************************************
;  Name:  cvendatr (null )
;  Description:
**************************************************************************/
subroutine cvendatr (null )
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("cvendatr Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	if (cv_atr->hstep )
		call uar_crmendreq (cv_atr->hstep )
	endif
	if (cv_atr->htask )
		call uar_crmendtask (cv_atr->htask )
	endif
	if (cv_atr->happ )
		call uar_crmendapp (cv_atr->happ )
	endif
	set stat = initrec (cv_atr )
 
	if(iDebugFlag > 0)
		call echo(concat("cvendatr Runtime: ",
	     trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	     " seconds"))
	endif
end ;Subroutine
 
/*************************************************************************
;  Name: DeleteObservation(null)
;  Description: Post the Observation to clinical_event table
**************************************************************************/
subroutine DeleteObservation(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("DeleteObservation Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	if ((cvbeginatr (applicationid ,taskid ,requestid ) != 0 ) )
		call ErrorHandler2(c_error_handler, "F", " FApp, task, Req", "Field to Begin ATR",
		"9999", "Faild to Begin ATR.", observation_reply_out)
		go to EXIT_SCRIPT
	endif
 
	set hreq = uar_srvadditem(cv_atr->hrequest,"req")
 
	if(iDebugFlag > 0)
		call echo(build("hreq--->", hreq))
	endif
 
	set stat = uar_srvsetshort (hreq,"ensure_type", 2 )
	set stat = uar_srvsetshort (hreq,"ensure_type2", 64 )
 
	set hce = uar_srvgetstruct (hreq ,"clin_event" )
	if(iDebugFlag > 0)
		call echo(build("hce--->", hce))
	endif
 
	IF(hce)
		set stat = uar_srvsetdouble(hce,"event_id",1000011_rep->rb_list[1].event_id)
		set stat = uar_srvsetlong (hce ,"view_level" ,1 )
		set stat = uar_srvsetdouble (hce ,"person_id" ,1000011_rep->rb_list[1].person_id )
		set stat = uar_srvsetdouble (hce ,"encntr_id" ,1000011_rep->rb_list[1].encntr_id )
		set stat = uar_srvsetdouble (hce ,"contributor_system_cd",1000011_rep->rb_list[1].contributor_system_cd )
		set stat = uar_srvsetdouble(hce,"parent_event_id",1000011_rep->rb_list[1].parent_event_id)
		set stat = uar_srvsetdouble (hce ,"event_class_cd" ,1000011_rep->rb_list[1].event_class_cd)
		set stat = uar_srvsetdouble (hce ,"event_cd" ,1000011_rep->rb_list[1].event_cd )
		set stat = uar_srvsetdate (hce ,"event_start_dt_tm" ,1000011_rep->rb_list[1].event_start_dt_tm )
		set stat = uar_srvsetdate (hce ,"event_end_dt_tm" ,1000011_rep->rb_list[1].event_end_dt_tm )
		set stat = uar_srvsetdouble (hce ,"task_assay_cd" ,1000011_rep->rb_list[1].task_assay_cd )
		set stat = uar_srvsetdouble (hce ,"record_status_cd" ,1000011_rep->rb_list[1].record_status_cd )
		set stat = uar_srvsetdouble (hce ,"result_status_cd" , c_inerror_status_cd )
		set stat = uar_srvsetshort (hce ,"authentic_flag" ,1 )
		set stat = uar_srvsetshort (hce ,"publish_flag" ,1 )
		set stat = uar_srvsetdouble (hce ,"normalcy_cd",1000011_rep->rb_list[1].normalcy_cd)
		set stat = uar_srvsetstring (hce ,"normal_high",nullterm(1000011_rep->rb_list[1].normal_high))
		set stat = uar_srvsetstring (hce ,"normal_low",nullterm(1000011_rep->rb_list[1].normal_low))
		set stat = uar_srvsetstring (hce ,"critical_high",nullterm(1000011_rep->rb_list[1].critical_high))
		set stat = uar_srvsetstring (hce ,"critical_low",nullterm(1000011_rep->rb_list[1].critical_low))
		set stat = uar_srvsetdouble (hce ,"result_units_cd",1000011_rep->rb_list[1].result_units_cd)
		set stat = uar_srvsetdouble (hce ,"entry_mode_cd",1000011_rep->rb_list[1].entry_mode_cd)
		set stat = uar_srvsetdouble (hce ,"source_cd",1000011_rep->rb_list[1].source_cd)
		set stat = uar_srvsetshort (hce ,"event_start_tz",1000011_rep->rb_list[1].event_start_tz)
		set stat = uar_srvsetshort (hce ,"event_end_tz",1000011_rep->rb_list[1].event_end_tz)
		set stat = uar_srvsetdouble (hce ,"task_assay_version_nbr",1000011_rep->rb_list[1].task_assay_version_nbr)
		set stat = uar_srvsetshort(hce,"updt_cnt",1000011_rep->rb_list[1].updt_cnt)
		set stat = uar_srvsetdouble(hce,"updt_id",dPrsnlId)
 
		; Add comments if they exist
		if(sComments > " " or sReason > " ")
			declare sFinalNote = vc
			set sFinalNote = build2(sReason, char(10), sComments)
			set noteSize = textlen(sFinalNote)
			set hnote = uar_srvadditem(hce,"event_note_list")
		if(hnote)
			set stat = uar_srvsetdouble(hnote,"note_type_cd",c_rescomment_note_type_cd)
			set stat = uar_srvsetdouble(hnote,"note_format_cd",c_ah_note_format_cd)
			set stat = uar_srvsetdouble(hnote,"entry_method_cd",c_unknown_entry_method_cd)
			set stat = uar_srvsetdouble(hnote,"note_prsnl_id",dPrsnlId)
			set stat = uar_srvsetdate(hnote,"note_dt_tm",cnvtdatetime(curdate,curtime3))
			set stat = uar_srvsetdouble(hnote,"record_status_cd",c_active_rec_status_cd)
			set stat = uar_srvsetdouble(hnote,"compression_cd",c_nocomp_compression_cd)
			set stat = uar_srvsetasis(hnote,"long_blob",sFinalNote,noteSize)
			set stat = uar_srvsetshort(hnote,"note_tz",1000011_rep->rb_list[1].event_start_tz)
		else
			call ErrorHandler2(c_error_handler, "F", " UAR_SRVADDITEM ", "Failed to allocate event_note_list",
			"9999", "Failed to allocate event_note_list", observation_reply_out)
			go to EXIT_SCRIPT
			endif
		endif
 
		set hprsnl = uar_srvadditem (hce ,"event_prsnl_list" )
		if (hprsnl )
			set stat = uar_srvsetshort (hprsnl, "action_tz", 1000011_rep->rb_list[1].event_start_tz)
			set stat = uar_srvsetdouble (hprsnl ,"action_prsnl_id" ,dPrsnlId)
			set stat = uar_srvsetdate (hprsnl ,"action_dt_tm" ,cnvtdatetime(curdate,curtime3))
			set stat = uar_srvsetdouble (hprsnl ,"action_type_cd" ,c_action_type_modify )
			set stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_action_status_completed )
			set sMsgTxt = "Modify"
		else
			call ErrorHandler2(c_error_handler, "F", " UAR_SRVADDITEM ", "Failed to allocate event_prsnl_list",
			"9999", build2("Failed to allocate event_prsnl_list - ",sMsgTxt), observation_reply_out)
			go to EXIT_SCRIPT
		endif
 
	ELSE
		call ErrorHandler2(c_error_handler, "F", " UAR_SRVGETSTRUCT ", "Failed to allocate clin_event",
		"9999", "Failed to allocate clin_event", observation_reply_out)
		GO TO EXIT_SCRIPT
	ENDIF
 
	if ((cvperformatr (null ) != 0 ) )
		go to exit_script
	endif
 
	set hstatus = uar_srvgetstruct (cv_atr->hreply ,"sb" )
	IF (hstatus )
		set reply->sb_severity = uar_srvgetlong (hstatus ,"severityCd" )
		set reply->sb_status = uar_srvgetlong (hstatus ,"statusCd" )
		set reply->sb_statustext = uar_srvgetstringptr (hstatus ,"statusText" )
	ELSE
		call ErrorHandler2(c_error_handler, "F", " UAR_SRVGETSTRUCT ", "hStatus returned F",
		"9999", "Invalid hStatus: F", observation_reply_out)
	ENDIF
 
	set rep_cnt = uar_srvgetitemcount (cv_atr->hreply,"rep")
	if(rep_cnt > 0)
		set rep = uar_srvgetitem(cv_atr->hreply ,"rep" ,0)
		set rb_cnt = uar_srvgetitemcount (rep ,"rb_list" )
 
		IF ((rb_cnt >= 1 ) )
			set hrb = uar_srvgetitem (rep ,"rb_list" ,0 )
			set observation_reply_out->observation_id = uar_srvgetdouble (hrb ,"parent_event_id" )
			call ErrorHandler2(c_error_handler, "S", "Process completed", "Observation has been deleted successfully",
			"0000", build2("Observation ID: ",observation_reply_out->observation_id, " has been deleted."), observation_reply_out)
 
			if(iDebugFlag > 0)
				call echo(build("parent_event_id -->", observation_reply_out->observation_id))
			endif
 
		ELSE
			call ErrorHandler2(c_error_handler, "F", " UAR_SRVGETSTRUCT ", "Reply rb_list is empty",
			"9999", "Reply rb_list is empty", observation_reply_out)
		ENDIF
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("PutObservation Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
end go
 
 
 
 
