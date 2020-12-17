/*****************************************************************************
  
  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

******************************************************************************
      Source file name:     snsro_get_pop_rad_docs.prg
      Object name:          vigilanz_get_pop_rad_docs
      Program purpose:      Retrieve documents from CLINICAL_EVENT based on
      						date range and event_cd list parameters.
      Tables read:			CLINICAL_EVENT, PERSON, ENCOUNTER
      Tables updated:       NONE
      Executing from:       Emissary Service
      Special Notes:      	This population query will check for maximum records
      						and a maximum date range and if those are exceeded
      						a failure status and message will get returned.
 *******************************************************************************
                     MODIFICATION CONTROL LOG
 *******************************************************************************
 Mod Date     Engineer             Comment
 --- -------- -------------------- ---------------------------------------------
  001 05/03/17 DJP                  Initial write
  002 05/18/17 DJP					Added Gender/DOB to Person Object
  003 06/13/17 JCO					Added DOCUMENT_STATUS_CD
  004 07/10/17 DJP					UTC date/time code changes
  005 07/10/17 DJP 					Check for From Date > To Date
  006 07/31/17 JCO					Changed %i to execute; update ErrorHandler2
  007 03/22/18 RJC					Added version code and copyright block
  008 04/11/18 DJP		        	Added string Birthdate to person object
  009 06/11/18 DJP					Comment out MAXREC on Selects
  010 07/25/18 RJC					Performance improvement using 1000079 instead of 1000011;
 									code cleanup; added maxvarlen for large documents
  011 08/09/18 RJC					Changed max rec behavior. Max recs will no longer error out. It will return the max recs and
									once the limit is reached, it return all recs tied to the same second.
  012 08/13/18 RJC					Changed temp data to collect clinical_event_id instead of event_id
  013 08/14/18 RJC					Made expand clause variable depending on number of elements in record
  014 08/27/18 RJC					Added valid_until_dt_tm to clinical_event query. Chunk up 1000079
  015 08/29/18 STV                  Rework to handle nonutc environments and use function calls for dates
  016 10/18/18 RJC					Outerjoin on person_alias table
  017 01/07/19 STV                  switched to encounter mrn
  018 01/16/19 RJC					Added max blob size input parameter
  019 02/28/19 STV                  Added ordering provider
  020 04/24/19 RJC					Updated dummyt refs with expands for performance/efficiency improvement;
  									fixed body length issue when body flag is false
  021 04/26/19 STV                  Added Time out
 ***********************************************************************/
drop program vigilanz_get_pop_rad_docs go
create program vigilanz_get_pop_rad_docs
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Username:" = ""  			;REQUIRED. Valid HNA Millennium user account.
	, "Beg Date:" = ""				;REQUIRED. Beginning of bookmark date range.
	, "End Date:" = ""				;OPTIONAL. No longer REQUIRED. End of bookmark date range. ;009
	, "Facility_Code_List" = ""		;OPTIONAL. List of location facility codes from code set 220.
	, "Include Body" = 0			;Defaults to no
	, "MaxBlobSize" = 0				;Optional - emissary setting
	, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
	, "Time Max" = 3600				;DO NOT USE. Undocumented value to override maximum date range in seconds.
with OUTDEV, USERNAME, BEG_DATE, END_DATE, LOC_LIST, INC_BODY, MAX_BLOB, DEBUG_FLAG, TIME_MAX
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL changed to Emissary version ;007
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record 1000079_req
record 1000079_req (
  1 req_list [*]
    2 query_mode  = i4
    2 query_mode_ind = i2
    2 event_id = f8
    2 contributor_system_cd = f8
    2 reference_nbr = vc
    2 dataset_uid = vc
    2 subtable_bit_map = i4
    2 subtable_bit_map_ind = i2
    2 valid_from_dt_tm = dq8
    2 valid_from_dt_tm_ind = i2
    2 decode_flag = i2
    2 ordering_provider_id = f8
    2 action_prsnl_id = f8
    2 event_id_list [*]
      3 event_id = f8
    2 action_type_cd_list [*]
      3 action_type_cd = f8
    2 src_event_id_ind = i2
    2 action_prsnl_group_id = f8
    2 query_mode2  = i4
)
 
