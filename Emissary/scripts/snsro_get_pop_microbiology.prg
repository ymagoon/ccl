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
  ~BE~***********************************************************************/
/*****************************************************************************
          Date Written:       11/28/16
          Source file name:   snsro_get_pop_microbiology
          Object name:        snsro_get_pop_microbiology
          Request #:
          Program purpose:    Returns all Micro Results
          Tables read:
          Tables updated:     NONE
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  000 11/28/16  AAB		    		Initial write
  001 12/15/16  AAB 				Add Person, Enc, and Fac objects
  002 12/22/16  AAB 				Add Accession_nbr to response and reset array
  003 12/27/16	DJP					Added error code for "Z" status, no data
  004 12/30/16  AAB 				Populate Organism at Sensitivy and Report level
  005 01/10/17	DJP					Add Location Object and remove Fac object
  006 02/01/17  AAB 				Add Ordering Provider
  007 02/04/17  AAB 				Add location to encounter object
  008 02/06/17  AAB					Add LOC List to input
  009 03/07/17  DJP					Added ErrorHandler2 fields
  010 03/17/17 	DJP					Added time band, time check, and max rec check and error handling for it
  011 04/03/17 	DJP					Fixed Micro/MicroPCR event set variables
  012 05/18/17  DJP					Added Gender/DOB to Person Object
  013 07/10/17  DJP					UTC date/time code changes
  014 07/10/17  DJP 				Check for From Date > To Date
  015 07/31/17	DJP					Changed updt_dt_tm to clin sign updt dt tm
  016 08/16/17  DJP					Changed %i to execute; updated ErrorHandler
  017 11/17/17	RJC					Susceptibility modification to DETAIL_SUSCEPTIBILITY_CD_DISP for Emissary mapping
  018 12/04/17	RJC					Fixed issue with lines > 132 chars
  019 03/22/18	RJC					Added version code and copyright block
  020 04/11/18  DJP					Added string Birthdate to person object
  021 08/01/18	RJC					Performance enhancements; code cleanup
  022 08/09/18  RJC					Changed max rec behavior. Max recs will no longer error out. It will return the max recs and
									once the limit is reached, it return all recs tied to the same second.
  023 08/13/18 	RJC					Created updated dttm changed to use ce.updt_dt_tm
  024 08/14/18 	RJC					Made expand clause variable depending on number of elements in record
  025 08/27/18  RJC					Added valid_until_dt_tm to query.
  026 08/29/18  STV                 update to handle nonutc environments and use functions for time
  027 10/18/18 	RJC					Outerjoin on person_alias table
 ***********************************************************************/
drop program snsro_get_pop_microbiology go
create program snsro_get_pop_microbiology
 
prompt
		"Output to File/Printer/MINE" = "MINE"
 		, "User Name:" 		= ""
		, "From Date:" 		= "01-JAN-1900"	; default beginning of time
		, "To Date:" 		= ""	; default end of time
		, "Facility_Code_List" = ""		;OPTIONAL. List of location facility codes from code set 220.		 008
  		, "Debug Flag" 		= 0		;OPTIONAL. Verbose logging when set to one (1).
 		, "Time Max" = 3600			;DO NOT USE. Undocumented value to override maximum date range in seconds.
with OUTDEV, USERNAME, FROM_DATE, TO_DATE, LOC_LIST, DEBUG_FLAG, TIME_MAX
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL changed to Emissary Version ;019
**************************************************************************/
set sVersion = "1.16.6.1"
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
 
free record loc_req   ;008
record loc_req (
	1 codes[*]
		2 code_value					= f8
		2 fac_identifier				= vc
)
 
