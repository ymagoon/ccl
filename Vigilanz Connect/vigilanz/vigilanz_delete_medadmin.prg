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
      Source file name: snsro_delete_medadmin.prg
      Object name:      vigilanz_delete_medadmin
      Program purpose:  DELETE a medication administration in Millennium
      Executing from:   Emissary
***********************************************************************
                  MODIFICATION CONTROL LOG
***********************************************************************
 Mod Date     	Engineer  	Comment
 -----------------------------------------------------------------------
 001 12/25/18	STV 		Initial Write
 002 03/08/19	RJC			Fixed minor issue with variable misspelling
 003 06/06/19   STV         Added SystemId and REference number
 004 09/09/19   RJC         Renamed object
************************************************************************/
;drop program snsro_delete_med_admin go
drop program vigilanz_delete_medadmin go
create program vigilanz_delete_medadmin
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Username" = ""
	, "AdministrationId" = ""
	, "Reason" = ""
	, "StatusId" = ""
	, "SystemId" = ""
	, "ReferenceNumber" = ""
	, "Debug" = 0
 
with OUTDEV, USERNAME, ADMINISTRATIONID, COMMENT, STATUSID, SystemId,
	ReferenceNumber, DEBUG_FLAG
 
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
 
;;1000087 - result_set_detail_batch_query
free record 1000087_req
record 1000087_req (
  1 req_list [*]
    2 query_mode  = i4
    2 result_set_id_list [*]
      3 result_set_id = f8
    2 subtable_bit_map = i4
    2 subtable_bit_map_ind = i2
    2 decode_flag = i2
    2 relation_type_list [*]
      3 relation_type_cd = f8
)
 
 
free record 1000087_rep
record 1000087_rep (
  1 sb
    2 severityCd = i4
    2 statusCd = i4
    2 statusText = vc
    2 subStatusList [*]
      3 subStatusCd = i4
  1 rep_list [*]
    2 sb
      3 severityCd = i4
      3 statusCd = i4
      3 statusText = vc
      3 subStatusList [*]
        4 subStatusCd = i4
    2 rb_list [*]
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
      3 event_reltn_cd = f8
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
      3 io_result [*]
        4 ce_io_result_id = f8
        4 event_id = f8
        4 person_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 io_dt_tm = dq8
        4 io_dt_tm_ind = i2
        4 type_cd = f8
        4 type_cd_disp = vc
        4 type_cd_mean = vc
        4 group_cd = f8
        4 group_cd_disp = vc
        4 group_cd_mean = vc
        4 volume = f8
        4 volume_ind = i2
        4 authentic_flag = i2
        4 authentic_flag_ind = i2
        4 record_status_cd = f8
        4 record_status_cd_disp = vc
        4 record_status_cd_mean = vc
        4 io_comment = vc
        4 system_note = vc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
      3 specimen_coll [*]
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 specimen_id = f8
        4 container_id = f8
        4 container_type_cd = f8
        4 container_type_cd_disp = vc
        4 container_type_cd_mean = vc
        4 specimen_status_cd = f8
        4 specimen_status_cd_disp = vc
        4 specimen_status_cd_mean = vc
        4 collect_dt_tm = dq8
        4 collect_dt_tm_ind = i2
        4 collect_method_cd = f8
        4 collect_method_cd_disp = vc
        4 collect_method_cd_mean = vc
        4 collect_loc_cd = f8
        4 collect_loc_cd_disp = vc
        4 collect_loc_cd_mean = vc
        4 collect_prsnl_id = f8
        4 collect_volume = f8
        4 collect_volume_ind = i2
        4 collect_unit_cd = f8
        4 collect_unit_cd_disp = vc
        4 collect_unit_cd_mean = vc
        4 collect_priority_cd = f8
        4 collect_priority_cd_disp = vc
        4 collect_priority_cd_mean = vc
        4 source_type_cd = f8
        4 source_type_cd_disp = vc
        4 source_type_cd_mean = vc
        4 source_text = vc
        4 body_site_cd = f8
        4 body_site_cd_disp = vc
        4 body_site_cd_mean = vc
        4 danger_cd = f8
        4 danger_cd_disp = vc
        4 danger_cd_mean = vc
        4 positive_ind = i2
        4 positive_ind_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 specimen_trans_list [*]
          5 event_id = f8
          5 sequence_nbr = i4
          5 sequence_nbr_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 transfer_dt_tm = dq8
          5 transfer_dt_tm_ind = i2
          5 transfer_prsnl_id = f8
          5 transfer_loc_cd = f8
          5 transfer_loc_cd_disp = vc
          5 receive_dt_tm = dq8
          5 receive_dt_tm_ind = i2
          5 receive_prsnl_id = f8
          5 receive_loc_cd = f8
          5 receive_loc_cd_disp = vc
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
        4 collect_tz = i4
        4 recvd_dt_tm = dq8
        4 recvd_tz = i4
      3 blob_result [*]
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
      3 string_result [*]
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 string_result_text = vc
        4 string_result_format_cd = f8
        4 string_result_format_cd_disp = vc
        4 equation_id = f8
        4 last_norm_dt_tm = dq8
        4 last_norm_dt_tm_ind = i2
        4 unit_of_measure_cd = f8
        4 unit_of_measure_cd_disp = vc
        4 feasible_ind = i2
        4 feasible_ind_ind = i2
        4 inaccurate_ind = i2
        4 inaccurate_ind_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 interp_comp_list [*]
          5 event_id = f8
          5 comp_idx = i4
          5 comp_idx_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 comp_event_id = f8
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 comp_name = vc
        4 calculation_equation = vc
        4 string_long_text_id = f8
      3 blood_transfuse [*]
        4 event_id = f8
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 transfuse_start_dt_tm = dq8
        4 transfuse_start_dt_tm_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 transfuse_end_dt_tm = dq8
        4 transfuse_end_dt_tm_ind = i2
        4 transfuse_note = vc
        4 transfuse_route_cd = f8
        4 transfuse_site_cd = f8
        4 transfuse_pt_loc_cd = f8
        4 initial_volume = f8
        4 total_intake_volume = f8
        4 transfusion_rate = f8
        4 transfusion_unit_cd = f8
        4 transfusion_time_cd = f8
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
      3 apparatus [*]
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 apparatus_type_cd = f8
        4 apparatus_type_cd_disp = vc
        4 apparatus_serial_nbr = vc
        4 apparatus_size_cd = f8
        4 apparatus_size_cd_disp = vc
        4 body_site_cd = f8
        4 body_site_cd_disp = vc
        4 insertion_pt_loc_cd = f8
        4 insertion_pt_loc_cd_disp = vc
        4 insertion_prsnl_id = f8
        4 removal_pt_loc_cd = f8
        4 removal_pt_loc_cd_disp = vc
        4 removal_prsnl_id = f8
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 assistant_list [*]
          5 event_id = f8
          5 assistant_type_cd = f8
          5 assistant_type_cd_disp = vc
          5 assistant_type_cd_mean = vc
          5 sequence_nbr = i4
          5 sequence_nbr_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 assistant_prsnl_id = f8
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
      3 product [*]
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 product_id = f8
        4 product_nbr = vc
        4 product_cd = f8
        4 product_cd_disp = vc
        4 product_cd_mean = vc
        4 abo_cd = f8
        4 abo_cd_disp = vc
        4 abo_cd_mean = vc
        4 rh_cd = f8
        4 rh_cd_disp = vc
        4 rh_cd_mean = vc
        4 product_status_cd = f8
        4 product_status_cd_disp = vc
        4 product_status_cd_mean = vc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 product_antigen_list [*]
          5 event_id = f8
          5 prod_ant_seq_nbr = i4
          5 prod_ant_seq_nbr_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 antigen_cd = f8
          5 antigen_cd_disp = vc
          5 antigen_cd_mean = vc
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
          5 attribute_ind = i2
        4 product_volume = f8
        4 product_volume_unit_cd = f8
        4 product_quantity = f8
        4 product_quantity_unit_cd = f8
        4 product_strength = f8
        4 product_strength_unit_cd = f8
      3 date_result [*]
        4 event_id = f8
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 result_dt_tm = dq8
        4 result_dt_tm_ind = i2
        4 result_dt_tm_os = f8
        4 result_dt_tm_os_ind = i2
        4 date_type_flag = i2
        4 date_type_flag_ind = i2
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
        4 result_tz_ind = i2
      3 med_result_list [*]
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 admin_note = vc
        4 admin_prov_id = f8
        4 admin_start_dt_tm = dq8
        4 admin_start_dt_tm_ind = i2
        4 admin_end_dt_tm = dq8
        4 admin_end_dt_tm_ind = i2
        4 admin_route_cd = f8
        4 admin_route_cd_disp = vc
        4 admin_route_cd_mean = vc
        4 admin_site_cd = f8
        4 admin_site_cd_disp = vc
        4 admin_site_cd_mean = vc
        4 admin_method_cd = f8
        4 admin_method_cd_disp = vc
        4 admin_method_cd_mean = vc
        4 admin_pt_loc_cd = f8
        4 admin_pt_loc_cd_disp = vc
        4 admin_pt_loc_cd_mean = vc
        4 initial_dosage = f8
        4 initial_dosage_ind = i2
        4 admin_dosage = f8
        4 admin_dosage_ind = i2
        4 dosage_unit_cd = f8
        4 dosage_unit_cd_disp = vc
        4 dosage_unit_cd_mean = vc
        4 initial_volume = f8
        4 initial_volume_ind = i2
        4 total_intake_volume = f8
        4 total_intake_volume_ind = i2
        4 diluent_type_cd = f8
        4 diluent_type_cd_disp = vc
        4 diluent_type_cd_mean = vc
        4 ph_dispense_id = f8
        4 infusion_rate = f8
        4 infusion_rate_ind = i2
        4 infusion_unit_cd = f8
        4 infusion_unit_cd_disp = vc
        4 infusion_unit_cd_mean = vc
        4 infusion_time_cd = f8
        4 infusion_time_cd_disp = vc
        4 infusion_time_cd_mean = vc
        4 medication_form_cd = f8
        4 medication_form_cd_disp = vc
        4 medication_form_cd_mean = vc
        4 reason_required_flag = i2
        4 reason_required_flag_ind = i2
        4 response_required_flag = i2
        4 response_required_flag_ind = i2
        4 admin_strength = i4
        4 admin_strength_ind = i2
        4 admin_strength_unit_cd = f8
        4 admin_strength_unit_cd_disp = vc
        4 admin_strength_unit_cd_mean = vc
        4 substance_lot_number = vc
        4 substance_exp_dt_tm = dq8
        4 substance_exp_dt_tm_ind = i2
        4 substance_manufacturer_cd = f8
        4 substance_manufacturer_cd_disp = vc
        4 substance_manufacturer_cd_mean = vc
        4 refusal_cd = f8
        4 refusal_cd_disp = vc
        4 refusal_cd_mean = vc
        4 system_entry_dt_tm = dq8
        4 system_entry_dt_tm_ind = i2
        4 iv_event_cd = f8
        4 infused_volume = f8
        4 infused_volume_unit_cd = f8
        4 infused_volume_unit_cd_disp = vc
        4 infused_volume_unit_cd_mean = vc
        4 remaining_volume = f8
        4 remaining_volume_unit_cd = f8
        4 remaining_volume_unit_cd_disp = vc
        4 remaining_volume_unit_cd_mean = vc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 synonym_id = f8
        4 immunization_type_cd = f8
        4 immunization_type_cd_disp = vc
        4 immunization_type_cd_mean = vc
        4 admin_start_tz = i4
        4 admin_end_tz = i4
        4 contributor_link_list [*]
          5 event_id = f8
          5 contributor_event_id = f8
          5 ce_valid_from_dt_tm = dq8
          5 type_flag = i2
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
          5 ce_valid_until_dt_tm = dq8
          5 ce_result_value = vc
          5 ce_performed_prsnl_id = f8
          5 ce_event_end_dt_tm = dq8
          5 ce_event_cd = f8
          5 ce_event_cd_disp = vc
          5 ce_clinical_event_id = f8
          5 ce_event_class_cd = f8
          5 ce_event_class_cd_disp = vc
          5 string_result_list [*]
            6 event_id = f8
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 string_result_text = vc
            6 string_result_format_cd = f8
            6 string_result_format_cd_disp = vc
            6 equation_id = f8
            6 last_norm_dt_tm = dq8
            6 last_norm_dt_tm_ind = i2
            6 unit_of_measure_cd = f8
            6 unit_of_measure_cd_disp = vc
            6 feasible_ind = i2
            6 feasible_ind_ind = i2
            6 inaccurate_ind = i2
            6 inaccurate_ind_ind = i2
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 interp_comp_list [*]
              7 event_id = f8
              7 comp_idx = i4
              7 comp_idx_ind = i2
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 comp_event_id = f8
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              7 comp_name = vc
            6 calculation_equation = vc
            6 string_long_text_id = f8
          5 coded_result_list [*]
            6 event_id = f8
            6 sequence_nbr = i4
            6 sequence_nbr_ind = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 nomenclature_id = f8
            6 result_set = i4
            6 result_set_ind = i2
            6 result_cd = f8
            6 result_cd_disp = vc
            6 acr_code_str = vc
            6 proc_code_str = vc
            6 pathology_str = vc
            6 group_nbr = i4
            6 group_nbr_ind = i2
            6 mnemonic = vc
            6 short_string = vc
            6 descriptor = vc
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 unit_of_measure_cd = f8
            6 source_string = vc
          5 date_result_list [*]
            6 event_id = f8
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 result_dt_tm = dq8
            6 result_dt_tm_ind = i2
            6 result_dt_tm_os = f8
            6 result_dt_tm_os_ind = i2
            6 date_type_flag = i2
            6 date_type_flag_ind = i2
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 result_tz = i4
            6 result_tz_ind = i2
          5 ce_result_status_cd = f8
          5 ce_result_status_cd_disp = vc
          5 ce_event_end_tz = i4
        4 weight_value = f8
        4 weight_unit_cd = f8
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
      3 microbiology_list [*]
        4 event_id = f8
        4 micro_seq_nbr = i4
        4 micro_seq_nbr_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 organism_cd = f8
        4 organism_cd_disp = vc
        4 organism_cd_desc = vc
        4 organism_cd_mean = vc
        4 organism_occurrence_nbr = i4
        4 organism_occurrence_nbr_ind = i2
        4 organism_type_cd = f8
        4 organism_type_cd_disp = vc
        4 organism_type_cd_mean = vc
        4 observation_prsnl_id = f8
        4 biotype = vc
        4 probability = f8
        4 positive_ind = i2
        4 positive_ind_ind = i2
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 susceptibility_list [*]
          5 event_id = f8
          5 micro_seq_nbr = i4
          5 micro_seq_nbr_ind = i2
          5 suscep_seq_nbr = i4
          5 suscep_seq_nbr_ind = i2
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 susceptibility_test_cd = f8
          5 susceptibility_test_cd_disp = vc
          5 susceptibility_test_cd_mean = vc
          5 detail_susceptibility_cd = f8
          5 detail_susceptibility_cd_disp = vc
          5 detail_susceptibility_cd_mean = vc
          5 panel_antibiotic_cd = f8
          5 panel_antibiotic_cd_disp = vc
          5 panel_antibiotic_cd_mean = vc
          5 antibiotic_cd = f8
          5 antibiotic_cd_disp = vc
          5 antibiotic_cd_desc = vc
          5 antibiotic_cd_mean = vc
          5 diluent_volume = f8
          5 diluent_volume_ind = i2
          5 result_cd = f8
          5 result_cd_disp = vc
          5 result_cd_mean = vc
          5 result_text_value = vc
          5 result_numeric_value = f8
          5 result_numeric_value_ind = i2
          5 result_unit_cd = f8
          5 result_unit_cd_disp = vc
          5 result_unit_cd_mean = vc
          5 result_dt_tm = dq8
          5 result_dt_tm_ind = i2
          5 result_prsnl_id = f8
          5 susceptibility_status_cd = f8
          5 susceptibility_status_cd_disp = vc
          5 susceptibility_status_cd_mean = vc
          5 abnormal_flag = i2
          5 abnormal_flag_ind = i2
          5 chartable_flag = i2
          5 chartable_flag_ind = i2
          5 nomenclature_id = f8
          5 antibiotic_note = vc
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
      3 coded_result_list [*]
        4 event_id = f8
        4 sequence_nbr = i4
        4 sequence_nbr_ind = i2
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 nomenclature_id = f8
        4 result_set = i4
        4 result_set_ind = i2
        4 result_cd = f8
        4 result_cd_disp = vc
        4 acr_code_str = vc
        4 proc_code_str = vc
        4 pathology_str = vc
        4 group_nbr = i4
        4 group_nbr_ind = i2
        4 mnemonic = vc
        4 short_string = vc
        4 descriptor = vc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 unit_of_measure_cd = f8
        4 source_string = vc
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
        4 series_ref_nbr = vc
        4 sub_series_ref_nbr = vc
        4 succession_type_cd = f8
        4 succession_type_cd_disp = vc
        ;4 child_event ( List: Dynamic )
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
      3 event_modifier_list [*]
        4 modifier_cd = f8
        4 modifier_cd_disp = vc
        4 modifier_value_cd = f8
        4 modifier_value_cd_disp = vc
        4 modifier_val_ft = vc
        4 modifier_value_person_id = f8
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
        4 group_sequence = i4
        4 item_sequence = i4
      3 suscep_footnote_r_list [*]
        4 event_id = f8
        4 valid_from_dt_tm = dq8
        4 valid_from_dt_tm_ind = i2
        4 valid_until_dt_tm = dq8
        4 valid_until_dt_tm_ind = i2
        4 micro_seq_nbr = i4
        4 micro_seq_nbr_ind = i2
        4 suscep_seq_nbr = i4
        4 suscep_seq_nbr_ind = i2
        4 suscep_footnote_id = f8
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 suscep_footnote [*]
          5 event_id = f8
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 ce_suscep_footnote_id = f8
          5 suscep_footnote_id = f8
          5 checksum = i4
          5 checksum_ind = i2
          5 compression_cd = f8
          5 format_cd = f8
          5 contributor_system_cd = f8
          5 blob_length = i4
          5 blob_length_ind = i2
          5 reference_nbr = vc
          5 long_blob = gvc
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_id = f8
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
      3 inventory_result_list [*]
        4 item_id = f8
        4 serial_nbr = vc
        4 serial_mnemonic = vc
        4 description = vc
        4 item_nbr = vc
        4 quantity = f8
        4 quantity_ind = i2
        4 body_site = vc
        4 reference_entity_id = f8
        4 reference_entity_name = vc
        4 implant_result [*]
          5 item_id = f8
          5 item_size = vc
          5 harvest_site = vc
          5 culture_ind = i2
          5 culture_ind_ind = i2
          5 tissue_graft_type_cd = f8
          5 tissue_graft_type_cd_disp = vc
          5 explant_reason_cd = f8
          5 explant_reason_cd_disp = vc
          5 explant_disposition_cd = f8
          5 explant_disposition_cd_disp = vc
          5 reference_entity_id = f8
          5 reference_entity_name = vc
          5 manufacturer_cd = f8
          5 manufacturer_cd_disp = vc
          5 manufacturer_ft = vc
          5 model_nbr = vc
          5 lot_nbr = vc
          5 other_identifier = vc
          5 expiration_dt_tm = dq8
          5 expiration_dt_tm_ind = i2
          5 ecri_code = vc
          5 batch_nbr = vc
          5 event_id = f8
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_id = f8
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
        4 inv_time_result_list [*]
          5 item_id = f8
          5 start_dt_tm = dq8
          5 start_dt_tm_ind = i2
          5 end_dt_tm = dq8
          5 end_dt_tm_ind = i2
          5 event_id = f8
          5 valid_from_dt_tm = dq8
          5 valid_from_dt_tm_ind = i2
          5 valid_until_dt_tm = dq8
          5 valid_until_dt_tm_ind = i2
          5 updt_dt_tm = dq8
          5 updt_dt_tm_ind = i2
          5 updt_task = i4
          5 updt_task_ind = i2
          5 updt_id = f8
          5 updt_cnt = i4
          5 updt_cnt_ind = i2
          5 updt_applctx = i4
          5 updt_applctx_ind = i2
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
      ;3 child_event_list ( List: Dynamic ) ;;;;;;;;;;;;;;;;;;;;;
      ;3 hla_list ( List: Dynamic )
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
      3 calculation_result_list [*]
        4 event_id = f8
        4 equation = vc
        4 calculation_result = vc
        4 calculation_result_frmt_cd = f8
        4 calculation_result_frmt_cd_disp = vc
        4 last_norm_dt_tm = dq8
        4 last_norm_dt_tm_ind = i2
        4 unit_of_measure_cd = f8
        4 unit_of_measure_cd_disp = vc
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
        4 contributor_link_list [*]
          5 event_id = f8
          5 contributor_event_id = f8
          5 ce_valid_from_dt_tm = dq8
          5 type_flag = i2
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
          5 ce_valid_until_dt_tm = dq8
          5 ce_result_value = vc
          5 ce_performed_prsnl_id = f8
          5 ce_event_end_dt_tm = dq8
          5 ce_event_cd = f8
          5 ce_event_cd_disp = vc
          5 ce_clinical_event_id = f8
          5 ce_event_class_cd = f8
          5 ce_event_class_cd_disp = vc
          5 string_result_list [*]
            6 event_id = f8
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 string_result_text = vc
            6 string_result_format_cd = f8
            6 string_result_format_cd_disp = vc
            6 equation_id = f8
            6 last_norm_dt_tm = dq8
            6 last_norm_dt_tm_ind = i2
            6 unit_of_measure_cd = f8
            6 unit_of_measure_cd_disp = vc
            6 feasible_ind = i2
            6 feasible_ind_ind = i2
            6 inaccurate_ind = i2
            6 inaccurate_ind_ind = i2
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 interp_comp_list [*]
              7 event_id = f8
              7 comp_idx = i4
              7 comp_idx_ind = i2
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 comp_event_id = f8
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              7 comp_name = vc
            6 calculation_equation = vc
            6 string_long_text_id = f8
          5 coded_result_list [*]
            6 event_id = f8
            6 sequence_nbr = i4
            6 sequence_nbr_ind = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 nomenclature_id = f8
            6 result_set = i4
            6 result_set_ind = i2
            6 result_cd = f8
            6 result_cd_disp = vc
            6 acr_code_str = vc
            6 proc_code_str = vc
            6 pathology_str = vc
            6 group_nbr = i4
            6 group_nbr_ind = i2
            6 mnemonic = vc
            6 short_string = vc
            6 descriptor = vc
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 unit_of_measure_cd = f8
            6 source_string = vc
          5 date_result_list [*]
            6 event_id = f8
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 result_dt_tm = dq8
            6 result_dt_tm_ind = i2
            6 result_dt_tm_os = f8
            6 result_dt_tm_os_ind = i2
            6 date_type_flag = i2
            6 date_type_flag_ind = i2
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 result_tz = i4
            6 result_tz_ind = i2
          5 ce_result_status_cd = f8
          5 ce_result_status_cd_disp = vc
          5 ce_event_end_tz = i4
      3 task_assay_version_nbr = f8
      3 modifier_long_text = vc
      3 modifier_long_text_id = f8
      3 result_set_link_list [*]
        4 event_id = f8
        4 result_set_id = f8
        4 entry_type_cd = f8
        4 entry_type_cd_disp = vc
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
        4 relation_type_cd = f8
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
        4 updt_task = i4
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
      3 scd_modifier_list [*]
        4 event_id = f8
        4 concept_cki = vc
        4 phrase = vc
        4 display = vc
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 valid_from_dt_tm = dq8
      3 endorse_ind = i2
      3 new_result_ind = i2
      3 organization_id = f8
      3 intake_output_result [*]
        4 ce_io_result_id = f8
        4 io_result_id = f8
        4 event_id = f8
        4 person_id = f8
        4 encntr_id = f8
        4 io_start_dt_tm = dq8
        4 io_start_dt_tm_ind = i2
        4 io_end_dt_tm = dq8
        4 io_end_dt_tm_ind = i2
        4 io_type_flag = i2
        4 io_volume = f8
        4 io_status_cd = f8
        4 io_status_cd_disp = vc
        4 io_status_cd_mean = vc
        4 reference_event_id = f8
        4 reference_event_cd = f8
        4 reference_event_cd_disp = vc
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
      3 io_total_result_list [*]
        4 ce_io_total_result_id = f8
        4 io_total_definition_id = f8
        4 event_id = f8
        4 encntr_id = f8
        4 encntr_focused_ind = i2
        4 person_id = f8
        4 io_total_start_dt_tm = dq8
        4 io_total_end_dt_tm = dq8
        4 io_total_value = f8
        4 io_total_unit_cd = f8
        4 io_total_unit_disp = vc
        4 io_total_unit_mean = vc
        4 suspect_flag = i2
        4 last_io_result_clinsig_dt_tm = dq8
        4 valid_from_dt_tm = dq8
        4 valid_until_dt_tm = dq8
        4 updt_dt_tm = dq8
        4 updt_dt_tm_ind = i2
        4 updt_id = f8
        4 updt_task = i4
        4 updt_task_ind = i2
        4 updt_cnt = i4
        4 updt_cnt_ind = i2
        4 updt_applctx = i4
        4 updt_applctx_ind = i2
        4 contributor_link_list [*]
          5 event_id = f8
          5 contributor_event_id = f8
          5 ce_valid_from_dt_tm = dq8
          5 type_flag = i2
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
          5 ce_valid_until_dt_tm = dq8
          5 ce_result_value = vc
          5 ce_performed_prsnl_id = f8
          5 ce_event_end_dt_tm = dq8
          5 ce_event_cd = f8
          5 ce_event_cd_disp = vc
          5 ce_clinical_event_id = f8
          5 ce_event_class_cd = f8
          5 ce_event_class_cd_disp = vc
          5 string_result_list [*]
            6 event_id = f8
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 string_result_text = vc
            6 string_result_format_cd = f8
            6 string_result_format_cd_disp = vc
            6 equation_id = f8
            6 last_norm_dt_tm = dq8
            6 last_norm_dt_tm_ind = i2
            6 unit_of_measure_cd = f8
            6 unit_of_measure_cd_disp = vc
            6 feasible_ind = i2
            6 feasible_ind_ind = i2
            6 inaccurate_ind = i2
            6 inaccurate_ind_ind = i2
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 interp_comp_list [*]
              7 event_id = f8
              7 comp_idx = i4
              7 comp_idx_ind = i2
              7 valid_from_dt_tm = dq8
              7 valid_from_dt_tm_ind = i2
              7 valid_until_dt_tm = dq8
              7 valid_until_dt_tm_ind = i2
              7 comp_event_id = f8
              7 updt_dt_tm = dq8
              7 updt_dt_tm_ind = i2
              7 updt_id = f8
              7 updt_task = i4
              7 updt_task_ind = i2
              7 updt_cnt = i4
              7 updt_cnt_ind = i2
              7 updt_applctx = i4
              7 updt_applctx_ind = i2
              7 comp_name = vc
            6 calculation_equation = vc
            6 string_long_text_id = f8
          5 coded_result_list [*]
            6 event_id = f8
            6 sequence_nbr = i4
            6 sequence_nbr_ind = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 nomenclature_id = f8
            6 result_set = i4
            6 result_set_ind = i2
            6 result_cd = f8
            6 result_cd_disp = vc
            6 acr_code_str = vc
            6 proc_code_str = vc
            6 pathology_str = vc
            6 group_nbr = i4
            6 group_nbr_ind = i2
            6 mnemonic = vc
            6 short_string = vc
            6 descriptor = vc
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 unit_of_measure_cd = f8
            6 source_string = vc
          5 date_result_list [*]
            6 event_id = f8
            6 valid_until_dt_tm = dq8
            6 valid_until_dt_tm_ind = i2
            6 valid_from_dt_tm = dq8
            6 valid_from_dt_tm_ind = i2
            6 result_dt_tm = dq8
            6 result_dt_tm_ind = i2
            6 result_dt_tm_os = f8
            6 result_dt_tm_os_ind = i2
            6 date_type_flag = i2
            6 date_type_flag_ind = i2
            6 updt_dt_tm = dq8
            6 updt_dt_tm_ind = i2
            6 updt_id = f8
            6 updt_task = i4
            6 updt_task_ind = i2
            6 updt_cnt = i4
            6 updt_cnt_ind = i2
            6 updt_applctx = i4
            6 updt_applctx_ind = i2
            6 result_tz = i4
            6 result_tz_ind = i2
          5 ce_result_status_cd = f8
          5 ce_result_status_cd_disp = vc
          5 ce_event_end_tz = i4
        4 io_total_result_val = vc
      3 src_event_id = f8
      3 src_clinsig_updt_dt_tm = dq8
      3 nomen_string_flag = i2
      3 ce_dynamic_label_id = f8
      3 dynamic_label_list [*]
        4 ce_dynamic_label_id = f8
        4 label_name = vc
        4 label_prsnl_id = f8
        4 label_status_cd = f8
        4 label_seq_nbr = i4
        4 valid_from_dt_tm = dq8
        4 label_comment = vc
      3 device_free_txt = vc
      3 trait_bit_map = i4
    2 person_list [*]
      3 person_id = f8
      3 name_full_formatted = vc
      3 prsnl_name_full_formatted = vc
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
 
;560303 - DCP.ModTask
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
 
;560306 dcp_query_task
free record 560306_request
record 560306_request (
  1 task_list [*]
    2 task_id = f8
  1 assign_prsnl_list [*]
    2 assign_prsnl_id = f8
  1 person_list [*]
    2 person_id = f8
  1 location_list [*]
    2 location_cd = f8
  1 loc_bed_list [*]
    2 loc_bed_cd = f8
  1 order_list [*]
    2 order_id = f8
  1 encntr_list [*]
    2 encntr_id = f8
  1 event_list [*]
    2 event_id = f8
  1 location_filter_list [*]
    2 location_cd = f8
  1 loc_bed_filter_list [*]
    2 loc_bed_cd = f8
  1 status_filter_list [*]
    2 status_cd = f8
  1 class_filter_list [*]
    2 class_cd = f8
  1 task_type_filter_list [*]
    2 task_type_cd = f8
  1 assign_prsnl_only_ind = i2
  1 user_position_cd = f8
  1 beg_dt_tm = dq8
  1 end_dt_tm = dq8
  1 get_encounter_info = i2
  1 get_ce_med_result_info = i2
  1 get_person_info = i2
  1 get_prsnl_info = i2
  1 get_order_info = i2
  1 get_floating_dosage_info = i2
)
 
free record 560306_reply
record 560306_reply (
1 task_list[*]
	2 task_id = f8
	2 catalog_type_cd = f8
	2 catalog_type_disp = vc
	2 catalog_type_mean = vc
	2 catalog_cd = f8
	2 stat_ind = i2
	2 location_cd = f8
	2 location_disp = vc
	2 location_mean = vc
	2 reference_task_id = f8
	2 task_type_cd = f8
	2 task_type_disp = vc
	2 task_type_mean = vc
	2 task_class_cd = f8
	2 task_class_disp = vc
	2 task_class_mean = vc
	2 task_status_cd = f8
	2 task_status_disp = vc
	2 task_status_mean = vc
	2 task_status_reason_cd = f8
	2 task_status_reason_disp = vc
	2 task_status_reason_mean = vc
	2 task_dt_tm = dq8
	2 event_id = f8
	2 task_activity_cd = f8
	2 task_activity_disp = vc
	2 task_activity_mean = vc
	2 msg_test_id = f8
	2 msg_subject_cd = f8
	2 msg_subject = vc
	2 msg_sender_id = f8
	2 msg_sender_name = vc
	2 confidential_ind = i2
	2 read_ind = i2
	2 delivery_ind = i2
	2 event_class_cd = f8
	2 event_class_disp = vc
	2 event_class_mean = vc
	2 task_create_dt_tm = dq8
	2 updt_cnt = i4
	2 updt_dt_tm = dq8
	2 updt_id = f8
	2 reschedule_ind = i2
	2 reschedule_reason_cd = f8
	2 reschedule_reason_disp = vc
	2 reschedule_reason_mean = vc
	2 template_task_flag = i2
	2 med_order_type_cd = f8
	2 task_description = vc
	2 chart_not_cmplt_ind = i2
	2 quick_chart_done_ind = i2
	2 quick_chart_ind = i2
	2 quick_chart_notdone_ind = i2
	2 allpositionchart_ind = i2
	2 event_cd = f8
	2 reschedule_time = i4
	2 cernertask_flag = i2
	2 ability_ind = i2
	2 dcp_forms_ref_id = f8
	2 capture_bill_info_ind = i2
	2 ignor_req_ind = i2
	2 order_id = f8
	2 order_comment_ind = i2
	2 order_status_cd = f8
	2 template_order_id = f8
	2 stop_type_cd = f8
	2 projected_stop_dt_tm = dq8
	2 comment_type_mask = i4
	2 hna_mnemonic = vc
	2 order_mnemonic = vc
	2 ordered_as_mnemonic = vc
	2 additive_cnt = i4
	2 order_detail_display_line = vc
	2 order_provider_id = f8
	2 order_dt_tm = dq8
	2 activity_type_cd = f8
	2 ref_text_mask = i4
	2 cki = vc
	2 need_rx_verify_ind = i2
	2 orderable_type_flag = i2
	2 need_nurse_review_ind = i2
	2 freq_type_flag = i2
	2 current_start_dt_tm = dq8
	2 template_order_flag = i2
	2 order_comment_text = vc
	2 parent_order_status_cd = f8
	2 parent_need_rx_verify_ind = i2
	2 parent_need_nurse_review_ind = i2
	2 parent_freq_type_flag = i2
	2 parent_stop_cd = f8
	2 parent_current_start_dt_tm = dq8
	2 parent_projected_stop_dt_tm = dq8
	2 route_detail_display = vc
	2 freq_detail_display = vc
	2 rsn_detail_display = vc
	2 frequency_cd = f8
	2 encntr_id = f8
	2 loc_room_cd = f8
	2 loc_room_disp = vc
	2 loc_room_mean = vc
	2 loc_bed_cd = f8
	2 loc_bed_disp = vc
	2 loc_bed_mean = vc
	2 isolation_cd = f8
	2 isolation_disp = vc
	2 isolation_mean = vc
	2 finnbr = vc
	2 mrn = vc
	2 person_id = f8
	2 person_name = vc
	2 updt_person_name = vc
	2 response_required_ind = i2
	2 last_done_dt_tm = dq8
	2 initial_volume = f8
	2 initial_dosage = f8
	2 admin_dosage = f8
	2 dosage_unit_cd = f8
	2 admin_site_cd = f8
	2 infusion_rate = f8
	2 infusion_unit_cd = f8
	2 iv_event_cd = f8
	2 task_priority_cd = f8
	2 task_priority_meaning = vc
	2 task_priority_display = vc
	2 assign_prsnl_list[*]
		3 assign_prsnl_id = f8
		3 updt_cnt = i4
		3 assign_prsnl_name = vc
	2 task_tz = i4
	2 projected_stop_tz = i4
	2 order_tz = i4
	2 current_start_tz = i4
	2 parent_projected_stop_tz = i4
	2 parent_current_start_tz = i4
	2 last_done_tz = i4
	2 charted_by_agent_cd = f8
	2 charted_by_agent_identifier = vc
	2 charting_context_reference = vc
	2 charting_agent_list[*]
		3 charting_agent_cd = f8
		3 charting_agent_entity_name = vc
		3 charting_agent_entity_id = f8
		3 charting_agent_identifier = vc
	2 link_nbr = f8
	2 link_flag_type = i2
	2 template_core_action_sequence = i4
 
1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
;600345 - dcp_events_ensured
;no reply
free record 600345_req
record 600345_req(
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
 
 
;601577 - bsc_generate_infusion_task
 free record 601577_req
record 601577_req (
  1 order_list [*]
    2 order_id = f8
  1 debug_ind = i2
  1 force_update_ind = i2
)
 
free record 601577_rep
record 601577_rep (
	1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
 
 
 
free record delete_medadmin_reply_out
record delete_medadmin_reply_out(
  1 administration_id            	= f8
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
 
;Temp events
free record temp
record temp (
	1 list[*]
		2 event_id = f8
)
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
 ;Inputs
declare sUserName					= vc with protect, noconstant("")
declare dAdministrationId			= f8 with protect, noconstant(0.0)
declare dStatusCd					= f8 with protect, noconstant(0.0)
declare sReason						= vc with protect, noconstant("")
declare dPrsnlId					= f8 with protect, noconstant(0.0)
declare dEventCd                    = f8 with protect, noconstant(0.0)
declare dEncounterId                = f8 with protect, noconstant(0.0)
declare dParentEventId              = f8 with protect, noconstant(0.0)
declare dOrderId                    = f8 with protect, noconstant(0.0)
declare dSystemId					= f8 with protect, noconstant(0.0)
declare sReferenceNumber			= vc with protect, noconstant("")
declare refNumberStr = vc
 
;;job variables
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
set dAdministrationId				= cnvtreal($ADMINISTRATIONID)
set dStatusCd						= cnvtreal($STATUSID)
set sComments						= trim($COMMENT,3)
set dSystemId                       = cnvtreal(trim($SystemId,3))
set sReferenceNumber                = trim($ReferenceNumber)
set iDebugFlag						= cnvtint($DEBUG_FLAG)
 
;Other
set dPrsnlId						= GetPrsnlIDfromUserName(sUserName)
set reqinfo->updt_id				= dPrsnlId
set sPrsnlName						= GetNameFromPrsnlID(dPrsnlId)
 
; Constants
declare c_error_handler				= vc with protect, constant("DELETE MED ADMINISTRATION")
declare c_inerror_status_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",8,"INERROR"))
declare c_auth_verified_status_cd   = f8 with protect, constant(uar_get_code_by("MEANING",8,"AUTH"))
declare c_task_complete_cd   		= f8 with protect, constant(uar_get_code_by("MEANING",79,"COMPLETE"))
declare c_modify_cd 				= f8 with protect, constant(uar_get_code_by("MEANING",21,"MODIFY"))
declare c_action_completed_cd	 	= f8 with protect, constant(uar_get_code_by("MEANING",103,"COMPLETED"))
declare c_rescomment_note_type_cd 	= f8 with protect, constant (uar_get_code_by("MEANING",14,"RES COMMENT"))
declare c_ah_note_format_cd 		= f8 with protect, constant (uar_get_code_by("MEANING",23,"AH"))
declare c_unknown_entry_method_cd 	= f8 with protect, constant (uar_get_code_by("MEANING",13,"UNKNOWN"))
declare c_nocomp_compression_cd 	= f8 with protect, constant (uar_get_code_by("MEANING",120,"NOCOMP"))
declare c_active_rec_status_cd		= f8 with protect, constant(uar_get_code_by("MEANING",48,"ACTIVE"))
 
 
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate AdminId exists
if(dAdministrationId = 0)
	call ErrorHandler2(c_error_handler, "F", "Validate", "Missing required field: AdministrationId.",
			"2055", "Missing required field: AdministrationId", delete_medadmin_reply_out)
     go to EXIT_SCRIPT
endif
 
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, delete_medadmin_reply_out, sVersion)
if(iRet = 0)  ;010
	call ErrorHandler2("VALIDATE", "F","Delete Med Admin", "Invalid User for Audit.",
	"1001",build("User is invalid: ",sUserName),delete_medadmin_reply_out)
	go to EXIT_SCRIPT
endif
 
 
; Validate StatusId
if(dStatusCd != c_inerror_status_cd)
	call ErrorHandler2(c_error_handler, "F", "Validate", "Invalid StatusId.",
		"2006","Invalid StatusId.", delete_medadmin_reply_out)
	go to exit_script
endif
 
; Validate EventId is an Adminitration
set iRet = ValidateAdminiId(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler, "F", "Validate", "Invalid AdministrationId: May not be Med Admin in correct status",
		"2051",build2("Invalid Administration Id(May not be Med Admin in correct status): ",dAdministrationId), delete_medadmin_reply_out)
	go to exit_script
endif
 
; Validate SystemId
if(dSystemId > 0)
	set iRet = GetCodeSet(dSystemId)
	if(iRet != 89)
		call ErrorHandler2("POST OBSERVATION", "F", "Validate", "Invalid SystemId",
					"9999","Invalid SystemId", delete_medadmin_reply_out)
					go to exit_script
	else
		; Validate ReferenceNumber exists on the request and is unique on the table
		if(sReferenceNumber = "")
				call ErrorHandler2("POST OBSERVATION", "F", "Validate", "ReferenceNumber required when SystemId provided.",
						"9999","ReferenceNumber required when SystemId provided.", delete_medadmin_reply_out)
						go to exit_script
		else
		;Validate external doc id doesn't already exist
		set check = 0
			select into "nl:"
			from clinical_event ce
			where ce.reference_nbr = sReferenceNumber
				and ce.contributor_system_cd = dSystemId
			detail
				check = 1
			with nocounter
 
			if(check > 0)
					call ErrorHandler2("POST OBSERVATION", "F", "Validate",
							"The ReferenceNumber already exists. Please provide a unique number.",
							"9999","The ReferenceNumber already exists. Please provide a unique number."
							, delete_medadmin_reply_out)
							go to exit_script
			endif
		endif
	endif
else
	set dSystemId = reqdata->contributor_system_cd
 
	;Check reference number is null
	if(sReferenceNumber > " ")
			call ErrorHandler2("POST OBSERVATION", "F", "Validate",
					"A systemId is required for a reference number to be used.","9999",
					"A systemId is required for a reference number to be used.", delete_medadmin_reply_out)
					go to exit_script
	endif
endif
 
; Get Med Tasks
set iRet = GetMedTask(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler, "F", "Validate", "Could not get medication tasks (560306)",
		"2051","Could not get medication tasks (560306)", delete_medadmin_reply_out)
	go to exit_script
endif
 
; Validate EventId and get necessary details to
set iRet = GetEventDetails(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler, "F", "Validate", "Invalid AdministrationId(result_set_batch query)",
		"2051",build2("Invalid Administration Id(result_set_batch query): ",dAdministrationId), delete_medadmin_reply_out)
	go to exit_script
endif
 
; Validate EventId and get necessary details to
set iRet =GetResultSetDetails(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler, "F", "Validate", "Invalid AdministrationId(event details)",
		"2051",build2("Invalid Administration Id(event_details): ",dAdministrationId), delete_medadmin_reply_out)
	go to exit_script
endif
 
 
; Verify user has privileges to Delete Observation
set iRet = VerifyPrivs(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler, "F", "Validate", "User does not have privileges to delete Adminiistration id.",
		"9999","User does not have privileges for Administration id.", delete_medadmin_reply_out)
	go to exit_script
endif
 
; Delete the Med
call DeleteMedAdmin(null)
 
; ensure the events
call EnsureEvents(null)
 
;; update task
call UpdateTask(null)
 
; Generate infusion task if applicable -- 601577 - bsc_generate_infusion_task
set iRet = CreateInfusionTask(null)
	if(iRet = 0)
		call ErrorHandler2(c_error_handler, "F", "Validate", "Could not generate infusion task (601577)",
		"9999","Could not generate infusion task (601577)", delete_medadmin_reply_out)
endif
 
;Set audit to successful
call ErrorHandler2(c_error_handler, "S", "Success", "Med administration deleted successfully.",
	"0000", "Med administration deleted successfully.", delete_medadmin_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(delete_medadmin_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	call echorecord(delete_medadmin_reply_out)
	call echo(JSONout)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_delete_medadmin.json")
	call echo(build2("_file : ", _file))
	call echojson(delete_medadmin_reply_out, _file, 0)
endif
#EXIT_VERSION
 
/********************************************************************
;ValidateAdminiId(null)
;;validates that the event is a med and is in completed status
*********************************************************************/
subroutine ValidateAdminiId(null)
 
declare validAdmin = i2
select into "nl:"
from med_admin_event mae
     ,clinical_event ce
     ,task_activity ta
plan mae
	where mae.event_id = dAdministrationId
join ce
	where ce.event_id = mae.event_id
		and ce.result_status_cd = c_auth_verified_status_cd
join ta
	where ta.event_id = ce.parent_event_id
		and ta.task_status_cd = c_task_complete_cd
head report
	validAdmin = 1
	dParentEventId = ta.event_id
	dOrderId = ce.order_id
with nocounter
 
return(validAdmin)
 
end ;end sub
 
/*************************************************************************
;  Name: GetMedTask(null) - 560306 dcp_query_task
;  Description:  Gets the task for the meds
**************************************************************************/
subroutine GetMedTask(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetMedTask Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 560300
	set iRequest = 560306
 
	;set up request
	set stat = alterlist(560306_request->event_list,1)
	set 560306_request->event_list[1].event_id = dParentEventId
 
	;execute
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",560306_request,"REC",560306_reply)
 
	if(560306_reply->status_data.status = "S")
		set iValidate = 1
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetMedTask Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
	return(iValidate)
end ; end sub
 
/*************************************************************************
;  Name: GetResultSetDetails(null) - 1000087 - result_set_batch query
;  Description:  Gets the details based on the event id (administration id)
**************************************************************************/
subroutine GetResultSetDetails(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetResultSetDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 1000087
	set iRequest = 1000087
 
 
	declare result_set_id = f8
	select into "nl:"
	from ce_result_set_link cr
		where cr.event_id = dAdministrationId
			and cr.valid_from_dt_tm <= cnvtdatetime(curdate,curtime3)
			and cr.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
	head report
		result_set_id = cr.result_set_id
	with nocounter
 
	if(result_set_id < 0)
		call ErrorHandler2(c_error_handler, "F", "Validate", "Could not generate result_set_id (task: 1000087)",
					"9999","Could not generate result_set_id (task: 1000087)", delete_medadmin_reply_out)
		go to exit_script
	endif
 
    set c_unknown_cd = uar_get_code_by("MEANING",4002218,"UNKNOWN")
	;Setup request
	set stat = alterlist(1000087_req->req_list,1)
 	set 1000087_req->req_list[1].query_mode = 1
 	set 1000087_req->req_list[1].subtable_bit_map_ind = 0
 	set 1000087_req->req_list[1].subtable_bit_map = 1073785615
 	set stat = alterlist(1000087_req->req_list[1].result_set_id_list,1)
 	set 1000087_req->req_list[1].result_set_id_list[1].result_set_id  = result_set_id
 	set stat = alterlist(1000087_req->req_list[1].relation_type_list,1)
 	set 1000087_req->req_list[1].relation_type_list[1].relation_type_cd  = c_unknown_cd
 
 
	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",1000087_req,"REC",1000087_rep)
 
	if(size(1000087_rep->rep_list[1].rb_list,5) > 0)
		set iValidate = 1
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetResultSetDetails Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
 	return(iValidate)
 
end ;End Subroutine
/*************************************************************************
;  Name: GetEventDetails(null) - 1000011 - event_detail_query
;  Description:  Gets the details based on the event id (administration id)
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
 	set 1000011_req->query_mode = 3
 	set 1000011_req->event_id = dAdministrationId
 	set 1000011_req->subtable_bit_map_ind = 0
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
			call ErrorHandler2(c_error_handler, "F", "Validate", "AmindId status is already InError.",
			"9999","AdminId status is already InError.", delete_medadmin_reply_out)
			go to exit_script
		endif
	endif
;call echorecord(1000011_rep)
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
;  Name: CreateInfusionTask(null) = i2 with protect ;601577 - bsc_generate_infusion_task
;  Description: Create infusion task if applicable
**************************************************************************/
subroutine CreateInfusionTask(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("CreateInfusionTask Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
	set iApplication = 600005
	set iTask = 560300
	set iRequest = 601577
 
 	;Setup request
	set stat = alterlist(601577_req->order_list,1)
	set 601577_req->order_list[1].order_id = 1000011_rep->rb_list[1].order_id
 
 	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",601577_req,"REC",601577_rep)
 
 	if(601577_rep->status_data.status != "F")
		set iValidate = 1
	endif
 
 	if(iDebugFlag > 0)
		call echo(concat("CreateInfusionTask Runtime: ",
			trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
				" seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: EnsureEvents(null)	= null with protect	;600345 - dcp_events_ensured
;  Description: Ensure tasks
**************************************************************************/
 
subroutine EnsureEvents(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("EnsureEvents Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
call echorecord(temp)
call echorecord(560306_reply)
	endif
 
 	set iApplication = 600005
	set iTask = 600108
	set iRequest = 600345
 
 
 	set idx = 1 ;placeholder
	for(i = 1 to size(temp->list,5))
		set stat = alterlist(600345_req->elist,i)
		set 600345_req->elist[i].event_id = temp->list[i].event_id
		set 600345_req->elist[i].order_id = dOrderId
		set 600345_req->elist[i].task_id = 560306_reply->task_list[1].task_id
	endfor
 
 	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600345_req,"REC",600345_req)
 
 	if(iDebugFlag > 0)
		call echo(concat("EnsureEvents Runtime: ",
			trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
					" seconds"))
 
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: UpdateTask(null)	= null with protect	;560303 dcp_mod_task
;  Description: Ensure tasks
**************************************************************************/
subroutine UpdateTask(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("UpdateTask Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iApplication = 600005
	set iTask = 560300
	set iRequest = 560303
 
 	;Setup request
	set stat = alterlist(560303_req->mod_list,1)
	set 560303_req->mod_list[1].task_id = 560306_reply->task_list[1].task_id
	set 560303_req->mod_list[1].updt_cnt = 1
	set 560303_req->mod_list[1].task_status_meaning = "PENDING"
	set 560303_req->mod_list[1].task_dt_tm = 560306_reply->task_list[1].task_dt_tm
	set 560303_req->mod_list[1].performed_dt_tm = 560306_reply->task_list[1].task_dt_tm
 
 
 
 	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",560303_req,"REC",560303_rep)
 
 	if(iDebugFlag > 0)
		call echo(concat("UpdateTask Runtime: ",
			trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
					" seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: DeleteMedAdmin(null)	= null with protect	;1000071 - event_batch_ensure
;  Description: Delete the medication administration event
**************************************************************************/
subroutine DeleteMedAdmin(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("DeleteMedAdmin Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
    set iValidate = 0
	declare error_msg = vc
 	declare happ = i4
	declare htask = i4
	declare hstep = i4
	declare crmstatus = i2
 
	set error_msg = "None"
	set iApplication = 600005
	set iTask = 600108
	set iRequest = 1000071
	execute crmrtl
	execute srvrtl
 
	call echo ("Beginning the Application" )
	set crmstatus = uar_crmbeginapp (iApplication ,happ )
 
	if ((crmstatus = 0 ) )
		set crmstatus = uar_crmbegintask (happ ,iTask ,htask )
		if ((crmstatus != 0 ) )
			set error_msg = concat ("BEGINTASK=" ,cnvtstring (crmstatus ))
			call uar_crmendapp (happ )
			call ErrorHandler2(c_error_handler, "F","Execute", error_msg,"9999", error_msg, delete_admin_reply_out)
			go to exit_script
		endif
	else
		set error_msg = concat ("BEGINAPP=" ,cnvtstring (crmstatus ) )
	endif
 
	if ((htask > 0 ) )
		call echo ("Beginning the Step" )
		set crmstatus = uar_crmbeginreq (htask ,"" ,iRequest ,hstep )
		if ((crmstatus != 0 ) )
			set error_msg = concat ("BEGINREQ=" ,cnvtstring (crmstatus ) )
			call uar_crmendapp (happ )
			call ErrorHandler2(c_error_handler, "F","Execute", error_msg,"9999", error_msg, delete_admin_reply_out)
			go to exit_script
		else
			; Create request
			set hrequest = uar_crmgetrequest (hstep )
			set hreq = uar_srvadditem(hrequest,"req")
			set stat = uar_srvsetshort(hreq,"ensure_type",2)
			set hce = uar_srvgetstruct (hreq ,"clin_event")
 
				;clinical event
				if(hce)
 
					set stat = uar_srvsetdouble(hce,"event_id",1000087_rep->rep_list[1].rb_list[1].event_id)
					set stat = uar_srvsetdouble(hce,"order_id",1000087_rep->rep_list[1].rb_list[1].order_id)
					set stat = uar_srvsetdouble(hce,"catalog_cd",1000087_rep->rep_list[1].rb_list[1].catalog_cd)
					set stat = uar_srvsetdouble (hce ,"person_id" ,1000087_rep->rep_list[1].rb_list[1].person_id )
					set stat = uar_srvsetdouble (hce ,"encntr_id" ,1000087_rep->rep_list[1].rb_list[1].encntr_id)
					set stat = uar_srvsetdouble (hce ,"contributor_system_cd",dSystemId)
					set stat = uar_srvsetdouble(hce,"parent_event_id",1000087_rep->rep_list[1].rb_list[1].parent_event_id)
					set stat = uar_srvsetdouble (hce ,"event_class_cd" ,1000087_rep->rep_list[1].rb_list[1].event_class_cd)
					set stat = uar_srvsetdouble (hce ,"event_cd" ,1000087_rep->rep_list[1].rb_list[1].event_cd )
					set stat = uar_srvsetdate (hce ,"event_end_dt_tm"
												,cnvtdatetime(1000087_rep->rep_list[1].rb_list[1].event_end_dt_tm))
					set stat = uar_srvsetdouble (hce ,"record_status_cd" ,1000087_rep->rep_list[1].rb_list[1].record_status_cd )
					set stat = uar_srvsetdouble (hce ,"result_status_cd" , c_inerror_status_cd )
					set stat = uar_srvsetshort (hce ,"publish_flag" ,1 )
					set stat = uar_srvsetlong (hce ,"updt_cnt" ,1000087_rep->rep_list[1].rb_list[1].updt_cnt )
					set stat = uar_srvsetlong (hce ,"order_action_sequence" ,1000087_rep->rep_list[1].rb_list[1].order_action_sequence )
					set stat = uar_srvsetdouble (hce ,"entry_mode_cd" , 1000087_rep->rep_list[1].rb_list[1].entry_mode_cd )
					set stat = uar_srvsetlong(hce,"event_end_tz",1000087_rep->rep_list[1].rb_list[1].event_end_tz)
 
 					if(sReferenceNumber > " ")
 						set refNumberStr = build2(sReferenceNumber,"!1")
						set stat = uar_srvsetstring(hce,"reference_nbr",nullterm(refNumberStr))
						set stat = uar_srvsetstring(hce,"series_ref_nbr",nullterm(refNumberStr))
					endif
 
					;event note list;;adds teh inerror comment
					; Add comments if they exist
					if(sComments > " ")
						declare sFinalNote = vc
						set sFinalNote = build2(sComments, char(10))
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
							set stat = uar_srvsetlong(hnote,"note_tz",1000087_rep->rep_list[1].rb_list[1].event_start_tz)
						else
							call ErrorHandler2(c_error_handler, "F", " UAR_SRVADDITEM ", "Failed to allocate event_note_list",
								"9999", "Failed to allocate event_note_list",  delete_admin_reply_out)
								go to EXIT_SCRIPT
						endif;end hnote
					endif;end sreason
 
					;psnl list
					; Event Prsnl List//look at delete obs here
				set ePrsnlSize = size(1000011_rep->rb_list[1].event_prsnl_list,5) + 1
				for(i = 1 to ePrsnlSize )
					set hprsnl = uar_srvadditem (hce ,"event_prsnl_list" )
					if(hprsnl)
						if( i < ePrsnlSize)
								set stat = uar_srvsetdouble(hprsnl,"event_prsnl_id",
																1000087_rep->rep_list[1].rb_list[1].event_prsnl_id)
								set stat = uar_srvsetdouble(hprsnl,"action_status_cd",
																1000087_rep->rep_list[1].rb_list[1].action_status_code)
								set stat = uar_srvsetlong(hprsnl,"action_tz"
																,1000087_rep->rep_list[1].rb_list[1].event_prsnl_list[i].action_tz)
								set stat = uar_srvsetdouble(hprsnl,"action_type_cd",
																1000087_rep->rep_list[1].rb_list[1].event_prsnl_list[i].action_type_cd)
								set stat = uar_srvsetdate(hprsnl,"action_dt_tm",
													cnvtdatetime(1000087_rep->rep_list[1].rb_list[1].event_prsnl_list[i].action_dt_tm))
								set stat = uar_srvsetdouble(hprsnl,"action_prsnl_id",
													1000087_rep->rep_list[1].rb_list[1].event_prsnl_list[i].action_prsnl_id)
								set stat = uar_srvsetlong(hprsnl,"request_tz"
													,1000087_rep->rep_list[1].rb_list[1].event_prsnl_list[i].request_tz)
 
 					 	else
 					 			set stat = uar_srvsetdouble(hprsnl,"event_prsnl_id",0.0)
								set stat = uar_srvsetdouble(hprsnl,"action_status_cd",c_action_completed_cd)
								set stat = uar_srvsetlong(hprsnl,"action_tz",curtimezoneapp)
								set stat = uar_srvsetdouble(hprsnl,"action_type_cd",c_modify_cd)
								set stat = uar_srvsetdate(hprsnl,"action_dt_tm",cnvtdatetime(curdate,curtime3))
								set stat = uar_srvsetdouble(hprsnl,"action_prsnl_id",dPrsnlId)
 
						endif
 
					else
						set error_msg = "Could not create hprsnl"
						call ErrorHandler2(c_error_handler, "F","uar_srvadditem", error_msg,"9999", error_msg,  delete_admin_reply_out)
						go to exit_script
					endif
				endfor;end eprsnlsize
 
				;result_link_list
				set hres = uar_srvadditem(hce,"result_set_link_list")
				if(hres)
					set stat = uar_srvsetdouble(hres,"result_set_id",1000087_rep->rep_list[1].rb_list[1].result_set_link_list[1].result_set_id)
					set stat = uar_srvsetdouble(hres,"entry_type_cd"
					,1000087_rep->rep_list[1].rb_list[1].result_set_link_list[1].entry_type_cd)
				else
					set error_msg = "Could not create hres."
					call ErrorHandler2(c_error_handler, "F","uar_srvadditem", error_msg,"9999", error_msg, delete_admin_reply_out)
					go to exit_script
				endif;endhres
 
				;; Child Event
				set hce_type = uar_srvcreatetypefrom (hreq ,"clin_event" )
				set hce_struct = uar_srvgetstruct (hreq ,"clin_event" )
				set stat = uar_srvbinditemtype (hce_struct ,"child_event_list" ,hce_type )
 
				set child_event_size = size(1000087_rep->rep_list[1].rb_list,5)
 
				;for loop to add the child_events
				;start at 2 since the first is the parent event_id
				declare iString = vc
				for(i = 2 to child_event_size)
					set hce2 = uar_srvadditem (hce_struct ,"child_event_list" )
 					if(hce2)
						call uar_srvbinditemtype (hce2 ,"child_event_list" ,hce_type )
						set stat = uar_srvsetdouble(hce2,"event_id",1000087_rep->rep_list[1].rb_list[i].event_id)
						set stat = uar_srvsetlong(hce2,"view_level",1)
						set stat = uar_srvsetdouble(hce2,"order_id",1000087_rep->rep_list[1].rb_list[i].order_id)
						set stat = uar_srvsetdouble(hce2,"catalog_cd",1000087_rep->rep_list[1].rb_list[i].catalog_cd)
						set stat = uar_srvsetdouble(hce2,"person_id",1000087_rep->rep_list[1].rb_list[i].person_id)
						set stat = uar_srvsetdouble(hce2,"encntr_id",1000087_rep->rep_list[1].rb_list[i].encntr_id)
						set stat = uar_srvsetdouble(hce2,"contributor_system_cd",dSystemId)
						set stat = uar_srvsetdouble(hce2,"parent_event_id",1000087_rep->rep_list[1].rb_list[i].parent_event_id)
						set stat = uar_srvsetdouble(hce2,"event_class_cd",1000087_rep->rep_list[1].rb_list[i].event_class_cd)
						set stat = uar_srvsetdouble(hce2,"event_cd",1000087_rep->rep_list[1].rb_list[i].event_cd)
						set stat = uar_srvsetdate(hce2,"action_dt_tm"
													,cnvtdatetime(1000087_rep->rep_list[1].rb_list[i].event_end_dt_tm))
						set stat = uar_srvsetdouble(hce2,"record_status_cd",1000087_rep->rep_list[1].rb_list[i].record_status_cd)
						set stat = uar_srvsetdouble(hce2,"result_status_cd",1000087_rep->rep_list[1].rb_list[i].result_status_cd)
						set stat = uar_srvsetshort(hce2,"publish_flag",1000087_rep->rep_list[1].rb_list[i].publish_flag)
						set stat = uar_srvsetstring(hce2,"event_title_text",nullterm(1000087_rep->rep_list[1].rb_list[i].event_title_text))
						set stat = uar_srvsetlong (hce2 ,"updt_cnt",1000087_rep->rep_list[1].rb_list[i].updt_cnt)
						set stat = uar_srvsetlong (hce2 ,"order_action_sequence" ,1000087_rep->rep_list[1].rb_list[i].order_action_sequence )
						set stat = uar_srvsetdouble (hce2 ,"entry_mode_cd", 1000087_rep->rep_list[1].rb_list[i].entry_mode_cd)
						set stat = uar_srvsetlong(hce2,"event_end_tz",1000087_rep->rep_list[1].rb_list[i].event_end_tz)
 						set stat = uar_srvsetdouble (hce2 ,"results_unit_cd", 1000087_rep->rep_list[1].rb_list[i].result_units_cd)
 
 						if(sReferenceNumber > " ")
 							set iString = cnvtstring(i)
 							set iString = trim(iString,3)
 							set refNumberStr = build2(sReferenceNumber,"!",iString)
							set stat = uar_srvsetstring(hce2,"reference_nbr",nullterm(refNumberStr))
							set stat = uar_srvsetstring(hce2,"series_ref_nbr",nullterm(refNumberStr))
						endif
 
						;Med_Result_List
						set med_res_list_cnt = size(1000087_rep->rep_list[1].rb_list[i].med_result_list,5)
						if(med_res_list_cnt > 0)
						  ;for loop to add med_results
						  for(j = 1 to med_res_list_cnt)
							set hmed = uar_srvadditem(hce2 ,"med_result_list")
							set stat = uar_srvsetshort(hmed,"ensure_type",258)
							set stat = uar_srvsetdate(hmed,"admin_start_dt_tm"
										,cnvtdatetime(1000087_rep->rep_list[1].rb_list[i].med_result_list[j].admin_start_dt_tm))
							set stat = uar_srvsetdate(hmed,"admin_end_dt_tm"
											,cnvtdatetime(1000087_rep->rep_list[1].rb_list[i].med_result_list[j].admin_end_dt_tm))
							set stat = uar_srvsetdouble(hmed,"admin_route_cd"
													,1000087_rep->rep_list[1].rb_list[i].med_result_list[j].admin_route_cd)
							set stat = uar_srvsetdouble(hmed,"admin_dosage"
													,1000087_rep->rep_list[1].rb_list[i].med_result_list[j].admin_dosage)
							set stat = uar_srvsetdouble(hmed,"dosage_unit_cd"
													,1000087_rep->rep_list[1].rb_list[i].med_result_list[j].dosage_unit_cd)
							set stat = uar_srvsetdouble(hmed,"infused_volume"
													,1000087_rep->rep_list[1].rb_list[i].med_result_list[j].infused_volume)
							set stat = uar_srvsetdouble(hmed,"infused_volume_unit_cd"
													,1000087_rep->rep_list[1].rb_list[i].med_result_list[j].infused_volume_unit_cd)
							set stat = uar_srvsetdouble(hmed,"synonym_id"
													,1000087_rep->rep_list[1].rb_list[i].med_result_list[j].synonym_id)
							set stat = uar_srvsetlong(hmed,"admin_start_tz"
													,1000087_rep->rep_list[1].rb_list[i].med_result_list[j].admin_start_tz)
							endfor;hmed
						endif;hmed
 
						;event_note_list hce2
						 set event_note_list_cnt = size(1000087_rep->rep_list[1].rb_list[i].event_note_list,5)
						 if(event_note_list_cnt > 0)
						 	for(j = 1 to event_note_list_cnt)
						 		set hnote2 = uar_srvadditem(hce2 ,"event_note_list")
						 		set stat = uar_srvsetdouble(hnote2,"note_type_cd"
						 								,1000087_rep->rep_list[1].rb_list[i].event_note_list[j].note_type_cd)
						 		set stat = uar_srvsetdouble(hnote2,"note_format_cd"
						 								,1000087_rep->rep_list[1].rb_list[i].event_note_list[j].note_format_cd)
						 		set stat = uar_srvsetdouble(hnote2,"entry_method_cd"
						 								,1000087_rep->rep_list[1].rb_list[i].event_note_list[j].entry_method_cd)
 
						 		set stat = uar_srvsetdouble(hnote2,"note_prsnl_id"
						 								,1000087_rep->rep_list[1].rb_list[i].event_note_list[j].note_prsnl_id)
						 		set stat = uar_srvsetdate(hnote2,"note_dt_tm>"
						 								,1000087_rep->rep_list[1].rb_list[i].event_note_list[j].note_dt_tm)
						 		set stat = uar_srvsetdouble(hnote2,"record_status_cd"
						 								,1000087_rep->rep_list[1].rb_list[i].event_note_list[j].record_status_cd)
						 		set stat = uar_srvsetdouble(hnote2,"compression_cd"
						 								,1000087_rep->rep_list[1].rb_list[i].event_note_list[j].compression_cd)
						 	    set stat = uar_srvsetasis(hnote2,"long_blob"
						 	    							,1000087_rep->rep_list[1].rb_list[i].event_note_list[j].long_blob
						 	    							,textlen(1000087_rep->rep_list[1].rb_list[i].event_note_list[j].long_blob)
						 	    							)
 
						 		set stat = uar_srvsetdouble(hnote2,"event_note_id"
						 								,1000087_rep->rep_list[1].rb_list[i].event_note_list[j].event_note_id)
						 		set stat = uar_srvsetlong(hnote2,"note_tz"
						 									,1000087_rep->rep_list[1].rb_list[i].event_note_list[j].note_tz)
						 	endfor;hnote2
						 endif	;event_note_list hce2
 
						 ;event_prsnl_list
						  set event_prsnl_list_cnt = size(1000087_rep->rep_list[1].rb_list[i].event_prsnl_list,5)+ 1
						  if(event_prsnl_list_cnt > 0)
						 	for(j = 1 to event_prsnl_list_cnt)
						 		set hprsnl2 = uar_srvadditem (hce2 ,"event_prsnl_list" )
						 		if(j < event_prsnl_list_cnt)
						 			set stat = uar_srvsetdouble(hprsnl2,"event_prsnl_id",
															1000087_rep->rep_list[1].rb_list[i].event_prsnl_list[j].event_prsnl_id)
									set stat = uar_srvsetdouble(hprsnl2,"action_type_cd",
															1000087_rep->rep_list[1].rb_list[i].event_prsnl_list[j].action_type_cd)
									set stat = uar_srvsetdate(hprsnl2,"action_dt_tm",
											cnvtdatetime(1000087_rep->rep_list[1].rb_list[i].event_prsnl_list[j].action_dt_tm))
									set stat = uar_srvsetdouble(hprsnl2,"action_prsnl_id",
															1000087_rep->rep_list[1].rb_list[i].event_prsnl_list[j].action_prsnl_id)
						 			set stat = uar_srvsetdouble(hprsnl2,"action_status_cd",
															1000087_rep->rep_list[1].rb_list[i].event_prsnl_list[j].action_status_cd)
 
									set stat = uar_srvsetlong(hprsnl2,"request_tz",
															1000087_rep->rep_list[1].rb_list[i].event_prsnl_list[j].request_tz)
									set stat = uar_srvsetlong(hprsnl2,"action_tz",
															1000087_rep->rep_list[1].rb_list[i].event_prsnl_list[j].action_tz)
						 		else
						 			set stat = uar_srvsetdouble(hprsnl2,"action_status_cd",c_action_completed_cd)
						 			set stat = uar_srvsetlong(hprsnl2,"action_tz",curtimezoneapp)
									set stat = uar_srvsetdouble(hprsnl2,"action_type_cd",c_modify_cd)
									set stat = uar_srvsetdate(hprsnl2,"action_dt_tm",cnvtdatetime(curdate,curtime3))
									set stat = uar_srvsetdouble(hprsnl2,"action_prsnl_id",dPrsnlId)
								endif
 
						 	endfor;event_prsnl_list
						  endif;;event_prsnl_list
 
						 ;result_link_list
						set result_link_list_cnt = size(1000087_rep->rep_list[1].rb_list[i].result_set_link_list,5)
						if(result_link_list_cnt > 0)
							for(j = 1 to result_link_list_cnt)
								set hres2 = uar_srvadditem(hce2,"result_set_link_list")
								set stat = uar_srvsetdouble(hres2,"result_set_id"
												,1000087_rep->rep_list[1].rb_list[i].result_set_link_list[j].result_set_id)
								set stat = uar_srvsetdouble(hres2,"entry_type_cd"
												,1000087_rep->rep_list[1].rb_list[i].result_set_link_list[j].result_set_id)
							endfor;result_link_list
						endif;result_link_list
 
						;string_result
						set string_result_cnt = size(1000087_rep->rep_list[1].rb_list[i].string_result,5)
						if(string_result_cnt > 0)
							for(j = 1 to string_result_cnt)
								set hstr2 = uar_srvadditem(hce2,"string_result")
								set stat = uar_srvsetshort(hstr2,"ensure_type",512)
							endfor;string_result
						endif;string_result
 
						;coded_result_list
						set coded_result_list_cnt = size(1000087_rep->rep_list[1].rb_list[i].coded_result_list,5)
						if(coded_result_list_cnt > 0)
							for(j = 1 to coded_result_list_cnt)
								set hcr2 = size(1000087_rep->rep_list[1].rb_list[i].coded_result_list,5)
								set stat = uar_srvsetshort(hcr2,"ensure_type",258)
								set stat = uar_srvsetlong(hcr2,"sequence_nbr",
												1000087_rep->rep_list[1].rb_list[i].coded_result_list[j].sequence_nbr)
								set stat = uar_srvsetdouble(hcr2,"nomenclature_id",
												1000087_rep->rep_list[1].rb_list[i].coded_result_list[j].nomenclature_id)
								set stat = uar_srvsetstring(hcr2,"mnemonic"
											,nullterm(1000087_rep->rep_list[1].rb_list[i].coded_result_list[j].mnemonic))
								set stat = uar_srvsetstring(hcr2,"short_string"
											,nullterm(1000087_rep->rep_list[1].rb_list[i].coded_result_list[j].short_string))
								set stat = uar_srvsetstring(hcr2,"descriptor"
											,nullterm(1000087_rep->rep_list[1].rb_list[i].coded_result_list[j].descriptor))
 
							endfor;coded_result_list
						endif;coded_result_list
 
 					endif;hce2
 
				endfor;child_event_size
		endif;hce
	endif;crmstatus
 
 
	; Execute request
	set crmstatus = uar_crmperform (hstep)
 
	if ((crmstatus = 0 ) )
		set hreply = uar_crmgetreply (hstep )
 
		if ((hreply > 0 ) )
			;Rep
			set rep_cnt = uar_srvgetitemcount(hreply,"rep")
			if(rep_cnt > 0)
				set hrep = uar_srvgetitem(hreply,"rep", 0)
				;Rb
				set rb_cnt = uar_srvgetitemcount(hrep,"rb_list")
				set stat = alterlist(temp->list,rb_cnt)
				if(rb_cnt > 0)
					for(i = 1 to rb_cnt)
						set hrb = uar_srvgetitem(hrep,"rb_list",i-1)
						set temp->list[i].event_id = uar_srvgetdouble(hrb,"event_id")
					endfor
				else
					set error_msg = "Rb_list is empty. Could not delete administration event."
					call ErrorHandler2(c_error_handler, "F","uar_srvgetstruct", error_msg,"9999", error_msg, delete_medadmin_reply_out)
						go to exit_script
				endif
			else
				set error_msg = "Rep list is empty. Could not delete administration event."
				call ErrorHandler2(c_error_handler, "F","uar_srvgetstruct", error_msg,"9999", error_msg,delete_medadmin_reply_out)
					go to exit_script
			endif;rep_cnt
		else
			set error_msg = "Failed to create hreply."
			call ErrorHandler2(c_error_handler, "F","uar_crmgetreply", error_msg,"9999", error_msg, delete_medadmin_reply_out)
				go to exit_script
		endif;hreply
	else
 
		set error_msg = "Failed to execute request 1000071."
		call ErrorHandler2(c_error_handler, "F","CRMPERFORM", error_msg,"9999", error_msg, delete_medadmin_reply_out)
		go to exit_script
	endif;crmstatus
endif;endhtask
 
 
call pause(5) ;one second delay
 
 
select into "nl:"
from clinical_event ce
 
plan ce
	where ce.event_id = dAdministrationId
		and ce.result_status_cd =  c_inerror_status_cd
		and ce.updt_dt_tm > cnvtlookbehind("1,MIN",cnvtdatetime(curdate,curtime3))
detail
	iValidate = 1
	delete_medadmin_reply_out->administration_id = dAdministrationId
with nocounter
 
 
if(iDebugFlag > 0)
		call echo(concat("DeleteMedAdmin Runtime: ",
			trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
					" seconds"))
endif
return(iValidate)
end ;end DeleteMedAdmin
 
end
go