free record 1000079_rep
record 1000079_rep (
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
      4 child_event [*]
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
			4 event_reltn_cd = f8
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
			4 io_result [*]
			  5 ce_io_result_id = f8
			  5 event_id = f8
			  5 person_id = f8
			  5 valid_from_dt_tm = dq8
			  5 valid_from_dt_tm_ind = i2
			  5 valid_until_dt_tm = dq8
			  5 valid_until_dt_tm_ind = i2
			  5 io_dt_tm = dq8
			  5 io_dt_tm_ind = i2
			  5 type_cd = f8
			  5 type_cd_disp = vc
			  5 type_cd_mean = vc
			  5 group_cd = f8
			  5 group_cd_disp = vc
			  5 group_cd_mean = vc
			  5 volume = f8
			  5 volume_ind = i2
			  5 authentic_flag = i2
			  5 authentic_flag_ind = i2
			  5 record_status_cd = f8
			  5 record_status_cd_disp = vc
			  5 record_status_cd_mean = vc
			  5 io_comment = vc
			  5 system_note = vc
			  5 updt_dt_tm = dq8
			  5 updt_dt_tm_ind = i2
			  5 updt_id = f8
			  5 updt_task = i4
			  5 updt_task_ind = i2
			  5 updt_cnt = i4
			  5 updt_cnt_ind = i2
			  5 updt_applctx = i4
			  5 updt_applctx_ind = i2
			4 specimen_coll [*]
			  5 event_id = f8
			  5 valid_from_dt_tm = dq8
			  5 valid_from_dt_tm_ind = i2
			  5 valid_until_dt_tm = dq8
			  5 valid_until_dt_tm_ind = i2
			  5 specimen_id = f8
			  5 container_id = f8
			  5 container_type_cd = f8
			  5 container_type_cd_disp = vc
			  5 container_type_cd_mean = vc
			  5 specimen_status_cd = f8
			  5 specimen_status_cd_disp = vc
			  5 specimen_status_cd_mean = vc
			  5 collect_dt_tm = dq8
			  5 collect_dt_tm_ind = i2
			  5 collect_method_cd = f8
			  5 collect_method_cd_disp = vc
			  5 collect_method_cd_mean = vc
			  5 collect_loc_cd = f8
			  5 collect_loc_cd_disp = vc
			  5 collect_loc_cd_mean = vc
			  5 collect_prsnl_id = f8
			  5 collect_volume = f8
			  5 collect_volume_ind = i2
			  5 collect_unit_cd = f8
			  5 collect_unit_cd_disp = vc
			  5 collect_unit_cd_mean = vc
			  5 collect_priority_cd = f8
			  5 collect_priority_cd_disp = vc
			  5 collect_priority_cd_mean = vc
			  5 source_type_cd = f8
			  5 source_type_cd_disp = vc
			  5 source_type_cd_mean = vc
			  5 source_text = vc
			  5 body_site_cd = f8
			  5 body_site_cd_disp = vc
			  5 body_site_cd_mean = vc
			  5 danger_cd = f8
			  5 danger_cd_disp = vc
			  5 danger_cd_mean = vc
			  5 positive_ind = i2
			  5 positive_ind_ind = i2
			  5 updt_dt_tm = dq8
			  5 updt_dt_tm_ind = i2
			  5 updt_id = f8
			  5 updt_task = i4
			  5 updt_task_ind = i2
			  5 updt_cnt = i4
			  5 updt_cnt_ind = i2
			  5 updt_applctx = i4
			  5 updt_applctx_ind = i2
			  5 specimen_trans_list [*]
				6 event_id = f8
				6 sequence_nbr = i4
				6 sequence_nbr_ind = i2
				6 valid_from_dt_tm = dq8
				6 valid_from_dt_tm_ind = i2
				6 valid_until_dt_tm = dq8
				6 valid_until_dt_tm_ind = i2
				6 transfer_dt_tm = dq8
				6 transfer_dt_tm_ind = i2
				6 transfer_prsnl_id = f8
				6 transfer_loc_cd = f8
				6 transfer_loc_cd_disp = vc
				6 receive_dt_tm = dq8
				6 receive_dt_tm_ind = i2
				6 receive_prsnl_id = f8
				6 receive_loc_cd = f8
				6 receive_loc_cd_disp = vc
				6 updt_dt_tm = dq8
				6 updt_dt_tm_ind = i2
				6 updt_id = f8
				6 updt_task = i4
				6 updt_task_ind = i2
				6 updt_cnt = i4
				6 updt_cnt_ind = i2
				6 updt_applctx = i4
				6 updt_applctx_ind = i2
			  5 collect_tz = i4
			  5 recvd_dt_tm = dq8
			  5 recvd_tz = i4
			4 blob_result [*]
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
			4 string_result [*]
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
			4 blood_transfuse [*]
			  5 event_id = f8
			  5 valid_until_dt_tm = dq8
			  5 valid_until_dt_tm_ind = i2
			  5 transfuse_start_dt_tm = dq8
			  5 transfuse_start_dt_tm_ind = i2
			  5 valid_from_dt_tm = dq8
			  5 valid_from_dt_tm_ind = i2
			  5 transfuse_end_dt_tm = dq8
			  5 transfuse_end_dt_tm_ind = i2
			  5 transfuse_note = vc
			  5 transfuse_route_cd = f8
			  5 transfuse_site_cd = f8
			  5 transfuse_pt_loc_cd = f8
			  5 initial_volume = f8
			  5 total_intake_volume = f8
			  5 transfusion_rate = f8
			  5 transfusion_unit_cd = f8
			  5 transfusion_time_cd = f8
			  5 updt_dt_tm = dq8
			  5 updt_dt_tm_ind = i2
			  5 updt_id = f8
			  5 updt_task = i4
			  5 updt_task_ind = i2
			  5 updt_cnt = i4
			  5 updt_cnt_ind = i2
			  5 updt_applctx = i4
			  5 updt_applctx_ind = i2
			4 apparatus [*]
			  5 event_id = f8
			  5 valid_from_dt_tm = dq8
			  5 valid_from_dt_tm_ind = i2
			  5 valid_until_dt_tm = dq8
			  5 valid_until_dt_tm_ind = i2
			  5 apparatus_type_cd = f8
			  5 apparatus_type_cd_disp = vc
			  5 apparatus_serial_nbr = vc
			  5 apparatus_size_cd = f8
			  5 apparatus_size_cd_disp = vc
			  5 body_site_cd = f8
			  5 body_site_cd_disp = vc
			  5 insertion_pt_loc_cd = f8
			  5 insertion_pt_loc_cd_disp = vc
			  5 insertion_prsnl_id = f8
			  5 removal_pt_loc_cd = f8
			  5 removal_pt_loc_cd_disp = vc
			  5 removal_prsnl_id = f8
			  5 updt_dt_tm = dq8
			  5 updt_dt_tm_ind = i2
			  5 updt_id = f8
			  5 updt_task = i4
			  5 updt_task_ind = i2
			  5 updt_cnt = i4
			  5 updt_cnt_ind = i2
			  5 updt_applctx = i4
			  5 updt_applctx_ind = i2
			  5 assistant_list [*]
				6 event_id = f8
				6 assistant_type_cd = f8
				6 assistant_type_cd_disp = vc
				6 assistant_type_cd_mean = vc
				6 sequence_nbr = i4
				6 sequence_nbr_ind = i2
				6 valid_from_dt_tm = dq8
				6 valid_from_dt_tm_ind = i2
				6 valid_until_dt_tm = dq8
				6 valid_until_dt_tm_ind = i2
				6 assistant_prsnl_id = f8
				6 updt_dt_tm = dq8
				6 updt_dt_tm_ind = i2
				6 updt_id = f8
				6 updt_task = i4
				6 updt_task_ind = i2
				6 updt_cnt = i4
				6 updt_cnt_ind = i2
				6 updt_applctx = i4
				6 updt_applctx_ind = i2
			4 product [*]
			  5 event_id = f8
			  5 valid_from_dt_tm = dq8
			  5 valid_from_dt_tm_ind = i2
			  5 valid_until_dt_tm = dq8
			  5 valid_until_dt_tm_ind = i2
			  5 product_id = f8
			  5 product_nbr = vc
			  5 product_cd = f8
			  5 product_cd_disp = vc
			  5 product_cd_mean = vc
			  5 abo_cd = f8
			  5 abo_cd_disp = vc
			  5 abo_cd_mean = vc
			  5 rh_cd = f8
			  5 rh_cd_disp = vc
			  5 rh_cd_mean = vc
			  5 product_status_cd = f8
			  5 product_status_cd_disp = vc
			  5 product_status_cd_mean = vc
			  5 updt_dt_tm = dq8
			  5 updt_dt_tm_ind = i2
			  5 updt_id = f8
			  5 updt_task = i4
			  5 updt_task_ind = i2
			  5 updt_cnt = i4
			  5 updt_cnt_ind = i2
			  5 updt_applctx = i4
			  5 updt_applctx_ind = i2
			  5 product_antigen_list [*]
				6 event_id = f8
				6 prod_ant_seq_nbr = i4
				6 prod_ant_seq_nbr_ind = i2
				6 valid_from_dt_tm = dq8
				6 valid_from_dt_tm_ind = i2
				6 valid_until_dt_tm = dq8
				6 valid_until_dt_tm_ind = i2
				6 antigen_cd = f8
				6 antigen_cd_disp = vc
				6 antigen_cd_mean = vc
				6 updt_dt_tm = dq8
				6 updt_dt_tm_ind = i2
				6 updt_id = f8
				6 updt_task = i4
				6 updt_task_ind = i2
				6 updt_cnt = i4
				6 updt_cnt_ind = i2
				6 updt_applctx = i4
				6 updt_applctx_ind = i2
				6 attribute_ind = i2
			  5 product_volume = f8
			  5 product_volume_unit_cd = f8
			  5 product_quantity = f8
			  5 product_quantity_unit_cd = f8
			  5 product_strength = f8
			  5 product_strength_unit_cd = f8
			4 date_result [*]
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
			4 med_result_list [*]
			  5 event_id = f8
			  5 valid_from_dt_tm = dq8
			  5 valid_from_dt_tm_ind = i2
			  5 valid_until_dt_tm = dq8
			  5 valid_until_dt_tm_ind = i2
			  5 admin_note = vc
			  5 admin_prov_id = f8
			  5 admin_start_dt_tm = dq8
			  5 admin_start_dt_tm_ind = i2
			  5 admin_end_dt_tm = dq8
			  5 admin_end_dt_tm_ind = i2
			  5 admin_route_cd = f8
			  5 admin_route_cd_disp = vc
			  5 admin_route_cd_mean = vc
			  5 admin_site_cd = f8
			  5 admin_site_cd_disp = vc
			  5 admin_site_cd_mean = vc
			  5 admin_method_cd = f8
			  5 admin_method_cd_disp = vc
			  5 admin_method_cd_mean = vc
			  5 admin_pt_loc_cd = f8
			  5 admin_pt_loc_cd_disp = vc
			  5 admin_pt_loc_cd_mean = vc
			  5 initial_dosage = f8
			  5 initial_dosage_ind = i2
			  5 admin_dosage = f8
			  5 admin_dosage_ind = i2
			  5 dosage_unit_cd = f8
			  5 dosage_unit_cd_disp = vc
			  5 dosage_unit_cd_mean = vc
			  5 initial_volume = f8
			  5 initial_volume_ind = i2
			  5 total_intake_volume = f8
			  5 total_intake_volume_ind = i2
			  5 diluent_type_cd = f8
			  5 diluent_type_cd_disp = vc
			  5 diluent_type_cd_mean = vc
			  5 ph_dispense_id = f8
			  5 infusion_rate = f8
			  5 infusion_rate_ind = i2
			  5 infusion_unit_cd = f8
			  5 infusion_unit_cd_disp = vc
			  5 infusion_unit_cd_mean = vc
			  5 infusion_time_cd = f8
			  5 infusion_time_cd_disp = vc
			  5 infusion_time_cd_mean = vc
			  5 medication_form_cd = f8
			  5 medication_form_cd_disp = vc
			  5 medication_form_cd_mean = vc
			  5 reason_required_flag = i2
			  5 reason_required_flag_ind = i2
			  5 response_required_flag = i2
			  5 response_required_flag_ind = i2
			  5 admin_strength = i4
			  5 admin_strength_ind = i2
			  5 admin_strength_unit_cd = f8
			  5 admin_strength_unit_cd_disp = vc
			  5 admin_strength_unit_cd_mean = vc
			  5 substance_lot_number = vc
			  5 substance_exp_dt_tm = dq8
			  5 substance_exp_dt_tm_ind = i2
			  5 substance_manufacturer_cd = f8
			  5 substance_manufacturer_cd_disp = vc
			  5 substance_manufacturer_cd_mean = vc
			  5 refusal_cd = f8
			  5 refusal_cd_disp = vc
			  5 refusal_cd_mean = vc
			  5 system_entry_dt_tm = dq8
			  5 system_entry_dt_tm_ind = i2
			  5 iv_event_cd = f8
			  5 infused_volume = f8
			  5 infused_volume_unit_cd = f8
			  5 infused_volume_unit_cd_disp = vc
			  5 infused_volume_unit_cd_mean = vc
			  5 remaining_volume = f8
			  5 remaining_volume_unit_cd = f8
			  5 remaining_volume_unit_cd_disp = vc
			  5 remaining_volume_unit_cd_mean = vc
			  5 updt_dt_tm = dq8
			  5 updt_dt_tm_ind = i2
			  5 updt_id = f8
			  5 updt_task = i4
			  5 updt_task_ind = i2
			  5 updt_cnt = i4
			  5 updt_cnt_ind = i2
			  5 updt_applctx = i4
			  5 updt_applctx_ind = i2
			  5 synonym_id = f8
			  5 immunization_type_cd = f8
			  5 immunization_type_cd_disp = vc
			  5 immunization_type_cd_mean = vc
			  5 admin_start_tz = i4
			  5 admin_end_tz = i4
			  5 contributor_link_list [*]
				6 event_id = f8
				6 contributor_event_id = f8
				6 ce_valid_from_dt_tm = dq8
				6 type_flag = i2
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
				6 ce_valid_until_dt_tm = dq8
				6 ce_result_value = vc
				6 ce_performed_prsnl_id = f8
				6 ce_event_end_dt_tm = dq8
				6 ce_event_cd = f8
				6 ce_event_cd_disp = vc
				6 ce_clinical_event_id = f8
				6 ce_event_class_cd = f8
				6 ce_event_class_cd_disp = vc
				6 string_result_list [*]
				  7 event_id = f8
				  7 valid_from_dt_tm = dq8
				  7 valid_from_dt_tm_ind = i2
				  7 valid_until_dt_tm = dq8
				  7 valid_until_dt_tm_ind = i2
				  7 string_result_text = vc
				  7 string_result_format_cd = f8
				  7 string_result_format_cd_disp = vc
				  7 equation_id = f8
				  7 last_norm_dt_tm = dq8
				  7 last_norm_dt_tm_ind = i2
				  7 unit_of_measure_cd = f8
				  7 unit_of_measure_cd_disp = vc
				  7 feasible_ind = i2
				  7 feasible_ind_ind = i2
				  7 inaccurate_ind = i2
				  7 inaccurate_ind_ind = i2
				  7 updt_dt_tm = dq8
				  7 updt_dt_tm_ind = i2
				  7 updt_id = f8
				  7 updt_task = i4
				  7 updt_task_ind = i2
				  7 updt_cnt = i4
				  7 updt_cnt_ind = i2
				  7 updt_applctx = i4
				  7 updt_applctx_ind = i2
				  7 interp_comp_list [*]
					8 event_id = f8
					8 comp_idx = i4
					8 comp_idx_ind = i2
					8 valid_from_dt_tm = dq8
					8 valid_from_dt_tm_ind = i2
					8 valid_until_dt_tm = dq8
					8 valid_until_dt_tm_ind = i2
					8 comp_event_id = f8
					8 updt_dt_tm = dq8
					8 updt_dt_tm_ind = i2
					8 updt_id = f8
					8 updt_task = i4
					8 updt_task_ind = i2
					8 updt_cnt = i4
					8 updt_cnt_ind = i2
					8 updt_applctx = i4
					8 updt_applctx_ind = i2
					8 comp_name = vc
				  7 calculation_equation = vc
				  7 string_long_text_id = f8
				6 coded_result_list [*]
				  7 event_id = f8
				  7 sequence_nbr = i4
				  7 sequence_nbr_ind = i2
				  7 valid_from_dt_tm = dq8
				  7 valid_from_dt_tm_ind = i2
				  7 valid_until_dt_tm = dq8
				  7 valid_until_dt_tm_ind = i2
				  7 nomenclature_id = f8
				  7 result_set = i4
				  7 result_set_ind = i2
				  7 result_cd = f8
				  7 result_cd_disp = vc
				  7 acr_code_str = vc
				  7 proc_code_str = vc
				  7 pathology_str = vc
				  7 group_nbr = i4
				  7 group_nbr_ind = i2
				  7 mnemonic = vc
				  7 short_string = vc
				  7 descriptor = vc
				  7 updt_dt_tm = dq8
				  7 updt_dt_tm_ind = i2
				  7 updt_id = f8
				  7 updt_task = i4
				  7 updt_task_ind = i2
				  7 updt_cnt = i4
				  7 updt_cnt_ind = i2
				  7 updt_applctx = i4
				  7 updt_applctx_ind = i2
				  7 unit_of_measure_cd = f8
				  7 source_string = vc
				6 date_result_list [*]
				  7 event_id = f8
				  7 valid_until_dt_tm = dq8
				  7 valid_until_dt_tm_ind = i2
				  7 valid_from_dt_tm = dq8
				  7 valid_from_dt_tm_ind = i2
				  7 result_dt_tm = dq8
				  7 result_dt_tm_ind = i2
				  7 result_dt_tm_os = f8
				  7 result_dt_tm_os_ind = i2
				  7 date_type_flag = i2
				  7 date_type_flag_ind = i2
				  7 updt_dt_tm = dq8
				  7 updt_dt_tm_ind = i2
				  7 updt_id = f8
				  7 updt_task = i4
				  7 updt_task_ind = i2
				  7 updt_cnt = i4
				  7 updt_cnt_ind = i2
				  7 updt_applctx = i4
				  7 updt_applctx_ind = i2
				  7 result_tz = i4
				  7 result_tz_ind = i2
				6 ce_result_status_cd = f8
				6 ce_result_status_cd_disp = vc
				6 ce_event_end_tz = i4
			  5 weight_value = f8
			  5 weight_unit_cd = f8
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
			4 microbiology_list [*]
			  5 event_id = f8
			  5 micro_seq_nbr = i4
			  5 micro_seq_nbr_ind = i2
			  5 valid_from_dt_tm = dq8
			  5 valid_from_dt_tm_ind = i2
			  5 valid_until_dt_tm = dq8
			  5 valid_until_dt_tm_ind = i2
			  5 organism_cd = f8
			  5 organism_cd_disp = vc
			  5 organism_cd_desc = vc
			  5 organism_cd_mean = vc
			  5 organism_occurrence_nbr = i4
			  5 organism_occurrence_nbr_ind = i2
			  5 organism_type_cd = f8
			  5 organism_type_cd_disp = vc
			  5 organism_type_cd_mean = vc
			  5 observation_prsnl_id = f8
			  5 biotype = vc
			  5 probability = f8
			  5 positive_ind = i2
			  5 positive_ind_ind = i2
			  5 updt_dt_tm = dq8
			  5 updt_dt_tm_ind = i2
			  5 updt_id = f8
			  5 updt_task = i4
			  5 updt_task_ind = i2
			  5 updt_cnt = i4
			  5 updt_cnt_ind = i2
			  5 updt_applctx = i4
			  5 updt_applctx_ind = i2
			  5 susceptibility_list [*]
				6 event_id = f8
				6 micro_seq_nbr = i4
				6 micro_seq_nbr_ind = i2
				6 suscep_seq_nbr = i4
				6 suscep_seq_nbr_ind = i2
				6 valid_from_dt_tm = dq8
				6 valid_from_dt_tm_ind = i2
				6 valid_until_dt_tm = dq8
				6 valid_until_dt_tm_ind = i2
				6 susceptibility_test_cd = f8
				6 susceptibility_test_cd_disp = vc
				6 susceptibility_test_cd_mean = vc
				6 detail_susceptibility_cd = f8
				6 detail_susceptibility_cd_disp = vc
				6 detail_susceptibility_cd_mean = vc
				6 panel_antibiotic_cd = f8
				6 panel_antibiotic_cd_disp = vc
				6 panel_antibiotic_cd_mean = vc
				6 antibiotic_cd = f8
				6 antibiotic_cd_disp = vc
				6 antibiotic_cd_desc = vc
				6 antibiotic_cd_mean = vc
				6 diluent_volume = f8
				6 diluent_volume_ind = i2
				6 result_cd = f8
				6 result_cd_disp = vc
				6 result_cd_mean = vc
				6 result_text_value = vc
				6 result_numeric_value = f8
				6 result_numeric_value_ind = i2
				6 result_unit_cd = f8
				6 result_unit_cd_disp = vc
				6 result_unit_cd_mean = vc
				6 result_dt_tm = dq8
				6 result_dt_tm_ind = i2
				6 result_prsnl_id = f8
				6 susceptibility_status_cd = f8
				6 susceptibility_status_cd_disp = vc
				6 susceptibility_status_cd_mean = vc
				6 abnormal_flag = i2
				6 abnormal_flag_ind = i2
				6 chartable_flag = i2
				6 chartable_flag_ind = i2
				6 nomenclature_id = f8
				6 antibiotic_note = vc
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
			4 linked_result_list [*]
			  5 linked_event_id = f8
			  5 order_id = f8
			  5 encntr_id = f8
			  5 accession_nbr = vc
			  5 contributor_system_cd = f8
			  5 contributor_system_cd_disp = vc
			  5 reference_nbr = vc
			  5 event_class_cd = f8
			  5 event_class_cd_disp = vc
			  5 series_ref_nbr = vc
			  5 sub_series_ref_nbr = vc
			  5 succession_type_cd = f8
			  5 succession_type_cd_disp = vc
			  5 child_event [*]
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
			4 event_modifier_list [*]
			  5 modifier_cd = f8
			  5 modifier_cd_disp = vc
			  5 modifier_value_cd = f8
			  5 modifier_value_cd_disp = vc
			  5 modifier_val_ft = vc
			  5 modifier_value_person_id = f8
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
			  5 group_sequence = i4
			  5 item_sequence = i4
			4 suscep_footnote_r_list [*]
			  5 event_id = f8
			  5 valid_from_dt_tm = dq8
			  5 valid_from_dt_tm_ind = i2
			  5 valid_until_dt_tm = dq8
			  5 valid_until_dt_tm_ind = i2
			  5 micro_seq_nbr = i4
			  5 micro_seq_nbr_ind = i2
			  5 suscep_seq_nbr = i4
			  5 suscep_seq_nbr_ind = i2
			  5 suscep_footnote_id = f8
			  5 updt_dt_tm = dq8
			  5 updt_dt_tm_ind = i2
			  5 updt_id = f8
			  5 updt_task = i4
			  5 updt_task_ind = i2
			  5 updt_cnt = i4
			  5 updt_cnt_ind = i2
			  5 updt_applctx = i4
			  5 updt_applctx_ind = i2
			  5 suscep_footnote [*]
				6 event_id = f8
				6 valid_from_dt_tm = dq8
				6 valid_from_dt_tm_ind = i2
				6 valid_until_dt_tm = dq8
				6 valid_until_dt_tm_ind = i2
				6 ce_suscep_footnote_id = f8
				6 suscep_footnote_id = f8
				6 checksum = i4
				6 checksum_ind = i2
				6 compression_cd = f8
				6 format_cd = f8
				6 contributor_system_cd = f8
				6 blob_length = i4
				6 blob_length_ind = i2
				6 reference_nbr = vc
				6 long_blob = gvc
				6 updt_dt_tm = dq8
				6 updt_dt_tm_ind = i2
				6 updt_id = f8
				6 updt_task = i4
				6 updt_task_ind = i2
				6 updt_cnt = i4
				6 updt_cnt_ind = i2
				6 updt_applctx = i4
				6 updt_applctx_ind = i2
			4 inventory_result_list [*]
			  5 item_id = f8
			  5 serial_nbr = vc
			  5 serial_mnemonic = vc
			  5 description = vc
			  5 item_nbr = vc
			  5 quantity = f8
			  5 quantity_ind = i2
			  5 body_site = vc
			  5 reference_entity_id = f8
			  5 reference_entity_name = vc
			  5 implant_result [*]
				6 item_id = f8
				6 item_size = vc
				6 harvest_site = vc
				6 culture_ind = i2
				6 culture_ind_ind = i2
				6 tissue_graft_type_cd = f8
				6 tissue_graft_type_cd_disp = vc
				6 explant_reason_cd = f8
				6 explant_reason_cd_disp = vc
				6 explant_disposition_cd = f8
				6 explant_disposition_cd_disp = vc
				6 reference_entity_id = f8
				6 reference_entity_name = vc
				6 manufacturer_cd = f8
				6 manufacturer_cd_disp = vc
				6 manufacturer_ft = vc
				6 model_nbr = vc
				6 lot_nbr = vc
				6 other_identifier = vc
				6 expiration_dt_tm = dq8
				6 expiration_dt_tm_ind = i2
				6 ecri_code = vc
				6 batch_nbr = vc
				6 event_id = f8
				6 valid_from_dt_tm = dq8
				6 valid_from_dt_tm_ind = i2
				6 valid_until_dt_tm = dq8
				6 valid_until_dt_tm_ind = i2
				6 updt_dt_tm = dq8
				6 updt_dt_tm_ind = i2
				6 updt_task = i4
				6 updt_task_ind = i2
				6 updt_id = f8
				6 updt_cnt = i4
				6 updt_cnt_ind = i2
				6 updt_applctx = i4
				6 updt_applctx_ind = i2
			  5 inv_time_result_list [*]
				6 item_id = f8
				6 start_dt_tm = dq8
				6 start_dt_tm_ind = i2
				6 end_dt_tm = dq8
				6 end_dt_tm_ind = i2
				6 event_id = f8
				6 valid_from_dt_tm = dq8
				6 valid_from_dt_tm_ind = i2
				6 valid_until_dt_tm = dq8
				6 valid_until_dt_tm_ind = i2
				6 updt_dt_tm = dq8
				6 updt_dt_tm_ind = i2
				6 updt_task = i4
				6 updt_task_ind = i2
				6 updt_id = f8
				6 updt_cnt = i4
				6 updt_cnt_ind = i2
				6 updt_applctx = i4
				6 updt_applctx_ind = i2
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
			4 child_event_list [*]
					5 clinical_event_id = f8
					5 event_id = f8
					5 valid_until_dt_tm = dq8
					5 valid_until_dt_tm_ind = i2
					5 clinsig_updt_dt_tm = dq8
					5 clinsig_updt_dt_tm_ind = i2
					5 view_level = i4
					5 view_level_ind = i2
					5 order_id = f8
					5 catalog_cd = f8
					5 catalog_cd_disp = vc
					5 series_ref_nbr = vc
					5 person_id = f8
					5 encntr_id = f8
					5 encntr_financial_id = f8
					5 accession_nbr = vc
					5 contributor_system_cd = f8
					5 contributor_system_cd_disp = vc
					5 reference_nbr = vc
					5 parent_event_id = f8
					5 valid_from_dt_tm = dq8
					5 valid_from_dt_tm_ind = i2
					5 event_class_cd = f8
					5 event_class_cd_disp = vc
					5 event_cd = f8
					5 event_cd_disp = vc
					5 event_cd_desc = vc
					5 event_tag = vc
					5 event_reltn_cd = f8
					5 event_reltn_cd_disp = vc
					5 event_start_dt_tm = dq8
					5 event_start_dt_tm_ind = i2
					5 event_end_dt_tm = dq8
					5 event_end_dt_tm_ind = i2
					5 event_end_dt_tm_os = f8
					5 event_end_dt_tm_os_ind = i2
					5 task_assay_cd = f8
					5 record_status_cd = f8
					5 record_status_cd_disp = vc
					5 result_status_cd = f8
					5 result_status_cd_disp = vc
					5 authentic_flag = i2
					5 authentic_flag_ind = i2
					5 publish_flag = i2
					5 publish_flag_ind = i2
					5 qc_review_cd = f8
					5 qc_review_cd_disp = vc
					5 normalcy_cd = f8
					5 normalcy_cd_disp = vc
					5 normalcy_cd_mean = vc
					5 normalcy_method_cd = f8
					5 normalcy_method_cd_disp = vc
					5 inquire_security_cd = f8
					5 inquire_security_cd_disp = vc
					5 resource_group_cd = f8
					5 resource_group_cd_disp = vc
					5 resource_cd = f8
					5 resource_cd_disp = vc
					5 subtable_bit_map = i4
					5 subtable_bit_map_ind = i2
					5 event_title_text = vc
					5 collating_seq = vc
					5 result_val = vc
					5 result_units_cd = f8
					5 result_units_cd_disp = vc
					5 result_time_units_cd = f8
					5 result_time_units_cd_disp = vc
					5 verified_dt_tm = dq8
					5 verified_dt_tm_ind = i2
					5 verified_prsnl_id = f8
					5 performed_dt_tm = dq8
					5 performed_dt_tm_ind = i2
					5 performed_prsnl_id = f8
					5 normal_low = vc
					5 normal_high = vc
					5 critical_low = vc
					5 critical_high = vc
					5 expiration_dt_tm = dq8
					5 expiration_dt_tm_ind = i2
					5 note_importance_bit_map = i2
					5 event_tag_set_flag = i2
					5 updt_dt_tm = dq8
					5 updt_dt_tm_ind = i2
					5 updt_id = f8
					5 updt_task = i4
					5 updt_task_ind = i2
					5 updt_cnt = i4
					5 updt_cnt_ind = i2
					5 updt_applctx = i4
					5 updt_applctx_ind = i2
					5 io_result [*]
					  6 ce_io_result_id = f8
					  6 event_id = f8
					  6 person_id = f8
					  6 valid_from_dt_tm = dq8
					  6 valid_from_dt_tm_ind = i2
					  6 valid_until_dt_tm = dq8
					  6 valid_until_dt_tm_ind = i2
					  6 io_dt_tm = dq8
					  6 io_dt_tm_ind = i2
					  6 type_cd = f8
					  6 type_cd_disp = vc
					  6 type_cd_mean = vc
					  6 group_cd = f8
					  6 group_cd_disp = vc
					  6 group_cd_mean = vc
					  6 volume = f8
					  6 volume_ind = i2
					  6 authentic_flag = i2
					  6 authentic_flag_ind = i2
					  6 record_status_cd = f8
					  6 record_status_cd_disp = vc
					  6 record_status_cd_mean = vc
					  6 io_comment = vc
					  6 system_note = vc
					  6 updt_dt_tm = dq8
					  6 updt_dt_tm_ind = i2
					  6 updt_id = f8
					  6 updt_task = i4
					  6 updt_task_ind = i2
					  6 updt_cnt = i4
					  6 updt_cnt_ind = i2
					  6 updt_applctx = i4
					  6 updt_applctx_ind = i2
					5 specimen_coll [*]
					  6 event_id = f8
					  6 valid_from_dt_tm = dq8
					  6 valid_from_dt_tm_ind = i2
					  6 valid_until_dt_tm = dq8
					  6 valid_until_dt_tm_ind = i2
					  6 specimen_id = f8
					  6 container_id = f8
					  6 container_type_cd = f8
					  6 container_type_cd_disp = vc
					  6 container_type_cd_mean = vc
					  6 specimen_status_cd = f8
					  6 specimen_status_cd_disp = vc
					  6 specimen_status_cd_mean = vc
					  6 collect_dt_tm = dq8
					  6 collect_dt_tm_ind = i2
					  6 collect_method_cd = f8
					  6 collect_method_cd_disp = vc
					  6 collect_method_cd_mean = vc
					  6 collect_loc_cd = f8
					  6 collect_loc_cd_disp = vc
					  6 collect_loc_cd_mean = vc
					  6 collect_prsnl_id = f8
					  6 collect_volume = f8
					  6 collect_volume_ind = i2
					  6 collect_unit_cd = f8
					  6 collect_unit_cd_disp = vc
					  6 collect_unit_cd_mean = vc
					  6 collect_priority_cd = f8
					  6 collect_priority_cd_disp = vc
					  6 collect_priority_cd_mean = vc
					  6 source_type_cd = f8
					  6 source_type_cd_disp = vc
					  6 source_type_cd_mean = vc
					  6 source_text = vc
					  6 body_site_cd = f8
					  6 body_site_cd_disp = vc
					  6 body_site_cd_mean = vc
					  6 danger_cd = f8
					  6 danger_cd_disp = vc
					  6 danger_cd_mean = vc
					  6 positive_ind = i2
					  6 positive_ind_ind = i2
					  6 updt_dt_tm = dq8
					  6 updt_dt_tm_ind = i2
					  6 updt_id = f8
					  6 updt_task = i4
					  6 updt_task_ind = i2
					  6 updt_cnt = i4
					  6 updt_cnt_ind = i2
					  6 updt_applctx = i4
					  6 updt_applctx_ind = i2
					  6 specimen_trans_list [*]
						7 event_id = f8
						7 sequence_nbr = i4
						7 sequence_nbr_ind = i2
						7 valid_from_dt_tm = dq8
						7 valid_from_dt_tm_ind = i2
						7 valid_until_dt_tm = dq8
						7 valid_until_dt_tm_ind = i2
						7 transfer_dt_tm = dq8
						7 transfer_dt_tm_ind = i2
						7 transfer_prsnl_id = f8
						7 transfer_loc_cd = f8
						7 transfer_loc_cd_disp = vc
						7 receive_dt_tm = dq8
						7 receive_dt_tm_ind = i2
						7 receive_prsnl_id = f8
						7 receive_loc_cd = f8
						7 receive_loc_cd_disp = vc
						7 updt_dt_tm = dq8
						7 updt_dt_tm_ind = i2
						7 updt_id = f8
						7 updt_task = i4
						7 updt_task_ind = i2
						7 updt_cnt = i4
						7 updt_cnt_ind = i2
						7 updt_applctx = i4
						7 updt_applctx_ind = i2
					  6 collect_tz = i4
					  6 recvd_dt_tm = dq8
					  6 recvd_tz = i4
					5 blob_result [*]
					  6 event_id = f8
					  6 valid_from_dt_tm = dq8
					  6 valid_from_dt_tm_ind = i2
					  6 valid_until_dt_tm = dq8
					  6 valid_until_dt_tm_ind = i2
					  6 max_sequence_nbr = i4
					  6 max_sequence_nbr_ind = i2
					  6 checksum = i4
					  6 checksum_ind = i2
					  6 succession_type_cd = f8
					  6 succession_type_cd_disp = vc
					  6 sub_series_ref_nbr = vc
					  6 storage_cd = f8
					  6 storage_cd_disp = vc
					  6 format_cd = f8
					  6 format_cd_disp = vc
					  6 device_cd = f8
					  6 device_cd_disp = vc
					  6 blob_handle = vc
					  6 blob_attributes = vc
					  6 updt_dt_tm = dq8
					  6 updt_dt_tm_ind = i2
					  6 updt_id = f8
					  6 updt_task = i4
					  6 updt_task_ind = i2
					  6 updt_cnt = i4
					  6 updt_cnt_ind = i2
					  6 updt_applctx = i4
					  6 updt_applctx_ind = i2
					  6 blob [*]
						7 event_id = f8
						7 blob_seq_num = i4
						7 blob_seq_num_ind = i2
						7 valid_from_dt_tm = dq8
						7 valid_from_dt_tm_ind = i2
						7 valid_until_dt_tm = dq8
						7 valid_until_dt_tm_ind = i2
						7 blob_length = i4
						7 blob_length_ind = i2
						7 compression_cd = f8
						7 compression_cd_disp = vc
						7 blob_contents = gvc
						7 blob_contents_ind = i2
						7 updt_dt_tm = dq8
						7 updt_dt_tm_ind = i2
						7 updt_id = f8
						7 updt_task = i4
						7 updt_task_ind = i2
						7 updt_cnt = i4
						7 updt_cnt_ind = i2
						7 updt_applctx = i4
						7 updt_applctx_ind = i2
					  6 blob_summary [*]
						7 ce_blob_summary_id = f8
						7 blob_summary_id = f8
						7 blob_length = i4
						7 blob_length_ind = i2
						7 format_cd = f8
						7 compression_cd = f8
						7 checksum = i4
						7 checksum_ind = i2
						7 long_blob = gvc
						7 valid_from_dt_tm = dq8
						7 valid_from_dt_tm_ind = i2
						7 valid_until_dt_tm = dq8
						7 valid_until_dt_tm_ind = i2
						7 event_id = f8
						7 updt_dt_tm = dq8
						7 updt_dt_tm_ind = i2
						7 updt_task = i4
						7 updt_task_ind = i2
						7 updt_id = f8
						7 updt_cnt = i4
						7 updt_cnt_ind = i2
						7 updt_applctx = i4
						7 updt_applctx_ind = i2
					5 string_result [*]
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
					5 blood_transfuse [*]
					  6 event_id = f8
					  6 valid_until_dt_tm = dq8
					  6 valid_until_dt_tm_ind = i2
					  6 transfuse_start_dt_tm = dq8
					  6 transfuse_start_dt_tm_ind = i2
					  6 valid_from_dt_tm = dq8
					  6 valid_from_dt_tm_ind = i2
					  6 transfuse_end_dt_tm = dq8
					  6 transfuse_end_dt_tm_ind = i2
					  6 transfuse_note = vc
					  6 transfuse_route_cd = f8
					  6 transfuse_site_cd = f8
					  6 transfuse_pt_loc_cd = f8
					  6 initial_volume = f8
					  6 total_intake_volume = f8
					  6 transfusion_rate = f8
					  6 transfusion_unit_cd = f8
					  6 transfusion_time_cd = f8
					  6 updt_dt_tm = dq8
					  6 updt_dt_tm_ind = i2
					  6 updt_id = f8
					  6 updt_task = i4
					  6 updt_task_ind = i2
					  6 updt_cnt = i4
					  6 updt_cnt_ind = i2
					  6 updt_applctx = i4
					  6 updt_applctx_ind = i2
					5 apparatus [*]
					  6 event_id = f8
					  6 valid_from_dt_tm = dq8
					  6 valid_from_dt_tm_ind = i2
					  6 valid_until_dt_tm = dq8
					  6 valid_until_dt_tm_ind = i2
					  6 apparatus_type_cd = f8
					  6 apparatus_type_cd_disp = vc
					  6 apparatus_serial_nbr = vc
					  6 apparatus_size_cd = f8
					  6 apparatus_size_cd_disp = vc
					  6 body_site_cd = f8
					  6 body_site_cd_disp = vc
					  6 insertion_pt_loc_cd = f8
					  6 insertion_pt_loc_cd_disp = vc
					  6 insertion_prsnl_id = f8
					  6 removal_pt_loc_cd = f8
					  6 removal_pt_loc_cd_disp = vc
					  6 removal_prsnl_id = f8
					  6 updt_dt_tm = dq8
					  6 updt_dt_tm_ind = i2
					  6 updt_id = f8
					  6 updt_task = i4
					  6 updt_task_ind = i2
					  6 updt_cnt = i4
					  6 updt_cnt_ind = i2
					  6 updt_applctx = i4
					  6 updt_applctx_ind = i2
					  6 assistant_list [*]
						7 event_id = f8
						7 assistant_type_cd = f8
						7 assistant_type_cd_disp = vc
						7 assistant_type_cd_mean = vc
						7 sequence_nbr = i4
						7 sequence_nbr_ind = i2
						7 valid_from_dt_tm = dq8
						7 valid_from_dt_tm_ind = i2
						7 valid_until_dt_tm = dq8
						7 valid_until_dt_tm_ind = i2
						7 assistant_prsnl_id = f8
						7 updt_dt_tm = dq8
						7 updt_dt_tm_ind = i2
						7 updt_id = f8
						7 updt_task = i4
						7 updt_task_ind = i2
						7 updt_cnt = i4
						7 updt_cnt_ind = i2
						7 updt_applctx = i4
						7 updt_applctx_ind = i2
					5 product [*]
					  6 event_id = f8
					  6 valid_from_dt_tm = dq8
					  6 valid_from_dt_tm_ind = i2
					  6 valid_until_dt_tm = dq8
					  6 valid_until_dt_tm_ind = i2
					  6 product_id = f8
					  6 product_nbr = vc
					  6 product_cd = f8
					  6 product_cd_disp = vc
					  6 product_cd_mean = vc
					  6 abo_cd = f8
					  6 abo_cd_disp = vc
					  6 abo_cd_mean = vc
					  6 rh_cd = f8
					  6 rh_cd_disp = vc
					  6 rh_cd_mean = vc
					  6 product_status_cd = f8
					  6 product_status_cd_disp = vc
					  6 product_status_cd_mean = vc
					  6 updt_dt_tm = dq8
					  6 updt_dt_tm_ind = i2
					  6 updt_id = f8
					  6 updt_task = i4
					  6 updt_task_ind = i2
					  6 updt_cnt = i4
					  6 updt_cnt_ind = i2
					  6 updt_applctx = i4
					  6 updt_applctx_ind = i2
					  6 product_antigen_list [*]
						7 event_id = f8
						7 prod_ant_seq_nbr = i4
						7 prod_ant_seq_nbr_ind = i2
						7 valid_from_dt_tm = dq8
						7 valid_from_dt_tm_ind = i2
						7 valid_until_dt_tm = dq8
						7 valid_until_dt_tm_ind = i2
						7 antigen_cd = f8
						7 antigen_cd_disp = vc
						7 antigen_cd_mean = vc
						7 updt_dt_tm = dq8
						7 updt_dt_tm_ind = i2
						7 updt_id = f8
						7 updt_task = i4
						7 updt_task_ind = i2
						7 updt_cnt = i4
						7 updt_cnt_ind = i2
						7 updt_applctx = i4
						7 updt_applctx_ind = i2
						7 attribute_ind = i2
					  6 product_volume = f8
					  6 product_volume_unit_cd = f8
					  6 product_quantity = f8
					  6 product_quantity_unit_cd = f8
					  6 product_strength = f8
					  6 product_strength_unit_cd = f8
					5 date_result [*]
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
					5 med_result_list [*]
					  6 event_id = f8
					  6 valid_from_dt_tm = dq8
					  6 valid_from_dt_tm_ind = i2
					  6 valid_until_dt_tm = dq8
					  6 valid_until_dt_tm_ind = i2
					  6 admin_note = vc
					  6 admin_prov_id = f8
					  6 admin_start_dt_tm = dq8
					  6 admin_start_dt_tm_ind = i2
					  6 admin_end_dt_tm = dq8
					  6 admin_end_dt_tm_ind = i2
					  6 admin_route_cd = f8
					  6 admin_route_cd_disp = vc
					  6 admin_route_cd_mean = vc
					  6 admin_site_cd = f8
					  6 admin_site_cd_disp = vc
					  6 admin_site_cd_mean = vc
					  6 admin_method_cd = f8
					  6 admin_method_cd_disp = vc
					  6 admin_method_cd_mean = vc
					  6 admin_pt_loc_cd = f8
					  6 admin_pt_loc_cd_disp = vc
					  6 admin_pt_loc_cd_mean = vc
					  6 initial_dosage = f8
					  6 initial_dosage_ind = i2
					  6 admin_dosage = f8
					  6 admin_dosage_ind = i2
					  6 dosage_unit_cd = f8
					  6 dosage_unit_cd_disp = vc
					  6 dosage_unit_cd_mean = vc
					  6 initial_volume = f8
					  6 initial_volume_ind = i2
					  6 total_intake_volume = f8
					  6 total_intake_volume_ind = i2
					  6 diluent_type_cd = f8
					  6 diluent_type_cd_disp = vc
					  6 diluent_type_cd_mean = vc
					  6 ph_dispense_id = f8
					  6 infusion_rate = f8
					  6 infusion_rate_ind = i2
					  6 infusion_unit_cd = f8
					  6 infusion_unit_cd_disp = vc
					  6 infusion_unit_cd_mean = vc
					  6 infusion_time_cd = f8
					  6 infusion_time_cd_disp = vc
					  6 infusion_time_cd_mean = vc
					  6 medication_form_cd = f8
					  6 medication_form_cd_disp = vc
					  6 medication_form_cd_mean = vc
					  6 reason_required_flag = i2
					  6 reason_required_flag_ind = i2
					  6 response_required_flag = i2
					  6 response_required_flag_ind = i2
					  6 admin_strength = i4
					  6 admin_strength_ind = i2
					  6 admin_strength_unit_cd = f8
					  6 admin_strength_unit_cd_disp = vc
					  6 admin_strength_unit_cd_mean = vc
					  6 substance_lot_number = vc
					  6 substance_exp_dt_tm = dq8
					  6 substance_exp_dt_tm_ind = i2
					  6 substance_manufacturer_cd = f8
					  6 substance_manufacturer_cd_disp = vc
					  6 substance_manufacturer_cd_mean = vc
					  6 refusal_cd = f8
					  6 refusal_cd_disp = vc
					  6 refusal_cd_mean = vc
					  6 system_entry_dt_tm = dq8
					  6 system_entry_dt_tm_ind = i2
					  6 iv_event_cd = f8
					  6 infused_volume = f8
					  6 infused_volume_unit_cd = f8
					  6 infused_volume_unit_cd_disp = vc
					  6 infused_volume_unit_cd_mean = vc
					  6 remaining_volume = f8
					  6 remaining_volume_unit_cd = f8
					  6 remaining_volume_unit_cd_disp = vc
					  6 remaining_volume_unit_cd_mean = vc
					  6 updt_dt_tm = dq8
					  6 updt_dt_tm_ind = i2
					  6 updt_id = f8
					  6 updt_task = i4
					  6 updt_task_ind = i2
					  6 updt_cnt = i4
					  6 updt_cnt_ind = i2
					  6 updt_applctx = i4
					  6 updt_applctx_ind = i2
					  6 synonym_id = f8
					  6 immunization_type_cd = f8
					  6 immunization_type_cd_disp = vc
					  6 immunization_type_cd_mean = vc
					  6 admin_start_tz = i4
					  6 admin_end_tz = i4
					  6 contributor_link_list [*]
						7 event_id = f8
						7 contributor_event_id = f8
						7 ce_valid_from_dt_tm = dq8
						7 type_flag = i2
						7 valid_from_dt_tm = dq8
						7 valid_from_dt_tm_ind = i2
						7 valid_until_dt_tm = dq8
						7 valid_until_dt_tm_ind = i2
						7 updt_dt_tm = dq8
						7 updt_dt_tm_ind = i2
						7 updt_id = f8
						7 updt_task = i4
						7 updt_task_ind = i2
						7 updt_cnt = i4
						7 updt_cnt_ind = i2
						7 updt_applctx = i4
						7 updt_applctx_ind = i2
						7 ce_valid_until_dt_tm = dq8
						7 ce_result_value = vc
						7 ce_performed_prsnl_id = f8
						7 ce_event_end_dt_tm = dq8
						7 ce_event_cd = f8
						7 ce_event_cd_disp = vc
						7 ce_clinical_event_id = f8
						7 ce_event_class_cd = f8
						7 ce_event_class_cd_disp = vc
						7 string_result_list [*]
						  8 event_id = f8
						  8 valid_from_dt_tm = dq8
						  8 valid_from_dt_tm_ind = i2
						  8 valid_until_dt_tm = dq8
						  8 valid_until_dt_tm_ind = i2
						  8 string_result_text = vc
						  8 string_result_format_cd = f8
						  8 string_result_format_cd_disp = vc
						  8 equation_id = f8
						  8 last_norm_dt_tm = dq8
						  8 last_norm_dt_tm_ind = i2
						  8 unit_of_measure_cd = f8
						  8 unit_of_measure_cd_disp = vc
						  8 feasible_ind = i2
						  8 feasible_ind_ind = i2
						  8 inaccurate_ind = i2
						  8 inaccurate_ind_ind = i2
						  8 updt_dt_tm = dq8
						  8 updt_dt_tm_ind = i2
						  8 updt_id = f8
						  8 updt_task = i4
						  8 updt_task_ind = i2
						  8 updt_cnt = i4
						  8 updt_cnt_ind = i2
						  8 updt_applctx = i4
						  8 updt_applctx_ind = i2
						  8 interp_comp_list [*]
							9 event_id = f8
							9 comp_idx = i4
							9 comp_idx_ind = i2
							9 valid_from_dt_tm = dq8
							9 valid_from_dt_tm_ind = i2
							9 valid_until_dt_tm = dq8
							9 valid_until_dt_tm_ind = i2
							9 comp_event_id = f8
							9 updt_dt_tm = dq8
							9 updt_dt_tm_ind = i2
							9 updt_id = f8
							9 updt_task = i4
							9 updt_task_ind = i2
							9 updt_cnt = i4
							9 updt_cnt_ind = i2
							9 updt_applctx = i4
							9 updt_applctx_ind = i2
							9 comp_name = vc
						  8 calculation_equation = vc
						  8 string_long_text_id = f8
						7 coded_result_list [*]
						  8 event_id = f8
						  8 sequence_nbr = i4
						  8 sequence_nbr_ind = i2
						  8 valid_from_dt_tm = dq8
						  8 valid_from_dt_tm_ind = i2
						  8 valid_until_dt_tm = dq8
						  8 valid_until_dt_tm_ind = i2
						  8 nomenclature_id = f8
						  8 result_set = i4
						  8 result_set_ind = i2
						  8 result_cd = f8
						  8 result_cd_disp = vc
						  8 acr_code_str = vc
						  8 proc_code_str = vc
						  8 pathology_str = vc
						  8 group_nbr = i4
						  8 group_nbr_ind = i2
						  8 mnemonic = vc
						  8 short_string = vc
						  8 descriptor = vc
						  8 updt_dt_tm = dq8
						  8 updt_dt_tm_ind = i2
						  8 updt_id = f8
						  8 updt_task = i4
						  8 updt_task_ind = i2
						  8 updt_cnt = i4
						  8 updt_cnt_ind = i2
						  8 updt_applctx = i4
						  8 updt_applctx_ind = i2
						  8 unit_of_measure_cd = f8
						  8 source_string = vc
						7 date_result_list [*]
						  8 event_id = f8
						  8 valid_until_dt_tm = dq8
						  8 valid_until_dt_tm_ind = i2
						  8 valid_from_dt_tm = dq8
						  8 valid_from_dt_tm_ind = i2
						  8 result_dt_tm = dq8
						  8 result_dt_tm_ind = i2
						  8 result_dt_tm_os = f8
						  8 result_dt_tm_os_ind = i2
						  8 date_type_flag = i2
						  8 date_type_flag_ind = i2
						  8 updt_dt_tm = dq8
						  8 updt_dt_tm_ind = i2
						  8 updt_id = f8
						  8 updt_task = i4
						  8 updt_task_ind = i2
						  8 updt_cnt = i4
						  8 updt_cnt_ind = i2
						  8 updt_applctx = i4
						  8 updt_applctx_ind = i2
						  8 result_tz = i4
						  8 result_tz_ind = i2
						7 ce_result_status_cd = f8
						7 ce_result_status_cd_disp = vc
						7 ce_event_end_tz = i4
					  6 weight_value = f8
					  6 weight_unit_cd = f8
					5 event_note_list [*]
					  6 ce_event_note_id = f8
					  6 valid_until_dt_tm = dq8
					  6 valid_until_dt_tm_ind = i2
					  6 event_note_id = f8
					  6 event_id = f8
					  6 note_type_cd = f8
					  6 note_type_cd_disp = vc
					  6 note_type_cd_mean = vc
					  6 note_format_cd = f8
					  6 note_format_cd_disp = vc
					  6 note_format_cd_mean = vc
					  6 valid_from_dt_tm = dq8
					  6 valid_from_dt_tm_ind = i2
					  6 entry_method_cd = f8
					  6 entry_method_cd_disp = vc
					  6 entry_method_cd_mean = vc
					  6 note_prsnl_id = f8
					  6 note_dt_tm = dq8
					  6 note_dt_tm_ind = i2
					  6 record_status_cd = f8
					  6 record_status_cd_disp = vc
					  6 record_status_cd_mean = vc
					  6 compression_cd = f8
					  6 compression_cd_disp = vc
					  6 compression_cd_mean = vc
					  6 checksum = i4
					  6 checksum_ind = i2
					  6 long_blob = gvc
					  6 long_text = vc
					  6 long_text_id = f8
					  6 non_chartable_flag = i2
					  6 importance_flag = i2
					  6 updt_dt_tm = dq8
					  6 updt_dt_tm_ind = i2
					  6 updt_id = f8
					  6 updt_task = i4
					  6 updt_task_ind = i2
					  6 updt_cnt = i4
					  6 updt_cnt_ind = i2
					  6 updt_applctx = i4
					  6 updt_applctx_ind = i2
					  6 note_tz = i4
					5 event_prsnl_list [*]
					  6 ce_event_prsnl_id = f8
					  6 event_prsnl_id = f8
					  6 person_id = f8
					  6 event_id = f8
					  6 valid_from_dt_tm = dq8
					  6 valid_from_dt_tm_ind = i2
					  6 valid_until_dt_tm = dq8
					  6 valid_until_dt_tm_ind = i2
					  6 action_type_cd = f8
					  6 action_type_cd_disp = vc
					  6 request_dt_tm = dq8
					  6 request_dt_tm_ind = i2
					  6 request_prsnl_id = f8
					  6 request_prsnl_ft = vc
					  6 request_comment = vc
					  6 action_dt_tm = dq8
					  6 action_dt_tm_ind = i2
					  6 action_prsnl_id = f8
					  6 action_prsnl_ft = vc
					  6 proxy_prsnl_id = f8
					  6 proxy_prsnl_ft = vc
					  6 action_status_cd = f8
					  6 action_status_cd_disp = vc
					  6 action_comment = vc
					  6 change_since_action_flag = i2
					  6 change_since_action_flag_ind = i2
					  6 updt_dt_tm = dq8
					  6 updt_dt_tm_ind = i2
					  6 updt_id = f8
					  6 updt_task = i4
					  6 updt_task_ind = i2
					  6 updt_cnt = i4
					  6 updt_cnt_ind = i2
					  6 updt_applctx = i4
					  6 updt_applctx_ind = i2
					  6 long_text_id = f8
					  6 long_text = vc
					  6 linked_event_id = f8
					  6 request_tz = i4
					  6 action_tz = i4
					  6 system_comment = vc
					  6 event_action_modifier_list [*]
						7 ce_event_action_modifier_id = f8
						7 event_action_modifier_id = f8
						7 event_id = f8
						7 event_prsnl_id = f8
						7 action_type_modifier_cd = f8
						7 action_type_modifier_cd_disp = vc
						7 valid_from_dt_tm = dq8
						7 valid_from_dt_tm_ind = i2
						7 valid_until_dt_tm = dq8
						7 valid_until_dt_tm_ind = i2
						7 updt_dt_tm = dq8
						7 updt_dt_tm_ind = i2
						7 updt_id = f8
						7 updt_task = i4
						7 updt_task_ind = i2
						7 updt_cnt = i4
						7 updt_cnt_ind = i2
						7 updt_applctx = i4
						7 updt_applctx_ind = i2
					  6 digital_signature_ident = vc
					  6 action_prsnl_group_id = f8
					  6 request_prsnl_group_id = f8
					  6 receiving_person_id = f8
					  6 receiving_person_ft = vc
					5 microbiology_list [*]
					  6 event_id = f8
					  6 micro_seq_nbr = i4
					  6 micro_seq_nbr_ind = i2
					  6 valid_from_dt_tm = dq8
					  6 valid_from_dt_tm_ind = i2
					  6 valid_until_dt_tm = dq8
					  6 valid_until_dt_tm_ind = i2
					  6 organism_cd = f8
					  6 organism_cd_disp = vc
					  6 organism_cd_desc = vc
					  6 organism_cd_mean = vc
					  6 organism_occurrence_nbr = i4
					  6 organism_occurrence_nbr_ind = i2
					  6 organism_type_cd = f8
					  6 organism_type_cd_disp = vc
					  6 organism_type_cd_mean = vc
					  6 observation_prsnl_id = f8
					  6 biotype = vc
					  6 probability = f8
					  6 positive_ind = i2
					  6 positive_ind_ind = i2
					  6 updt_dt_tm = dq8
					  6 updt_dt_tm_ind = i2
					  6 updt_id = f8
					  6 updt_task = i4
					  6 updt_task_ind = i2
					  6 updt_cnt = i4
					  6 updt_cnt_ind = i2
					  6 updt_applctx = i4
					  6 updt_applctx_ind = i2
					  6 susceptibility_list [*]
						7 event_id = f8
						7 micro_seq_nbr = i4
						7 micro_seq_nbr_ind = i2
						7 suscep_seq_nbr = i4
						7 suscep_seq_nbr_ind = i2
						7 valid_from_dt_tm = dq8
						7 valid_from_dt_tm_ind = i2
						7 valid_until_dt_tm = dq8
						7 valid_until_dt_tm_ind = i2
						7 susceptibility_test_cd = f8
						7 susceptibility_test_cd_disp = vc
						7 susceptibility_test_cd_mean = vc
						7 detail_susceptibility_cd = f8
						7 detail_susceptibility_cd_disp = vc
						7 detail_susceptibility_cd_mean = vc
						7 panel_antibiotic_cd = f8
						7 panel_antibiotic_cd_disp = vc
						7 panel_antibiotic_cd_mean = vc
						7 antibiotic_cd = f8
						7 antibiotic_cd_disp = vc
						7 antibiotic_cd_desc = vc
						7 antibiotic_cd_mean = vc
						7 diluent_volume = f8
						7 diluent_volume_ind = i2
						7 result_cd = f8
						7 result_cd_disp = vc
						7 result_cd_mean = vc
						7 result_text_value = vc
						7 result_numeric_value = f8
						7 result_numeric_value_ind = i2
						7 result_unit_cd = f8
						7 result_unit_cd_disp = vc
						7 result_unit_cd_mean = vc
						7 result_dt_tm = dq8
						7 result_dt_tm_ind = i2
						7 result_prsnl_id = f8
						7 susceptibility_status_cd = f8
						7 susceptibility_status_cd_disp = vc
						7 susceptibility_status_cd_mean = vc
						7 abnormal_flag = i2
						7 abnormal_flag_ind = i2
						7 chartable_flag = i2
						7 chartable_flag_ind = i2
						7 nomenclature_id = f8
						7 antibiotic_note = vc
						7 updt_dt_tm = dq8
						7 updt_dt_tm_ind = i2
						7 updt_id = f8
						7 updt_task = i4
						7 updt_task_ind = i2
						7 updt_cnt = i4
						7 updt_cnt_ind = i2
						7 updt_applctx = i4
						7 updt_applctx_ind = i2
						7 result_tz = i4
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
					5 linked_result_list [*]
					  6 linked_event_id = f8
					  6 order_id = f8
					  6 encntr_id = f8
					  6 accession_nbr = vc
					  6 contributor_system_cd = f8
					  6 contributor_system_cd_disp = vc
					  6 reference_nbr = vc
					  6 event_class_cd = f8
					  6 event_class_cd_disp = vc
					  6 series_ref_nbr = vc
					  6 sub_series_ref_nbr = vc
					  6 succession_type_cd = f8
					  6 succession_type_cd_disp = vc
					  6 child_event [*]
					  6 event_id = f8
					  6 valid_from_dt_tm = dq8
					  6 valid_from_dt_tm_ind = i2
					  6 valid_until_dt_tm = dq8
					  6 valid_until_dt_tm_ind = i2
					  6 updt_dt_tm = dq8
					  6 updt_dt_tm_ind = i2
					  6 updt_task = i4
					  6 updt_task_ind = i2
					  6 updt_id = f8
					  6 updt_cnt = i4
					  6 updt_cnt_ind = i2
					  6 updt_applctx = i4
					  6 updt_applctx_ind = i2
					5 event_modifier_list [*]
					  6 modifier_cd = f8
					  6 modifier_cd_disp = vc
					  6 modifier_value_cd = f8
					  6 modifier_value_cd_disp = vc
					  6 modifier_val_ft = vc
					  6 modifier_value_person_id = f8
					  6 event_id = f8
					  6 valid_from_dt_tm = dq8
					  6 valid_from_dt_tm_ind = i2
					  6 valid_until_dt_tm = dq8
					  6 valid_until_dt_tm_ind = i2
					  6 updt_dt_tm = dq8
					  6 updt_dt_tm_ind = i2
					  6 updt_task = i4
					  6 updt_task_ind = i2
					  6 updt_id = f8
					  6 updt_cnt = i4
					  6 updt_cnt_ind = i2
					  6 updt_applctx = i4
					  6 updt_applctx_ind = i2
					  6 group_sequence = i4
					  6 item_sequence = i4
					5 suscep_footnote_r_list [*]
					  6 event_id = f8
					  6 valid_from_dt_tm = dq8
					  6 valid_from_dt_tm_ind = i2
					  6 valid_until_dt_tm = dq8
					  6 valid_until_dt_tm_ind = i2
					  6 micro_seq_nbr = i4
					  6 micro_seq_nbr_ind = i2
					  6 suscep_seq_nbr = i4
					  6 suscep_seq_nbr_ind = i2
					  6 suscep_footnote_id = f8
					  6 updt_dt_tm = dq8
					  6 updt_dt_tm_ind = i2
					  6 updt_id = f8
					  6 updt_task = i4
					  6 updt_task_ind = i2
					  6 updt_cnt = i4
					  6 updt_cnt_ind = i2
					  6 updt_applctx = i4
					  6 updt_applctx_ind = i2
					  6 suscep_footnote [*]
						7 event_id = f8
						7 valid_from_dt_tm = dq8
						7 valid_from_dt_tm_ind = i2
						7 valid_until_dt_tm = dq8
						7 valid_until_dt_tm_ind = i2
						7 ce_suscep_footnote_id = f8
						7 suscep_footnote_id = f8
						7 checksum = i4
						7 checksum_ind = i2
						7 compression_cd = f8
						7 format_cd = f8
						7 contributor_system_cd = f8
						7 blob_length = i4
						7 blob_length_ind = i2
						7 reference_nbr = vc
						7 long_blob = gvc
						7 updt_dt_tm = dq8
						7 updt_dt_tm_ind = i2
						7 updt_id = f8
						7 updt_task = i4
						7 updt_task_ind = i2
						7 updt_cnt = i4
						7 updt_cnt_ind = i2
						7 updt_applctx = i4
						7 updt_applctx_ind = i2
					5 inventory_result_list [*]
					  6 item_id = f8
					  6 serial_nbr = vc
					  6 serial_mnemonic = vc
					  6 description = vc
					  6 item_nbr = vc
					  6 quantity = f8
					  6 quantity_ind = i2
					  6 body_site = vc
					  6 reference_entity_id = f8
					  6 reference_entity_name = vc
					  6 implant_result [*]
						7 item_id = f8
						7 item_size = vc
						7 harvest_site = vc
						7 culture_ind = i2
						7 culture_ind_ind = i2
						7 tissue_graft_type_cd = f8
						7 tissue_graft_type_cd_disp = vc
						7 explant_reason_cd = f8
						7 explant_reason_cd_disp = vc
						7 explant_disposition_cd = f8
						7 explant_disposition_cd_disp = vc
						7 reference_entity_id = f8
						7 reference_entity_name = vc
						7 manufacturer_cd = f8
						7 manufacturer_cd_disp = vc
						7 manufacturer_ft = vc
						7 model_nbr = vc
						7 lot_nbr = vc
						7 other_identifier = vc
						7 expiration_dt_tm = dq8
						7 expiration_dt_tm_ind = i2
						7 ecri_code = vc
						7 batch_nbr = vc
						7 event_id = f8
						7 valid_from_dt_tm = dq8
						7 valid_from_dt_tm_ind = i2
						7 valid_until_dt_tm = dq8
						7 valid_until_dt_tm_ind = i2
						7 updt_dt_tm = dq8
						7 updt_dt_tm_ind = i2
						7 updt_task = i4
						7 updt_task_ind = i2
						7 updt_id = f8
						7 updt_cnt = i4
						7 updt_cnt_ind = i2
						7 updt_applctx = i4
						7 updt_applctx_ind = i2
					  6 inv_time_result_list [*]
						7 item_id = f8
						7 start_dt_tm = dq8
						7 start_dt_tm_ind = i2
						7 end_dt_tm = dq8
						7 end_dt_tm_ind = i2
						7 event_id = f8
						7 valid_from_dt_tm = dq8
						7 valid_from_dt_tm_ind = i2
						7 valid_until_dt_tm = dq8
						7 valid_until_dt_tm_ind = i2
						7 updt_dt_tm = dq8
						7 updt_dt_tm_ind = i2
						7 updt_task = i4
						7 updt_task_ind = i2
						7 updt_id = f8
						7 updt_cnt = i4
						7 updt_cnt_ind = i2
						7 updt_applctx = i4
						7 updt_applctx_ind = i2
					  6 event_id = f8
					  6 valid_from_dt_tm = dq8
					  6 valid_from_dt_tm_ind = i2
					  6 valid_until_dt_tm = dq8
					  6 valid_until_dt_tm_ind = i2
					  6 updt_dt_tm = dq8
					  6 updt_dt_tm_ind = i2
					  6 updt_task = i4
					  6 updt_task_ind = i2
					  6 updt_id = f8
					  6 updt_cnt = i4
					  6 updt_cnt_ind = i2
					  6 updt_applctx = i4
					  6 updt_applctx_ind = i2
					5 child_event_list [*]
					5 hla_list [*]
					5 order_action_sequence = i4
					5 entry_mode_cd = f8
					5 source_cd = f8
					5 source_cd_disp = vc
					5 source_cd_mean = vc
					5 clinical_seq = vc
					5 event_start_tz = i4
					5 event_end_tz = i4
					5 verified_tz = i4
					5 performed_tz = i4
					5 calculation_result_list [*]
					  6 event_id = f8
					  6 equation = vc
					  6 calculation_result = vc
					  6 calculation_result_frmt_cd = f8
					  6 calculation_result_frmt_cd_disp = vc
					  6 last_norm_dt_tm = dq8
					  6 last_norm_dt_tm_ind = i2
					  6 unit_of_measure_cd = f8
					  6 unit_of_measure_cd_disp = vc
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
					  6 contributor_link_list [*]
						7 event_id = f8
						7 contributor_event_id = f8
						7 ce_valid_from_dt_tm = dq8
						7 type_flag = i2
						7 valid_from_dt_tm = dq8
						7 valid_from_dt_tm_ind = i2
						7 valid_until_dt_tm = dq8
						7 valid_until_dt_tm_ind = i2
						7 updt_dt_tm = dq8
						7 updt_dt_tm_ind = i2
						7 updt_id = f8
						7 updt_task = i4
						7 updt_task_ind = i2
						7 updt_cnt = i4
						7 updt_cnt_ind = i2
						7 updt_applctx = i4
						7 updt_applctx_ind = i2
						7 ce_valid_until_dt_tm = dq8
						7 ce_result_value = vc
						7 ce_performed_prsnl_id = f8
						7 ce_event_end_dt_tm = dq8
						7 ce_event_cd = f8
						7 ce_event_cd_disp = vc
						7 ce_clinical_event_id = f8
						7 ce_event_class_cd = f8
						7 ce_event_class_cd_disp = vc
						7 string_result_list [*]
						  8 event_id = f8
						  8 valid_from_dt_tm = dq8
						  8 valid_from_dt_tm_ind = i2
						  8 valid_until_dt_tm = dq8
						  8 valid_until_dt_tm_ind = i2
						  8 string_result_text = vc
						  8 string_result_format_cd = f8
						  8 string_result_format_cd_disp = vc
						  8 equation_id = f8
						  8 last_norm_dt_tm = dq8
						  8 last_norm_dt_tm_ind = i2
						  8 unit_of_measure_cd = f8
						  8 unit_of_measure_cd_disp = vc
						  8 feasible_ind = i2
						  8 feasible_ind_ind = i2
						  8 inaccurate_ind = i2
						  8 inaccurate_ind_ind = i2
						  8 updt_dt_tm = dq8
						  8 updt_dt_tm_ind = i2
						  8 updt_id = f8
						  8 updt_task = i4
						  8 updt_task_ind = i2
						  8 updt_cnt = i4
						  8 updt_cnt_ind = i2
						  8 updt_applctx = i4
						  8 updt_applctx_ind = i2
						  8 interp_comp_list [*]
							9 event_id = f8
							9 comp_idx = i4
							9 comp_idx_ind = i2
							9 valid_from_dt_tm = dq8
							9 valid_from_dt_tm_ind = i2
							9 valid_until_dt_tm = dq8
							9 valid_until_dt_tm_ind = i2
							9 comp_event_id = f8
							9 updt_dt_tm = dq8
							9 updt_dt_tm_ind = i2
							9 updt_id = f8
							9 updt_task = i4
							9 updt_task_ind = i2
							9 updt_cnt = i4
							9 updt_cnt_ind = i2
							9 updt_applctx = i4
							9 updt_applctx_ind = i2
							9 comp_name = vc
						  8 calculation_equation = vc
						  8 string_long_text_id = f8
						7 coded_result_list [*]
						  8 event_id = f8
						  8 sequence_nbr = i4
						  8 sequence_nbr_ind = i2
						  8 valid_from_dt_tm = dq8
						  8 valid_from_dt_tm_ind = i2
						  8 valid_until_dt_tm = dq8
						  8 valid_until_dt_tm_ind = i2
						  8 nomenclature_id = f8
						  8 result_set = i4
						  8 result_set_ind = i2
						  8 result_cd = f8
						  8 result_cd_disp = vc
						  8 acr_code_str = vc
						  8 proc_code_str = vc
						  8 pathology_str = vc
						  8 group_nbr = i4
						  8 group_nbr_ind = i2
						  8 mnemonic = vc
						  8 short_string = vc
						  8 descriptor = vc
						  8 updt_dt_tm = dq8
						  8 updt_dt_tm_ind = i2
						  8 updt_id = f8
						  8 updt_task = i4
						  8 updt_task_ind = i2
						  8 updt_cnt = i4
						  8 updt_cnt_ind = i2
						  8 updt_applctx = i4
						  8 updt_applctx_ind = i2
						  8 unit_of_measure_cd = f8
						  8 source_string = vc
						7 date_result_list [*]
						  8 event_id = f8
						  8 valid_until_dt_tm = dq8
						  8 valid_until_dt_tm_ind = i2
						  8 valid_from_dt_tm = dq8
						  8 valid_from_dt_tm_ind = i2
						  8 result_dt_tm = dq8
						  8 result_dt_tm_ind = i2
						  8 result_dt_tm_os = f8
						  8 result_dt_tm_os_ind = i2
						  8 date_type_flag = i2
						  8 date_type_flag_ind = i2
						  8 updt_dt_tm = dq8
						  8 updt_dt_tm_ind = i2
						  8 updt_id = f8
						  8 updt_task = i4
						  8 updt_task_ind = i2
						  8 updt_cnt = i4
						  8 updt_cnt_ind = i2
						  8 updt_applctx = i4
						  8 updt_applctx_ind = i2
						  8 result_tz = i4
						  8 result_tz_ind = i2
						7 ce_result_status_cd = f8
						7 ce_result_status_cd_disp = vc
						7 ce_event_end_tz = i4
					5 task_assay_version_nbr = f8
					5 modifier_long_text = vc
					5 modifier_long_text_id = f8
					5 result_set_link_list [*]
					  6 event_id = f8
					  6 result_set_id = f8
					  6 entry_type_cd = f8
					  6 entry_type_cd_disp = vc
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
					  6 relation_type_cd = f8
					5 event_order_link_list [*]
					  6 event_id = f8
					  6 order_id = f8
					  6 order_action_sequence = i4
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
					  6 template_order_id = f8
					  6 event_end_dt_tm = dq8
					  6 parent_order_ident = f8
					  6 person_id = f8
					  6 encntr_id = f8
					  6 catalog_type_cd = f8
					  6 ce_event_order_link_id = f8
					5 scd_modifier_list [*]
					  6 event_id = f8
					  6 concept_cki = vc
					  6 phrase = vc
					  6 display = vc
					  6 updt_dt_tm = dq8
					  6 updt_dt_tm_ind = i2
					  6 updt_id = f8
					  6 updt_task = i4
					  6 updt_task_ind = i2
					  6 updt_cnt = i4
					  6 updt_cnt_ind = i2
					  6 updt_applctx = i4
					  6 updt_applctx_ind = i2
					  6 valid_from_dt_tm = dq8
					5 endorse_ind = i2
					5 new_result_ind = i2
					5 organization_id = f8
					5 intake_output_result [*]
					  6 ce_io_result_id = f8
					  6 io_result_id = f8
					  6 event_id = f8
					  6 person_id = f8
					  6 encntr_id = f8
					  6 io_start_dt_tm = dq8
					  6 io_start_dt_tm_ind = i2
					  6 io_end_dt_tm = dq8
					  6 io_end_dt_tm_ind = i2
					  6 io_type_flag = i2
					  6 io_volume = f8
					  6 io_status_cd = f8
					  6 io_status_cd_disp = vc
					  6 io_status_cd_mean = vc
					  6 reference_event_id = f8
					  6 reference_event_cd = f8
					  6 reference_event_cd_disp = vc
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
					5 io_total_result_list [*]
					  6 ce_io_total_result_id = f8
					  6 io_total_definition_id = f8
					  6 event_id = f8
					  6 encntr_id = f8
					  6 encntr_focused_ind = i2
					  6 person_id = f8
					  6 io_total_start_dt_tm = dq8
					  6 io_total_end_dt_tm = dq8
					  6 io_total_value = f8
					  6 io_total_unit_cd = f8
					  6 io_total_unit_disp = vc
					  6 io_total_unit_mean = vc
					  6 suspect_flag = i2
					  6 last_io_result_clinsig_dt_tm = dq8
					  6 valid_from_dt_tm = dq8
					  6 valid_until_dt_tm = dq8
					  6 updt_dt_tm = dq8
					  6 updt_dt_tm_ind = i2
					  6 updt_id = f8
					  6 updt_task = i4
					  6 updt_task_ind = i2
					  6 updt_cnt = i4
					  6 updt_cnt_ind = i2
					  6 updt_applctx = i4
					  6 updt_applctx_ind = i2
					  6 contributor_link_list [*]
						7 event_id = f8
						7 contributor_event_id = f8
						7 ce_valid_from_dt_tm = dq8
						7 type_flag = i2
						7 valid_from_dt_tm = dq8
						7 valid_from_dt_tm_ind = i2
						7 valid_until_dt_tm = dq8
						7 valid_until_dt_tm_ind = i2
						7 updt_dt_tm = dq8
						7 updt_dt_tm_ind = i2
						7 updt_id = f8
						7 updt_task = i4
						7 updt_task_ind = i2
						7 updt_cnt = i4
						7 updt_cnt_ind = i2
						7 updt_applctx = i4
						7 updt_applctx_ind = i2
						7 ce_valid_until_dt_tm = dq8
						7 ce_result_value = vc
						7 ce_performed_prsnl_id = f8
						7 ce_event_end_dt_tm = dq8
						7 ce_event_cd = f8
						7 ce_event_cd_disp = vc
						7 ce_clinical_event_id = f8
						7 ce_event_class_cd = f8
						7 ce_event_class_cd_disp = vc
						7 string_result_list [*]
						  8 event_id = f8
						  8 valid_from_dt_tm = dq8
						  8 valid_from_dt_tm_ind = i2
						  8 valid_until_dt_tm = dq8
						  8 valid_until_dt_tm_ind = i2
						  8 string_result_text = vc
						  8 string_result_format_cd = f8
						  8 string_result_format_cd_disp = vc
						  8 equation_id = f8
						  8 last_norm_dt_tm = dq8
						  8 last_norm_dt_tm_ind = i2
						  8 unit_of_measure_cd = f8
						  8 unit_of_measure_cd_disp = vc
						  8 feasible_ind = i2
						  8 feasible_ind_ind = i2
						  8 inaccurate_ind = i2
						  8 inaccurate_ind_ind = i2
						  8 updt_dt_tm = dq8
						  8 updt_dt_tm_ind = i2
						  8 updt_id = f8
						  8 updt_task = i4
						  8 updt_task_ind = i2
						  8 updt_cnt = i4
						  8 updt_cnt_ind = i2
						  8 updt_applctx = i4
						  8 updt_applctx_ind = i2
						  8 interp_comp_list [*]
							9 event_id = f8
							9 comp_idx = i4
							9 comp_idx_ind = i2
							9 valid_from_dt_tm = dq8
							9 valid_from_dt_tm_ind = i2
							9 valid_until_dt_tm = dq8
							9 valid_until_dt_tm_ind = i2
							9 comp_event_id = f8
							9 updt_dt_tm = dq8
							9 updt_dt_tm_ind = i2
							9 updt_id = f8
							9 updt_task = i4
							9 updt_task_ind = i2
							9 updt_cnt = i4
							9 updt_cnt_ind = i2
							9 updt_applctx = i4
							9 updt_applctx_ind = i2
							9 comp_name = vc
						  8 calculation_equation = vc
						  8 string_long_text_id = f8
						7 coded_result_list [*]
						  8 event_id = f8
						  8 sequence_nbr = i4
						  8 sequence_nbr_ind = i2
						  8 valid_from_dt_tm = dq8
						  8 valid_from_dt_tm_ind = i2
						  8 valid_until_dt_tm = dq8
						  8 valid_until_dt_tm_ind = i2
						  8 nomenclature_id = f8
						  8 result_set = i4
						  8 result_set_ind = i2
						  8 result_cd = f8
						  8 result_cd_disp = vc
						  8 acr_code_str = vc
						  8 proc_code_str = vc
						  8 pathology_str = vc
						  8 group_nbr = i4
						  8 group_nbr_ind = i2
						  8 mnemonic = vc
						  8 short_string = vc
						  8 descriptor = vc
						  8 updt_dt_tm = dq8
						  8 updt_dt_tm_ind = i2
						  8 updt_id = f8
						  8 updt_task = i4
						  8 updt_task_ind = i2
						  8 updt_cnt = i4
						  8 updt_cnt_ind = i2
						  8 updt_applctx = i4
						  8 updt_applctx_ind = i2
						  8 unit_of_measure_cd = f8
						  8 source_string = vc
						7 date_result_list [*]
						  8 event_id = f8
						  8 valid_until_dt_tm = dq8
						  8 valid_until_dt_tm_ind = i2
						  8 valid_from_dt_tm = dq8
						  8 valid_from_dt_tm_ind = i2
						  8 result_dt_tm = dq8
						  8 result_dt_tm_ind = i2
						  8 result_dt_tm_os = f8
						  8 result_dt_tm_os_ind = i2
						  8 date_type_flag = i2
						  8 date_type_flag_ind = i2
						  8 updt_dt_tm = dq8
						  8 updt_dt_tm_ind = i2
						  8 updt_id = f8
						  8 updt_task = i4
						  8 updt_task_ind = i2
						  8 updt_cnt = i4
						  8 updt_cnt_ind = i2
						  8 updt_applctx = i4
						  8 updt_applctx_ind = i2
						  8 result_tz = i4
						  8 result_tz_ind = i2
						7 ce_result_status_cd = f8
						7 ce_result_status_cd_disp = vc
						7 ce_event_end_tz = i4
					  6 io_total_result_val = vc
					5 src_event_id = f8
					5 src_clinsig_updt_dt_tm = dq8
					5 nomen_string_flag = i2
					5 ce_dynamic_label_id = f8
					5 dynamic_label_list [*]
					  6 ce_dynamic_label_id = f8
					  6 label_name = vc
					  6 label_prsnl_id = f8
					  6 label_status_cd = f8
					  6 label_seq_nbr = i4
					  6 valid_from_dt_tm = dq8
					  6 label_comment = vc
					5 device_free_txt = vc
					5 trait_bit_map = i4
			4 hla_list [*]
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
			4 calculation_result_list [*]
			  5 event_id = f8
			  5 equation = vc
			  5 calculation_result = vc
			  5 calculation_result_frmt_cd = f8
			  5 calculation_result_frmt_cd_disp = vc
			  5 last_norm_dt_tm = dq8
			  5 last_norm_dt_tm_ind = i2
			  5 unit_of_measure_cd = f8
			  5 unit_of_measure_cd_disp = vc
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
			  5 contributor_link_list [*]
				6 event_id = f8
				6 contributor_event_id = f8
				6 ce_valid_from_dt_tm = dq8
				6 type_flag = i2
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
				6 ce_valid_until_dt_tm = dq8
				6 ce_result_value = vc
				6 ce_performed_prsnl_id = f8
				6 ce_event_end_dt_tm = dq8
				6 ce_event_cd = f8
				6 ce_event_cd_disp = vc
				6 ce_clinical_event_id = f8
				6 ce_event_class_cd = f8
				6 ce_event_class_cd_disp = vc
				6 string_result_list [*]
				  7 event_id = f8
				  7 valid_from_dt_tm = dq8
				  7 valid_from_dt_tm_ind = i2
				  7 valid_until_dt_tm = dq8
				  7 valid_until_dt_tm_ind = i2
				  7 string_result_text = vc
				  7 string_result_format_cd = f8
				  7 string_result_format_cd_disp = vc
				  7 equation_id = f8
				  7 last_norm_dt_tm = dq8
				  7 last_norm_dt_tm_ind = i2
				  7 unit_of_measure_cd = f8
				  7 unit_of_measure_cd_disp = vc
				  7 feasible_ind = i2
				  7 feasible_ind_ind = i2
				  7 inaccurate_ind = i2
				  7 inaccurate_ind_ind = i2
				  7 updt_dt_tm = dq8
				  7 updt_dt_tm_ind = i2
				  7 updt_id = f8
				  7 updt_task = i4
				  7 updt_task_ind = i2
				  7 updt_cnt = i4
				  7 updt_cnt_ind = i2
				  7 updt_applctx = i4
				  7 updt_applctx_ind = i2
				  7 interp_comp_list [*]
					8 event_id = f8
					8 comp_idx = i4
					8 comp_idx_ind = i2
					8 valid_from_dt_tm = dq8
					8 valid_from_dt_tm_ind = i2
					8 valid_until_dt_tm = dq8
					8 valid_until_dt_tm_ind = i2
					8 comp_event_id = f8
					8 updt_dt_tm = dq8
					8 updt_dt_tm_ind = i2
					8 updt_id = f8
					8 updt_task = i4
					8 updt_task_ind = i2
					8 updt_cnt = i4
					8 updt_cnt_ind = i2
					8 updt_applctx = i4
					8 updt_applctx_ind = i2
					8 comp_name = vc
				  7 calculation_equation = vc
				  7 string_long_text_id = f8
				6 coded_result_list [*]
				  7 event_id = f8
				  7 sequence_nbr = i4
				  7 sequence_nbr_ind = i2
				  7 valid_from_dt_tm = dq8
				  7 valid_from_dt_tm_ind = i2
				  7 valid_until_dt_tm = dq8
				  7 valid_until_dt_tm_ind = i2
				  7 nomenclature_id = f8
				  7 result_set = i4
				  7 result_set_ind = i2
				  7 result_cd = f8
				  7 result_cd_disp = vc
				  7 acr_code_str = vc
				  7 proc_code_str = vc
				  7 pathology_str = vc
				  7 group_nbr = i4
				  7 group_nbr_ind = i2
				  7 mnemonic = vc
				  7 short_string = vc
				  7 descriptor = vc
				  7 updt_dt_tm = dq8
				  7 updt_dt_tm_ind = i2
				  7 updt_id = f8
				  7 updt_task = i4
				  7 updt_task_ind = i2
				  7 updt_cnt = i4
				  7 updt_cnt_ind = i2
				  7 updt_applctx = i4
				  7 updt_applctx_ind = i2
				  7 unit_of_measure_cd = f8
				  7 source_string = vc
				6 date_result_list [*]
				  7 event_id = f8
				  7 valid_until_dt_tm = dq8
				  7 valid_until_dt_tm_ind = i2
				  7 valid_from_dt_tm = dq8
				  7 valid_from_dt_tm_ind = i2
				  7 result_dt_tm = dq8
				  7 result_dt_tm_ind = i2
				  7 result_dt_tm_os = f8
				  7 result_dt_tm_os_ind = i2
				  7 date_type_flag = i2
				  7 date_type_flag_ind = i2
				  7 updt_dt_tm = dq8
				  7 updt_dt_tm_ind = i2
				  7 updt_id = f8
				  7 updt_task = i4
				  7 updt_task_ind = i2
				  7 updt_cnt = i4
				  7 updt_cnt_ind = i2
				  7 updt_applctx = i4
				  7 updt_applctx_ind = i2
				  7 result_tz = i4
				  7 result_tz_ind = i2
				6 ce_result_status_cd = f8
				6 ce_result_status_cd_disp = vc
				6 ce_event_end_tz = i4
			4 task_assay_version_nbr = f8
			4 modifier_long_text = vc
			4 modifier_long_text_id = f8
			4 result_set_link_list [*]
			  5 event_id = f8
			  5 result_set_id = f8
			  5 entry_type_cd = f8
			  5 entry_type_cd_disp = vc
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
			  5 relation_type_cd = f8
			4 event_order_link_list [*]
			  5 event_id = f8
			  5 order_id = f8
			  5 order_action_sequence = i4
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
			  5 template_order_id = f8
			  5 event_end_dt_tm = dq8
			  5 parent_order_ident = f8
			  5 person_id = f8
			  5 encntr_id = f8
			  5 catalog_type_cd = f8
			  5 ce_event_order_link_id = f8
			4 scd_modifier_list [*]
			  5 event_id = f8
			  5 concept_cki = vc
			  5 phrase = vc
			  5 display = vc
			  5 updt_dt_tm = dq8
			  5 updt_dt_tm_ind = i2
			  5 updt_id = f8
			  5 updt_task = i4
			  5 updt_task_ind = i2
			  5 updt_cnt = i4
			  5 updt_cnt_ind = i2
			  5 updt_applctx = i4
			  5 updt_applctx_ind = i2
			  5 valid_from_dt_tm = dq8
			4 endorse_ind = i2
			4 new_result_ind = i2
			4 organization_id = f8
			4 intake_output_result [*]
			  5 ce_io_result_id = f8
			  5 io_result_id = f8
			  5 event_id = f8
			  5 person_id = f8
			  5 encntr_id = f8
			  5 io_start_dt_tm = dq8
			  5 io_start_dt_tm_ind = i2
			  5 io_end_dt_tm = dq8
			  5 io_end_dt_tm_ind = i2
			  5 io_type_flag = i2
			  5 io_volume = f8
			  5 io_status_cd = f8
			  5 io_status_cd_disp = vc
			  5 io_status_cd_mean = vc
			  5 reference_event_id = f8
			  5 reference_event_cd = f8
			  5 reference_event_cd_disp = vc
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
			4 io_total_result_list [*]
			  5 ce_io_total_result_id = f8
			  5 io_total_definition_id = f8
			  5 event_id = f8
			  5 encntr_id = f8
			  5 encntr_focused_ind = i2
			  5 person_id = f8
			  5 io_total_start_dt_tm = dq8
			  5 io_total_end_dt_tm = dq8
			  5 io_total_value = f8
			  5 io_total_unit_cd = f8
			  5 io_total_unit_disp = vc
			  5 io_total_unit_mean = vc
			  5 suspect_flag = i2
			  5 last_io_result_clinsig_dt_tm = dq8
			  5 valid_from_dt_tm = dq8
			  5 valid_until_dt_tm = dq8
			  5 updt_dt_tm = dq8
			  5 updt_dt_tm_ind = i2
			  5 updt_id = f8
			  5 updt_task = i4
			  5 updt_task_ind = i2
			  5 updt_cnt = i4
			  5 updt_cnt_ind = i2
			  5 updt_applctx = i4
			  5 updt_applctx_ind = i2
			  5 contributor_link_list [*]
				6 event_id = f8
				6 contributor_event_id = f8
				6 ce_valid_from_dt_tm = dq8
				6 type_flag = i2
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
				6 ce_valid_until_dt_tm = dq8
				6 ce_result_value = vc
				6 ce_performed_prsnl_id = f8
				6 ce_event_end_dt_tm = dq8
				6 ce_event_cd = f8
				6 ce_event_cd_disp = vc
				6 ce_clinical_event_id = f8
				6 ce_event_class_cd = f8
				6 ce_event_class_cd_disp = vc
				6 string_result_list [*]
				  7 event_id = f8
				  7 valid_from_dt_tm = dq8
				  7 valid_from_dt_tm_ind = i2
				  7 valid_until_dt_tm = dq8
				  7 valid_until_dt_tm_ind = i2
				  7 string_result_text = vc
				  7 string_result_format_cd = f8
				  7 string_result_format_cd_disp = vc
				  7 equation_id = f8
				  7 last_norm_dt_tm = dq8
				  7 last_norm_dt_tm_ind = i2
				  7 unit_of_measure_cd = f8
				  7 unit_of_measure_cd_disp = vc
				  7 feasible_ind = i2
				  7 feasible_ind_ind = i2
				  7 inaccurate_ind = i2
				  7 inaccurate_ind_ind = i2
				  7 updt_dt_tm = dq8
				  7 updt_dt_tm_ind = i2
				  7 updt_id = f8
				  7 updt_task = i4
				  7 updt_task_ind = i2
				  7 updt_cnt = i4
				  7 updt_cnt_ind = i2
				  7 updt_applctx = i4
				  7 updt_applctx_ind = i2
				  7 interp_comp_list [*]
					8 event_id = f8
					8 comp_idx = i4
					8 comp_idx_ind = i2
					8 valid_from_dt_tm = dq8
					8 valid_from_dt_tm_ind = i2
					8 valid_until_dt_tm = dq8
					8 valid_until_dt_tm_ind = i2
					8 comp_event_id = f8
					8 updt_dt_tm = dq8
					8 updt_dt_tm_ind = i2
					8 updt_id = f8
					8 updt_task = i4
					8 updt_task_ind = i2
					8 updt_cnt = i4
					8 updt_cnt_ind = i2
					8 updt_applctx = i4
					8 updt_applctx_ind = i2
					8 comp_name = vc
				  7 calculation_equation = vc
				  7 string_long_text_id = f8
				6 coded_result_list [*]
				  7 event_id = f8
				  7 sequence_nbr = i4
				  7 sequence_nbr_ind = i2
				  7 valid_from_dt_tm = dq8
				  7 valid_from_dt_tm_ind = i2
				  7 valid_until_dt_tm = dq8
				  7 valid_until_dt_tm_ind = i2
				  7 nomenclature_id = f8
				  7 result_set = i4
				  7 result_set_ind = i2
				  7 result_cd = f8
				  7 result_cd_disp = vc
				  7 acr_code_str = vc
				  7 proc_code_str = vc
				  7 pathology_str = vc
				  7 group_nbr = i4
				  7 group_nbr_ind = i2
				  7 mnemonic = vc
				  7 short_string = vc
				  7 descriptor = vc
				  7 updt_dt_tm = dq8
				  7 updt_dt_tm_ind = i2
				  7 updt_id = f8
				  7 updt_task = i4
				  7 updt_task_ind = i2
				  7 updt_cnt = i4
				  7 updt_cnt_ind = i2
				  7 updt_applctx = i4
				  7 updt_applctx_ind = i2
				  7 unit_of_measure_cd = f8
				  7 source_string = vc
				6 date_result_list [*]
				  7 event_id = f8
				  7 valid_until_dt_tm = dq8
				  7 valid_until_dt_tm_ind = i2
				  7 valid_from_dt_tm = dq8
				  7 valid_from_dt_tm_ind = i2
				  7 result_dt_tm = dq8
				  7 result_dt_tm_ind = i2
				  7 result_dt_tm_os = f8
				  7 result_dt_tm_os_ind = i2
				  7 date_type_flag = i2
				  7 date_type_flag_ind = i2
				  7 updt_dt_tm = dq8
				  7 updt_dt_tm_ind = i2
				  7 updt_id = f8
				  7 updt_task = i4
				  7 updt_task_ind = i2
				  7 updt_cnt = i4
				  7 updt_cnt_ind = i2
				  7 updt_applctx = i4
				  7 updt_applctx_ind = i2
				  7 result_tz = i4
				  7 result_tz_ind = i2
				6 ce_result_status_cd = f8
				6 ce_result_status_cd_disp = vc
				6 ce_event_end_tz = i4
			  5 io_total_result_val = vc
			4 src_event_id = f8
			4 src_clinsig_updt_dt_tm = dq8
			4 nomen_string_flag = i2
			4 ce_dynamic_label_id = f8
			4 dynamic_label_list [*]
			  5 ce_dynamic_label_id = f8
			  5 label_name = vc
			  5 label_prsnl_id = f8
			  5 label_status_cd = f8
			  5 label_seq_nbr = i4
			  5 valid_from_dt_tm = dq8
			  5 label_comment = vc
			4 device_free_txt = vc
			4 trait_bit_map = i4
    3 hla_list [*]
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
      3 event_uuid = vc
    2 person_list [*]
      3 person_id = f8
      3 name_full_formatted = vc
      3 prsnl_name_full_formatted = vc
)
 