free record pop_micro_results_reply_out
record pop_micro_results_reply_out
(
	1 micro_result[*]
		2 order_id              	= f8
		2 result_id 				= f8	; ce.event_id
	   	2 result_date				= dq8 	; ce.performed_dt_tm
	   	2 collected_date_time		= dq8
	   	2 accession_nbr 			= vc
		2 result_value				= vc	; ce.result_val
		2 component_id     			= f8	; ce.event_cd
		2 component_desc       		= vc	; ce.event_cd (Disp)
		2 units_of_measure			= vc	; ce.result_units_cd
	    2 clinsig_updt_dt_tm		= dq8	; ce.clinsig_updt_dt_tm
		2 clinical_display_line     = vc	; ce.clinical_display_line
		2 result_status		       	= vc	; ce.result_status_cd (disp)
		2 normalcy					= vc	; ce.normalcy_cd (mean)
		2 normalcy_disp				= vc 	; ce.normalcy_cd (disp)
		2 flag						= vc    ; ce.normalcy_cd (disp)
		2 normal_high				= vc	; ce.normal_high
		2 normal_low				= vc	; ce.normal_low
		2 resource_cd				= f8	; ce.resource_cd
		2 resource_cd_disp			= vc	; ce.resource_cd
		2 performed_prsnl_id		= f8	; ce.performed_prsnl_id
		2 verified_prsnl_id			= f8	; ce.verified_prsnl_id
		2 loinc_cd					= vc	; n.source_identifier
		2 created_updated_date_time	= dq8 ;ce.
		2 ordering_provider_id		= f8  ;006
		2 ordering_provider_name 	= vc  ;006
		2 event_set_cd				= f8
		2 event_set_disp			= vc
		2 event_class_cd			= f8
		2 event_class_disp			= vc
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
	    2 person		;001 +
		  3 person_id 					= f8	;p.person_id
		  3 name_full_formatted 		= vc	;p.name_full_formatted
		  3 name_last 					= vc	;p.last_name
		  3 name_first 					= vc	;p.first_name
		  3 name_middle 				= vc	;p.middle_name
		  3 mrn							= vc    ;pa.alias
		  3 dob							= dq8 ;012
		  3 gender_id					= f8  ;012
		  3 gender_disp					= vc  ;012
		  3 sDOB						= c10 ;020
	 	2 encounter
		  3 encounter_id 				= f8	;e.encntr_id
		  3 encounter_type_cd			= f8	;e.encntr_type_cd
		  3 encounter_type_disp			= vc	;encounter type display
		  3 encounter_type_class_cd		= f8	;encounter_type_class_cd
	      3 encounter_type_class_disp	= vc	;encounter type class display
 		  3 arrive_date					= dq8	;e.admit_dt_tm
 		  3 discharge_date				= dq8	;e.discharge_dt_tm
 		  3 fin_nbr						= vc	;ea.alias
 		  ;3 facility							;005 +
 		  	;4 facility_id				= f8
 		  	;4 facility_name				= vc
 		  	;4 facility_abbr				= vc  ;001 -
	 	  3 patient_location								;007 +
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
	  			4  loc_temp_disp            = vc    		;007 -
		1 audit
		2 user_id							= f8
		2 user_firstname					= vc
		2 user_lastname						= vc
		2 patient_id						= f8
		2 patient_firstname					= vc
		2 patient_lastname					= vc
	    2 service_version					= vc
  1 status_data												;016
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
)
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common ;016
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
set MODIFY MAXVARLEN 200000000	;022
 
; Input
declare sUserName			= vc with protect, noconstant("")
declare sFromDate			= vc with protect, noconstant("")
declare sToDate				= vc with protect, noconstant("")
declare sLocFacilities		= vc with protect,noconstant("") ;008
declare iDebugFlag			= i2 with protect, noconstant(0)
declare iTimeMax			= i4 with protect, noconstant(0)
 
; Other
declare qFromDateTime			= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare qToDateTime				= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare iTimeDiff			= i4 with protect, noconstant(0)
declare UTCmode				= i2 with protect, noconstant(0);;013
declare UTCpos 				= i2 with protect, noconstant(0);;013
declare ndx2				= i4  ;008
declare iMaxRecs			= i4 with protect, constant(2000) ;022
 
