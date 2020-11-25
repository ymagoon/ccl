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
		Date Written:       06/12/15
        Source file name:   vigilanz_get_flowsheet
        Object name:        vigilanz_get_flowsheet
        Program purpose:    Returns result values for specific flowsheets
        Executing from:     EMISSARY SERVICES
***********************************************************************
                   GENERATED MODIFICATION CONTROL LOG
***********************************************************************
Mod Date     Engineer             Comment
 ------------------------------------------------------------------
  000 06/12/15	AAB		    Initial write
  001 07/30/15	AAB			Add Observed_dt_tm to response
  002 07/30/15	AAB			Pull Normal_cd MEANING
  003 09/14/15	AAB			Add audit object
  004 12/09/15	AAB			Return encntr_type_cd and encntr_type_disp
  005 02/22/16	AAB 		Add encntr_type_cd and encntr_type_disp
  006 04/29/16	AAB 		Added version
  007 06/03/16	AAB 		Username was missing from Prompt
  008 10/10/16	AAB 		Add DEBUG_FLAG
  009 07/06/17	JCO			Fixed 1000011 reply structure
  010 07/27/17	JCO			Changed %i to execute; update ErrorHandler2
  011 03/21/18	RJC			Added version code and copyright block
  012 11/01/18	RJC			Added observation group
  013 04/22/19  STV         Added task object
  014 08/22/19  STV         Adjustment for result_dt_tm
  015 10/16/19  STV         Added Documented by
  016 11/14/19  JJR			Adding Coded Results
  017 01/02/20  KRD         Added long blob results to populate result_val_long_text
  018 1/16/20   KRD         Added long blob results to populate observation_comments
  019 04/30/20  KRD	    Fix long "Other" Alpha response text - 
                            used existing result_val_long_text
***********************************************************************/
drop program vigilanz_get_flowsheet go
create program vigilanz_get_flowsheet
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Result Id :" = 0.0
	, "Username" = ""		;007
  	, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).	  008
 
with OUTDEV, RESULT_ID, USERNAME, DEBUG_FLAG   ;008
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2" ;011
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
 