;Locations temp record
free record loc_req
record loc_req (
	1 codes[*]
		2 code_value					= f8
		2 fac_identifier				= vc
)
 
; Final Reply
free record pop_documents_reply_out
record pop_documents_reply_out (
	1 doc_cnt							= i4
	1 master_document[*]
		2 document_id 					= f8	;event_id
		2 parent_document_id			= f8
		2 clinical_event_id     		= f8	;unique PK
		2 encntr_id						= f8
		2 document_name 				= vc	;event_code display
		2 document_title				= vc	;TitleText
		2 document_ref_cd				= f8	;event_code
		2 cpt_code						= vc
		2 exam_accession				= vc	;accesssion_nbr
		2 exam_start_dt_tm				= dq8	;event_start_dt_tm
		2 exam_end_dt_tm				= dq8	;event_end_dt_tm
		2 document_dt_tm				= dq8	;event_end_dt_tm
		2 document_status_cd			= f8	;result status	;003
		2 document_status				= vc	;result status display
		2 document_format				= vc
		2 order_id						= f8
		2 ordering_provider
			3 provider_id               = f8
			3 provider_name             = vc
		2 catalog_cd					= f8
		2 catalog_cd_disp				= vc
		2 view_level					= i4
		2 active_ind					= i2	;record status = ACTIVE ?
		2 publish_flag					= i2	;published display
		2 document_author				= vc	;author of the document
		2 document_author_id 			= f8	;prsnl id of author
		2 created_updated_date_time 	= dq8	;ce.updt_dttm
		2 document_components[*]				;blob_results
			3 document_id				= f8	;event_id
			3 document_name 			= vc	;event_code display
			3 document_title			= vc	;TitleText
			3 document_ref_cd			= f8	;event_code
			3 document_dt_tm			= dq8	;event_end_dt_tm
			3 document_status_cd		= f8 	;result status 	;003
			3 document_status			= vc	;result status display
/*001*/		3 document_handle			= vc	;blob_handle or pointer to image/document outside Millennium
			3 view_level				= i4
			3 active_ind				= i2	;record status = ACTIVE ?
			3 publish_flag				= vc	;published display
			3 storage					= vc	;storage display
			3 format					= vc	;format display
			3 body						= vc	;body
			3 length					= i4	;length of body
		2 blob_check[*]							;014
			3 event_id 					= f8
			3 blob_length 				= i4
/*		2 document_notes[*]						;event_note_list
			3 note_id					= f8	;eventNoteId
			3 note_dt_tm				= dq8	;datetime
			3 note_type					= vc	;type display
			3 format					= vc	;format display
			3 body						= vc	;body
			3 length					= i4	;length of body */
		2 person
		  3 person_id 					= f8	;p.person_id
		  3 name_full_formatted 		= vc	;p.name_full_formatted
		  3 name_last 					= vc	;p.last_name
		  3 name_first 					= vc	;p.first_name
		  3 name_middle 				= vc	;p.middle_name
		  3 mrn							= vc    ;pa.alias
		  3 dob							= dq8 	;002
		  3 gender_id					= f8 	;002
		  3 gender_disp					= vc  	;002
		  3 sDOB						= c10 	;008
	  2 encounter
		  3 encounter_id 				= f8	;e.encntr_id
		  3 encounter_type_cd			= f8	;e.encntr_type_cd
		  3 encounter_type_disp			= vc	;encounter type display
		  3 encounter_type_class_cd		= f8	;encounter_type_class_cd
	      3 encounter_type_class_disp	= vc	;encounter type class display
 		  3 arrive_date					= dq8	;e.arrive_dt_tm
 		  3 discharge_date				= dq8	;e.discharge_dt_tm
 		  3 fin_nbr						= vc	;ea.alias
 		  3 patient_location
 		  	4  location_cd              = f8
  			4  location_disp            = vc
  			4  loc_bed_cd               = f8
  			4  loc_bed_disp             = vc
  			4  loc_building_cd          = f8
  			4  loc_building_disp        = vc
  			4  loc_facility_cd          = f8
  			4  loc_facility_disp        = vc
  			4  loc_nurse_unit_cd        = f8
 			4  loc_nurse_unit_disp      = vc
 			4  loc_room_cd              = f8
  			4  loc_room_disp            = vc
  			4  loc_temp_cd              = f8
  			4  loc_temp_disp            = vc
	1 audit
		2 user_id						= f8
		2 user_firstname				= vc
		2 user_lastname					= vc
		2 patient_id					= f8
		2 patient_firstname				= vc
		2 patient_lastname				= vc
		2 service_version				= vc
		2 query_execute_time			= vc
	    2 query_execute_units			= vc
  1 status_data									;006
    2 status 							= c1
    2 subeventstatus[1]
      3 OperationName 					= c25
      3 OperationStatus 				= c1
      3 TargetObjectName 				= c25
      3 TargetObjectValue 				= vc
      3 Code 							= c4
      3 Description 					= vc
)
 