; Constants
declare c_ordered_order_status_cd		= f8 with protect, constant(uar_get_code_by("MEANING",6004,"ORDERED")) ;006
declare c_microbiology_event_set_cd 	= f8 with protect, noconstant(uar_get_code_by("DISPLAY_KEY", 93, "MICROBIOLOGY"));011
declare c_micropcr_event_set_cd			= f8 with protect, noconstant(uar_get_code_by("DISPLAY_KEY", 93, "MICROPCR"));011
declare c_mbo_event_class_cd			= f8 with protect, constant(uar_get_code_by("MEANING", 53, "MBO"))
declare c_mrn_person_alias_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",4,"MRN"))
declare c_finnbr_encntr_alias_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
; Input
set sUserName		= trim($USERNAME, 3)
set sFromDate		= trim($FROM_DATE, 3)
set sToDate			= trim($TO_DATE, 3)
set sLocFacilities 	= trim($LOC_LIST,3)  ;008
set iDebugFlag		= cnvtint($DEBUG_FLAG)
set iTimeMax		= cnvtint($TIME_MAX)
 
; Other
set UTCmode			= CURUTC ;013
set UTCpos			= findstring("Z",sFromDate,1,0) ;013
set qFromDateTime = GetDateTime(sFromDate)
set qToDateTime = GetDateTime(sToDate)
 