free record req_in
record req_in (
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
)
 
 
free record reply_out
record reply_out (
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
/*009 begin*/
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
/*009 end*/
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
 
free record flowsheet_reply_out
record flowsheet_reply_out
(
   1 events[*]
      2 clinical_event_id 		= f8
      2 result_id 				= f8	; ce.event_id
      2 parent_event_id         = f8
      2 person_id 				= f8
	  2 component_id     		= f8	; ce.event_cd
	  2 component_desc       	= vc	; ce.event_cd (Disp)
      2 result_date				= dq8 	; ce.performed_dt_tm
	  2 clinsig_updt_dt_tm		= dq8	; ce.clinsig_updt_dt_tm
	  2 observed_dt_tm			= dq8   ; ce.event_end_dt_tm  ;001
      2 valid_from_date 		= dq8
      2 normalcy_cd 			= f8
	  2 normalcy_disp 			= vc
	  2 normal_high				= vc	; ce.normal_high
	  2 normal_low				= vc	; ce.normal_low
      2 order_id 				= f8
      2 result_status_cd 		= f8
	  2 result_status	 		= vc
      2 event_tag 				= vc
      2 event_class_cd 			= f8
	  2 event_class_disp 		= vc
      2 string_result_text		= vc
      2 calc_result_text 		= vc
      2 date_result 			= dq8
      2 date_result_type 		= i2
      2 date_result_tz 			= i4
      2 unit_cd 				= f8
	  2 unit_disp 				= vc
      2 result_val 				= vc
      2 result_dt_tm            = dq8
      2 collating_seq 			= vc
	  2 encntr_id 				= f8	;004
	  2 encntr_type_cd			= f8	;004
	  2 encntr_type_disp		= vc	;004
	  2 encntr_type_class_cd	= f8	;005
	  2 encntr_type_class_disp	= vc	;005
	  2 observation_group				;012
	  	3 id 					= f8
	  	3 name 					= vc
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
  	2 documented_by [*]
  			3 provider
  				4 provider_id = f8
  				4 provider_name = vc
  			3 action
  				4 id = f8
  				4 name = vc
 
 
  	2 coded_results[*] ;016
  	 3 id = f8
  	 3 name = vc
 
;017
  	2 result_val_long_text[*]
  		3 note_date_time = dq8
  		3 comments = vc
  		3 format
  			4 id = f8
  			4 name = vc
  		3 provider
  			4 provider_id = f8
  			4 provider_name = vc
 
	2 observation_comment[*]  ;018
  			3 note_date_time = dq8
  			3 comments = vc
  			3 format
  				4 id = f8
  				4 name = vc
  			3 provider
  				4 provider_id = f8
  				4 provider_name = vc
 
	1 audit			;003
		2 user_id							= f8
		2 user_firstname					= vc
		2 user_lastname						= vc
		2 patient_id						= f8
		2 patient_firstname					= vc
		2 patient_lastname					= vc
	    2 service_version					= vc		 ;006
 
;010 %i cclsource:status_block.inc
/*010 begin */
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
/*010 end */
)
 
 
set flowsheet_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare dResultID  					= f8 with protect, noconstant(0.0)
declare JSONout						= vc with protect, noconstant("")
declare sUserName					= vc with protect, noconstant("")   ;003
declare iRet						= i2 with protect, noconstant(0) 	;003
 
declare APPLICATION_NUMBER 			= i4 with protect, constant(600005)
declare TASK_NUMBER 				= i4 with protect, constant(600107)
declare REQ_NUM	 					= i4 with protect, constant(1000011)
declare Section_Start_Dt_Tm 		= dq8 with protect, noconstant(cnvtdatetime(curdate, curtime3))
declare idebugFlag					= i2 with protect, noconstant(0) ;008
declare c_noocfcomp_cd = f8 with protect, constant(uar_get_code_by("MEANING",120,"NOCOMP")) ;017
declare c_ocfcomp_cd =  f8 with protect, constant(uar_get_code_by("MEANING",120,"OCFCOMP")) ;017
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set dResultID   = cnvtint($RESULT_ID)
set sUserName	= trim($USERNAME, 3)   ;003
set idebugFlag	= cnvtint($DEBUG_FLAG)  ;008
 
if(idebugFlag > 0)
 
	call echo(build("dResultID -->",dResultID))
	call echo(build("sUserName  ->", sUserName))
 
endif
 
/****************************************************************************
;INCLUDES
****************************************************************************/
;010 %i ccluserdir:snsro_common.inc
execute snsro_common
 
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetFlowsheetData(null) 		= null with protect
declare PostAmble(null)				= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
if(dResultID > 0.0)
	call GetFlowsheetData(null)
    call PostAmble(null)
	set iRet = PopulateAudit(sUserName, flowsheet_reply_out->events[1]->person_id, flowsheet_reply_out, sVersion)   ;006      ;003
 
	if(iRet = 0)  ;004
		call ErrorHandler("FLOWSHEET DATA", "F", "User is invalid", "Invalid User for Audit.", flowsheet_reply_out)
		set flowsheet_reply_out->status_data->status = "F"
		go to EXIT_SCRIPT
 
	endif
 
	call ErrorHandler("QUERY", "S", "FLOWSHEET DATA", "Flowsheet detail retrieved successfully.", flowsheet_reply_out)
else
	call ErrorHandler("QUERY", "F", "FLOWSHEET DATA", "Missing required field: RESULT ID.", flowsheet_reply_out)
	set flowsheet_reply_out->status_data->status = "F"
	go to EXIT_SCRIPT
endif
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
 
if(idebugFlag > 0)
 
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_flowsheet.json")
	call echo(build2("_file : ", _file))
	call echojson(flowsheet_reply_out, _file, 0)
    call echorecord(flowsheet_reply_out)
	call echo(JSONout)
 
endif
 
 
	set JSONout = CNVTRECTOJSON(flowsheet_reply_out)
    if(validate(_MEMORY_REPLY_STRING))
		set _MEMORY_REPLY_STRING = trim(JSONout,3)
	endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetFlowsheetData
;  Description: Retrieve Flowsheet information by result ID
**************************************************************************/
subroutine GetFlowsheetData(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetFlowsheetData Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
if(idebugFlag > 0)
 
	call echo(build("Result id: ",dResultID))
 
endif
 
set req_in->query_mode = 269615107 ;value hard-coded to match PowerChart
set req_in->query_mode_ind = 0
set req_in->event_id = dResultID
set req_in->contributor_system_cd = 0
set req_in->subtable_bit_map = 0
set req_in->subtable_bit_map_ind = 1
set req_in->valid_from_dt_tm = cnvtdatetime("0000-00-00 00:00:00.00")
set req_in->valid_from_dt_tm_ind = 1
set req_in->decode_flag = 0
set req_in->ordering_provider_id = 0
set req_in->action_prsnl_id = 0
set req_in->src_event_id_ind = 0
set req_in->action_prsnl_group_id = 0
 
 
	set stat = tdbexecute(APPLICATION_NUMBER, TASK_NUMBER, REQ_NUM,"REC",req_in,"REC", reply_out)
 call echorecord(req_in)
call echorecord(reply_out)
 
	if(stat > 0)
		call ErrorHandler("EXECUTE", "F", "Error", "Error executing EVENT DETAIL tdbexecute. ", flowsheet_reply_out)
		go to EXIT_SCRIPT
 
	endif
 
	if(size(reply_out->rb_list, 5) = 0)
 
		call ErrorHandler("EXECUTE", "Z", "No Data found", "No flowsheet values found", flowsheet_reply_out )
 
	else
 
		call ErrorHandler("EXECUTE", "S", "Success", "Success retrieving flowsheet item detail", flowsheet_reply_out )
 
	endif
 
if(idebugFlag > 0)
call echorecord(reply_out)
	call echo(concat("GetFlowsheetData Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
/*************************************************************************
;  Name: PostAmble(null)
;  Description: This will perform any post processing after the search has been performed
;
**************************************************************************/
subroutine PostAmble(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("PostAmble Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
declare event_cnt 				= i4 with protect, noconstant(0)
 
set event_cnt = size(reply_out->rb_list, 5)
 
for (x = 1 to event_cnt)
 
	set state = alterlist(flowsheet_reply_out->events, x)
 
	set flowsheet_reply_out->events[x]->clinical_event_id 	=  reply_out->rb_list[x]->clinical_event_id
	set flowsheet_reply_out->events[x]->order_id 			=  reply_out->rb_list[x]->order_id
	set flowsheet_reply_out->events[x]->person_id 			=  reply_out->rb_list[x]->person_id
	set flowsheet_reply_out->events[x]->encntr_id 			=  reply_out->rb_list[x]->encntr_id
	set flowsheet_reply_out->events[x]->encntr_type_cd 		=  GetPatientClass(flowsheet_reply_out->events[x]->encntr_id,1)			  ;004
	set flowsheet_reply_out->events[x]->encntr_type_disp	=  uar_get_code_display(flowsheet_reply_out->events[x]->encntr_type_cd)   ;004
	set flowsheet_reply_out->events[x]->encntr_type_class_cd =  GetPatientClass(flowsheet_reply_out->events[x]->encntr_id,2)			  ;005
	set flowsheet_reply_out->events[x]->encntr_type_class_disp	=
		uar_get_code_display(flowsheet_reply_out->events[x]->encntr_type_class_cd)   ;005
 
	set flowsheet_reply_out->events[x]->result_id 			=  reply_out->rb_list[x]->event_id
	set flowsheet_reply_out->events[x].parent_event_id      = reply_out->rb_list[x].parent_event_id
	set flowsheet_reply_out->events[x]->collating_seq		=  reply_out->rb_list[x]->clinical_seq
	set flowsheet_reply_out->events[x]->result_date		=  reply_out->rb_list[x]->performed_dt_tm
	set flowsheet_reply_out->events[x]->result_val			=  reply_out->rb_list[x]->result_val
	set flowsheet_reply_out->events[x]->component_id     	=  reply_out->rb_list[x]->event_cd
	set flowsheet_reply_out->events[x]->component_desc     =  reply_out->rb_list[x]->event_cd_disp
	set flowsheet_reply_out->events[x]->unit_disp			=  reply_out->rb_list[x]->result_units_cd_disp
	set flowsheet_reply_out->events[x]->unit_cd			=  reply_out->rb_list[x]->result_units_cd
	set flowsheet_reply_out->events[x]->clinsig_updt_dt_tm =  reply_out->rb_list[x]->clinsig_updt_dt_tm
	set flowsheet_reply_out->events[x]->observed_dt_tm	   = reply_out->rb_list[x]->event_end_dt_tm   ;001
	set flowsheet_reply_out->events[x]->result_status		=  reply_out->rb_list[x]->result_status_cd_disp
	set flowsheet_reply_out->events[x]->result_status_cd	=  reply_out->rb_list[x]->result_status_cd
	set flowsheet_reply_out->events[x]->normalcy_disp		=  uar_get_code_meaning(reply_out->rb_list[x]->normalcy_cd) ;002
	set flowsheet_reply_out->events[x]->normalcy_cd		=  reply_out->rb_list[x]->normalcy_cd
	set flowsheet_reply_out->events[x]->normal_high		=  reply_out->rb_list[x]->normal_high
	set flowsheet_reply_out->events[x]->normal_low			=  reply_out->rb_list[x]->normal_low
	set flowsheet_reply_out->events[x]->event_tag			=  reply_out->rb_list[x]->event_tag
	set flowsheet_reply_out->events[x]->event_class_cd		=  reply_out->rb_list[x]->event_class_cd
	set flowsheet_reply_out->events[x]->event_class_disp	=  uar_get_code_display(reply_out->rb_list[x]->event_class_cd)
	set flowsheet_reply_out->events[x]->string_result_text	=  "" ;rep_event_query->rb_list[1]->event_list[x]->
	set flowsheet_reply_out->events[x]->calc_result_text	=  "";rep_event_query->rb_list[1]->event_list[x]->
	set flowsheet_reply_out->events[x]->date_result_type	=  0;rep_event_query->rb_list[1]->event_list[x]->
	set flowsheet_reply_out->events[x]->date_result_tz		=  0;rep_event_query->rb_list[1]->event_list[x]->
 
	;Observation group
	if(reply_out->rb_list[x].ce_dynamic_label_id > 0)
 		set flowsheet_reply_out->events[x].observation_group.id = reply_out->rb_list[x].dynamic_label_list[1].ce_dynamic_label_id
 		set flowsheet_reply_out->events[x].observation_group.name = reply_out->rb_list[x].dynamic_label_list[1].label_name
	endif
endfor
 
;getting the date result
	select into "nl:"
	from ce_date_result cdr
		 ,(dummyt d with seq = size(flowsheet_reply_out->events,5))
	plan d
		where flowsheet_reply_out->events[d.seq].result_id > 0
	join cdr
			where cdr.event_id = flowsheet_reply_out->events[d.seq].result_id
				and cdr.valid_from_dt_tm <= cnvtdatetime(curdate,curtime3)
				and cdr.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
	head d.seq
		flowsheet_reply_out->events[d.seq].result_dt_tm = cdr.result_dt_tm
	with nocounter
 
;getting the task object
	select into "nl:"
	from (dummyt d with seq = size(flowsheet_reply_out->events,5))
     	 ,task_activity ta
	plan d
		where flowsheet_reply_out->events[d.seq].parent_event_id > 0
	join ta
		where ta.event_id = flowsheet_reply_out->events[d.seq].parent_event_id
	head d.seq
		x = 0
		detail
			x = x + 1
			stat = alterlist(flowsheet_reply_out->events[d.seq].tasks,x)
			flowsheet_reply_out->events[d.seq].tasks[x].task_id= ta.task_id
			flowsheet_reply_out->events[d.seq].tasks[x].task_class.id = ta.task_class_cd
			flowsheet_reply_out->events[d.seq].tasks[x].task_class.name = trim(uar_get_code_display(ta.task_class_cd))
			flowsheet_reply_out->events[d.seq].tasks[x].task_type.id = ta.task_type_cd
			flowsheet_reply_out->events[d.seq].tasks[x].task_type.name = trim(uar_get_code_display(ta.task_type_cd))
			flowsheet_reply_out->events[d.seq].tasks[x].task_status.id = ta.task_status_cd
			flowsheet_reply_out->events[d.seq].tasks[x].task_status.name = trim(uar_get_code_display(ta.task_status_cd))
	with nocounter
 
	;getting the documented by
	select into "nl:"
	from (dummyt d with seq = size(flowsheet_reply_out->events,5))
	     ,ce_event_prsnl cep
	     ,prsnl p
	plan d
		where flowsheet_reply_out->events[d.seq].result_id > 0
	join cep
		where cep.event_id = flowsheet_reply_out->events[d.seq].result_id
			and cep.valid_until_dt_tm > cnvtdatetime(curdate, curtime3)
	join p
		where p.person_id = cep.action_prsnl_id
	order by d.seq, cep.ce_event_prsnl_id
	head d.seq
		x = 0
		head cep.ce_event_prsnl_id
			x = x + 1
			stat = alterlist(flowsheet_reply_out->events[d.seq].documented_by,x)
			flowsheet_reply_out->events[d.seq].documented_by[x].action.id = cep.action_type_cd
			flowsheet_reply_out->events[d.seq].documented_by[x].action.name = uar_get_code_display(cep.action_type_cd)
			flowsheet_reply_out->events[d.seq].documented_by[x].provider.provider_id = p.person_id
			flowsheet_reply_out->events[d.seq].documented_by[x].provider.provider_name = p.name_full_formatted
	with nocounter
 
;BEG 016
;getting coded results
	select into "nl:"
	from
	   (dummyt d with seq = size(flowsheet_reply_out->events,5))
	   ,ce_coded_result cer
	   ,nomenclature n
	plan d
		where flowsheet_reply_out->events[d.seq].result_id > 0
	join cer
			where cer.event_id = flowsheet_reply_out->events[d.seq].result_id
				and cer.valid_from_dt_tm <= cnvtdatetime(curdate,curtime3)
				and cer.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
   join n
   where n.nomenclature_id = cer.nomenclature_id
       and n.active_ind = 1
 
	head d.seq
	x = 0
		detail
			x = x + 1
			stat = alterlist(flowsheet_reply_out->events[d.seq].coded_results,x)
			flowsheet_reply_out->events[d.seq].coded_results[x].id = n.nomenclature_id
			flowsheet_reply_out->events[d.seq].coded_results[x].name = trim(n.source_string)
	with nocounter
;END 016
 
;017 getting long blob if it exists
 	set idx = 1
 	if(size(flowsheet_reply_out->events,5) > 200)
		set exp = 2
	else
		set exp = 0
	endif
	declare blob = c32768
	;set blob = fillstring(32768,"~")
 
	declare size_blob = i4
	set size_blob = 32768
 
	select into "nl:"
	from ce_blob_result cbr
		 ,ce_blob cb
	plan cbr
		where expand(idx,1,size(flowsheet_reply_out->events,5),cbr.event_id
								, flowsheet_reply_out->events[idx].result_id)
			and cbr.valid_until_dt_tm > cnvtdatetime(curdate, curtime3)
	join cb
		where cb.event_id =  cbr.event_id
			and cb.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
	order by cb.event_id, cb.blob_seq_num
	head report
		next = 0
		head cb.event_id
			x = 0
			next = next + 1
			pos = locateval(idx,next,size(flowsheet_reply_out->events,5)
							,cb.event_id,flowsheet_reply_out->events[idx].result_id)
 
			head cb.blob_seq_num
				x = x + 1
				stat = alterlist(flowsheet_reply_out->events[pos].result_val_long_text,x)
				flowsheet_reply_out->events[pos].result_val_long_text[x].format.id = cbr.format_cd
				flowsheet_reply_out->events[pos].result_val_long_text[x].format.name = uar_get_code_display(cbr.format_cd)
				flowsheet_reply_out->events[pos].result_val_long_text[x].note_date_time = cb.valid_from_dt_tm
				;;todo is find the provider
 
 
				blob = " ";resets the string
				if(cb.compression_cd = c_noocfcomp_cd)
					blob = substring(1,findstring("ocf_blob",cb.blob_contents,1)-1,cb.blob_contents)
				elseif(cb.compression_cd = c_ocfcomp_cd)
					stat = uar_ocf_uncompress(cb.blob_contents, cb.blob_length, blob, size_blob, 32768)
				endif
				flowsheet_reply_out->events[pos].result_val_long_text[x].comments = trim(blob)
 	with nocounter
;END 017
 
;Begining of ;018
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
 	cbr.event_id , cb.long_blob_id
	from ce_event_note cbr
		,long_blob cb
		,prsnl pr
	plan cbr
		where expand(idx,1,size(flowsheet_reply_out->events,5),cbr.event_id
								, flowsheet_reply_out->events[idx].result_id)
		and cbr.valid_until_dt_tm > cnvtdatetime(curdate, curtime3)
	join cb
		where cb.parent_entity_id  =  cbr.ce_event_note_id
			and cb.parent_entity_name = "CE_EVENT_NOTE"
	join pr where pr.person_id  = cbr.note_prsnl_id
		and pr.active_ind = 1
	order by cbr.event_id , cb.long_blob_id
	head report
		next = 0
		head cbr.event_id
			x = 0
			next = next + 1
			pos = locateval(idx,1,size(flowsheet_reply_out->events,5),cbr.event_id
								, flowsheet_reply_out->events[idx].result_id)
			head cb.long_blob_id
				x = x + 1
				stat = alterlist(flowsheet_reply_out->events [pos].observation_comment,x)
				flowsheet_reply_out->events[pos].observation_comment[x].format.id = cbr.note_format_cd
				flowsheet_reply_out->events[pos].observation_comment[x].format.name
																			 = uar_get_code_display(cbr.note_format_cd)
				flowsheet_reply_out->events[pos].observation_comment[x].note_date_time = cb.active_status_dt_tm
				flowsheet_reply_out->events[pos].observation_comment[x].provider .provider_id  = pr.person_id
				flowsheet_reply_out->events[pos].observation_comment[x].provider .provider_name = pr.
				name_full_formatted
 				blob = " ";resets the string
				if(cbr.compression_cd  = c_noocfcomp_cd)
					blob = substring(1,findstring("ocf_blob",cb.long_blob ,1)-1,cb.long_blob)
				elseif(cbr.compression_cd = c_ocfcomp_cd)
					stat = uar_ocf_uncompress(cb.long_blob, size(trim(cb.long_blob)), blob, size_blob, 32768)
				endif
 				flowsheet_reply_out->events[pos].observation_comment[x].comments = trim(blob)
  	with nocounter
 ;end of 018
 
   ;begin 019
   set queryStartTm = cnvtdatetime(curdate, curtime3)
   set idx = 0
   select into "nl:"
   from  ce_string_result cer
   plan cer
			where expand(idx,1,size(flowsheet_reply_out->events,5),cer.event_id
						,flowsheet_reply_out->events[idx].result_id)
			and cer.valid_until_dt_tm > cnvtdatetime(curdate, curtime3)
	order by cer.event_id
	detail
		next = 1
		pos = locateval(idx,next,size(flowsheet_reply_out->events,5),cer.event_id,
       		  flowsheet_reply_out->events[idx].result_id)
		x = size(flowsheet_reply_out->events[pos]->result_val_long_text,5)+1
			while(pos > 0 and next <= size(flowsheet_reply_out->events,5))
				stat = alterlist(flowsheet_reply_out->events[pos].result_val_long_text,x)
				flowsheet_reply_out->events[pos].result_val_long_text [x].comments  = trim(cer.string_result_text)
				flowsheet_reply_out->events[pos].result_val_long_text[x].format.id = cer.string_result_format_cd
				flowsheet_reply_out->events[pos].result_val_long_text[x].format.name
																			 = uar_get_code_display(cer.string_result_format_cd)
				flowsheet_reply_out->events[pos].result_val_long_text[x].note_date_time = cer.valid_from_dt_tm
				next = pos + 1
				pos = locateval(idx,next,size(flowsheet_reply_out->events,5),cer.event_id,
				flowsheet_reply_out->events[idx].result_id)
			endwhile
	with nocounter
	;end 019
 
if(idebugFlag > 0)
 
	call echo(concat("PostAmble Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
 
end go
 