;initialize status to FAIL
set pop_documents_reply_out->status_data->status = "F"
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common	;006
 
/**************************************************************
* DECLARE VARIABLES
**************************************************************/
set MODIFY MAXVARLEN 200000000			;010
 
;Input
declare sUserName						= vc with protect, noconstant("")  ;006
declare sFromDate						= vc with protect, noconstant("")
declare sToDate							= vc with protect, noconstant("")
declare sLocFacilities					= vc with protect, noconstant("")
declare iIncludeBody					= i2 with protect, noconstant(0)
declare iDebugFlag						= i2 with protect, noconstant(0)
declare iTimeMax						= i4 with protect, noconstant(0)
 
;Other
declare iTimeDiff						= i4 with protect, noconstant(0)
declare iObsSize						= i4 with protect, noconstant(0)
declare qFromDateTime					= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare qToDateTime						= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare ndx                     		= i4
declare ndx2                     		= i4
declare UTCmode							= i2 with protect, noconstant(0) 	;004
declare UTCpos 							= i2 with protect, noconstant(0) 	;004
declare iMaxRecs						= i4 with protect, constant(2000) 	;011
declare iIndex							= i4 with protect, noconstant(1)	;014
declare iTotalBlobSize 					= i4 with protect, noconstant(0)	;014
declare iMaxBlobSize 					= i4 with protect, noconstant(0)	;014
declare timeOutThreshold 				= i4 with protect, noconstant(115);setting to 115 seconds
declare queryStartTm 					= dq8
 