if(iDebugFlag > 0)
	call echo(build("$FROM_DATE -->",sFromDate))
	call echo(build("$TO_DATE -->",sToDate))
	call echo(build("$LOC_LIST -->",sLocFacilities))
	call echo(build("sUserName  ->", sUserName))
	call echo(build("UTC MODE -->",UTCmode));013
 	call echo(build("UTC POS -->",UTCpos));013
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ParseLocations(null)		= null with protect ;008
declare GetMicroResults(null)		= null with protect
declare GetEventDetails(null)		= null with protect
declare PostAmble(null)				= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, pop_micro_results_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("MICRO LAB RESULTS", "F","User is invalid", "Invalid User for Audit.",
	"1001",build("User is invalid. "," Invalid User for Audit."),pop_micro_results_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate from date is not greater than to date
if (qFromDateTime > qToDateTime)
	call ErrorHandler2("SELECT", "F", "VALIDATE", "From Date Greater than To Date. Refine Dates Entered.",
	"2010", "From Date Greater than To Date. Refine Dates Entered.", pop_micro_results_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate time difference does not exceed threshold - 010
set iRet = ThreshHoldValidator(iTimeMax,"s",qFromDateTime,qToDateTime)
if(iRet = 0)
	call ErrorHandler2("SELECT", "F", "VALIDATE", "Date Range Too Long. Refine Query.",
	"2011","Date Range Too Long. Refine Query.",pop_micro_results_reply_out)
	go to EXIT_SCRIPT
endif
 
; Parse locations if provided
if(sLocFacilities > " ")
	call ParseLocations(null)
endif
 
; Get Microbiology results
call GetMicroResults(null)
 
; Get Event Details
call GetEventDetails(null)
 
; Post Amble
call PostAmble(null)
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(pop_micro_results_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_pop_microbiology.json")
	call echo(build2("_file : ", _file))
	call echojson(pop_micro_results_reply_out, _file, 0)
    call echorecord(pop_micro_results_reply_out)
	call echo(JSONout)
endif
 
#EXIT_VERSION
 
/*************************************************************************
;  Name: ParseLocations(null)
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
			 loc_req->codes[num]->code_value = code_value
 
	 		if(curqual = 0)
	 			call ErrorHandler2("SELECT", "F", "VALIDATE", build("Invalid Facility Code: ", loc_req->codes[num]->code_value),
				"2040", build("Invalid Facility Code: ",loc_req->codes[num]->code_value),pop_micro_results_reply_out)
				set stat = alterlist(pop_micro_results_reply_out->micro_result,0)
				go to Exit_Script
			endif
	  	endif
	  	set num = num + 1
	endwhile
 
	if(iDebugFlag > 0)
		call echo(concat("ParseLocations Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetMicroResults(null)
;  Description: Retrieve microbiology results
**************************************************************************/
subroutine GetMicroResults(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetMicroResults Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare iMicroResultCnt      = i4 with protect, noconstant(0)
	declare iLocFacCnt      	= i4 with protect, noconstant(0)
 
	set iLocFacCnt = size(loc_req->codes, 5)
 
	; Temp record
	free record temp
	record temp (
		1 qual_cnt = i4
		1 qual[*]
			2 clinical_event_id = f8
	)
 
	;Set expand control value - 024
	if(iLocFacCnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
   ; Populate temp record - performance improvement
   ; Restrict list to iMaxRec records, but adjust if the limit is reached and there are others at the same second - 022
   select
	   	if(iLocFacCnt > 0)
	   		ce.clinical_event_id
	   		,ce.updt_dt_tm
			from clinical_event ce
				,v500_event_set_explode vese
				,encounter e
			plan ce where ce.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime (qToDateTime)
				and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)	;025
			join vese where  vese.event_cd = ce.event_cd
				and vese.event_set_cd in(c_micropcr_event_set_cd, c_microbiology_event_set_cd);011
			join e where e.encntr_id = ce.encntr_id
				and expand(ndx2,1,iLocFacCnt,e.loc_facility_cd,loc_req->codes[ndx2].code_value)
			order by ce.updt_dt_tm
		else
			ce.clinical_event_id
	   		,ce.updt_dt_tm
			from clinical_event ce
				,v500_event_set_explode vese
			plan ce where ce.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime (qToDateTime)
				and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)	;025
			join vese where  vese.event_cd = ce.event_cd
				and vese.event_set_cd in(c_micropcr_event_set_cd, c_microbiology_event_set_cd);011
			order by ce.updt_dt_tm
		endif
	into "nl:"
	head report
		x = 0
		max_reached = 0
		stat = alterlist(temp->qual,iMaxRecs)
	head ce.updt_dt_tm
		if(x > iMaxRecs)
			max_reached = 1
		endif
	detail
		if(max_reached = 0)
			x = x + 1
			if(mod(x,100) = 1 and x > iMaxRecs)
				stat = alterlist(temp->qual,x + 99)
			endif
 
			temp->qual[x].clinical_event_id = ce.clinical_event_id
	 	endif
	foot report
		stat = alterlist(temp->qual,x)
		temp->qual_cnt = x
	with nocounter, expand = value(exp)
 
 	if(iDebugFlag)
 		call echo(build("------Qual Cnt = ",temp->qual_cnt))
 	endif
 	; Populate audit
	if(temp->qual_cnt > 0)
		call ErrorHandler("VALIDATE", "S", "Population MICROBIOLOGY", "MICROBIOLOGY retrieval Successful", pop_micro_results_reply_out)
	else
		call ErrorHandler("EXECUTE", "Z", "No data", "No records qualify", pop_micro_results_reply_out)
		go to exit_script
	endif
 
 	; Populate final record
 
 	;Set expand control value - 024
	if(temp->qual_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	set tnum = 1
 
	select into "nl:"
		ce.event_id
	from clinical_event   ce
		,v500_event_set_explode vese
		,person p
		,person_alias pa
		,encounter e
		,encntr_alias ea
		,order_action oa
		,prsnl pr
	plan ce where expand(tnum,1,temp->qual_cnt,ce.clinical_event_id,temp->qual[tnum].clinical_event_id)
	join vese where vese.event_cd = ce.event_cd
 	join p where p.person_id = ce.person_id
	join pa where pa.person_id = outerjoin(p.person_id)
		and pa.person_alias_type_cd = outerjoin(c_mrn_person_alias_type_cd)
		and pa.active_ind = outerjoin(1)
		and pa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and pa.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	join e where e.encntr_id = outerjoin(ce.encntr_id)
	join ea where ea.encntr_id = outerjoin(e.encntr_id)
		and ea.encntr_alias_type_cd = outerjoin(c_finnbr_encntr_alias_type_cd)
		and ea.active_ind = outerjoin(1)
		and ea.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and ea.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	join oa   where oa.order_id = outerjoin(ce.order_id) ;006
		and oa.order_status_cd = outerjoin(c_ordered_order_status_cd)
	join pr where pr.person_id = outerjoin(oa.order_provider_id) ;006 -
	head report
		iMicroResultCnt = 0
	head ce.event_id
		iMicroResultCnt = iMicroResultCnt + 1
		stat = alterlist(pop_micro_results_reply_out->micro_result,iMicroResultCnt )
 
		;Clinical Event
		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->result_id = ce.event_id
 
		; Order Action
		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->ordering_provider_id = oa.order_provider_id ;006
 
		; Prsnl
		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->ordering_provider_name = pr.name_full_formatted ;006
 
		; V500_event_set_explode
		pop_micro_results_reply_out->micro_result[iMicroResultCnt].event_set_cd = vese.event_set_cd
 	   	pop_micro_results_reply_out->micro_result[iMicroResultCnt]->event_set_disp = uar_get_code_display(vese.event_set_cd)
 
 		; Person DAta
		pop_micro_results_reply_out->micro_result[iMicroREsultCnt]->person->person_id = p.person_id
		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->person->name_full_formatted = p.name_full_formatted
		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->person->name_first = p.name_first
		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->person->name_last = p.name_last
		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->person->name_middle = p.name_middle
 		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->person->mrn = pa.alias
 		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->person->dob = p.birth_dt_tm ;012
 		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->person->gender_id = p.sex_cd ;012
 		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->person->gender_disp = uar_get_code_display(p.sex_cd);012
  		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->person->sDOB =
 		datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef);020
 
		; Encounter Data
		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->encounter->encounter_id = e.encntr_id
		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->encounter->encounter_type_cd = e.encntr_type_cd
		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->encounter->encounter_type_disp =
		 uar_get_code_display(e.encntr_type_cd)
		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->encounter->encounter_type_class_cd = e.encntr_type_class_cd
		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->encounter->encounter_type_class_disp =
		 uar_get_code_display(e.encntr_type_class_cd)
		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->encounter->arrive_date = e.arrive_dt_tm
		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->encounter->discharge_date = e.disch_dt_tm
 		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->encounter->fin_nbr = ea.alias
 
  		; Encounter Location Data
 		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->encounter->patient_location->location_cd = e.location_cd
 		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->encounter->patient_location->location_disp =
 		 uar_get_code_display(e.location_cd)
  		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->encounter->patient_location->loc_bed_cd = e.loc_bed_cd
 		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->encounter->patient_location->loc_bed_disp =
 		 uar_get_code_display(e.loc_bed_cd)
		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->encounter->patient_location->loc_building_cd = e.loc_building_cd
 		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->encounter->patient_location->loc_building_disp =
 		 uar_get_code_display(e.loc_building_cd)
		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->encounter->patient_location->loc_facility_cd = e.loc_facility_cd
 		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->encounter->patient_location->loc_facility_disp =
 		 uar_get_code_display(e.loc_facility_cd)
		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->encounter->patient_location->loc_nurse_unit_cd = e.loc_nurse_unit_cd
 		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->encounter->patient_location->loc_nurse_unit_disp =
 		 uar_get_code_display(e.loc_nurse_unit_cd)
		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->encounter->patient_location->loc_room_cd = e.loc_room_cd
 		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->encounter->patient_location->loc_room_disp =
 		 uar_get_code_display(e.loc_room_cd)
		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->encounter->patient_location->loc_temp_cd = e.loc_temp_cd
 		pop_micro_results_reply_out->micro_result[iMicroResultCnt]->encounter->patient_location->loc_temp_disp =
 		 uar_get_code_display(e.loc_temp_cd)
 	detail
 		if(ce.updt_dt_tm > pop_micro_results_reply_out->micro_result[iMicroResultCnt]->created_updated_date_time) ;023
 			pop_micro_results_reply_out->micro_result[iMicroResultCnt]->created_updated_date_time = ce.updt_dt_tm
 		endif
	with nocounter, expand = value(exp)
 
	if(iDebugFlag > 0)
		call echo(concat("GetMicroResults Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetEventDetails(null)
;  Description: Get details for each event_id
**************************************************************************/
subroutine GetEventDetails(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetEventDetails Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;Setup request
	set microCnt = size(pop_micro_results_reply_out->micro_result,5)
	set stat = alterlist(1000079_req->req_list,microCnt)
	for(a = 1 to microCnt)
		set 1000079_req->req_list[a].event_id = pop_micro_results_reply_out->micro_result[a].result_id
		set 1000079_req->req_list[a]->query_mode = 983043
		set 1000079_req->req_list[a]->query_mode_ind = 0
		set 1000079_req->req_list[a]->contributor_system_cd = 0
		set 1000079_req->req_list[a]->subtable_bit_map = 0
		set 1000079_req->req_list[a]->subtable_bit_map_ind = 1
		set 1000079_req->req_list[a]->valid_from_dt_tm = cnvtdatetime("0000-00-00 00:00:00.00")
		set 1000079_req->req_list[a]->valid_from_dt_tm_ind = 1
		set 1000079_req->req_list[a]->decode_flag = 0
		set 1000079_req->req_list[a]->ordering_provider_id = 0
		set 1000079_req->req_list[a]->action_prsnl_id = 0
		set 1000079_req->req_list[a]->src_event_id_ind = 0
		set 1000079_req->req_list[a]->action_prsnl_group_id = 0
 	endfor
 
 	;Execute request
	set stat = tdbexecute(600005, 600107, 1000079,"REC",1000079_req,"REC",1000079_rep)
 
 	if(size(1000079_rep->rep_list,5) = 0)
 		call ErrorHandler2("POP MICRO", "F", "EXECUTE", "Could not retrieve event details (1000079).",
		"9999","Could not retrieve event details (1000079).",pop_micro_results_reply_out)
		go to EXIT_SCRIPT
	endif
 
	;Iterate through reply
	select into "nl:"
	from (dummyt d with seq = size(1000079_rep->rep_list,5))
		,(dummyt d1 with seq = size(pop_micro_results_reply_out->micro_result,5))
	plan d
	join d1 where pop_micro_results_reply_out->micro_result[d1.seq].result_id =
		1000079_rep->rep_list[d.seq].rb_list[1].event_id
	detail
		pop_micro_results_reply_out->micro_result[d1.seq]->order_id = 1000079_rep->rep_list[d.seq].rb_list[1].order_id
		pop_micro_results_reply_out->micro_result[d1.seq]->result_date = 1000079_rep->rep_list[d.seq].rb_list[1].performed_dt_tm
		pop_micro_results_reply_out->micro_result[d1.seq]->collected_date_time = 1000079_rep->rep_list[d.seq].rb_list[1].event_start_dt_tm
		pop_micro_results_reply_out->micro_result[d1.seq]->result_value = 1000079_rep->rep_list[d.seq].rb_list[1].result_val
		pop_micro_results_reply_out->micro_result[d1.seq]->component_id = 1000079_rep->rep_list[d.seq].rb_list[1].event_cd
		pop_micro_results_reply_out->micro_result[d1.seq]->accession_nbr = trim(1000079_rep->rep_list[d.seq].rb_list[1].accession_nbr,3)
		pop_micro_results_reply_out->micro_result[d1.seq]->component_desc =
			uar_get_code_display(1000079_rep->rep_list[d.seq].rb_list[1].event_cd)
		pop_micro_results_reply_out->micro_result[d1.seq]->units_of_measure =
			uar_get_code_display(1000079_rep->rep_list[d.seq].rb_list[1].result_units_cd)
		pop_micro_results_reply_out->micro_result[d1.seq]->clinsig_updt_dt_tm = 1000079_rep->rep_list[d.seq].rb_list[1].clinsig_updt_dt_tm
		pop_micro_results_reply_out->micro_result[d1.seq]->result_status =
			uar_get_code_display(1000079_rep->rep_list[d.seq].rb_list[1].result_status_cd)
		pop_micro_results_reply_out->micro_result[d1.seq]->normalcy =
			uar_get_code_meaning(1000079_rep->rep_list[d.seq].rb_list[1].normalcy_cd)
		pop_micro_results_reply_out->micro_result[d1.seq]->normalcy_disp =
			uar_get_code_display(1000079_rep->rep_list[d.seq].rb_list[1].normalcy_cd)
		pop_micro_results_reply_out->micro_result[d1.seq]->flag =
			uar_get_code_meaning(1000079_rep->rep_list[d.seq].rb_list[1].normalcy_cd)
		pop_micro_results_reply_out->micro_result[d1.seq]->resource_cd = 1000079_rep->rep_list[d.seq].rb_list[1].resource_cd
		pop_micro_results_reply_out->micro_result[d1.seq]->resource_cd_disp =
			uar_get_code_display(1000079_rep->rep_list[d.seq].rb_list[1].resource_cd)
		pop_micro_results_reply_out->micro_result[d1.seq]->normal_high = 1000079_rep->rep_list[d.seq].rb_list[1].normal_high
		pop_micro_results_reply_out->micro_result[d1.seq]->normal_low = 1000079_rep->rep_list[d.seq].rb_list[1].normal_low
		pop_micro_results_reply_out->micro_result[d1.seq]->event_class_cd = 1000079_rep->rep_list[d.seq].rb_list[1].event_class_cd
		pop_micro_results_reply_out->micro_result[d1.seq]->event_class_disp =
			uar_get_code_display(1000079_rep->rep_list[d.seq].rb_list[1].event_class_cd)
 
		; Update record lists
		if(pop_micro_results_reply_out->micro_result[d1.seq]->event_class_cd = c_mbo_event_class_cd)
			; Load specimen_collection data into final reply
			specCollSize = size(1000079_rep->rep_list[d.seq].rb_list[1].specimen_coll,5)
			if(specCollSize > 0)
				stat = movereclist(1000079_rep->rep_list[d.seq].rb_list[1].specimen_coll,
				pop_micro_results_reply_out->micro_result[d1.seq].specimen_coll,1,0,specCollSize,true)
			endif
 
			; Load microbiology_list data into final reply
			microlistSize = size(1000079_rep->rep_list[d.seq].rb_list[1].microbiology_list,5)
			if(microlistSize > 0)
				stat = movereclist(1000079_rep->rep_list[d.seq].rb_list[1].microbiology_list,
				pop_micro_results_reply_out->micro_result[d1.seq].microbiology_list,1,0,microlistSize,true)
			endif
 
			; Load child event list data into final reply
			childeventSize = size(1000079_rep->rep_list[d.seq].rb_list[1].child_event_list,5)
			if(childeventSize > 0)
				stat = movereclist(1000079_rep->rep_list[d.seq].rb_list[1].child_event_list,
				pop_micro_results_reply_out->micro_result[d1.seq].child_event_list,1,0,childeventSize,true)
			endif
		endif
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetEventDetails Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: PostAmble(null)
;  Description: Update susceptibility display name
**************************************************************************/
subroutine PostAmble(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostAmble Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;017 Start
	declare detail_cd = f8
	declare detail_desc = vc
	declare detail_disp = vc
	declare final_name = vc
 
	for(x = 1 to size(pop_micro_results_reply_out->micro_result,5))
		for(y = 1 to size(pop_micro_results_reply_out->micro_result[x].microbiology_list,5))
			; Susceptibility List
			for(z = 1 to size(pop_micro_results_reply_out->micro_result[x].microbiology_list[y].susceptibility_list,5))
				if(pop_micro_results_reply_out->micro_result[x].microbiology_list[y].susceptibility_list[z].\
				detail_susceptibility_cd_disp not in ("MINT","MDIL"))
					set detail_cd =
					pop_micro_results_reply_out->micro_result[x].microbiology_list[y].susceptibility_list[z].detail_susceptibility_cd
					set detail_disp =
					pop_micro_results_reply_out->micro_result[x].microbiology_list[y].susceptibility_list[z].detail_susceptibility_cd_disp
					set final_name = detail_disp
 
					select into "nl:"
					from code_value cv
					where cv.code_value = detail_cd and cv.code_set = 1004
					detail
						detail_desc = cv.description
					with nocounter
 
					set int_pos = findstring("INTERP",cnvtupper(detail_desc),1,0)
					set dil_pos = findstring("DIL",cnvtupper(detail_desc),1,0)
 
					if(int_pos > 0)
						set final_name = "MINT"
					else
						if(dil_pos > 0)
							set final_name = "MDIL"
						else
							set int_pos2 = findstring("INT",cnvtupper(detail_disp),1,0)
							set dil_pos2 = findstring("DIL",cnvtupper(detail_disp),1,0)
 
							if(int_pos2 > 0)
								set final_name = "MINT"
							else
								if(dil_pos2 > 0)
									set final_name = "MDIL"
								endif
							endif
						endif
					endif
					; Set Display
					set pop_micro_results_reply_out->micro_result[x].microbiology_list[y].susceptibility_list[z].detail_susceptibility_cd_disp =
						final_name
					set pop_micro_results_reply_out->micro_result[x].microbiology_list[y].susceptibility_list[z].detail_susceptibility_cd_mean =
						detail_disp
				endif
			endfor
		endfor ;End Parent
 
		; Child Event
		for(y = 1 to size(pop_micro_results_reply_out->micro_result[x].child_event_list,5))
			; Micro List
			for(z = 1 to size(pop_micro_results_reply_out->micro_result[x].child_event_list[y].microbiology_list,5))
				; Susceptibility List
				for(a = 1 to size(pop_micro_results_reply_out->micro_result[x].child_event_list[y].microbiology_list[z].susceptibility_list,5))
					declare detail_cd = f8
					declare detail_desc = vc
					declare detail_disp = vc
					declare final_name = vc
					if(pop_micro_results_reply_out->micro_result[x].child_event_list[y].microbiology_list[z].susceptibility_list[a].\
					detail_susceptibility_cd_disp not in ("MINT","MDIL"))
 
						set detail_cd =
						pop_micro_results_reply_out->micro_result[x].child_event_list[y].microbiology_list[z].susceptibility_list[a].\
						detail_susceptibility_cd
 
						set detail_disp =
						pop_micro_results_reply_out->micro_result[x].child_event_list[y].microbiology_list[z].susceptibility_list[a]\
						.detail_susceptibility_cd_disp
 
						set final_name = detail_disp
 
						select into "nl:"
						from code_value cv
						where cv.code_value = detail_cd and cv.code_set = 1004
						detail
							detail_desc = cv.description
						with nocounter
 
						set int_pos = findstring("INTERP",cnvtupper(detail_desc),1,0)
						set dil_pos = findstring("DIL",cnvtupper(detail_desc),1,0)
 
						if(int_pos > 0)
							set final_name = "MINT"
						else
							if(dil_pos > 0)
								set final_name = "MDIL"
							else
								set int_pos2 = findstring("INT",cnvtupper(detail_disp),1,0)
								set dil_pos2 = findstring("DIL",cnvtupper(detail_disp),1,0)
 
								if(int_pos2 > 0)
									set final_name = "MINT"
								else
									if(dil_pos2 > 0)
										set final_name = "MDIL"
									endif
								endif
							endif
						endif
 
						; Set display
						set pop_micro_results_reply_out->micro_result[x].child_event_list[y].microbiology_list[z].susceptibility_list[a].\
						detail_susceptibility_cd_disp = final_name
 
						set pop_micro_results_reply_out->micro_result[x].child_event_list[y].microbiology_list[z].susceptibility_list[a].\
						detail_susceptibility_cd_mean = detail_disp
					endif
				endfor
			endfor
		endfor
	endfor
	; 017 End
 
	if(iDebugFlag > 0)
		call echo(concat("GetSusceptibilityData Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
end go
 
 
 
 
 