;Constants
declare c_mrn_encounter_alias_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",319,"MRN"))
declare c_fin_encntr_alias_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare c_rad_event_class_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",53,"RAD"))
declare c_blob_storage_cd				= f8 with protect, constant(uar_get_code_by("MEANING",25,"BLOB"))
declare c_nocomp_compression_cd    		= f8 with protect, constant(uar_get_code_by("MEANING", 120, "NOCOMP"))
declare c_ocfcomp_compression_cd   		= f8 with protect, constant(uar_get_code_by("MEANING", 120, "OCFCOMP"))
declare c_primary_mnemonic_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",6011,"PRIMARY"))
declare c_radiology_catalog_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",6000,"RADIOLOGY"))
declare c_radiology_activity_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",106,"RADIOLOGY"))
declare c_datetime_result_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",289,"11"))
declare c_billcode_bill_item_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",13019,"BILL CODE"))
declare c_order_action_cd 				= f8 with protect, constant(uar_get_code_by("MEANING",6003,"ORDER"))
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
;Input
set sUserName						= trim($USERNAME, 3)
set sFromDate						= trim($BEG_DATE, 3)
set sToDate							= trim($END_DATE, 3)
set sLocFacilities					= trim($LOC_LIST,3)
set iIncludeBody					= cnvtint($INC_BODY)
set iDebugFlag						= cnvtint($DEBUG_FLAG)
set iTimeMax						= cnvtint($TIME_MAX)
 
;Other
set UTCmode							= CURUTC 						;004
set UTCpos							= findstring("Z",sFromDate,1,0) ;004
set iMaxBlobSize					= cnvtreal($MAX_BLOB)
if(iMaxBlobSize = 0)
	set iMaxBlobSize = 7500000
endif
 
set qFromDateTime = GetDateTime(sFromDate)
set qToDateTime = GetDateTime(sToDate)
 
if(iDebugFlag > 0)
	call echo(build("sFromDate -> ",sFromDate))
	call echo(build("sToDate -> ",sToDate))
	call echo(build("sUserName -> ", sUserName))
	call echo(build("qFromDateTime -> ", qFromDateTime))
	call echo(build("qToDateTime -> ", qToDateTime))
	call echo(build("debug flag -> ", iDebugFlag))
	call echo(build("include body -> ", iIncludeBody))
	call echo(build("Time Maximum -> ", iTimeMax))
	call echo(build("Loc Facilities -> ",sLocFacilities))
	call echo(build("BLOB STORAGE CD:-> ",c_blob_storage_cd))
	call echo(build(" c_primary_mnemonic_type_cd: -> ", c_primary_mnemonic_type_cd))
	call echo(build("UTC MODE -->",UTCmode)) 	;004
 	call echo(build("UTC POS -->",UTCpos)) 		;004
	call echo(build("datediff-->", iTimeDiff))
	call echo(build("iMaxBlobSize-->", iMaxBlobSize))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ParseLocations(sLocFacilities = vc)				= null with protect
declare GetDocInfo(null)								= null with protect
declare GetDocument(null)								= null with protect
declare PostAmble(null)									= null with protect
declare GetCodingSystem(null)							= null with protect
declare GetCPTCode(null) 								= null with protect
declare GetOrderingProvider(null)                       = null with protect
 
/*************************************************************************
;MAIN
**************************************************************************/
; Validate username and populate audit
set iRet = PopulateAudit(sUserName, 0.0, pop_documents_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F","POP_RAD_DOCS","Invalid User for Audit.",
	"1001",build("User is invalid: ",sUserName),pop_documents_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate dates are not in the future005
if (qFromDateTime > qToDateTime)
	call ErrorHandler2("VALIDATE", "F", "POP_RAD_DOCS", "From Date Greater than To Date. Refine Dates Entered.",
	"2010", "From Date Greater than To Date. Refine Dates Entered.", pop_documents_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate timespan does not exceed threshold
set iRet = ThreshHoldValidator(iTimeMax,"s",qFromDateTime,qToDateTime)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "POP_RAD_DOCS", "Date Range Too Long. Refine Query.",
	"2011","Date Range Too Long. Refine Query.",pop_documents_reply_out) ;012
	go to EXIT_SCRIPT
endif
 
; Parse locations if provided
if(sLocFacilities > " ")
	call ParseLocations(sLocFacilities)
endif
 
; Get Document List
call GetDocInfo(null)
 
; Get Document Details
call GetDocument(null)
 
; Get CPT Code information and ordering provider
if(size(pop_documents_reply_out->master_document,5) > 0)
	call GetCPTCode(null)
	call GetOrderingProvider(null)
endif
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************
* Convert REC output to JSON
**************************************************************/
set JSONout = CNVTRECTOJSON(pop_documents_reply_out)
if(iDebugFlag > 0)
	call echorecord(pop_documents_reply_out)
	call echo(JSONout)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_pop_rad_docs.json")
	call echo(build2("_file : ", _file))
	call echojson(pop_documents_reply_out, _file, 0)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
 
/*************************************************************************
;  Name: ParseComponents(null)
;  Description: Subroutine to parse a comma delimited string
**************************************************************************/
subroutine ParseLocations(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParseLocations Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
 
	while (str != notfnd)
	 	set str =  piece(sLocFacilities,',',num,notfnd)
	 	if(str != notfnd)
	  		set stat = alterlist(loc_req->codes, num)
	 		set loc_req->codes[num]->code_value = cnvtint(str)
 
	 		 select into code_value
	 		 from code_value
			 where code_set = 220 and cdf_meaning = "FACILITY" and
			 loc_req->codes[num]->code_value = code_value              ;003
 
	 		if (curqual = 0)
	 			call ErrorHandler2("EXECUTE", "F", "POP_DOCUMENTS", build("Invalid Facility Code: ", loc_req->codes[num]->code_value),
				"2040", build("Invalid Facility Code: ",loc_req->codes[num]->code_value),pop_documents_reply_out) ;012
				set stat = alterlist(pop_documents_reply_out->master_document,0)
				go to Exit_Script
			endif  ;003
	 	endif
	  	set num = num + 1
	endwhile
 
	if(iDebugFlag > 0)
		call echo(concat("ParseLocations Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 6)), 3),
	    " seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetDocInfo
;  Description: Retrieve document ids/persons/encounters
**************************************************************************/
subroutine GetDocInfo(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetDocInfo Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;Set expand control value - 013
	set iLocFacCnt 	= size(loc_req->codes, 5)
	if(iLocFacCnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	; Populate temp record - performance improvement
	; Restrict list to iMaxRec records, but adjust if the limit is reached and there are others at the same second - 011
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select
		if(iLocFacCnt > 0)
			from clinical_event ce
				,encounter e
			plan ce where ce.updt_dt_tm >= cnvtdatetime(qFromDateTime)
				and ce.updt_dt_tm <= cnvtdatetime(qToDateTime)
				and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3) ;015
				and ce.view_level = 1
				and ce.event_class_cd = c_rad_event_class_cd
			join e where e.encntr_id = ce.encntr_id
				and expand(ndx2,1,iLocFacCnt,e.loc_facility_cd,loc_req->codes[ndx2].code_value)
			order by ce.updt_dt_tm
		else
			from clinical_event ce
			plan ce where ce.updt_dt_tm >= cnvtdatetime(qFromDateTime)
				and ce.updt_dt_tm <= cnvtdatetime(qToDateTime)
				and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3) ;015
				and ce.view_level = 1
				and ce.event_class_cd = c_rad_event_class_cd
			order by ce.updt_dt_tm, ce.event_id
		endif
	into "nl:"
	head report
		x = 0
		max_reached = 0
		stat = alterlist(pop_documents_reply_out->master_document,iMaxRecs)
	head ce.updt_dt_tm
		if(x > iMaxRecs)
			max_reached = 1
		endif
	head ce.event_id
		if(max_reached = 0)
			if(substring(1,2,ce.reference_nbr) != "AP")
				x = x + 1
				if(mod(x,100) = 1 and x > iMaxRecs)
					stat = alterlist(pop_documents_reply_out->master_document,x + 99)
				endif
 
				pop_documents_reply_out->master_document[x]->document_id = ce.event_id
				pop_documents_reply_out->master_document[x]->parent_document_id = ce.parent_event_id
				pop_documents_reply_out->master_document[x]->person->person_id = ce.person_id
				pop_documents_reply_out->master_document[x]->encounter->encounter_id = ce.encntr_id
				pop_documents_reply_out->master_document[x].encntr_id = ce.encntr_id
				if(ce.updt_dt_tm > pop_documents_reply_out->master_document[x]->created_updated_date_time)
					pop_documents_reply_out->master_document[x]->created_updated_date_time = ce.updt_dt_tm
					pop_documents_reply_out->master_document[x]->clinical_event_id = ce.clinical_event_id
		 		endif
			endif
		endif
	foot report
		stat = alterlist(pop_documents_reply_out->master_document,x)
		pop_documents_reply_out->doc_cnt = x
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag)
 		call echo(build("------Qual Cnt = ",pop_documents_reply_out->doc_cnt))
 	endif
 
	; Populate audit
	if(pop_documents_reply_out->doc_cnt > 0)
		call ErrorHandler("EXECUTE", "S", "POP_DOCUMENTS", "Success", pop_documents_reply_out);007
	else
		call ErrorHandler("EXECUTE", "Z", "POP_DOCUMENTS", "No records qualify.", pop_documents_reply_out);007
		go to exit_script
	endif
 
 
	;Set expand control value - 013
	set idx = 1
	if(pop_documents_reply_out->doc_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	; Person
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
 	select into "nl:"
 	from person p
	plan p where expand(idx,1,pop_documents_reply_out->doc_cnt,p.person_id,
		pop_documents_reply_out->master_document[idx].person.person_id)
	detail
		next = 1
		pos = locateval(idx,next,pop_documents_reply_out->doc_cnt,p.person_id,
		pop_documents_reply_out->master_document[idx].person.person_id)
 
		while(pos > 0 and next <= pop_documents_reply_out->doc_cnt)
			pop_documents_reply_out->master_document[pos]->person->name_full_formatted = p.name_full_formatted
			pop_documents_reply_out->master_document[pos]->person->name_first = p.name_first
			pop_documents_reply_out->master_document[pos]->person->name_last = p.name_last
			pop_documents_reply_out->master_document[pos]->person->name_middle = p.name_middle
			pop_documents_reply_out->master_document[pos]->person->dob = p.birth_dt_tm ;002
			pop_documents_reply_out->master_document[pos]->person->gender_id = p.sex_cd ;002
			pop_documents_reply_out->master_document[pos]->person->gender_disp = uar_get_code_display(p.sex_cd);002
			pop_documents_reply_out->master_document[pos]->person->sDOB =
			datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef)
 
			next = pos + 1
			pos = locateval(idx,next,pop_documents_reply_out->doc_cnt,p.person_id,
			pop_documents_reply_out->master_document[idx].person.person_id)
 		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
 	; Encounter Data
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
 	select into "nl:"
 	from encounter e
		,encntr_alias ea
		,encntr_alias ea2
	plan e where expand(idx,1,pop_documents_reply_out->doc_cnt,e.encntr_id,
		pop_documents_reply_out->master_document[idx].encounter.encounter_id)
	join ea where ea.encntr_id = outerjoin(e.encntr_id)
		and ea.encntr_alias_type_cd = outerjoin(c_fin_encntr_alias_type_cd)
		and ea.active_ind = outerjoin(1)
		and ea.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and ea.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	join ea2 where ea2.encntr_id = outerjoin(e.encntr_id)
		and ea2.encntr_alias_type_cd = outerjoin(c_mrn_encounter_alias_type_cd)
		and ea2.active_ind = outerjoin(1)
		and ea2.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and ea2.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	detail
		next = 1
		pos = locateval(idx,next,pop_documents_reply_out->doc_cnt,e.encntr_id,
		pop_documents_reply_out->master_document[idx].encounter.encounter_id)
 
 		while(pos > 0 and next <= pop_documents_reply_out->doc_cnt)
			;MRN
			pop_documents_reply_out->master_document[pos]->person->mrn = ea2.alias
 
			;Encounter Data
			pop_documents_reply_out->master_document[pos]->encounter->encounter_id = e.encntr_id
			pop_documents_reply_out->master_document[pos]->encounter->encounter_type_cd = e.encntr_type_cd
			pop_documents_reply_out->master_document[pos]->encounter->encounter_type_disp =
				uar_get_code_display(e.encntr_type_cd)
			pop_documents_reply_out->master_document[pos]->encounter->encounter_type_class_cd = e.encntr_type_class_cd
			pop_documents_reply_out->master_document[pos]->encounter->encounter_type_class_disp =
				uar_get_code_display(e.encntr_type_class_cd)
			pop_documents_reply_out->master_document[pos]->encounter->arrive_date = e.arrive_dt_tm
			if (e.arrive_dt_tm is null)
				pop_documents_reply_out->master_document[pos]->encounter->arrive_date = e.reg_dt_tm
			endif
			pop_documents_reply_out->master_document[pos]->encounter->discharge_date = e.disch_dt_tm
			pop_documents_reply_out->master_document[pos]->encounter->fin_nbr = ea.alias
 
			;Patient Location Data
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->location_cd = e.location_cd
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->location_disp =
				uar_get_code_display(e.location_cd)
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_bed_cd = e.loc_bed_cd
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_bed_disp =
				uar_get_code_display(e.loc_bed_cd)
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_building_cd = e.loc_building_cd
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_building_disp =
				uar_get_code_display(e.loc_building_cd)
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_facility_cd = e.loc_facility_cd
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_facility_disp =
				uar_get_code_display(e.loc_facility_cd)
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_nurse_unit_cd = e.loc_nurse_unit_cd
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_nurse_unit_disp =
				uar_get_code_display(e.loc_nurse_unit_cd)
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_room_cd = e.loc_room_cd
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_room_disp =
				uar_get_code_display(e.loc_room_cd)
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_temp_cd = e.loc_temp_cd
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_temp_disp =
				uar_get_code_display(e.loc_temp_cd)
 
			next = pos + 1
			pos = locateval(idx,next,pop_documents_reply_out->doc_cnt,e.encntr_id,
			pop_documents_reply_out->master_document[idx].encounter.encounter_id)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	;Get blob sizes for all event and child events - 014
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from  clinical_event ce
		, clinical_event ce2
		, ce_linked_result clr
		, ce_blob_result cbr
		, ce_blob cb
	plan ce where expand(idx,1,pop_documents_reply_out->doc_cnt,ce.event_id,
		pop_documents_reply_out->master_document[idx].document_id)
	join clr where clr.event_id = ce.event_id
	join ce2 where (ce2.event_id = ce.event_id
			or ce2.parent_event_id = ce.event_id
			or ce2.event_id = clr.linked_event_id
			or ce2.parent_event_id = clr.linked_event_id)
			and ce2.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
	join cbr where cbr.event_id = ce2.event_id
		and cbr.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
	join cb where cb.event_id = outerjoin(cbr.event_id)
		and cb.blob_seq_num = outerjoin(cbr.max_sequence_nbr)
		and cb.valid_until_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	order by ce.event_id, cbr.event_id
	head ce.event_id
		x = 0
	head cbr.event_id
		next = 1
		pos = locateval(idx,next,pop_documents_reply_out->doc_cnt,ce.event_id,
		pop_documents_reply_out->master_document[idx].document_id)
 
		if(cb.event_id > 0)
			x = x + 1
			while(pos > 0 and next <= pop_documents_reply_out->doc_cnt)
				stat = alterlist(pop_documents_reply_out->master_document[pos].blob_check,x)
				pop_documents_reply_out->master_document[pos].blob_check[x].event_id= cb.event_id
				pop_documents_reply_out->master_document[pos].blob_check[x].blob_length = cb.blob_length
 
				next = pos + 1
				pos = locateval(idx,next,pop_documents_reply_out->doc_cnt,ce.event_id,
				pop_documents_reply_out->master_document[idx].document_id)
			endwhile
		endif
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetDocInfo Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 6)), 3),
	    " seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetDocument(null)
;  Description: Retrieve document information by document ID
**************************************************************************/
subroutine GetDocument(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetDocument Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;Setup request - Chunk up 100079 request if total blob size gets too large - 015
	set iTotalBlobSize = 0
	set documentCnt = pop_documents_reply_out->doc_cnt
	set c = 0
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	for(a = iIndex to documentCnt)
		if(iTotalBlobSize < iMaxBlobSize)
			if(size(pop_documents_reply_out->master_document[a].blob_check,5) > 0)
				for(b = 1 to size(pop_documents_reply_out->master_document[a].blob_check,5))
					set iTotalBlobSize = iTotalBlobSize + pop_documents_reply_out->master_document[a].blob_check[b].blob_length
				endfor
			endif
		endif
 
		if(iTotalBlobSize < iMaxBlobSize)
			set iIndex = a
			set c = c + 1
			set stat = alterlist(1000079_req->req_list,c)
 
			set 1000079_req->req_list[c].event_id = pop_documents_reply_out->master_document[a].document_id
			set 1000079_req->req_list[c]->query_mode = 269615107 ;value hard-coded to match PowerChart
			set 1000079_req->req_list[c]->query_mode_ind = 0
			set 1000079_req->req_list[c]->contributor_system_cd = 0
			set 1000079_req->req_list[c]->subtable_bit_map = 0
			set 1000079_req->req_list[c]->subtable_bit_map_ind = 1
			set 1000079_req->req_list[c]->valid_from_dt_tm = cnvtdatetime("0000-00-00 00:00:00.00")
			set 1000079_req->req_list[c]->valid_from_dt_tm_ind = 1
			set 1000079_req->req_list[c]->decode_flag = 0
			set 1000079_req->req_list[c]->ordering_provider_id = 0
			set 1000079_req->req_list[c]->action_prsnl_id = 0
			set 1000079_req->req_list[c]->src_event_id_ind = 0
			set 1000079_req->req_list[c]->action_prsnl_group_id = 0
		endif
 	endfor
 
 	;Execute request
	set stat = tdbexecute(600005, 600107, 1000079,"REC",1000079_req,"REC",1000079_rep)
 
 	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
	;Iterate through reply
	set docCnt = size(1000079_rep->rep_list,5)
	if (docCnt > 0)
		set queryStartTm = cnvtdatetime(curdate, curtime3)
 		select into "nl:"
 		from (dummyt d with seq = docCnt) ; 1000079_rep
 		, (dummyt d1 with seq = documentCnt) ;pop_docs_reply
 		, prsnl p
 		plan d
 		join d1 where pop_documents_reply_out->master_document[d1.seq].document_id =
 				 1000079_rep->rep_list[d.seq].rb_list[1].event_id
 		join p where p.person_id = 1000079_rep->rep_list[d.seq].rb_list[1].performed_prsnl_id
 		head d1.seq
 			compCnt = 0
 		detail
			pop_documents_reply_out->master_document[d1.seq]->document_name = 1000079_rep->rep_list[d.seq].rb_list[1]->event_cd_disp
			pop_documents_reply_out->master_document[d1.seq]->document_title = 1000079_rep->rep_list[d.seq].rb_list[1]->event_title_text
			pop_documents_reply_out->master_document[d1.seq]->document_ref_cd = 1000079_rep->rep_list[d.seq].rb_list[1]->event_cd
			pop_documents_reply_out->master_document[d1.seq]->exam_accession = 1000079_rep->rep_list[d.seq].rb_list[1]->accession_nbr
			pop_documents_reply_out->master_document[d1.seq]->exam_start_dt_tm = 1000079_rep->rep_list[d.seq].rb_list[1]->event_start_dt_tm
			pop_documents_reply_out->master_document[d1.seq]->exam_end_dt_tm= 1000079_rep->rep_list[d.seq].rb_list[1]->event_end_dt_tm
			pop_documents_reply_out->master_document[d1.seq]->document_dt_tm =
				1000079_rep->rep_list[d.seq].rb_list[1]->clinsig_updt_dt_tm   ;012
			pop_documents_reply_out->master_document[d1.seq]->document_status_cd =
				1000079_rep->rep_list[d.seq].rb_list[1]->result_status_cd	;003
			pop_documents_reply_out->master_document[d1.seq]->document_status =
				1000079_rep->rep_list[d.seq].rb_list[1]->result_status_cd_disp
			pop_documents_reply_out->master_document[d1.seq]->encntr_id = 1000079_rep->rep_list[d.seq].rb_list[1]->encntr_id
			pop_documents_reply_out->master_document[d1.seq]->order_id = 1000079_rep->rep_list[d.seq].rb_list[1]->order_id
			pop_documents_reply_out->master_document[d1.seq]->catalog_cd = 1000079_rep->rep_list[d.seq].rb_list[1]->catalog_cd
			pop_documents_reply_out->master_document[d1.seq]->catalog_cd_disp = 1000079_rep->rep_list[d.seq].rb_list[1]->catalog_cd_disp
			pop_documents_reply_out->master_document[d1.seq]->view_level = 1000079_rep->rep_list[d.seq].rb_list[1]->view_level
			pop_documents_reply_out->master_document[d1.seq]->publish_flag = 1000079_rep->rep_list[d.seq].rb_list[1]->publish_flag
 			pop_documents_reply_out->master_document[d1.seq]->document_author_id =
 				1000079_rep->rep_list[d.seq].rb_list[1].performed_prsnl_id
 			pop_documents_reply_out->master_document[d1.seq]->document_author = p.name_full_formatted
			if (1000079_rep->rep_list[d.seq].rb_list[1]->record_status_cd_disp = "Active")
				pop_documents_reply_out->master_document[d1.seq].active_ind = 1
			else
				pop_documents_reply_out->master_document[d1.seq].active_ind = 0
			endif
 
		    ; Loop through child_event_list 003 +
     	   	RadRepCnt = size(1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list,5)
 
			if(iDebugFlag > 0)
				call echo(build("RadRepCnt--->", RadRepCnt))
			endif
			if(RadRepCnt > 0)
				for (v = 1 to RadRepCnt)
					if(size(1000079_rep->rep_list[d.seq].rb_list[1].child_event_list[v].blob_result, 5) > 0)
						compCnt = compCnt + 1
						stat = alterlist(pop_documents_reply_out->master_document[d1.seq].document_components,compCnt)
 
		 				if (1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->blob_result[1].event_id > 0 )
		 					pop_documents_reply_out->master_document[d1.seq]->document_format =
		 					1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v].blob_result[1].format_cd_disp
							pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].document_id =
								1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->blob_result[1].event_id
							pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].document_name =
								1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->event_cd_disp
							pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].document_title =
								1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->event_title_text
							pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].document_ref_cd =
								1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->event_cd
							pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].document_dt_tm =
								1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->valid_from_dt_tm
							pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].document_status_cd =
								1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->blob_result[1].succession_type_cd	;003
							pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].document_status =
								1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->blob_result[1].succession_type_cd_disp
							pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].view_level = 1
							pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].active_ind = 1
							pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].publish_flag = "PUBLISH"
							pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].storage =
								1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->blob_result[1].storage_cd_disp
							pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].format =
								1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->blob_result[1].format_cd_disp
 
							if(size(1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->blob_result[1]->blob, 5) > 0)
								;Include Body if requested
								if(iIncludeBody)
									pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].body =
									1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->blob_result[1]->blob[1].blob_contents
								endif
 
								pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].length =
								size(1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->blob_result[1]->blob[1].blob_contents)
							else
								pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].document_handle =
								1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->blob_result[1]->blob_handle
							endif
						endif
					endif
 
		   		; Loop through child_event->child_event
			    	rbRadDocCnt = size(1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->child_event_list, 5)
					if(iDebugFlag > 0)
						call echo(build("rbRadDocCnt--->", rbRadDocCnt))
					endif
					if(rbRadDocCnt > 0 )
			    		for (k = 1 to rbRadDocCnt)
					    	rbRadChildCnt = size(1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->child_event_list[k]->blob_result,5)
							if(iDebugFlag > 0)
								call echo(build("rbRadChildCnt--->", rbRadChildCnt))
							endif
 
							if(rbRadChildCnt > 0)
								for (y = 1 to rbRadChildCnt)
									compCnt = compCnt + 1
									stat = alterlist(pop_documents_reply_out->master_document[d1.seq].document_components,compCnt)
 
	 				 				if(1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->child_event_list[k]->blob_result[y].event_id > 0)
					 					pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].document_id =
											1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->child_event_list[k]->blob_result[y].event_id
										pop_documents_reply_out->master_document[d1.seq]->document_format =
										1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->child_event_list[k]->blob_result[y].format_cd_disp
										pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].document_name =
											1000079_rep->rep_list[d.seq].rb_list[1].event_cd_disp
										pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].document_title =
											1000079_rep->rep_list[d.seq].rb_list[1].event_title_text
										pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].document_ref_cd =
											1000079_rep->rep_list[d.seq].rb_list[1].event_cd
										pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].document_dt_tm =
											1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->child_event_list[k]->blob_result[y].valid_from_dt_tm
										pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].document_status_cd =
											1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->child_event_list[k]->blob_result[y].succession_type_cd	;003
										pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].document_status =
											1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->child_event_list[k]->blob_result[y].succession_type_cd_disp
										pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].view_level = 1
										pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].active_ind = 1
										pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].publish_flag = "PUBLISH"
										pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].storage =
											1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->child_event_list[k]->blob_result[y].storage_cd_disp
										pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].format =
											1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->child_event_list[k]->blob_result[y].format_cd_disp
										;/*001*/ set pop_documents_reply_out->master_document->document_components[compCnt].document_handle =
										;1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->child_event_list[k]->blob_result[y].blob_handle
 
					 					if(1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->child_event_list[k]->blob_result[y].storage_cd =
					 					c_blob_storage_cd)
											if(size(1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->child_event_list[k]->blob_result[y].blob, 5) > 0)
												;Include Body if requested
												if(iIncludeBody)
													pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].body =
													1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->child_event_list[k]->blob_result[y].blob[1].blob_contents
												endif
 
												pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].length =
												size(1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->child_event_list[k]->blob_result[y].blob[1]\
												.blob_contents)
											else
												pop_documents_reply_out->master_document[d1.seq]->document_components[compCnt].document_handle =
												1000079_rep->rep_list[d.seq].rb_list[1]->child_event_list[v]->child_event_list[k]->blob_result[y].blob_handle
											endif ; blob
										endif ; blobStorageCd
									endif
								endfor
							endif
						endfor
					endif
				endfor ; for with child v
			endif
		with nocounter, time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
		; Call GetDocumentDetail again if needed - 015
	 	if(iIndex != documentCnt)
 			set stat = initrec(1000079_req)
 			set stat = initrec(1000079_rep)
 			set iIndex = iIndex + 1
 			call GetDocumentDetail(null)
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetDocument Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 6)), 3),
		" seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetCPTCode(null)
;  Description: Subroutine to retrieve CPT code
**************************************************************************/
subroutine GetCPTCode(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetCPTCode Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set idx = 1
 	set doc_cnt = size(pop_documents_reply_out->master_document,5)
 	if(doc_cnt > 200)
 		set exp = 2
 	else
 		set exp = 0
 	endif
 
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from order_catalog_synonym   ocs
	, order_catalog   oc
	, profile_task_r   ptr
	, discrete_task_assay   dta
	, bill_item   bi
	, bill_item_modifier   bim
	plan ocs where expand(idx,1,doc_cnt,ocs.catalog_cd,pop_documents_reply_out->master_document[idx]->catalog_cd)
		and ocs.mnemonic_type_cd = c_primary_mnemonic_type_cd
	join oc where ocs.catalog_cd = oc.catalog_cd
		and oc.catalog_type_cd =  c_radiology_catalog_type_cd
		and oc.activity_type_cd = c_radiology_activity_type_cd
		and oc.active_ind = 1
	join ptr where ptr.catalog_cd = oc.catalog_cd
		and ptr.active_ind = 1
	join dta where dta.task_assay_cd = ptr.task_assay_cd
		and dta.default_result_type_cd = c_datetime_result_type_cd
		and dta.active_ind = 1
	join bi where bi.ext_child_reference_id = dta.task_assay_cd
		and bi.ext_parent_reference_id = oc.catalog_cd
	join bim where bim.bill_item_id = bi.bill_item_id
		and bim.bill_item_type_cd = c_billcode_bill_item_type_cd
		and bim.key3_entity_name = "NOMENCLATURE"
	detail
		next = 1
		pos = locateval(idx,next,doc_cnt,ocs.catalog_cd,pop_documents_reply_out->master_document[idx]->catalog_cd)
		while(pos > 0 and next <= doc_cnt)
			pop_documents_reply_out->master_document[pos]->cpt_code = bim.key6
 
			next = pos + 1
			pos = locateval(idx,next,doc_cnt,ocs.catalog_cd,pop_documents_reply_out->master_document[idx]->catalog_cd)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetCPTCode Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 6)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetOrderingProvider(null)
;  Description: Subroutine to retrieve Ordering_Provider
**************************************************************************/
subroutine GetOrderingProvider(null)
if(iDebugFlag > 0)
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetOrderingProvider Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
endif
 
	set idx = 1
 	set doc_cnt = size(pop_documents_reply_out->master_document,5)
 	if(doc_cnt > 200)
 		set exp = 2
 	else
 		set exp = 0
 	endif
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from order_action oa
	     ,prsnl p
	plan oa where expand(idx,1,doc_cnt,oa.order_id,pop_documents_reply_out->master_document[idx].order_id)
			and oa.action_type_cd = c_order_action_cd
			and oa.order_id > 0
	join p where p.person_id = oa.order_provider_id
	detail
		next = 1
		pos = locateval(idx,next,doc_cnt,oa.order_id,pop_documents_reply_out->master_document[idx].order_id)
		while(pos > 0 and next <= doc_cnt)
			pop_documents_reply_out->master_document[pos].ordering_provider.provider_id = p.person_id
			pop_documents_reply_out->master_document[pos].ordering_provider.provider_name = trim(p.name_full_formatted)
 
			next = pos + 1
			pos = locateval(idx,next,doc_cnt,oa.order_id,pop_documents_reply_out->master_document[idx].order_id)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetOrderingProvider Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 6)), 3),
		" seconds"))
	endif
 
end ; end
 
end
go
set trace notranslatelock go