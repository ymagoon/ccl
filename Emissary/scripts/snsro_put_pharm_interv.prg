/*~BB~***********************************************************************************
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
  ~BE~***********************************************************************************/
/*****************************************************************************************
      Source file name:  	snsro_put_pharm_interv.prg
      Object name:       	snsro_put_pharm_interv
      Program purpose:    	Update a pharmacy intervention in Millennium.
      Tables read:      	MANY
      Tables updated:   	CLINICAL_EVENT
	  Services Called:
							1000011 event detail query
							500415	orm_get_order_by_id
	  						3200310 msvc_svr_get_clinctx
							600373	dcp_get_dcp_form
							680500	MSVC_GetPrivilegesByCodes
							680501	MSVC_CheckPrivileges
							600471	dcp_get_section_input_runtime
							600356	dcp_get_dta_info_all
							600908	dcp_upd_lock_forms_activity
							600907 dcp_chk_lock_forms_activity
							1000012	Add to Clinical Event Table
							600353 	dcp_upd_forms_activity
							600345	dcp_events_ensured
							560303	DCP.ModTask
      Executing from:   	mPages Discern Web Service
      Special Notes:      	NA
*********************************************************************************/
/********************************************************************************
*                   MODIFICATION CONTROL LOG                      				*
*********************************************************************************
* Mod 	Date     	Engineer             	Comment                            	*
* --- 	-------- 	-------------------- 	-----------------------------------	*
  001	01/15/18	RJC						Initial Write
  002	03/22/18	RJC						Added version code and copyright block
  003	03/26/18	RJC						Updated reqinfo->updt_id with userid
*********************************************************************************/
/********************************************************************************/
drop program snsro_put_pharm_interv go
create program snsro_put_pharm_interv
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        		;Required
		, "InterventionId:" = 0.00		;Required
		, "Json Args:" = ""				;Required
		, "Debug Flag:" = 0				;Optional
 
with OUTDEV, USERNAME, INTERVENTION_ID, JSON, DEBUG_FLAG
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;002
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
 
free record arglist
record arglist (
	1 Status = vc
	1 Types
		2 FieldId = vc
		2 ValueIds[*] = vc
		2 Values[*] = vc
	1 SubTypes
		2 FieldId = vc
		2 ValueIds[*] = vc
		2 Values[*] = vc
	1 Significance
		2 FieldId = vc
		2 ValueIds[*] = vc
		2 Values[*] = vc
	1 TimeSpent
		2 FieldId = vc
		2 ValueIds[*] = vc
		2 Values[*] = vc
	1 Value
		2 FieldId = vc
		2 ValueIds[*] = vc
		2 Values[*] = vc
	1 Response
		2 FieldId = vc
		2 ValueIds[*] = vc
		2 Values[*] = vc
	1 Outcomes
		2 FieldId = vc
		2 ValueIds[*] = vc
		2 Values[*] = vc
	1 AdditionalDetails[*]
		2 FieldId = vc
		2 ValueIds[*] = vc
		2 Values[*] = vc
	1 LinkedOrders[*]
		2 OrderId 		= vc
		2 LinkTypeId	= vc
	1 Documentation 	= gvc
	1 Notes =  vc
)
 
; Input data
free record input_list
record input_list (
	1 qual[*]
		2 input_id = f8
		2 values[*]
			3 response_id = f8
			3 response = vc
)
 
; Temp structure for powerform elements
free record powerform
record powerform (
	1 dcp_forms_ref_id = f8
	1 dcp_form_instance_id = f8
	1 form_event_id = f8
	1 description = vc
	1 event_cd = f8
	1 sections[*]
		2 post_ind = i2
		2 dcp_forms_def_id = f8
		2 section_seq = i4
		2 dcp_section_ref_id = f8
		2 dcp_section_instance_id = f8
		2 section_event_id = f8
		2 description = vc
		2 definition = vc
		2 active_ind = i2
		2 input_cnt = i2
		2 inputs[*]
			3 dcp_input_ref_id = f8
			3 input_ref_seq = i4
			3 description = vc
			3 input_event_id = f8
			3 module = vc
			3 input_type = i4
			3 alignment = vc
			3 backcolor =  vc
			3 caption = vc
			3 conditional_control_unit = vc
			3 default = vc
			3 facename = vc
			3 fonteffects = vc
			3 forecolor = vc
			3 freetext = vc
			3 nomen_field = vc
			3 physicians_only = vc
			3 pointsize = vc
			3 position = vc
			3 required = vc
			3 multi_select = vc
			3 response_values[*]
				4 response_id = f8
				4 response = vc
				4 date_time_response = dq8
				4 event_class_cd = f8
				4 coded_result_check = i2
				4 string_result_check = i2
				4 string_result_format_cd = f8
				4 date_result_check = i2
				4 date_type_flag = i2
				4 io_type_flag = i2
				4 normalcy_cd = f8
				4 results_unit_cd = f8
			3 discrete_task_assay
				4 task_assay_cd = f8
				4 mnemonic = vc
				4 description = vc
				4 event_cd = f8
				4 activity_type_cd = f8
				4 default_result_type_cd = f8
				4 default_result_type_disp = vc
				4 default_result_type_mean = vc
				4 ref_range_factor
					5 species_cd = f8
					5 sex_cd = f8
					5 age_from_minutes = i4
					5 age_to_minutes = i4
					5 service_resource_cd = f8
					5 encntr_type_cd = f8
					5 specimen_type_cd = f8
					5 review_ind = i2
					5 review_low = f8
					5 review_high = f8
					5 sensitive_ind = i2
					5 sensitive_low = f8
					5 sensitive_high = f8
					5 normal_ind = i2
					5 normal_low = f8
					5 normal_high = f8
					5 critical_ind = i2
					5 critical_low = f8
					5 critical_high = f8
					5 feasible_ind = i2
					5 feasible_low = f8
					5 feasible_high = f8
					5 units_cd = f8
					5 def_result_ind = i2
			        5 default_result = vc
			        5 default_result_value = f8
			        5 unknown_age_ind = i2
			        5 alpha_response_ind = i2
			        5 alpha_responses_cnt = i4
					5 alpha_responses [*]
					  6 nomenclature_id = f8
					  6 source_string = vc
					  6 short_string = vc
					  6 mnemonic = c25
					  6 sequence = i4
					  6 default_ind = i2
					  6 description = vc
					  6 result_value = f8
					  6 multi_alpha_sort_order = i4
					  6 concept_identifier = vc
				4 data_map [* ]
					5 data_map_type_flag = i2
					5 result_entry_format = i4
					5 max_digits = i4
					5 min_digits = i4
					5 min_decimal_places = i4
					5 service_resource_cd = f8
)
 
free record temp_events
record temp_events (
	1 qual[*]
		2 event_id = f8
)
 
;1000011 event detail query
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
)
 
 free record 1000011_rep
record 1000011_rep (
  1 sb
    2 severityCd = i4
    2 statusCd = i4
    2 statusText = vc
    2 subStatusList [*]
      3 subStatusCd = i4
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
 
;500415	orm_get_order_by_id
free record 500415_req
record 500415_req (
  1 order_id = f8
)
 
free record 500415_rep
record 500415_rep (
   1 provider_id = f8
   1 encntr_id = f8
   1 catalog_cd = f8
   1 catalog_type_cd = f8
   1 med_type_cd = f8
   1 oe_format_id = f8
   1 activity_type_cd = f8
   1 current_start_dt_tm = dq8
   1 current_start_tz = i4
   1 orig_order_dt_tm = dq8
   1 orig_order_tz = i4
   1 freq_type_flag = i2
   1 hna_order_mnemonic = vc
   1 ordered_as_mnemonic = vc
   1 valid_dose_dt_tm = dq8
   1 person_id = f8
   1 order_status_cd = f8
   1 order_status_disp = vc
   1 clinical_display_line = vc
   1 dcp_clin_cat_cd = f8
   1 dept_status_cd = f8
   1 ref_text_mask = i4
   1 order_comment_ind = i2
   1 ingredient_ind = i2
   1 template_order_flag = i2
   1 template_order_id = f8
   1 cs_flag = i2
   1 cs_order_id = f8
   1 orderable_type_flag = i2
   1 cki = vc
   1 orig_ord_as_flag = i2
   1 synonym_id = f8
   1 prn_ind = i2
   1 rx_mask = i4
   1 comment_type_mask = i4
   1 stop_type_cd = f8
   1 projected_stop_dt_tm = dq8
   1 order_mnemonic = vc
   1 last_updt_cnt = i4
   1 additive_count_for_ivpb = i4
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
 )
 
;3200310 msvc_svr_get_clinctx
free record 3200310_req
record 3200310_req (
  1 patient_id = f8
  1 person_prsnl_reltn_cd = f8
  1 encounter_id = f8
  1 load
    2 patient = i2
    2 encounter = i2
    2 allergy = i2
    2 clinical_fact = i2
    2 clinical_event
      3 event_set_names [*]
        4 name = vc
      3 statuses [*]
        4 code = f8
    2 consent
      3 type_cd = f8
    2 diagnosis = i2
    2 auth_encounter = i2
    2 patient_relationship = i2
    2 encounter_relationship = i2
    2 relationship_by_types
      3 encntr_reltn_types [*]
        4 encntr_reltn_type_cd = f8
      3 patient_reltn_types [*]
        4 patient_reltn_type_cd = f8
    2 patient_details
      3 basic_info = i2
      3 pcp = i2
      3 name = i2
      3 aliases = i2
      3 secure_email = i2
      3 addresses = i2
      3 phones = i2
    2 encounter_details
      3 basic_info = i2
      3 aliases = i2
      3 location = i2
      3 timezone = i2
)
free record 3200310_rep
record 3200310_rep (
  1 patient
    2 patient_id = f8
    2 name
      3 name_full_formatted = vc
      3 prefix = vc
      3 suffix = vc
      3 degree = vc
      3 title = vc
      3 first = vc
      3 middle = vc
      3 last = vc
    2 birth_dt_tm = dq8
    2 birth_dt_cd = f8
    2 birth_tz = i4
    2 gest_age_at_birth = i4
    2 sex_cd = f8
    2 aliases [*]
      3 alias = vc
      3 type_cd = f8
      3 data_status_cd = f8
      3 contributor_system_cd = f8
      3 alias_pool_cd = f8
    2 species_cd = f8
    2 language_cd = f8
    2 race_cd = f8
    2 ethnic_grp_cd = f8
    2 deceased_dt_tm = dq8
    2 deceased_tz = i4
    2 pcp_name = vc
    2 formatted_home_phone = vc
    2 formatted_mobile_phone = vc
    2 formatted_home_addr_single_line = vc
    2 deceased_cd = f8
    2 cause_of_death = vc
    2 secure_emails [*]
      3 email_address = vc
    2 addresses [*]
      3 type_cd = f8
      3 street = vc
      3 street2 = vc
      3 street3 = vc
      3 street4 = vc
      3 city = vc
      3 state = vc
      3 state_cd = f8
      3 postal_code = vc
    2 phones [*]
      3 extension = vc
      3 number = vc
      3 format_cd = f8
      3 type_cd = f8
    2 races [*]
      3 race_cd = f8
  1 encounter
    2 encounter_id = f8
    2 aliases [*]
      3 alias = vc
      3 type_cd = f8
      3 data_status_cd = f8
      3 contributor_system_cd = f8
      3 alias_pool_cd = f8
    2 reg_dt_tm = dq8
    2 arrive_dt_tm = dq8
    2 disch_dt_tm = dq8
    2 med_service_cd = f8
    2 contributor_system_cd = f8
    2 encntr_type_cd = f8
    2 encntr_type_class_cd = f8
    2 reason_for_visit = vc
    2 isolation_cd = f8
    2 diet_cd = f8
    2 encntr_status_cd = f8
    2 encntr_financial_id = f8
    2 organization_id = f8
    2 est_arrive_dt_dm = dq8
    2 est_disch_dt_tm = dq8
    2 facility_id = f8
    2 building_id = f8
    2 nurse_unit_id = f8
    2 room_id = f8
    2 bed_id = f8
    2 temp_id = f8
    2 encounter_tz = i4
    2 org_security_ind = i2
    2 financial_class_cd = f8
  1 allergy
    2 allergies_filtered_ind = i2
    2 resolved_allergies_filtered_ind = i2
    2 allergies [*]
      3 allergy_display = vc
      3 severity_cd = f8
      3 freetext_ind = i2
  1 clinical_fact
    2 abo_cd = f8
    2 rh_cd = f8
  1 clinical_events
    2 results [*]
      3 event_id = f8
      3 person_id = f8
      3 encounter_id = f8
      3 event_cd = f8
      3 effective_date = dq8
      3 effective_date_tz = i4
      3 status_cd = f8
      3 version = i4
      3 info_source_cd = f8
      3 contributor_system_cd = f8
      3 has_comments_ind = i2
      3 not_done_reason_cd = f8
      3 not_done_reason_ft = vc
      3 entry_mode_cd = f8
      3 task_assay_cd = f8
      3 task_assay_version = vc
      3 reference_id = vc
      3 update_date = dq8
      3 service_resource_cd = f8
      3 comments [*]
        4 comment_id = f8
        4 comment_text = gvc
        4 comment_format_cd = f8
        4 comment_author_id = f8
        4 comment_date = dq8
        4 comment_date_tz = i4
        4 chartable_ind = i2
        4 comment_type_cd = f8
      3 orders [*]
        4 order_id = f8
      3 action_requests [*]
        4 action_request_id = f8
        4 action_request_type_cd = f8
        4 action_request_status_cd = f8
        4 action_request_comment = vc
        4 request_date = dq8
        4 request_date_tz = i4
        4 action_date = dq8
        4 action_date_tz = i4
        4 requestor_id = f8
        4 requestor_ft = vc
        4 requestee_id = f8
        4 requestee_ft = vc
        4 modifiers [*]
          5 modifier_type_cd = f8
      3 participations [*]
        4 participation_id = f8
        4 participation_type_cd = f8
        4 participation_comment = vc
        4 participation_date = dq8
        4 participation_date_tz = i4
        4 participation_prsnl_id = f8
        4 participation_prsnl_ft = vc
        4 modifiers [*]
          5 modifier_type_cd = f8
      3 clinical_event_classification = vc
      3 blood_product [*]
        4 product_nbr = vc
        4 product_cd = f8
        4 product_status_cd = f8
        4 abo_cd = f8
        4 rh_cd = f8
        4 volume [*]
          5 number = f8
          5 unit_cd = f8
          5 modifier_cd = f8
          5 digits_past_decimal = i4
        4 quantity [*]
          5 number = f8
          5 unit_cd = f8
          5 modifier_cd = f8
          5 digits_past_decimal = i4
        4 strength [*]
          5 number = f8
          5 unit_cd = f8
          5 modifier_cd = f8
          5 digits_past_decimal = i4
        4 antigens [*]
          5 type_cd = f8
          5 sequence = i4
        4 measurement [*]
          5 measurement_classification = vc
          5 accession_nbr = vc
          5 interpretation_cd = f8
          5 specimen_collection [*]
            6 collect_date = dq8
            6 collect_date_tz = i4
            6 collect_method_cd = f8
            6 collect_performer_id = f8
            6 collect_location_id = f8
            6 specimen
              7 specimen_id = f8
              7 specimen_source_cd = f8
              7 specimen_source_ft = vc
              7 specimen_body_site_cd = f8
            6 received_date = dq8
            6 received_date_tz = i4
          5 string_value [*]
            6 value = vc
            6 unit_cd = f8
            6 numeric_value [*]
              7 number = f8
              7 unit_cd = f8
              7 modifier_cd = f8
              7 digits_past_decimal = i4
          5 quantity_value [*]
            6 number = f8
            6 unit_cd = f8
            6 modifier_cd = f8
            6 digits_past_decimal = i4
          5 code_value [*]
            6 other_response = vc
            6 values [*]
              7 value_nomenclature_id = f8
              7 value_cd = f8
              7 unit_cd = f8
              7 group = i4
              7 code_value_sequence = i4
            6 nomen_string_flag = i2
          5 date_value [*]
            6 value_date = dq8
            6 value_date_tz = i4
            6 date_only_ind = i2
          5 reference_range [*]
            6 critical_low
              7 number = f8
              7 unit_cd = f8
            6 normal_low
              7 number = f8
              7 unit_cd = f8
            6 normal_high
              7 number = f8
              7 unit_cd = f8
            6 critical_high
              7 number = f8
              7 unit_cd = f8
            6 critical_low_text = vc
            6 normal_low_text = vc
            6 normal_high_text = vc
            6 critical_high_text = vc
            6 critical_low_ind = i2
            6 normal_low_ind = i2
            6 normal_high_ind = i2
            6 critical_high_ind = i2
          5 group_label [*]
            6 id = f8
            6 name = vc
            6 status_cd = f8
            6 sequence = i4
            6 performer_id = f8
            6 comments [*]
              7 comment_id = f8
              7 comment_text = gvc
              7 comment_format_cd = f8
              7 comment_author_id = f8
              7 comment_date = dq8
              7 comment_date_tz = i4
              7 chartable_ind = i2
              7 comment_type_cd = f8
          5 encapsulated_value [*]
            6 text = gvc
            6 media_type_cd = f8
        4 attributes [*]
          5 type_cd = f8
          5 sequence = i4
      3 document_container [*]
        4 doc_container_title = vc
        4 doc_container_published_ind = i2
        4 doc_container_viewable_ind = i2
        4 document
          5 result
            6 event_id = f8
            6 person_id = f8
            6 encounter_id = f8
            6 event_cd = f8
            6 effective_date = dq8
            6 effective_date_tz = i4
            6 status_cd = f8
            6 version = i4
            6 info_source_cd = f8
            6 contributor_system_cd = f8
            6 has_comments_ind = i2
            6 not_done_reason_cd = f8
            6 not_done_reason_ft = vc
            6 entry_mode_cd = f8
            6 task_assay_cd = f8
            6 task_assay_version = vc
            6 reference_id = vc
            6 update_date = dq8
            6 service_resource_cd = f8
            6 comments [*]
              7 comment_id = f8
              7 comment_text = gvc
              7 comment_format_cd = f8
              7 comment_author_id = f8
              7 comment_date = dq8
              7 comment_date_tz = i4
              7 chartable_ind = i2
              7 comment_type_cd = f8
            6 orders [*]
              7 order_id = f8
          5 action_requests [*]
            6 action_request_id = f8
            6 action_request_type_cd = f8
            6 action_request_status_cd = f8
            6 action_request_comment = vc
            6 request_date = dq8
            6 request_date_tz = i4
            6 action_date = dq8
            6 action_date_tz = i4
            6 requestor_id = f8
            6 requestor_ft = vc
            6 requestee_id = f8
            6 requestee_ft = vc
            6 modifiers [*]
              7 modifier_type_cd = f8
          5 participations [*]
            6 participation_id = f8
            6 participation_type_cd = f8
            6 participation_comment = vc
            6 participation_date = dq8
            6 participation_date_tz = i4
            6 participation_prsnl_id = f8
            6 participation_prsnl_ft = vc
            6 modifiers [*]
              7 modifier_type_cd = f8
          5 document_title = vc
          5 document_published_ind = i2
          5 document_viewable_ind = i2
          5 document_sequence = vc
          5 documentation_date = dq8
          5 documentation_date_tz = i4
          5 signature_line_text = gvc
          5 signature_line_type_cd = f8
          5 contributions [*]
            6 clinical_event
              7 event_id = f8
              7 encounter_id = f8
              7 has_comments_ind = i2
              7 not_done_reason_cd = f8
              7 not_done_reason_ft = vc
              7 entry_mode_cd = f8
              7 task_assay_cd = f8
              7 task_assay_version = vc
              7 reference_id = vc
              7 update_date = dq8
              7 service_resource_cd = f8
              7 orders [*]
                8 order_id = f8
            6 action_requests [*]
              7 action_request_id = f8
              7 action_request_type_cd = f8
              7 action_request_status_cd = f8
              7 action_request_comment = vc
              7 request_date = dq8
              7 request_date_tz = i4
              7 action_date = dq8
              7 action_date_tz = i4
              7 requestor_id = f8
              7 requestor_ft = vc
              7 requestee_id = f8
              7 requestee_ft = vc
              7 modifiers [*]
                8 modifier_type_cd = f8
            6 participations [*]
              7 participation_id = f8
              7 participation_type_cd = f8
              7 participation_comment = vc
              7 participation_date = dq8
              7 participation_date_tz = i4
              7 participation_prsnl_id = f8
              7 participation_prsnl_ft = vc
              7 modifiers [*]
                8 modifier_type_cd = f8
            6 sections [*]
              7 result
                8 event_id = f8
                8 person_id = f8
                8 encounter_id = f8
                8 event_cd = f8
                8 effective_date = dq8
                8 effective_date_tz = i4
                8 status_cd = f8
                8 version = i4
                8 info_source_cd = f8
                8 contributor_system_cd = f8
                8 has_comments_ind = i2
                8 not_done_reason_cd = f8
                8 not_done_reason_ft = vc
                8 entry_mode_cd = f8
                8 task_assay_cd = f8
                8 task_assay_version = vc
                8 reference_id = vc
                8 update_date = dq8
                8 service_resource_cd = f8
                8 comments [*]
                  9 comment_id = f8
                  9 comment_text = gvc
                  9 comment_format_cd = f8
                  9 comment_author_id = f8
                  9 comment_date = dq8
                  9 comment_date_tz = i4
                  9 chartable_ind = i2
                  9 comment_type_cd = f8
                8 orders [*]
                  9 order_id = f8
              7 action_requests [*]
                8 action_request_id = f8
                8 action_request_type_cd = f8
                8 action_request_status_cd = f8
                8 action_request_comment = vc
                8 request_date = dq8
                8 request_date_tz = i4
                8 action_date = dq8
                8 action_date_tz = i4
                8 requestor_id = f8
                8 requestor_ft = vc
                8 requestee_id = f8
                8 requestee_ft = vc
                8 modifiers [*]
                  9 modifier_type_cd = f8
              7 participations [*]
                8 participation_id = f8
                8 participation_type_cd = f8
                8 participation_comment = vc
                8 participation_date = dq8
                8 participation_date_tz = i4
                8 participation_prsnl_id = f8
                8 participation_prsnl_ft = vc
                8 modifiers [*]
                  9 modifier_type_cd = f8
              7 section_title = vc
              7 section_published_ind = i2
              7 section_viewable_ind = i2
              7 section_sequence = vc
              7 documentation_date = dq8
              7 documentation_date_tz = i4
              7 text_bodies [*]
                8 text_storage_cd = f8
                8 text_format_cd = f8
                8 text_body = gvc
                8 location_handle = vc
              7 signature_line_text = gvc
              7 signature_line_type_cd = f8
      3 measurement [*]
        4 measurement_classification = vc
        4 accession_nbr = vc
        4 interpretation_cd = f8
        4 specimen_collection [*]
          5 collect_date = dq8
          5 collect_date_tz = i4
          5 collect_method_cd = f8
          5 collect_performer_id = f8
          5 collect_location_id = f8
          5 specimen
            6 specimen_id = f8
            6 specimen_source_cd = f8
            6 specimen_source_ft = vc
            6 specimen_body_site_cd = f8
          5 received_date = dq8
          5 received_date_tz = i4
        4 string_value [*]
          5 value = vc
          5 unit_cd = f8
          5 numeric_value [*]
            6 number = f8
            6 unit_cd = f8
            6 modifier_cd = f8
            6 digits_past_decimal = i4
        4 quantity_value [*]
          5 number = f8
          5 unit_cd = f8
          5 modifier_cd = f8
          5 digits_past_decimal = i4
        4 code_value [*]
          5 other_response = vc
          5 values [*]
            6 value_nomenclature_id = f8
            6 value_cd = f8
            6 unit_cd = f8
            6 group = i4
            6 code_value_sequence = i4
          5 nomen_string_flag = i2
        4 date_value [*]
          5 value_date = dq8
          5 value_date_tz = i4
          5 date_only_ind = i2
        4 reference_range [*]
          5 critical_low
            6 number = f8
            6 unit_cd = f8
          5 normal_low
            6 number = f8
            6 unit_cd = f8
          5 normal_high
            6 number = f8
            6 unit_cd = f8
          5 critical_high
            6 number = f8
            6 unit_cd = f8
          5 critical_low_text = vc
          5 normal_low_text = vc
          5 normal_high_text = vc
          5 critical_high_text = vc
          5 critical_low_ind = i2
          5 normal_low_ind = i2
          5 normal_high_ind = i2
          5 critical_high_ind = i2
        4 group_label [*]
          5 id = f8
          5 name = vc
          5 status_cd = f8
          5 sequence = i4
          5 performer_id = f8
          5 comments [*]
            6 comment_id = f8
            6 comment_text = gvc
            6 comment_format_cd = f8
            6 comment_author_id = f8
            6 comment_date = dq8
            6 comment_date_tz = i4
            6 chartable_ind = i2
            6 comment_type_cd = f8
        4 encapsulated_value [*]
          5 text = gvc
          5 media_type_cd = f8
      3 medication_administration [*]
        4 route_cd = f8
        4 site_cd = f8
        4 refusal_reason_cd = f8
        4 dose
          5 number = f8
          5 unit_cd = f8
          5 modifier_cd = f8
          5 digits_past_decimal = i4
        4 strength
          5 number = f8
          5 unit_cd = f8
          5 modifier_cd = f8
          5 digits_past_decimal = i4
        4 substance
          5 manufacturer = vc
          5 lot = vc
          5 expiration_date = dq8
        4 admin_note = vc
        4 admin_prov_id = f8
        4 event_id = f8
        4 not_done_ind = i2
        4 not_given_ind = i2
      3 microbiology [*]
        4 microbiology_accession_nbr = vc
        4 microbiology_interpretation_cd = f8
        4 specimen_collection
          5 collect_date = dq8
          5 collect_date_tz = i4
          5 collect_method_cd = f8
          5 collect_performer_id = f8
          5 collect_location_id = f8
          5 specimen
            6 specimen_id = f8
            6 specimen_source_cd = f8
            6 specimen_source_ft = vc
            6 specimen_body_site_cd = f8
          5 received_date = dq8
          5 received_date_tz = i4
        4 isolate_workups [*]
          5 org_occurrence_nbr = vc
          5 organism_cd = f8
          5 organism_type_cd = f8
          5 isolate_workup_sequence = i4
          5 tests [*]
            6 methodology_cd = f8
            6 test_sequence = i4
            6 panels [*]
              7 panel_cd = f8
              7 panel_sequence = i4
              7 antibiotic_results [*]
                8 antibiotic_cd = f8
                8 susceptibility
                  9 susceptibility_id = f8
                  9 susceptibility_type_cd = f8
                  9 susceptibility_status_cd = f8
                  9 susceptibility_prsnl_id = f8
                  9 susceptibility_date = dq8
                  9 susceptibility_date_tz = i4
                  9 dilution_value_cd = f8
                  9 susceptibility_value
                    10 number = f8
                    10 unit_cd = f8
                    10 modifier_cd = f8
                    10 digits_past_decimal = i4
                  9 susceptibility_comments [*]
                    10 suscep_comment_id = f8
                    10 suscep_comment_text = gvc
                    10 suscep_comment_format_cd = f8
                  9 susceptibility_seq_nbr = i4
                  9 chartable_ind = i2
                  9 freetext_value = vc
                8 interpretations [*]
                  9 interpretation_id = f8
                  9 interpretation_type_cd = f8
                  9 interpretation_status_cd = f8
                  9 interpretation_prsnl_id = f8
                  9 interpretation_date = dq8
                  9 interpretation_date_tz = i4
                  9 interpretation_cd = f8
                  9 interpretation_comments [*]
                    10 suscep_comment_id = f8
                    10 suscep_comment_text = gvc
                    10 suscep_comment_format_cd = f8
                  9 susceptibility_seq_nbr = i4
                  9 chartable_ind = i2
                8 susceptibilities [*]
                  9 susceptibility_id = f8
                  9 susceptibility_type_cd = f8
                  9 susceptibility_status_cd = f8
                  9 susceptibility_prsnl_id = f8
                  9 susceptibility_date = dq8
                  9 susceptibility_date_tz = i4
                  9 dilution_value_cd = f8
                  9 susceptibility_value
                    10 number = f8
                    10 unit_cd = f8
                    10 modifier_cd = f8
                    10 digits_past_decimal = i4
                  9 susceptibility_comments [*]
                    10 suscep_comment_id = f8
                    10 suscep_comment_text = gvc
                    10 suscep_comment_format_cd = f8
                  9 susceptibility_seq_nbr = i4
                  9 chartable_ind = i2
                  9 freetext_value = vc
        4 reports [*]
          5 doc_id = f8
          5 doc_published_ind = i2
          5 doc_date = dq8
          5 doc_date_tz = i4
          5 doc_status_cd = f8
          5 doc_text = gvc
          5 doc_format_cd = f8
          5 doc_type_cd = f8
          5 participations [*]
            6 participation_id = f8
            6 participation_type_cd = f8
            6 participation_comment = vc
            6 participation_date = dq8
            6 participation_date_tz = i4
            6 participation_prsnl_id = f8
            6 participation_prsnl_ft = vc
            6 modifiers [*]
              7 modifier_type_cd = f8
          5 event_cd = f8
          5 isolate_workups [*]
            6 org_occurrence_nbr = vc
            6 organism_cd = f8
            6 organism_type_cd = f8
            6 isolate_workup_sequence = i4
            6 tests [*]
              7 methodology_cd = f8
              7 test_sequence = i4
              7 panels [*]
                8 panel_cd = f8
                8 panel_sequence = i4
                8 antibiotic_results [*]
                  9 antibiotic_cd = f8
                  9 susceptibility
                    10 susceptibility_id = f8
                    10 susceptibility_type_cd = f8
                    10 susceptibility_status_cd = f8
                    10 susceptibility_prsnl_id = f8
                    10 susceptibility_date = dq8
                    10 susceptibility_date_tz = i4
                    10 dilution_value_cd = f8
                    10 susceptibility_value
                      11 number = f8
                      11 unit_cd = f8
                      11 modifier_cd = f8
                      11 digits_past_decimal = i4
                    10 susceptibility_comments [*]
                      11 suscep_comment_id = f8
                      11 suscep_comment_text = gvc
                      11 suscep_comment_format_cd = f8
                    10 susceptibility_seq_nbr = i4
                    10 chartable_ind = i2
                    10 freetext_value = vc
                  9 interpretations [*]
                    10 interpretation_id = f8
                    10 interpretation_type_cd = f8
                    10 interpretation_status_cd = f8
                    10 interpretation_prsnl_id = f8
                    10 interpretation_date = dq8
                    10 interpretation_date_tz = i4
                    10 interpretation_cd = f8
                    10 interpretation_comments [*]
                      11 suscep_comment_id = f8
                      11 suscep_comment_text = gvc
                      11 suscep_comment_format_cd = f8
                    10 susceptibility_seq_nbr = i4
                    10 chartable_ind = i2
                  9 susceptibilities [*]
                    10 susceptibility_id = f8
                    10 susceptibility_type_cd = f8
                    10 susceptibility_status_cd = f8
                    10 susceptibility_prsnl_id = f8
                    10 susceptibility_date = dq8
                    10 susceptibility_date_tz = i4
                    10 dilution_value_cd = f8
                    10 susceptibility_value
                      11 number = f8
                      11 unit_cd = f8
                      11 modifier_cd = f8
                      11 digits_past_decimal = i4
                    10 susceptibility_comments [*]
                      11 suscep_comment_id = f8
                      11 suscep_comment_text = gvc
                      11 suscep_comment_format_cd = f8
                    10 susceptibility_seq_nbr = i4
                    10 chartable_ind = i2
                    10 freetext_value = vc
        4 stains [*]
          5 doc_id = f8
          5 doc_published_ind = i2
          5 doc_date = dq8
          5 doc_date_tz = i4
          5 doc_status_cd = f8
          5 doc_text = gvc
          5 doc_format_cd = f8
          5 doc_type_cd = f8
          5 participations [*]
            6 participation_id = f8
            6 participation_type_cd = f8
            6 participation_comment = vc
            6 participation_date = dq8
            6 participation_date_tz = i4
            6 participation_prsnl_id = f8
            6 participation_prsnl_ft = vc
            6 modifiers [*]
              7 modifier_type_cd = f8
          5 event_cd = f8
        4 start_date = dq8
        4 start_date_tz = i4
      3 procedure [*]
        4 document_containers [*]
          5 doc_container_title = vc
          5 doc_container_published_ind = i2
          5 doc_container_viewable_ind = i2
          5 document
            6 result
              7 event_id = f8
              7 person_id = f8
              7 encounter_id = f8
              7 event_cd = f8
              7 effective_date = dq8
              7 effective_date_tz = i4
              7 status_cd = f8
              7 version = i4
              7 info_source_cd = f8
              7 contributor_system_cd = f8
              7 has_comments_ind = i2
              7 not_done_reason_cd = f8
              7 not_done_reason_ft = vc
              7 entry_mode_cd = f8
              7 task_assay_cd = f8
              7 task_assay_version = vc
              7 reference_id = vc
              7 update_date = dq8
              7 service_resource_cd = f8
              7 comments [*]
                8 comment_id = f8
                8 comment_text = gvc
                8 comment_format_cd = f8
                8 comment_author_id = f8
                8 comment_date = dq8
                8 comment_date_tz = i4
                8 chartable_ind = i2
                8 comment_type_cd = f8
              7 orders [*]
                8 order_id = f8
            6 action_requests [*]
              7 action_request_id = f8
              7 action_request_type_cd = f8
              7 action_request_status_cd = f8
              7 action_request_comment = vc
              7 request_date = dq8
              7 request_date_tz = i4
              7 action_date = dq8
              7 action_date_tz = i4
              7 requestor_id = f8
              7 requestor_ft = vc
              7 requestee_id = f8
              7 requestee_ft = vc
              7 modifiers [*]
                8 modifier_type_cd = f8
            6 participations [*]
              7 participation_id = f8
              7 participation_type_cd = f8
              7 participation_comment = vc
              7 participation_date = dq8
              7 participation_date_tz = i4
              7 participation_prsnl_id = f8
              7 participation_prsnl_ft = vc
              7 modifiers [*]
                8 modifier_type_cd = f8
            6 document_title = vc
            6 document_published_ind = i2
            6 document_viewable_ind = i2
            6 document_sequence = vc
            6 documentation_date = dq8
            6 documentation_date_tz = i4
            6 signature_line_text = gvc
            6 signature_line_type_cd = f8
            6 contributions [*]
              7 clinical_event
                8 event_id = f8
                8 encounter_id = f8
                8 has_comments_ind = i2
                8 not_done_reason_cd = f8
                8 not_done_reason_ft = vc
                8 entry_mode_cd = f8
                8 task_assay_cd = f8
                8 task_assay_version = vc
                8 reference_id = vc
                8 update_date = dq8
                8 service_resource_cd = f8
                8 orders [*]
                  9 order_id = f8
              7 action_requests [*]
                8 action_request_id = f8
                8 action_request_type_cd = f8
                8 action_request_status_cd = f8
                8 action_request_comment = vc
                8 request_date = dq8
                8 request_date_tz = i4
                8 action_date = dq8
                8 action_date_tz = i4
                8 requestor_id = f8
                8 requestor_ft = vc
                8 requestee_id = f8
                8 requestee_ft = vc
                8 modifiers [*]
                  9 modifier_type_cd = f8
              7 participations [*]
                8 participation_id = f8
                8 participation_type_cd = f8
                8 participation_comment = vc
                8 participation_date = dq8
                8 participation_date_tz = i4
                8 participation_prsnl_id = f8
                8 participation_prsnl_ft = vc
                8 modifiers [*]
                  9 modifier_type_cd = f8
              7 sections [*]
                8 result
                  9 event_id = f8
                  9 person_id = f8
                  9 encounter_id = f8
                  9 event_cd = f8
                  9 effective_date = dq8
                  9 effective_date_tz = i4
                  9 status_cd = f8
                  9 version = i4
                  9 info_source_cd = f8
                  9 contributor_system_cd = f8
                  9 has_comments_ind = i2
                  9 not_done_reason_cd = f8
                  9 not_done_reason_ft = vc
                  9 entry_mode_cd = f8
                  9 task_assay_cd = f8
                  9 task_assay_version = vc
                  9 reference_id = vc
                  9 update_date = dq8
                  9 service_resource_cd = f8
                  9 comments [*]
                    10 comment_id = f8
                    10 comment_text = gvc
                    10 comment_format_cd = f8
                    10 comment_author_id = f8
                    10 comment_date = dq8
                    10 comment_date_tz = i4
                    10 chartable_ind = i2
                    10 comment_type_cd = f8
                  9 orders [*]
                    10 order_id = f8
                8 action_requests [*]
                  9 action_request_id = f8
                  9 action_request_type_cd = f8
                  9 action_request_status_cd = f8
                  9 action_request_comment = vc
                  9 request_date = dq8
                  9 request_date_tz = i4
                  9 action_date = dq8
                  9 action_date_tz = i4
                  9 requestor_id = f8
                  9 requestor_ft = vc
                  9 requestee_id = f8
                  9 requestee_ft = vc
                  9 modifiers [*]
                    10 modifier_type_cd = f8
                8 participations [*]
                  9 participation_id = f8
                  9 participation_type_cd = f8
                  9 participation_comment = vc
                  9 participation_date = dq8
                  9 participation_date_tz = i4
                  9 participation_prsnl_id = f8
                  9 participation_prsnl_ft = vc
                  9 modifiers [*]
                    10 modifier_type_cd = f8
                8 section_title = vc
                8 section_published_ind = i2
                8 section_viewable_ind = i2
                8 section_sequence = vc
                8 documentation_date = dq8
                8 documentation_date_tz = i4
                8 text_bodies [*]
                  9 text_storage_cd = f8
                  9 text_format_cd = f8
                  9 text_body = gvc
                  9 location_handle = vc
                8 signature_line_text = gvc
                8 signature_line_type_cd = f8
      3 custom_display = vc
  1 consent
    2 consent_status_cd = f8
  1 diagnosis
    2 diagnoses [*]
      3 working_diagnosis = vc
  1 auth_encounter
    2 auth_encounters [*]
      3 encounter_id = f8
  1 patient_relationship
    2 patient_relationships [*]
      3 person_prsnl_reltn_id = f8
      3 person_prsnl_reltn_cd = f8
      3 prsnl_id = f8
      3 formatted_prsnl_name = vc
      3 begin_effective_dt_tm = dq8
      3 end_effective_dt_tm = dq8
  1 encounter_relationship
    2 encounter_relationships [*]
      3 encntr_prsnl_reltn_id = f8
      3 encntr_prsnl_reltn_cd = f8
      3 encntr_id = f8
      3 prsnl_id = f8
      3 formatted_prsnl_name = vc
      3 begin_effective_dt_tm = dq8
      3 end_effective_dt_tm = dq8
  1 status_data
    2 status = c1
    2 subeventstatus [*]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
  1 relationship_by_types
    2 eprs [*]
      3 encntr_prsnl_reltn_id = f8
      3 encntr_prsnl_reltn_cd = f8
      3 encntr_id = f8
      3 prsnl_id = f8
      3 formatted_prsnl_name = vc
      3 beg_effective_dt_tm = dq8
      3 end_effective_dt_tm = dq8
    2 pprs [*]
      3 person_prsnl_reltn_id = f8
      3 person_prsnl_reltn_cd = f8
      3 prsnl_id = f8
      3 formatted_prsnl_name = vc
      3 beg_effective_dt_tm = dq8
      3 end_effective_dt_tm = dq8
)
 
;680500	MSVC_GetPrivilegesByCodes
free record 680500_req
record 680500_req (
  1 patient_user_criteria
    2 user_id = f8
    2 patient_user_relationship_cd = f8
  1 privilege_criteria
    2 privileges [*]
      3 privilege_cd = f8
    2 locations [*]
      3 location_id = f8
)
 
free record 680500_rep
record 680500_rep (
  1 patient_user_information
    2 user_id = f8
    2 patient_user_relationship_cd = f8
    2 role_id = f8
  1 privileges [*]
    2 privilege_cd = f8
    2 default [*]
      3 granted_ind = i2
      3 exceptions [*]
        4 entity_name = vc
        4 type_cd = f8
        4 id = f8
      3 status
        4 success_ind = i2
    2 locations [*]
      3 location_id = f8
      3 privilege
        4 granted_ind = i2
        4 exceptions [*]
          5 entity_name = vc
          5 type_cd = f8
          5 id = f8
        4 status
          5 success_ind = i2
  1 transaction_status
    2 success_ind = i2
    2 debug_error_message = vc
)
 
;600373	dcp_get_dcp_form
free record 600373_req
record 600373_req (
  1 dcp_forms_ref_id = f8
  1 version_dt_tm = dq8
)
 
free record 600373_rep
record 600373_rep (
   1 dcp_forms_ref_id = f8
   1 dcp_form_instance_id = f8
   1 description = vc
   1 definition = vc
   1 task_assay_cd = f8
   1 task_assay_disp = vc
   1 event_cd = f8
   1 event_cd_disp = vc
   1 done_charting_ind = i2
   1 active_ind = i2
   1 height = i4
   1 width = i4
   1 flags = i4
   1 beg_effective_dt_tm = dq8
   1 end_effective_dt_tm = dq8
   1 updt_cnt = i4
   1 sect_cnt = i2
   1 text_rendition_event_cd = f8
   1 sect_list [*]
     2 dcp_forms_def_id = f8
     2 section_seq = i4
     2 dcp_section_ref_id = f8
     2 dcp_section_instance_id = f8
     2 description = vc
     2 definition = vc
     2 flags = i4
     2 width = i4
     2 height = i4
     2 task_assay_cd = f8
     2 task_assay_disp = vc
     2 event_cd = f8
     2 event_disp = vc
     2 active_ind = i2
     2 beg_effective_dt_tm = dq8
     2 end_effective_dt_tm = dq8
     2 updt_cnt = i4
     2 input_cnt = i2
     2 input_list [* ]
		3 dcp_input_ref_id = f8
		3 input_ref_seq = i4
		3 description = vc
		3 module = vc
		3 input_type = i4
		3 updt_cnt = i4
		3 nv_cnt = i2
		3 nv [* ]
			4 pvc_name = vc
			4 pvc_value = vc
			4 merge_id = f8
			4 sequence = i4
   	 2 cki = vc
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c15
       3 operationstatus = c1
       3 targetobjectname = c15
       3 targetobjectvalue = vc
   1 event_set_name = vc
 )
 
;680501	MSVC_CheckPrivileges
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
 
;600471	dcp_get_section_input_runtime
free record 600471_req
record 600471_req (
  1 dcp_section_ref_id = f8
  1 dcp_section_instance_id = f8
  1 cki = vc
)
 
free record 600471_rep
record 600471_rep (
    1 dcp_section_instance_id = f8
    1 dcp_section_ref_id = f8
    1 description = vc
    1 definition = vc
    1 task_assay_cd = f8
    1 task_assay_disp = vc
    1 event_cd = f8
    1 event_disp = vc
    1 active_ind = i2
    1 beg_effective_dt_tm = dq8
    1 end_effective_dt_tm = dq8
    1 updt_cnt = i4
    1 input_cnt = i2
    1 input_list [* ]
      2 dcp_input_ref_id = f8
      2 input_ref_seq = i4
      2 description = vc
      2 module = vc
      2 input_type = i4
      2 updt_cnt = i4
      2 nv_cnt = i2
      2 nv [* ]
        3 pvc_name = vc
        3 pvc_value = vc
        3 merge_id = f8
        3 sequence = i4
    1 cki = vc
    1 width = i4
    1 height = i4
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
  )
 
;600356	dcp_get_dta_info_all
free record 600356_req
record 600356_req (
  1 dta [*]
    2 task_assay_cd = f8
)
 
free record 600356_rep
record 600356_rep (
    1 dta [* ]
      2 task_assay_cd = f8
      2 active_ind = i2
      2 mnemonic = vc
      2 description = vc
      2 event_cd = f8
      2 activity_type_cd = f8
      2 activity_type_disp = vc
      2 activity_type_desc = vc
      2 activity_type_mean = vc
      2 default_result_type_cd = f8
      2 default_result_type_disp = c40
      2 default_result_type_desc = c60
      2 default_result_type_mean = vc
      2 code_set = i4
      2 equation [* ]
        3 equation_id = f8
        3 equation_description = vc
        3 equation_postfix = vc
        3 script = vc
        3 species_cd = f8
        3 sex_cd = f8
        3 age_from_minutes = i4
        3 age_to_minutes = i4
        3 service_resource_cd = f8
        3 unknown_age_ind = i2
        3 e_comp_cnt = i4
        3 e_comp [* ]
          4 constant_value = f8
          4 default_value = f8
          4 units_cd = f8
          4 included_assay_cd = f8
          4 name = vc
          4 result_req_flag = i2
          4 look_time_direction_flag = i2
          4 time_window_minutes = i4
          4 time_window_back_minutes = i4
          4 event_cd = f8
        3 age_from = i4
        3 age_to = i4
        3 age_from_units_cd = f8
        3 age_to_units_cd = f8
        3 age_from_units_meaning = vc
        3 age_to_units_meaning = vc
      2 ref_range_factor [* ]
        3 species_cd = f8
        3 sex_cd = f8
        3 age_from_minutes = i4
        3 age_to_minutes = i4
        3 service_resource_cd = f8
        3 encntr_type_cd = f8
        3 specimen_type_cd = f8
        3 review_ind = i2
        3 review_low = f8
        3 review_high = f8
        3 sensitive_ind = i2
        3 sensitive_low = f8
        3 sensitive_high = f8
        3 normal_ind = i2
        3 normal_low = f8
        3 normal_high = f8
        3 critical_ind = i2
        3 critical_low = f8
        3 critical_high = f8
        3 feasible_ind = i2
        3 feasible_low = f8
        3 feasible_high = f8
        3 units_cd = f8
        3 units_disp = c40
        3 units_desc = c60
        3 code_set = i4
        3 minutes_back = i4
        3 def_result_ind = i2
        3 default_result = vc
        3 default_result_value = f8
        3 unknown_age_ind = i2
        3 alpha_response_ind = i2
        3 alpha_responses_cnt = i4
        3 alpha_responses [* ]
          4 nomenclature_id = f8
          4 source_string = vc
          4 short_string = vc
          4 mnemonic = c25
          4 sequence = i4
          4 default_ind = i2
          4 description = vc
          4 result_value = f8
          4 multi_alpha_sort_order = i4
          4 concept_identifier = vc
        3 age_from = i4
        3 age_to = i4
        3 age_from_units_cd = f8
        3 age_to_units_cd = f8
        3 age_from_units_meaning = vc
        3 age_to_units_meaning = vc
        3 categories [* ]
          4 category_id = f8
          4 expand_flag = i2
          4 category_name = vc
          4 sequence = i4
          4 alpha_responses [* ]
            5 nomenclature_id = f8
            5 source_string = vc
            5 short_string = vc
            5 mnemonic = c25
            5 sequence = i4
            5 default_ind = i2
            5 description = vc
            5 result_value = f8
            5 multi_alpha_sort_order = i4
            5 concept_identifier = vc
      2 data_map [* ]
        3 data_map_type_flag = i2
        3 result_entry_format = i4
        3 max_digits = i4
        3 min_digits = i4
        3 min_decimal_places = i4
        3 service_resource_cd = f8
      2 modifier_ind = i2
      2 single_select_ind = i2
      2 default_type_flag = i2
      2 version_number = f8
      2 io_flag = i2
      2 io_total_definition_id = f8
      2 label_template_id = f8
      2 template_script_cd = f8
      2 event_set_cd = f8
      2 dta_offset_mins [* ]
        3 dta_offset_min_id = f8
        3 beg_effective_dt_tm = dq8
        3 end_effective_dt_tm = dq8
        3 offset_min_nbr = i4
        3 offset_min_type_cd = f8
      2 witness_required_ind = i2
    1 cond_exp [* ]
      2 cond_expression_id = f8
      2 cond_expression_name = c100
      2 cond_expression_text = c512
      2 cond_postfix_txt = c512
      2 multiple_ind = i2
      2 prev_cond_expression_id = f8
      2 beg_effective_dt_tm = dq8
      2 end_effective_dt_tm = dq8
      2 exp_comp [* ]
        3 active_ind = i2
        3 beg_effective_dt_tm = dq8
        3 cond_comp_name = c30
        3 cond_expression_comp_id = f8
        3 end_effective_dt_tm = dq8
        3 operator_cd = f8
        3 parent_entity_id = f8
        3 parent_entity_name = c60
        3 prev_cond_expression_comp_id = f8
        3 required_ind = i2
        3 trigger_assay_cd = f8
        3 result_value = f8
        3 cond_expression_id = f8
      2 cond_dtas [* ]
        3 active_ind = i2
        3 age_from_nbr = f8
        3 age_from_unit_cd = f8
        3 age_to_nbr = f8
        3 age_to_unit_cd = f8
        3 beg_effective_dt_tm = dq8
        3 conditional_assay_cd = f8
        3 conditional_dta_id = f8
        3 end_effective_dt_tm = dq8
        3 gender_cd = f8
        3 location_cd = f8
        3 position_cd = f8
        3 prev_conditional_dta_id = f8
        3 required_ind = i2
        3 unknown_age_ind = i2
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
  )
 
;600908	dcp_upd_lock_forms_activity
free record 600908_req
record 600908_req (
  1 forms_activity_id = f8
  1 prsnl_id = f8
  1 override_existing_lock_flag = i2
  1 free_lock_flag = i2
)
 
free record 600908_rep
record 600908_rep (
   1 prsnl_id = f8
   1 lock_create_dt_tm = dq8
   1 forms_activity_id = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
;600907 dcp_chk_lock_forms_activity
free record 600907_req
record 600907_req (
  1 prsnl_id = f8
  1 forms_activity_id = f8
)
 
free record 600907_rep
record 600907_rep (
   1 prsnl_id = f8
   1 forms_activity_id = f8
   1 lock_create_dt_tm = dq8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
 
; 600353 dcp_upd_forms_activity
free record 600353_req
record 600353_req (
  1 form_activity_id = f8
  1 form_reference_id = f8
  1 person_id = f8
  1 encntr_id = f8
  1 task_id = f8
  1 form_dt_tm = dq8
  1 form_tz = i4
  1 form_status_cd = f8
  1 flags = i4
  1 description = vc
  1 version_dt_tm = dq8
  1 component [*]
    2 parent_entity_name = vc
    2 parent_entity_id = f8
    2 component_cd = f8
  1 prsnl [*]
    2 prsnl_id = f8
    2 prsnl_ft = vc
    2 proxy_id = f8
    2 activity_dt_tm = dq8
  1 reference_nbr = vc
)
 
free record 600353_rep
record 600353_rep (
  1 activity_form_id = f8
  1 status_data
    2 status = c1
    2 subeventstatus [*]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
)
 
;600345 dcp_events_ensured
free record 600345_req
record 600345_req (
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
 
free record 600345_rep
record 600345_rep (
	1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c15
       3 operationstatus = c1
       3 targetobjectname = c15
       3 targetobjectvalue = vc
)
 
;560303	DCP.ModTask
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
 
; Final reply
free record intervention_reply_out
record intervention_reply_out (
	1 intervention_id			= f8
  	1 audit
	    2 user_id             	= f8
	    2 user_firstname        = vc
	    2 user_lastname         = vc
	    2 patient_id            = f8
	    2 patient_firstname     = vc
	    2 patient_lastname      = vc
	    2 service_version       = vc
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
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
; Input parameters
declare dInterventionId		= f8 with protect, noconstant(0.0)
declare sUserName			= vc with protect, noconstant("")
declare dPrsnlId			= f8 with protect, noconstant(0.0)
declare sJsonArgs			= gvc with protect, noconstant("")
declare iDebugFlag			= i2 with protect, noconstant(0)
declare dStatusCd			= f8 with protect, noconstant(0.0)
 
; Other
declare dPatientId			= f8 with protect, noconstant(0.0)
declare dEncounterId		= f8 with protect, noconstant(0.0)
declare dOrderId			= f8 with protect, noconstant(0.0)
declare dFormsRefId			= f8 with protect, noconstant(0.0)
declare dTaskId				= f8 with protect, noconstant(0.0)
declare iTimeZone			= i2 with protect, noconstant(0.0)
declare sReferenceNumber	= c60 with protect, noconstant("")
declare dFormEventId		= f8 with protect, noconstant(0.0)
declare dReferenceTaskId	= f8 with protect, noconstant(0.0)
declare dCurrStatusCd		= f8 with protect, noconstant(0.0)
declare sCurrStatusMean		= vc with protect, noconstant("")
declare sStatusMean			= vc with protect, noconstant("")
 
; Constants
declare c_now_dt_tm			= dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
 
declare c_clinpharm_task_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",6026,"CLINPHARM"))
declare c_chartresult_task_activity_cd = f8 with protect, constant(uar_get_code_by("MEANING",6027,"CHART RESULT"))
declare c_adhoc_task_class_cd	= f8 with protect, constant(uar_get_code_by("MEANING",6025,"ADHOC"))
declare c_dropped_task_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",79,"DROPPED"))
declare c_inprocess_task_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",79,"INPROCESS"))
declare c_complete_task_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",79,"COMPLETE"))
declare c_charting_agent_cd = f8 with protect, constant(uar_get_code_by("MEANING",255090,"POWERFORM"))
declare c_doc_val_section_priv =  f8 with protect, constant(uar_get_code_by("MEANING",6016,"VALSECONLY"))
declare c_signpowerform_priv = f8 with protect, constant(uar_get_code_by("MEANING",6016,"SIGNPOWERFRM"))
declare c_contributor_system_cd = f8 with protect, constant(uar_get_code_by("MEANING",89,"POWERCHART"))
declare c_grp_event_class_cd = f8 with protect, constant(uar_get_code_by("MEANING",53,"GRP"))
declare c_txt_event_class_cd = f8 with protect, constant(uar_get_code_by("MEANING",53,"TXT"))
declare c_active_record_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",48,"ACTIVE"))
declare c_auth_result_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",8,"AUTH"))
declare c_inprogress_result_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",8,"IN PROGRESS"))
declare c_root_event_reltn_cd = f8 with protect, constant(uar_get_code_by("MEANING",24,"ROOT"))
declare c_child_event_reltn_cd = f8 with protect, constant(uar_get_code_by("MEANING",24,"CHILD"))
declare c_completed_action_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",103,"COMPLETED"))
declare c_order_action_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",21,"ORDER"))
declare c_verify_action_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",21,"VERIFY"))
declare c_perform_action_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",21,"PERFORM"))
declare c_modify_action_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",21,"MODIFY"))
declare c_clinicalevent_activity_component_cd = f8 with protect, constant(uar_get_code_by("MEANING",18189,"CLINCALEVENT"))
declare c_order_activity_component_cd = f8 with protect, constant(uar_get_code_by("MEANING",18189,"ORDER"))
declare c_pharminterv_activity_component_cd = f8 with protect, constant(uar_get_code_by("MEANING",18189,"PHARMINTERV"))
declare c_alpha_string_result_format_cd = f8 with protect, constant(uar_get_code_by("MEANING",14113,"ALPHA"))
declare c_powerform_entry_mode_cd = f8 with protect, constant(uar_get_code_by("MEANING",29520,"POWERFORMS"))
declare c_powerform_entry_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",255431,"POWERFORMS"))
declare c_dcpgeneric_event_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY",72,"DCPGENERICCODE"))
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set dInterventionId				= cnvtreal($INTERVENTION_ID)
set sUserName					= trim($USERNAME, 3)
set dPrsnlId					= GetPrsnlIDFromUserName(sUserName) ;defined in snsro_common
set reqinfo->updt_id			= dPrsnlId  	;003
set sJsonArgs					= trim($JSON,3)
set jrec						= cnvtjsontorec(sJsonArgs)
set dStatusCd					= cnvtreal(arglist->Status)
set iDebugFlag					= cnvtint($DEBUG_FLAG)
 
if(idebugFlag > 0)
	call echo(build("dInterventionId -> ",dInterventionId))
	call echo(build("sUserName -> ",sUserName))
	call echo(build("dPrsnlId -> ",dPrsnlId))
	call echo(build("dStatusCd -> ",dStatusCd))
	call echo(build("sJsonArgs -> ",sJsonArgs))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetInputData(null)				= null with protect 	;Gather input data
declare GetInterventionDetail(null) 	= i2 with protect		;Gather details based on intervention id
declare ValidateStatus(null)			= null with protect		;Ensure current status can be updated by submitted status
declare GetClinicalEventDetails(null) 	= i2 with protect 		;1000011 event detail query
declare GetOrderDetails(null)			= i2 with protect 		;500415	orm_get_order_by_id
declare GetEncntrDetails(null)			= i2 with protect 		;3200310 	msvc_svr_get_clinctx
declare GetFormDefinition(null)			= i2 with protect 		;600373	dcp_get_dcp_form
declare GetPrivsByCode(null)			= i2 with protect 		;680500	MSVC_GetPrivilegesByCodes
declare CheckPrivileges(null)			= i2 with protect 		;680501	MSVC_CheckPrivileges
declare GetFormSectionDetails(null)		= i2 with protect 		;600471	dcp_get_section_input_runtime
declare GetFormDtaDetails(null)			= i2 with protect 		;600356	dcp_get_dta_info_all
declare BuildTempPowerForm(null)		= null with protect 	;Build temp powerform
declare ValidateInputData(null)			= null with protect 	;Validate user input based on powerform build constraints
declare ValidateTimeFormat(time = vc) 	= i4 with protect		;verifies time is 24hr format with four digits
declare UpdateDcpLocks(null)			= i2 with protect		;600908	dcp_upd_lock_forms_activity
declare CheckDcpLocks(null)				= i2 with protect		;600907 dcp_chk_lock_forms_activity
declare PostPowerform(null)				= i2 with protect 		;1000012 	Add to Clinical Event Table
declare UpdateFormsActivity(null)		= i2 with protect 		;600353 dcp_upd_forms_activity
declare EnsureDcpEvents(null)			= null with protect 	;600345 dcp_events_ensured
declare ModifyOrderTask(null)			= i2 with protect 		;560303	DCP.ModTask
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
if(dInterventionId = 0)
	call ErrorHandler2("PUT INTERVENTION", "F", "Invalid URI Parameters", "Missing required field: InterventionId.",
	"9999", "Missing required field: InterventionId", intervention_reply_out)
	go to EXIT_SCRIPT
endif
 
; Gather input arguments
call GetInputData(null)
 
; Get Data based on Intervention Id
set iRet = GetInterventionDetail(null)
if(iRet = 0)
	call ErrorHandler2("PUT INTERVENTION", "F", "Invalid URI parameters", "Invalid InterventionId",
	"9999",build2("Invalid InterventionId: ",dInterventionId), intervention_reply_out)
	go to exit_script
endif
 
;Check Status code provided is valid
set iRet = GetCodeSet(dStatusCd)
if(iRet != 8)
	call ErrorHandler2("PUT INTERVENTION", "F", "Validate", "Invalid Status provided.",
	"9999",build2("Invalid Status provided."), intervention_reply_out)
	go to exit_script
else
	set sStatusMean = uar_get_code_meaning(dStatusCd)
	call ValidateStatus(null)
endif
 
;Get Clinical Event Details - 1000011 event detail query
set iRet = GetClinicalEventDetails(null)
if(iRet = 0)
	call ErrorHandler2("PUT INTERVENTION", "F", "Validate", "Could not retrieve clinical event details.",
	"9999",build2("Could not retrieve clinical event details."), intervention_reply_out)
	go to exit_script
endif
 
; Validate username
set iRet = PopulateAudit(sUserName, dPatientId, intervention_reply_out, sVersion)
if(iRet = 0)
  call ErrorHandler2("PUT INTERVENTION", "F", "User is invalid", "Invalid User for Audit.",
  "1001",build2("Invalid user: ",sUserName), intervention_reply_out)
  go to exit_script
endif
 
; Get Order Information - 500415 orm_get_order_by_id
set iRet = GetOrderDetails(null)
if(iRet = 0)
  call ErrorHandler2("PUT INTERVENTION", "F", "Validate", "Invalid OrderId",
  "2079",build2("Invalid OrderId: ",dOrderId), intervention_reply_out)
  go to exit_script
endif
 
; Get Encounter Details - 3200310 msvc_svr_get_clinctx
set iRet = GetEncntrDetails(null)
if(iRet = 0)
  call ErrorHandler2("PUT INTERVENTION", "F", "Encounter Details", "Could not retrieve encounter details.",
  "2004","Could not retrieve encounter details.", intervention_reply_out)
  go to exit_script
endif
 
; Get Form Definition details - 600373 dcp_get_dcp_form
set iRet = GetFormDefinition(null)
if(iRet = 0)
  call ErrorHandler2("PUT INTERVENTION", "F", "Form Definition", "Could not retrieve form definition.",
  "9999","Could not retrieve form definition.", intervention_reply_out)
  go to exit_script
endif
 
; Get privileges by code - 680500 MSVC_GetPrivilegesByCodes
set iRet = GetPrivsByCode(null)
if(iRet = 0)
  call ErrorHandler2("PUT INTERVENTION", "F", "Get Privileges", "Could not retrieve privileges.",
  "9999","Could not retrieve privileges.", intervention_reply_out)
  go to exit_script
endif
 
; Check priviliges - 680501	MSVC_CheckPrivileges
set iRet = CheckPrivileges(null)
if(iRet = 0)
  call ErrorHandler2("PUT INTERVENTION", "F", "Check Privileges", "User does not have privileges.",
  "9999","User does not have privileges.", intervention_reply_out)
  go to exit_script
endif
 
; Get Powerform Section details - 600471 dcp_get_section_input_runtime
set iRet = GetFormSectionDetails(null)
if(iRet = 0)
  call ErrorHandler2("PUT INTERVENTION", "F", "Section Details", "Could not retrieve section details.",
  "9999","Could not retrieve section details.", intervention_reply_out)
  go to exit_script
endif
 
; Get DTA details - 600356 dcp_get_dta_info_all
set iRet = GetFormDtaDetails(null)
if(iRet = 0)
  call ErrorHandler2("PUT INTERVENTION", "F", "DTA Details", "Could not retrieve DTA details.",
  "9999","Could not retrieve DTA details.", intervention_reply_out)
  go to exit_script
endif
 
; Build Temp Powerform
call BuildTempPowerForm(null)
 
; Validate input data based on powerform build constraints
call ValidateInputData(null)
 
; Update DCP Activity Lock - 600908	dcp_upd_lock_forms_activity
set iRet = UpdateDcpLocks(null)
if(iRet = 0)
  call ErrorHandler2("PUT INTERVENTION", "F", "DTA Details", "Could not create lock.",
  "9999","Could not create lock.", intervention_reply_out)
  go to exit_script
endif
 
; Check DCP Activity Locks - 600907 dcp_chk_lock_forms_activity
set iRet = CheckDcpLocks(null)
if(iRet = 0)
  call ErrorHandler2("PUT INTERVENTION", "F", "DTA Details", "Lock not found.",
  "9999","Lock not found.", intervention_reply_out)
  go to exit_script
endif
 
; Post the PowerForm - 1000012 	Add to Clinical Event Table
set iRet = PostPowerform(null)
if(iRet = 0)
  call ErrorHandler2("PUT INTERVENTION", "F", "Post PowerForm", "Could not post PowerForm.",
  "9999","Could not post PowerForm.", intervention_reply_out)
  go to exit_script
endif
 
; Update Forms Activity Table - 600353 dcp_upd_forms_activity
set iRet = UpdateFormsActivity(null)
if(iRet = 0)
  call ErrorHandler2("PUT INTERVENTION", "F", "Update Forms Activity", "Could not update forms activity.",
  "9999","Could not update forms activity.", intervention_reply_out)
  go to exit_script
endif
 
; Ensure DCP events - 600345 dcp_events_ensured
call EnsureDcpEvents(null)
 
; Modify the task tied to the order and powerform - 560303 DCP.ModTask
set iRet = ModifyOrderTask(null)
if(iRet = 0)
  call ErrorHandler2("PUT INTERVENTION", "F", "Complete Task", "Could not complete task.",
  "9999","Could not complete task.", intervention_reply_out)
  go to exit_script
endif
 
; Update Audit with successful status
call ErrorHandler2("PUT INTERVENTION", "S", "Success", "Intervention updated successfully.",
"0000", "Intervention updated successfully", intervention_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
  if(idebugFlag > 0)
	  call echorecord(intervention_reply_out)
 
	  set file_path = logical("ccluserdir")
	  set _file = build2(trim(file_path),"/snsro_put_intervention.json")
	  call echo(build2("_file : ", _file))
	  call echojson(intervention_reply_out, _file, 0)
  endif
 
  set JSONout = CNVTRECTOJSON(intervention_reply_out)
 
  if(idebugFlag > 0)
	call echo(JSONout)
  endif
 
   if(validate(_MEMORY_REPLY_STRING))
    set _MEMORY_REPLY_STRING = trim(JSONout,3)
  endif
 
#EXIT_VERSION
/*************************************************************************
; SUBROUTINES
**************************************************************************/
 
/*************************************************************************
;  Name: GetInputData(null)		= null with protect
;  Description:  Gather input data into one data record
**************************************************************************/
subroutine GetInputData(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetInputData Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	declare inputCnt = i2
 
	; Load all responses into one record
	;Types
	if(cnvtreal(arglist->Types.FieldId) > 0)
		set inputCnt = size(input_list->qual,5)
		set inputCnt = inputCnt + 1
		set stat = alterlist(input_list->qual,inputCnt)
		set input_list->qual[inputCnt].input_id = cnvtreal(arglist->Types.FieldId)
 
		set idSize = size(arglist->Types.ValueIds,5)
		set valSize = size(arglist->Types.Values,5)
		set inputSize = 0
		if(idSize >= valSize)
			set inputSize = idSize
		else
			set inputSize = valSize
		endif
 
		set stat = alterlist(input_list->qual[inputCnt].values,inputSize)
		for(i = 1 to inputSize)
			if(i <= idSize)
				set input_list->qual[inputCnt].values[i].response_id = cnvtreal(arglist->Types.ValueIds[i])
			endif
			if(i <= valSize)
				set input_list->qual[inputCnt].values[i].response = arglist->Types.Values[i]
			endif
		endfor
	endif
 
	;SubTypes
	if(cnvtreal(arglist->SubTypes.FieldId) > 0)
		set inputCnt = size(input_list->qual,5)
		set inputCnt = inputCnt + 1
		set stat = alterlist(input_list->qual,inputCnt)
		set input_list->qual[inputCnt].input_id = cnvtreal(arglist->SubTypes.FieldId)
 
		set idSize = size(arglist->SubTypes.ValueIds,5)
		set valSize = size(arglist->SubTypes.Values,5)
		set inputSize = 0
		if(idSize >= valSize)
			set inputSize = idSize
		else
			set inputSize = valSize
		endif
 
		set stat = alterlist(input_list->qual[inputCnt].values,inputSize)
		for(i = 1 to inputSize)
			if(i <= idSize)
				set input_list->qual[inputCnt].values[i].response_id = cnvtreal(arglist->SubTypes.ValueIds[i])
			endif
			if(i <= valSize)
				set input_list->qual[inputCnt].values[i].response = arglist->SubTypes.Values[i]
			endif
		endfor
	endif
 
	; Significance
	if(cnvtreal(arglist->Significance.FieldId) > 0)
		set inputCnt = size(input_list->qual,5)
		set inputCnt = inputCnt + 1
		set stat = alterlist(input_list->qual,inputCnt)
		set input_list->qual[inputCnt].input_id = cnvtreal(arglist->Significance.FieldId)
 
		set idSize = size(arglist->Significance.ValueIds,5)
		set valSize = size(arglist->Significance.Values,5)
		set inputSize = 0
		if(idSize >= valSize)
			set inputSize = idSize
		else
			set inputSize = valSize
		endif
 
		set stat = alterlist(input_list->qual[inputCnt].values,inputSize)
		for(i = 1 to inputSize)
			if(i <= idSize)
				set input_list->qual[inputCnt].values[i].response_id = cnvtreal(arglist->Significance.ValueIds[i])
			endif
			if(i <= valSize)
				set input_list->qual[inputCnt].values[i].response = arglist->Significance.Values[i]
			endif
		endfor
	endif
 
	; Time Spent
	if(cnvtreal(arglist->TimeSpent.FieldId) > 0)
		set inputCnt = size(input_list->qual,5)
		set inputCnt = inputCnt + 1
		set stat = alterlist(input_list->qual,inputCnt)
		set input_list->qual[inputCnt].input_id = cnvtreal(arglist->TimeSpent.FieldId)
 
		set idSize = size(arglist->TimeSpent.ValueIds,5)
		set valSize = size(arglist->TimeSpent.Values,5)
		set inputSize = 0
		if(idSize >= valSize)
			set inputSize = idSize
		else
			set inputSize = valSize
		endif
 
		set stat = alterlist(input_list->qual[inputCnt].values,inputSize)
		for(i = 1 to inputSize)
			if(i <= idSize)
				set input_list->qual[inputCnt].values[i].response_id = cnvtreal(arglist->TimeSpent.ValueIds[i])
			endif
			if(i <= valSize)
				set input_list->qual[inputCnt].values[i].response = arglist->TimeSpent.Values[i]
			endif
		endfor
	endif
 
	; Monetary Value
	if(cnvtreal(arglist->Value.FieldId) > 0)
		set inputCnt = size(input_list->qual,5)
		set inputCnt = inputCnt + 1
		set stat = alterlist(input_list->qual,inputCnt)
		set input_list->qual[inputCnt].input_id = cnvtreal(arglist->Value.FieldId)
 
		set idSize = size(arglist->Value.ValueIds,5)
		set valSize = size(arglist->Value.Values,5)
		set inputSize = 0
		if(idSize >= valSize)
			set inputSize = idSize
		else
			set inputSize = valSize
		endif
 
		set stat = alterlist(input_list->qual[inputCnt].values,inputSize)
		for(i = 1 to inputSize)
			if(i <= idSize)
				set input_list->qual[inputCnt].values[i].response_id = cnvtreal(arglist->Value.ValueIds[i])
			endif
			if(i <= valSize)
				set input_list->qual[inputCnt].values[i].response = arglist->Value.Values[i]
			endif
		endfor
	endif
 
	; Response
	if(cnvtreal(arglist->Response.FieldId) > 0)
		set inputCnt = size(input_list->qual,5)
		set inputCnt = inputCnt + 1
		set stat = alterlist(input_list->qual,inputCnt)
		set input_list->qual[inputCnt].input_id = cnvtreal(arglist->Response.FieldId)
 
		set idSize = size(arglist->Response.ValueIds,5)
		set valSize = size(arglist->Response.Values,5)
		set inputSize = 0
		if(idSize >= valSize)
			set inputSize = idSize
		else
			set inputSize = valSize
		endif
 
		set stat = alterlist(input_list->qual[inputCnt].values,inputSize)
		for(i = 1 to inputSize)
			if(i <= idSize)
				set input_list->qual[inputCnt].values[i].response_id = cnvtreal(arglist->Response.ValueIds[i])
			endif
			if(i <= valSize)
				set input_list->qual[inputCnt].values[i].response = arglist->Response.Values[i]
			endif
		endfor
	endif
 
	; Outcomes
	if(cnvtreal(arglist->Outcomes.FieldId) > 0)
		set inputCnt = size(input_list->qual,5)
		set inputCnt = inputCnt + 1
		set stat = alterlist(input_list->qual,inputCnt)
		set input_list->qual[inputCnt].input_id = cnvtreal(arglist->Outcomes.FieldId)
 
		set idSize = size(arglist->Outcomes.ValueIds,5)
		set valSize = size(arglist->Outcomes.Values,5)
		set inputSize = 0
		if(idSize >= valSize)
			set inputSize = idSize
		else
			set inputSize = valSize
		endif
 
		set stat = alterlist(input_list->qual[inputCnt].values,inputSize)
		for(i = 1 to inputSize)
			if(i <= idSize)
				set input_list->qual[inputCnt].values[i].response_id = cnvtreal(arglist->Outcomes.ValueIds[i])
			endif
			if(i <= valSize)
				set input_list->qual[inputCnt].values[i].response = arglist->Outcomes.Values[i]
			endif
		endfor
	endif
 
	;Additional Information
	set addlSize =	size(arglist->AdditionalDetails,5)
	if(addlSize > 0)
		for(i = 1 to addlSize)
			if(cnvtreal(arglist->AdditionalDetails[i].FieldId) > 0)
				set inputCnt = size(input_list->qual,5)
				set inputCnt = inputCnt + 1
				set stat = alterlist(input_list->qual,inputCnt)
				set input_list->qual[inputCnt].input_id = cnvtreal(arglist->AdditionalDetails[i].FieldId)
 
				set idSize = size(arglist->AdditionalDetails[i].ValueIds,5)
				set valSize = size(arglist->AdditionalDetails[i].Values,5)
				set inputSize = 0
				if(idSize >= valSize)
					set inputSize = idSize
				else
					set inputSize = valSize
				endif
 
				set stat = alterlist(input_list->qual[inputCnt].values,inputSize)
				for(inp = 1 to inputSize)
					if(inp <= idSize)
						set input_list->qual[inputCnt].values[inp].response_id = cnvtreal(arglist->AdditionalDetails[i].ValueIds[inp])
					endif
					if(inp <= valSize)
						set input_list->qual[inputCnt].values[inp].response = arglist->AdditionalDetails[i].Values[inp]
					endif
				endfor
			endif
		endfor
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetInputData Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	    ;call echorecord(input_list)
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetInterventionDetail(null) = i2
;  Description: Get data based on intervention id
**************************************************************************/
subroutine GetInterventionDetail(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetInterventionDetail Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 
	; Get the details from the dcp_forms_activity table
	select into "nl:"
	from dcp_forms_activity dfa
	, dcp_forms_activity_comp dfac
	plan dfa where dfa.dcp_forms_activity_id = dInterventionId
	join dfac where dfac.dcp_forms_activity_id = dfa.dcp_forms_activity_id
						and dfac.component_cd = value(uar_get_code_by("MEANING",18189,"PHARMINTERV"))
	order by dfa.dcp_forms_activity_id
 
	head dfa.dcp_forms_activity_id
		dFormsRefId = dfa.dcp_forms_ref_id
		dPatientId = dfa.person_id
		dEncounterId = dfa.encntr_id
		dTaskId = dfa.task_id
		dCurrStatusCd = dfa.form_status_cd
		sCurrStatusMean = uar_get_code_meaning(dfa.form_status_cd)
		iValidate = 1
 
	detail
		if(cnvtupper(dfac.parent_entity_name) = "ORDER")
			dOrderId = dfac.parent_entity_id
		endif
	with nocounter
 
	; Get the event id from the task activity table
	select into "nl:"
	from task_activity ta
	where ta.task_id = dTaskId
	detail
		dFormEventId = ta.event_id
	with nocounter
 
	if(idebugFlag > 0)
		call echo(concat("GetInterventionDetail Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateStatus(null) = null
;  Description: Ensure current status can be updated by submitted status
*************************************************************************/
subroutine ValidateStatus(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateStatus Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	; Only allow IN PROGRESS, AUTH and MODIFIED statuses
 	if(sStatusMean not in("IN PROGRESS", "AUTH", "MODIFIED"))
		call ErrorHandler2("PUT INTERVENTION", "F", "Invalid Status", "The only valid statuses are 'IN PROGRESS', 'AUTH' or 'MODIFIED'.",
		"9999", "The only valid statuses are 'IN PROGRESS', 'AUTH' or 'MODIFIED'.", intervention_reply_out)
		go to EXIT_SCRIPT
	endif
 
	;Check current status and verify if it can be updated to provided status
	set errorMsg = 0
	case(sCurrStatusMean)
		of "IN PROGRESS":
			if(sStatusMean not in ("IN PROGRESS", "AUTH"))
				set errorMsg = 1
			endif
		of value("AUTH", "MODIFIED"):
			if(sStatusMean != "MODIFIED")
				set errorMsg = 1
			endif
	endcase
 
	if(errorMsg)
		call ErrorHandler2("PUT INTERVENTION", "F", "Invalid Status",
		build2("The current document status is ",sCurrStatusMean, " and cannot be updated to ",sStatusMean,"."),"9999",
		build2("The current document status is ",sCurrStatusMean, " and cannot be updated to ",sStatusMean,".")
		, intervention_reply_out)
		go to EXIT_SCRIPT
	endif
 
	if(idebugFlag > 0)
		call echo(concat("ValidateStatus Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetClinicalEventDetails(null) 	= i2	- 1000011 event detail query
;  Description:  Get Clinical Event Details
**************************************************************************/
subroutine GetClinicalEventDetails(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetClinicalEventDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 380000
	set iTask  = 600107
	set iRequest = 1000011
 
	set 1000011_req->query_mode = 3
	set 1000011_req->event_id = dFormEventId
	set 1000011_req->subtable_bit_map_ind = 1
	set 1000011_req->valid_from_dt_tm_ind = 1
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",1000011_req,"REC",1000011_rep)
 
	set iValidate = size(1000011_rep->rb_list)
 
	if(idebugFlag > 0)
		call echo(concat("GetClinicalEventDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetOrderDetails(null)		= i2 with protect ;500415	orm_get_order_by_id
;  Description:  Get Order Information
**************************************************************************/
subroutine GetOrderDetails(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 600701
	set iRequest = 500415
 
	set 500415_req->order_id = dOrderId
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",500415_req,"REC",500415_rep)
 
	if(500415_rep->status_data.status = "S")
		set iValidate = 1
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetOrderDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetEncntrDetails(null)		= i2 with protect ;3200310 	msvc_svr_get_clinctx
;  Description: Get Encounter Details
**************************************************************************/
subroutine GetEncntrDetails(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetEncntrDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 600206
	set iRequest = 3200310
 
	set 3200310_req->patient_id = dPatientId
	set 3200310_req->encounter_id = dEncounterId
	set 3200310_req->load.patient = 1
	set 3200310_req->load.encounter = 1
	set 3200310_req->load.auth_encounter = 1
	set 3200310_req->load.patient_relationship = 1
	set 3200310_req->load.encounter_relationship = 1
	set 3200310_req->load.patient_details.basic_info = 1
	set 3200310_req->load.patient_details.pcp = 1
	set 3200310_req->load.patient_details.name = 1
	set 3200310_req->load.patient_details.aliases = 1
	set 3200310_req->load.patient_details.secure_email = 1
	set 3200310_req->load.patient_details.addresses = 1
	set 3200310_req->load.patient_details.phones = 1
	set 3200310_req->load.encounter_details.basic_info = 1
	set 3200310_req->load.encounter_details.aliases = 1
	set 3200310_req->load.encounter_details.location = 1
	set 3200310_req->load.encounter_details.timezone = 1
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",3200310_req,"REC",3200310_rep)
 
	if(3200310_rep->status_data.status = "S")
		set iValidate = 1
		set iTimeZone = 3200310_rep->encounter.encounter_tz
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetEncntrDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetFormDefinition(null)		= i2 with protect ;600373	dcp_get_dcp_form
;  Description:  Get the form definition
**************************************************************************/
subroutine GetFormDefinition(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetFormDefinition Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 600701
	set iRequest = 600373
 
	set 600373_req->dcp_forms_ref_id = dFormsRefId
	set 600373_req->version_dt_tm = cnvtdatetime(curdate,curtime3)
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600373_req,"REC",600373_rep)
 
	if(600373_rep->status_data = "S")
		set iValidate = 1
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetFormDefinition Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetPrivsByCode(null)		= i2 with protect ;680500	MSVC_GetPrivilegesByCodes
;  Description:  Get privileges by code = make sure user has privs to review powerforms
**************************************************************************/
subroutine GetPrivsByCode(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPrivsByCode Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 3202004
	set iRequest = 680500
 
	set 680500_req->patient_user_criteria.user_id = dPrsnlId
 
	set stat = alterlist(680500_req->privilege_criteria.privileges,2)
	set 680500_req->privilege_criteria.privileges[1].privilege_cd = c_doc_val_section_priv
	set 680500_req->privilege_criteria.privileges[2].privilege_cd = c_signpowerform_priv
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",680500_req,"REC",680500_rep)
 
	set priv_check = 0
	for(i = 1 to size(680500_rep->privileges,5))
		set priv_check = priv_check + 680500_rep->privileges[i].default[1].granted_ind
	endfor
 
	if(priv_check > 1)
		set iValidate = 1
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetPrivsByCode Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: CheckPrivileges(null)		= i2 with protect ;680501	MSVC_CheckPrivileges
;  Description:  Check priviliges - ensure user can add and sign the powerform
**************************************************************************/
subroutine CheckPrivileges(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("CheckPrivileges Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 	set iApplication = 380000
	set iTask = 3202004
	set iRequest = 680501
 
	set 680501_req->patient_user_criteria.user_id = dPrsnlId
	set stat = alterlist(680501_req->event_privileges.event_code_level.event_codes,1)
	set 680501_req->event_privileges.event_code_level.event_codes[1].event_cd = 600373_rep->event_cd
	set 680501_req->event_privileges.event_code_level.add_documentation_ind = 1
	set 680501_req->event_privileges.event_code_level.sign_documentation_ind = 1
	set 680501_req->event_privileges.event_code_level.modify_documentation_ind = 1
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",680501_req,"REC",680501_rep)
 
	set priv_check = 0
	set priv_check = priv_check + 680501_rep->event_privileges.add_documentation.status.success_ind
	set priv_check = priv_check + 680501_rep->event_privileges.sign_documentation.status.success_ind
 	set priv_check = priv_check + 680501_rep->event_privileges.modify_documentation.status.success_ind
 
	if(priv_check > 2)
		set iValidate = 1
	endif
 
	if(idebugFlag > 0)
		call echo(concat("CheckPrivileges Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetFormSectionDetails(null)	= i2 with protect ;600471	dcp_get_section_input_runtime
;  Description:  Get form section details
**************************************************************************/
subroutine GetFormSectionDetails(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetFormSectionDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 600701
	set iRequest = 600471
 
	for(i = 1 to size(600373_rep->sect_list,5))
		set 600471_req->dcp_section_ref_id = 600373_rep->sect_list[i].dcp_section_ref_id
		set 600471_req->dcp_section_instance_id = 600373_rep->sect_list[i].dcp_section_instance_id
 
		set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600471_req,"REC",600471_rep)
 
		if(600471_rep->status_data.status = "S")
			set iValidate = 1
			set 600373_rep->sect_list[i].cki = 600471_rep->cki
			set 600373_rep->sect_list[i].input_cnt = 600471_rep->input_cnt
			set stat = moverec(600471_rep->input_list,600373_rep->sect_list[i].input_list)
		endif
	endfor
 
	if(idebugFlag > 0)
		call echo(concat("GetFormSectionDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetFormDtaDetails(null)		= i2 with protect ;600356	dcp_get_dta_info_all
;  Description:  Get DTA details
**************************************************************************/
subroutine GetFormDtaDetails(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetFormDtaDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 	set iApplication = 380000
	set iTask = 600701
	set iRequest = 600356
 
	set dtaCnt = 0
	for(i = 1 to size(600373_rep->sect_list,5))
		for(x = 1 to 600373_rep->sect_list[i].input_cnt)
			for(y = 1 to 600373_rep->sect_list[i].input_list[x].nv_cnt)
				if(600373_rep->sect_list[i].input_list[x].nv[y].pvc_name = "discrete_task_assay")
					set dtaCnt = dtaCnt + 1
					set stat = alterlist(600356_req->dta,dtaCnt)
					set 600356_req->dta[dtaCnt].task_assay_cd = 600373_rep->sect_list[i].input_list[x].nv[y].merge_id
				endif
			endfor
		endfor
	endfor
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600356_req,"REC",600356_rep)
 
	if(600356_rep->status_data.status = "S")
		set iValidate = 1
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetFormDtaDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: BuildTempPowerForm(null) = null with protect
;  Description:  Builds temp powerform structure
**************************************************************************/
subroutine BuildTempPowerForm(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("BuildTempPowerForm Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Add powerform data build to temp structure for easier parsing
	set powerform->dcp_forms_ref_id = 600373_rep->dcp_forms_ref_id
	set powerform->dcp_form_instance_id = 600373_rep->dcp_form_instance_id
	set powerform->description = 600373_rep->description
	set powerform->event_cd = 600373_rep->event_cd
 
	set stat = alterlist(powerform->sections, 600373_rep->sect_cnt)
	for(i = 1 to 600373_rep->sect_cnt)
		set powerform->sections[i].dcp_forms_def_id = 600373_rep->sect_list[i].dcp_forms_def_id
		set powerform->sections[i].section_seq = 600373_rep->sect_list[i].section_seq
		set powerform->sections[i].dcp_section_ref_id = 600373_rep->sect_list[i].dcp_section_ref_id
		set powerform->sections[i].dcp_section_instance_id = 600373_rep->sect_list[i].dcp_section_instance_id
		set powerform->sections[i].description = 600373_rep->sect_list[i].description
		set powerform->sections[i].definition = 600373_rep->sect_list[i].definition
		set powerform->sections[i].active_ind = 600373_rep->sect_list[i].active_ind
		set powerform->sections[i].input_cnt = 600373_rep->sect_list[i].input_cnt
		set stat = alterlist(powerform->sections[i].inputs,powerform->sections[i].input_cnt)
 
		for(x = 1 to powerform->sections[i].input_cnt)
			set powerform->sections[i].inputs[x].dcp_input_ref_id = 600373_rep->sect_list[i].input_list[x].dcp_input_ref_id
			set powerform->sections[i].inputs[x].input_ref_seq = 600373_rep->sect_list[i].input_list[x].input_ref_seq
			set powerform->sections[i].inputs[x].description = 600373_rep->sect_list[i].input_list[x].description
			set powerform->sections[i].inputs[x].module = 600373_rep->sect_list[i].input_list[x].module
			set powerform->sections[i].inputs[x].input_type = 600373_rep->sect_list[i].input_list[x].input_type
 
			for(y = 1 to 600373_rep->sect_list[i].input_list[x].nv_cnt)
				case(600373_rep->sect_list[i].input_list[x].nv[y].pvc_name)
 
				of "alignment":
					set powerform->sections[i].inputs[x].alignment = 600373_rep->sect_list[i].input_list[x].nv[y].pvc_value
				of "backcolor":
					set powerform->sections[i].inputs[x].backcolor = 600373_rep->sect_list[i].input_list[x].nv[y].pvc_value
				of "caption":
					set powerform->sections[i].inputs[x].caption = 600373_rep->sect_list[i].input_list[x].nv[y].pvc_value
				of "conditional_control_unit":
					set powerform->sections[i].inputs[x].conditional_control_unit = 600373_rep->sect_list[i].input_list[x].nv[y].pvc_value
				of "default":
					set powerform->sections[i].inputs[x].default = 600373_rep->sect_list[i].input_list[x].nv[y].pvc_value
				of "facename":
					set powerform->sections[i].inputs[x].facename = 600373_rep->sect_list[i].input_list[x].nv[y].pvc_value
				of "fonteffects":
					set powerform->sections[i].inputs[x].fonteffects = 600373_rep->sect_list[i].input_list[x].nv[y].pvc_value
				of "forecolor":
					set powerform->sections[i].inputs[x].forecolor = 600373_rep->sect_list[i].input_list[x].nv[y].pvc_value
				of "freetext":
					set powerform->sections[i].inputs[x].freetext = 600373_rep->sect_list[i].input_list[x].nv[y].pvc_value
				of "nomen_field":
					set powerform->sections[i].inputs[x].nomen_field = 600373_rep->sect_list[i].input_list[x].nv[y].pvc_value
				of "physicians_only":
					set powerform->sections[i].inputs[x].physicians_only = 600373_rep->sect_list[i].input_list[x].nv[y].pvc_value
				of "pointsize":
					set powerform->sections[i].inputs[x].pointsize = 600373_rep->sect_list[i].input_list[x].nv[y].pvc_value
				of "position":
					set powerform->sections[i].inputs[x].position = 600373_rep->sect_list[i].input_list[x].nv[y].pvc_value
				of "required":
					set powerform->sections[i].inputs[x].required = 600373_rep->sect_list[i].input_list[x].nv[y].pvc_value
				of "multi_select":
					set powerform->sections[i].inputs[x].multi_select = 600373_rep->sect_list[i].input_list[x].nv[y].pvc_value
				of "discrete_task_assay":
					set powerform->sections[i].inputs[x].discrete_task_assay.task_assay_cd =
					cnvtreal(600373_rep->sect_list[i].input_list[x].nv[y].merge_id)
				endcase
			endfor
		endfor
	endfor
 
	; Get Reference Range Index
	for(a = 1 to size(600356_rep->dta,5))
 
		; Check if there are multiple Reference Ranges and pick the reference range to use
		set refRangeIdx = 0
		set refRangeSize = size(600356_rep->dta[a].ref_range_factor,5)
		if( refRangeSize > 1)
			declare sex_cd = f8
			declare dob = dq8
			declare ageInMin = i4
			set sex_cd = 3200310_rep->patient.sex_cd
			set dob = 3200310_rep->patient.birth_dt_tm
			set ageInMin = datetimediff(cnvtdatetime(curdate,curtime3),dob,4)
 
			for(b = 1 to refRangeSize)
				; Check Sex
				if(600356_rep->dta[a].ref_range_factor[b].sex_cd = 0 or
				(600356_rep->dta[a].ref_range_factor[b].sex_cd > 0 and
				600356_rep->dta[a].ref_range_factor[b].sex_cd = sex_cd))
 
					; Check Age
					if(ageInMin >= 600356_rep->dta[a].ref_range_factor[b].age_from_minutes and
			   		ageInMin <= 600356_rep->dta[a].ref_range_factor[b].age_to_minutes)
			   			set refRangeIdx = b
			   		endif
				endif
			endfor
		else
			set refRangeIdx = 1
		endif
 
		; Get DTA details
		for(i = 1 to size(powerform->sections,5))
			for(inp = 1 to powerform->sections[i].input_cnt)
				if(600356_rep->dta[a].task_assay_cd = powerform->sections[i].inputs[inp].discrete_task_assay.task_assay_cd)
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.mnemonic = 600356_rep->dta[a].mnemonic
					set powerform->sections[i].inputs[inp].discrete_task_assay.description = 600356_rep->dta[a].description
					set powerform->sections[i].inputs[inp].discrete_task_assay.event_cd = 600356_rep->dta[a].event_cd
					set powerform->sections[i].inputs[inp].discrete_task_assay.activity_type_cd = 600356_rep->dta[a].activity_type_cd
					set powerform->sections[i].inputs[inp].discrete_task_assay.default_result_type_cd = 600356_rep->dta[a].default_result_type_cd
 					set powerform->sections[i].inputs[inp].discrete_task_assay.default_result_type_disp =
 					uar_get_code_display(600356_rep->dta[a].default_result_type_cd)
 
 					set powerform->sections[i].inputs[inp].discrete_task_assay.default_result_type_mean =
 					uar_get_code_meaning(600356_rep->dta[a].default_result_type_cd)
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.species_cd =
					600356_rep->dta[a].ref_range_factor[refRangeIdx].species_cd
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.sex_cd =
					600356_rep->dta[a].ref_range_factor[refRangeIdx].sex_cd
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.age_from_minutes =
					600356_rep->dta[a].ref_range_factor[refRangeIdx].age_from_minutes
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.age_to_minutes =
					600356_rep->dta[a].ref_range_factor[refRangeIdx].age_to_minutes
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.service_resource_cd =
					600356_rep->dta[a].ref_range_factor[refRangeIdx].service_resource_cd
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.encntr_type_cd =
					600356_rep->dta[a].ref_range_factor[refRangeIdx].encntr_type_cd
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.specimen_type_cd =
					600356_rep->dta[a].ref_range_factor[refRangeIdx].specimen_type_cd
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.review_ind =
					600356_rep->dta[a].ref_range_factor[refRangeIdx].review_ind
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.review_low =
					600356_rep->dta[a].ref_range_factor[refRangeIdx].review_low
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.review_high =
					600356_rep->dta[a].ref_range_factor[refRangeIdx].review_high
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.sensitive_ind =
					600356_rep->dta[a].ref_range_factor[refRangeIdx].sensitive_ind
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.sensitive_low =
					600356_rep->dta[a].ref_range_factor[refRangeIdx].sensitive_low
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.sensitive_high =
					600356_rep->dta[a].ref_range_factor[refRangeIdx].sensitive_high
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.normal_ind =
					600356_rep->dta[a].ref_range_factor[refRangeIdx].normal_ind
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.normal_low =
					600356_rep->dta[a].ref_range_factor[refRangeIdx].normal_low
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.normal_high =
					600356_rep->dta[a].ref_range_factor[refRangeIdx].normal_high
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.critical_ind =
					600356_rep->dta[a].ref_range_factor[refRangeIdx].critical_ind
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.critical_low =
					600356_rep->dta[a].ref_range_factor[refRangeIdx].critical_low
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.critical_high =
					600356_rep->dta[a].ref_range_factor[refRangeIdx].critical_high
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.feasible_ind =
					600356_rep->dta[a].ref_range_factor[refRangeIdx].feasible_ind
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.feasible_low =
					600356_rep->dta[a].ref_range_factor[refRangeIdx].feasible_low
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.feasible_high =
					600356_rep->dta[a].ref_range_factor[refRangeIdx].feasible_high
 
					set powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.units_cd =
					600356_rep->dta[a].ref_range_factor[refRangeIdx].units_cd
 
					if(600356_rep->dta[a].ref_range_factor[refRangeIdx].alpha_responses_cnt > 0)
						set stat = moverec(600356_rep->dta[a].ref_range_factor[refRangeIdx].alpha_responses,
						powerform->sections[i].inputs[inp].discrete_task_assay.ref_range_factor.alpha_responses)
					endif
 
					if(size(600356_rep->dta[a].data_map,5) > 0)
						set stat = moverec(600356_rep->dta[a].data_map,powerform->sections[i].inputs[inp].discrete_task_assay.data_map)
					endif
				endif
			endfor
		endfor
	endfor
 
	; Get Event Id information from 1000011 request
 
	; Form Event id
	set powerform->form_event_id = dFormEventId
 
	; Section and Input Event Ids
	select into "nl:"
	from (dummyt d with seq = size(1000011_rep->rb_list[1].child_event_list,5))
	, (dummyt d2 with seq = size(powerform->sections,5))
	, (dummyt d3 with seq = size(1000011_rep->rb_list[1].child_event_list[d.seq].child_event_list,5))
	, (dummyt d4 with seq = size(powerform->sections[d2.seq].inputs,5))
 
	plan d
	join d2 where powerform->sections[d2.seq].dcp_section_ref_id =
		cnvtreal(1000011_rep->rb_list[1].child_event_list[d.seq].collating_seq)
	join d3
	join d4 where powerform->sections[d2.seq].inputs[d4.seq].discrete_task_assay.task_assay_cd =
			1000011_rep->rb_list[1].child_event_list[d.seq].child_event_list[d3.seq].task_assay_cd
	detail
		powerform->sections[d2.seq].section_event_id = 1000011_rep->rb_list[1].child_event_list[d2.seq].event_id
		powerform->sections[d2.seq].post_ind = 1
 
		powerform->sections[d2.seq].inputs[d4.seq].input_event_id =
		1000011_rep->rb_list[1].child_event_list[d.seq].child_event_list[d3.seq].event_id
	with nocounter
 
	if(idebugFlag > 0)
		call echo(concat("BuildTempPowerForm Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: declare ValidateInputData(null)			= null with protect
;  Description:  Validate user input based on powerform build constraints
**************************************************************************/
subroutine ValidateInputData(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateInputData Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare response = vc
	declare response_id = f8
	declare result_type = vc
	declare dttm_response = dq8
 
	; Verify the inputs given exist on the powerform
	for(i = 1 to size(input_list->qual,5))
		for(x = 1 to size(powerform->sections,5))
			set check = 0
			select into "nl:"
			from (dummyt d with seq = powerform->sections[x].input_cnt)
			plan d where powerform->sections[x].inputs[d.seq].dcp_input_ref_id = input_list->qual[i].input_id
			detail
				check = 1
			with nocounter
 
			if(check = 0)
				call ErrorHandler2("PUT INTERVENTION", "F", "Validate Input",
 				build2("Input Id provided does not exist on the powerform: ",input_list->qual[i].input_id),
  	  			"9999","Invalid InputId for this powerform.", intervention_reply_out)
  	  			go to exit_script
			endif
		endfor
	endfor
 
 	; Validate field entries
 	for(i = 1 to size(powerform->sections,5))
 		for(x = 1 to powerform->sections[i].input_cnt)
 			if(powerform->sections[i].inputs[x].discrete_task_assay.task_assay_cd > 0)
 				set inputIndex = 0
 				select into "nl:"
 				from (dummyt d with seq = size(input_list->qual,5))
 				plan d
 					where input_list->qual[d.seq].input_id = powerform->sections[i].inputs[x].dcp_input_ref_id
 				detail
 					inputIndex = d.seq
 				with nocounter
 
				if(inputIndex)
					; Set postable ind flag at section level
					set powerform->sections[i].post_ind = 1
 
					; Add responses to temp powerform record
					set valSize = size(input_list->qual[inputIndex].values,5)
					set stat = alterlist(powerform->sections[i].inputs[x].response_values, valSize)
					for(val = 1 to valSize)
						set powerform->sections[i].inputs[x].response_values[val].response_id =
						input_list->qual[inputIndex].values[valSize].response_id
 
						set powerform->sections[i].inputs[x].response_values[val].response =
						input_list->qual[inputIndex].values[valSize].response
					endfor
 
 					; Validate date user entry based on DTA result type
					set result_type = powerform->sections[i].inputs[x].discrete_task_assay.default_result_type_disp
					case(result_type)
						of value("Numeric","Count"):
							if(valSize > 1)
								call ErrorHandler2("PUT INTERVENTION", "F", "Invalid Entry",
								build2("This input id only allows one response and multiple were provided"),
								"9999", build2("This input id only allows one response and multiple were provided"),
								intervention_reply_out)
								go to EXIT_SCRIPT
							else
								set response = powerform->sections[i].inputs[x].response_values[1].response
								set powerform->sections[i].inputs[x].response_values[1].event_class_cd= uar_get_code_by("MEANING",53,"NUM")
								set powerform->sections[i].inputs[x].response_values[1].string_result_check = 1
								set powerform->sections[i].inputs[x].response_values[1].string_result_format_cd = uar_get_code_by("MEANING",14113,"NUMERIC")
								set zero_test = replace(replace(powerform->sections[i].inputs[x].response_values[1].response,".",""),"0","")
								set real_test = cnvtreal(response)
 
								; Verify the string is 0 or a valid number
								if(zero_test = "" or (zero_test != "" and real_test != 0.00 ))
									set precision = powerform->sections[i].inputs[x].discrete_task_assay.data_map[1].min_decimal_places
									set max_digits = powerform->sections[i].inputs[x].discrete_task_assay.data_map[1].max_digits
									set min_digits = powerform->sections[i].inputs[x].discrete_task_assay.data_map[1].min_digits
 
									; Verify number of digits match constraints
									set digitCheck = textlen(trim(replace(response,".",""),3))
									if(min_digits > 0)
										if(digitCheck < min_digits)
											call ErrorHandler2("PUT INTERVENTION", "F", "Invalid Entry",
											build2("This input id requires a minimum of ",min_digits," digits."),
											"9999", build2("This input id requires a minimum of ",min_digits," digits."),
											intervention_reply_out)
											go to EXIT_SCRIPT
										endif
									endif
 
									if(max_digits > 0)
										if(digitCheck > max_digits)
											call ErrorHandler2("PUT INTERVENTION", "F", "Invalid Entry",
											build2("This input id only allows a max of ",max_digits," digits."),
											"9999", build2("This input id only allows a max of ",max_digits," digits."),
											intervention_reply_out)
											go to EXIT_SCRIPT
										endif
									endif
 
									; Verify precision matches constraints
									set pos = findstring(".",response,1)
 
									if(precision > 0)
										if(pos > 0)
											set postDecimal = textlen(trim(substring(pos + 1,textlen(response),response),3))
											if(postDecimal > precision)
												call ErrorHandler2("PUT INTERVENTION", "F", "Invalid Entry",
												build2("This input id only allows a decimal precision of ",precision,"."),
												"9999", build2("This input id only allows a decimal precision of ",precision,"."),
												intervention_reply_out)
												go to EXIT_SCRIPT
											endif
										endif
									else
										if(pos > 0)
											call ErrorHandler2("PUT INTERVENTION", "F", "Invalid Entry", build2("This input id only allows integers."),
											"9999", build2("This input id only allows integers."), intervention_reply_out)
											go to EXIT_SCRIPT
										endif
									endif
								else
									call ErrorHandler2("PUT INTERVENTION", "F", "Invalid Entry",
									build2("This input id is a numeric field. Please enter a number"),
									"9999", build2("This input id is a numeric field. Please enter a number"),
									intervention_reply_out)
									go to EXIT_SCRIPT
								endif
 
								; Set final variable with entered value
								set  powerform->sections[i].inputs[x].response_values[1].response = response
							endif
 
						of value("Text","Freetext"):
							if(valSize > 1)
								call ErrorHandler2("PUT INTERVENTION", "F", "Invalid Entry",
								build2("This input id only allows one response and multiple were provided"),
								"9999", build2("This input id only allows one response and multiple were provided"),
								intervention_reply_out)
								go to EXIT_SCRIPT
							else
								set powerform->sections[i].inputs[x].response_values[1].event_class_cd = uar_get_code_by("MEANING",53,"TXT")
								set powerform->sections[i].inputs[x].response_values[1].string_result_check = 1
								set powerform->sections[i].inputs[x].response_values[1].string_result_format_cd = uar_get_code_by("MEANING",14113,"ALPHA")
 							endif
 
						of value("Date and Time","Date","Time"):
							if(valSize > 1)
								call ErrorHandler2("PUT INTERVENTION", "F", "Invalid Entry",
								build2("This input id only allows one response and multiple were provided"),
								"9999", build2("This input id only allows one response and multiple were provided"),
								intervention_reply_out)
								go to EXIT_SCRIPT
							else
								set response = powerform->sections[i].inputs[x].response_values[1].response
								set UTC = curutc
								set powerform->sections[i].inputs[x].response_values[1].event_class_cd = uar_get_code_by("MEANING",53,"DATE")
								set powerform->sections[i].inputs[x].response_values[1].date_result_check = 1
								declare date = vc
								declare time = vc
 
								/* Date Type Flag
								0.00	Date and Time
								1.00	Date only
								2.00	Time only	*/
 
								if(result_type = "Time")
									set date_type_flag = 2
									set timeCheck = ValidateTimeFormat(response)
									set time = trim(response,3)
									if(timeCheck)
										if(UTC)
											set dttm_response = cnvtdatetimeUTC(cnvtdatetime(curdate,cnvtint(time)))
										else
											set dttm_response = cnvtdatetime(curdate,cnvtint(time))
										endif
									else
										call ErrorHandler2("PUT INTERVENTION", "F", "Invalid Entry",
										build2("This input id is a time field and requires 24-hour format HHMM."),
										"9999", build2("This input id is a time field and requires 24-hour format HHMM."),
										intervention_reply_out)
										go to EXIT_SCRIPT
									endif
								elseif(result_type = "Date")
									set date_type_flag = 1
									set date = trim(replace(response,"/",""),3)
									if(cnvtdate(date))
										if(UTC)
											set dttm_response = cnvtdatetimeUTC(cnvtdatetime(cnvtdate(date),curtime3))
										else
											set dttm_response = cnvtdatetime(cnvtdate(date),curtime3)
										endif
									else
										call ErrorHandler2("PUT INTERVENTION", "F", "Invalid Entry",
										build2("This input id is a date field and requires a format of MM/DD/YY, MM/DD/YYYY, MMDDYY or MMDDYYYY"),
										"9999", build2("This input id is a date field and requires a format of MM/DD/YY, MM/DD/YYYY, MMDDYY or MMDDYYYY"),
										intervention_reply_out)
										go to EXIT_SCRIPT
									endif
								else
									set date_type_flag = 0
									set formatCheck = 0
									set checkSpace = findstring(" ",response)
									set date = substring(1,checkSpace,response)
									set date = trim(replace(date,"/",""),3)
									set time = trim(substring(checkSpace + 1,textlen(response),response),3)
									set time = trim(replace(time,":",""),3)
									set dateCheck = cnvtdate(date)
									set timeCheck = ValidateTimeFormat(time)
 
									if(dateCheck > 0 and timeCheck > 0)
										if(UTC)
											set dttm_response = cnvtdatetimeUTC(cnvtdatetime(cnvtdate(date),cnvtint(time)))
										else
											set dttm_response = cnvtdatetime(cnvtdate(date),cnvtint(time))
										endif
									else
										call ErrorHandler2("PUT INTERVENTION", "F", "Invalid Entry",
										build2("This input id is a datetime field and requires a format of 'MM/DD/YY HHMM', ",
										" 'MM/DD/YYYY HHMM', 'MMDDYY HHMM' or 'MMDDYYYY HHMM'"),
										"9999", build2("This input id is a datetime field and requires a format of 'MM/DD/YY HHMM', ",
										" 'MM/DD/YYYY HHMM', 'MMDDYY HHMM' or 'MMDDYYYY HHMM'"),
										intervention_reply_out)
										go to EXIT_SCRIPT
									endif
								endif
							endif
 
							; Set final response
							set powerform->sections[i].inputs[x].response_values[1].date_time_response = dttm_response
							set powerform->sections[i].inputs[x].response_values[1].date_type_flag = date_type_flag
 
						of value("Multi-alpha and Freetext"):
							for(val = 1 to valSize)
								set response = powerform->sections[i].inputs[x].response_values[val].response
								set response_id = powerform->sections[i].inputs[x].response_values[val].response_id
								set powerform->sections[i].inputs[x].response_values[val].event_class_cd = uar_get_code_by("MEANING",53,"TXT")
 
								if(response > "")
									set powerform->sections[i].inputs[x].response_values[val].response = build2("Other: ",response)
									set powerform->sections[i].inputs[x].response_values[val].string_result_check = 1
									set powerform->sections[i].inputs[x].response_values[val].string_result_format_cd =
									uar_get_code_by("MEANING",14113,"ALPHA")
								endif
 
								; Verify response_id is valid for the input
								if(response_id > 0)
									set powerform->sections[i].inputs[x].response_values[val].coded_result_check = 1
									set check = 0
									select into "nl:"
									from (dummyt d with seq = size(powerform->sections[i].inputs[x].discrete_task_assay.ref_range_factor.alpha_responses,5))
									plan d where
										powerform->sections[i].inputs[x].discrete_task_assay.ref_range_factor.alpha_responses[d.seq].nomenclature_id = response_id
									detail
										check = 1
									with nocounter
 
									if(check = 0)
										call ErrorHandler2("PUT INTERVENTION", "F", "Invalid InputValueId",
										build2("This InputValueId is not a valid option for this InputId",response_id),
										"9999", build2("This InputValueId is not a valid option for this InputId", response_id),
										intervention_reply_out)
										go to EXIT_SCRIPT
									endif
								endif
							endfor
 
						of "Alpha and Freetext":
							if( valSize > 1 and powerform->sections[i].inputs[x].multi_select != "true")
								call ErrorHandler2("PUT INTERVENTION", "F", "Invalid Entry",
								build2("This input id only allows one response and multiple were provided"),
								"9999", build2("This input id only allows one response and multiple were provided"),
								intervention_reply_out)
								go to EXIT_SCRIPT
							else
								for(val = 1 to valSize)
									set response = powerform->sections[i].inputs[x].response_values[val].response
									set response_id = powerform->sections[i].inputs[x].response_values[val].response_id
									set powerform->sections[i].inputs[x].response_values[val].event_class_cd = uar_get_code_by("MEANING",53,"TXT")
									if(response > "")
										set powerform->sections[i].inputs[x].response_values[val].response = build2("Other: ",response)
										set powerform->sections[i].inputs[x].response_values[val].string_result_check = 1
										set powerform->sections[i].inputs[x].response_values[val].string_result_format_cd =
										uar_get_code_by("MEANING",14113,"ALPHA")
									else
										; Verify response_id is valid for the input
										set powerform->sections[i].inputs[x].response_values[val].coded_result_check = 1
										set check = 0
										select into "nl:"
										from (dummyt d with seq = size(powerform->sections[i].inputs[x].discrete_task_assay.ref_range_factor.alpha_responses,5))
										plan d where powerform->sections[i].inputs[x].discrete_task_assay.ref_range_factor.\
										alpha_responses[d.seq].nomenclature_id = response_id
										detail
											check = 1
										with nocounter
 
										if(check = 0)
											call ErrorHandler2("PUT INTERVENTION", "F", "Invalid InputValueId",
											build2("This InputValueId is not a valid option for this InputId",response_id),
											"9999", build2("This InputValueId is not a valid option for this InputId", response_id),
											intervention_reply_out)
											go to EXIT_SCRIPT
										endif
									endif
								endfor
							endif
 
						of "Alpha":
							if( valSize > 1 and powerform->sections[i].inputs[x].multi_select != "true")
								call ErrorHandler2("PUT INTERVENTION", "F", "Invalid Entry",
								build2("This input id only allows one response and multiple were provided"),
								"9999", build2("This input id only allows one response and multiple were provided"),
								intervention_reply_out)
								go to EXIT_SCRIPT
							else
								for(val = 1 to valSize)
									set response = powerform->sections[i].inputs[x].response_values[val].response
									set response_id = powerform->sections[i].inputs[x].response_values[val].response_id
 
									; Alpha inputs can only be a coded result or freetext but not both
									if(response > "" and response_id > 0)
										call ErrorHandler2("PUT INTERVENTION", "F", "Invalid Entry",
										build2("This input id only allows a freetext response OR a selection, but not both"),
										"9999", build2("This input id only allows a freetext response OR a selection, but not both"),
										intervention_reply_out)
										go to EXIT_SCRIPT
									endif
 
									set powerform->sections[i].inputs[x].response_values[val].event_class_cd = uar_get_code_by("MEANING",53,"TXT")
									if(response > "" and powerform->sections[i].inputs[x].freetext = "true")
										set powerform->sections[i].inputs[x].response_values[val].response = build2("Other: ",response)
										set powerform->sections[i].inputs[x].response_values[val].string_result_check = 1
										set powerform->sections[i].inputs[x].response_values[val].string_result_format_cd =
										uar_get_code_by("MEANING",14113,"ALPHA")
									endif
 
									; Verify response_id is valid for the input
									set powerform->sections[i].inputs[x].response_values[val].coded_result_check = 1
									set check = 0
									select into "nl:"
									from (dummyt d with seq = size(powerform->sections[i].inputs[x].discrete_task_assay.ref_range_factor.alpha_responses,5))
									plan d where
										powerform->sections[i].inputs[x].discrete_task_assay.ref_range_factor.\
										alpha_responses[d.seq].nomenclature_id = response_id
									detail
										check = 1
									with nocounter
 
									if(check = 0)
										call ErrorHandler2("PUT INTERVENTION", "F", "Invalid InputValueId",
										build2("This InputValueId is not a valid option for this InputId",response_id),
										"9999", build2("This InputValueId is not a valid option for this InputId", response_id),
										intervention_reply_out)
										go to EXIT_SCRIPT
									endif
								endfor
							endif
 
						of "Multi":
							for(val = 1 to valSize)
								set response = powerform->sections[i].inputs[x].response_values[val].response
								set response_id = powerform->sections[i].inputs[x].response_values[val].response_id
								set powerform->sections[i].inputs[x].response_values[val].event_class_cd = uar_get_code_by("MEANING",53,"TXT")
								if(response > "" and powerform->sections[i].inputs[x].freetext = "true")
									set powerform->sections[i].inputs[x].response_values[val].response = build2("Other: ",response)
									set powerform->sections[i].inputs[x].response_values[val].string_result_check = 1
									set powerform->sections[i].inputs[x].response_values[val].string_result_format_cd =
									uar_get_code_by("MEANING",14113,"ALPHA")
								endif
 
								; Verify response_id is valid for the input
								set powerform->sections[i].inputs[x].response_values[val].coded_result_check = 1
								set check = 0
								select into "nl:"
								from (dummyt d with seq = size(powerform->sections[i].inputs[x].discrete_task_assay.ref_range_factor.alpha_responses,5))
								plan d where
									powerform->sections[i].inputs[x].discrete_task_assay.ref_range_factor.\
									alpha_responses[d.seq].nomenclature_id = response_id
								detail
									check = 1
								with nocounter
 
								if(check = 0)
									call ErrorHandler2("PUT INTERVENTION", "F", "Invalid InputValueId",
									build2("This InputValueId is not a valid option for this InputId",response_id),
									"9999", build2("This InputValueId is not a valid option for this InputId", response_id),
									intervention_reply_out)
									go to EXIT_SCRIPT
								endif
							endfor
 
						of "Provider":
							if( valSize > 1)
								call ErrorHandler2("PUT INTERVENTION", "F", "Invalid Entry",
								build2("This input id only allows one response and multiple were provided"),
								"9999", build2("This input id only allows one response and multiple were provided"),
								intervention_reply_out)
								go to EXIT_SCRIPT
							else
								set response = powerform->sections[i].inputs[x].response_values[1].response
								if(cnvtreal(trim(response,3)) = 0)
									call ErrorHandler2("PUT INTERVENTION", "F", "Invalid Entry",
									build2("This input id is a provider lookup. Please provide a ProviderId in the InputValue field"),
									"9999", build2("This input id is a provider lookup. Please provide a ProviderId in the InputValue field"),
									intervention_reply_out)
									go to EXIT_SCRIPT
								else
									set check = 0
									select into "nl:"
									from prsnl pr
									, person p
									plan pr where pr.person_id = cnvtreal(trim(response,3))
									join p where p.person_id = pr.person_id
									detail
										if(powerform->sections[i].inputs[x].physicians_only = "true")
											if(pr.physician_ind = 1)
												check = 1
												 powerform->sections[i].inputs[x].response_values[1].response  = trim(p.name_full_formatted,3)
											endif
										else
											check = 1
											powerform->sections[i].inputs[x].response_values[1].response  = trim(p.name_full_formatted,3)
										endif
									with nocounter
 
									if(check)
										set powerform->sections[i].inputs[x].response_values[1].string_result_check = 1
										set powerform->sections[i].inputs[x].response_values[1].event_class_cd = uar_get_code_by("MEANING",53,"TXT")
										set powerform->sections[i].inputs[x].response_values[1].string_result_format_cd =
										uar_get_code_by("MEANING",14113,"ALPHA")
									else
										call ErrorHandler2("PUT INTERVENTION", "F", "Invalid Entry",
										build2("Invalid ProviderId provided: ", response),
										"9999", build2("Invalid ProviderId provided: ", response),
										intervention_reply_out)
										go to EXIT_SCRIPT
									endif
								endif
							endif
 
						of "Yes / No":
							if( valSize > 1)
								call ErrorHandler2("PUT INTERVENTION", "F", "Invalid Entry",
								build2("This input id only allows one response and multiple were provided"),
								"9999", build2("This input id only allows one response and multiple were provided"),
								intervention_reply_out)
								go to EXIT_SCRIPT
							else
								for(val = 1 to valSize)
									set response = powerform->sections[i].inputs[x].response_values[val].response
									set response_id = powerform->sections[i].inputs[x].response_values[val].response_id
									set powerform->sections[i].inputs[x].response_values[val].event_class_cd = uar_get_code_by("MEANING",53,"TXT")
 
									if(response > "" and powerform->sections[i].inputs[x].freetext = "true")
										set powerform->sections[i].inputs[x].response_values[val].response = build2("Other: ",response)
										set powerform->sections[i].inputs[x].response_values[val].string_result_check = 1
										set powerform->sections[i].inputs[x].response_values[val].string_result_format_cd =
										uar_get_code_by("MEANING",14113,"ALPHA")
									endif
 
									; Verify response_id is valid for the input
									set check = 0
									select into "nl:"
									from (dummyt d with seq = size(powerform->sections[i].inputs[x].discrete_task_assay.ref_range_factor.alpha_responses,5))
									plan d where
										powerform->sections[i].inputs[x].discrete_task_assay.ref_range_factor.\
										alpha_responses[d.seq].nomenclature_id = response_id
									detail
										check = 1
									with nocounter
 
									if(check = 0)
										call ErrorHandler2("PUT INTERVENTION", "F", "Invalid InputValueId",
										build2("This InputValueId is not a valid option for this InputId",response_id),
										"9999", build2("This InputValueId is not a valid option for this InputId", response_id),
										intervention_reply_out)
										go to EXIT_SCRIPT
									endif
								endfor
							endif
 
						else
							/* The following are the other types that currently aren't supported.
								Calculation - this field gets populated based on a calculation of other fields
								Interp - ??
								Read Only - read only field
								Inventory - ??
								ORC Select  - ??
							*/
 
							call ErrorHandler2("PUT INTERVENTION", "F", "Invalid Field",
							build2("This input id is not eligible to be added or updated. The field type is:  ",result_type),
							"9999", build2("This input id is not eligible to be added or updated. The field type is:  ",result_type),
							intervention_reply_out)
							go to EXIT_SCRIPT
					endcase
 
 				else
					; Verify a value exists if the field is required
					if(powerform->sections[i].inputs[x].required = "true" and
					powerform->sections[i].inputs[x].conditional_control_unit = "")
						call ErrorHandler2("PUT INTERVENTION", "F", "Validate Required Field",
						build2("Missing required input field: ",powerform->sections[i].inputs[x].dcp_input_ref_id),"9999",
						build2("Missing required input field: ",powerform->sections[i].inputs[x].dcp_input_ref_id), intervention_reply_out)
						go to exit_script
					endif
 
 
					; Verify if the input has a default value and add it to the input list if not already defined
					if(powerform->sections[i].inputs[x].default = "1")
						set stat = alterlist(powerform->sections[i].inputs[x].response_values,1)
						for(al = 1 to size(powerform->sections[i].inputs[x].discrete_task_assay.ref_range_factor.alpha_responses,5))
							if(powerform->sections[i].inputs[x].discrete_task_assay.ref_range_factor.alpha_responses[al].default_ind)
								set powerform->sections[i].inputs[x].response_values[1].coded_result_check = 1
 
								set powerform->sections[i].inputs[x].response_values[1].event_class_cd =
								uar_get_code_by("MEANING",53,"TXT")
 
								set powerform->sections[i].inputs[x].response_values[1].response_id =
								powerform->sections[i].inputs[x].discrete_task_assay.ref_range_factor.alpha_responses[al].nomenclature_id
							endif
						endfor
					endif
 
				endif ;End inputIndex
 			endif ;(powerform->sections[i].inputs[x].discrete_task_assay.task_assay_cd > 0)
 		endfor
 	endfor
 
	if(idebugFlag > 0)
		call echo(concat("ValidateInputData Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	    ;call echorecord(powerform)
	    ;go to exit_script
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateTimeFormat(time)
;  Description:  Validate user entry with DTA constraints
**************************************************************************/
subroutine ValidateTimeFormat(origTime)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateTimeFormat Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare iValidate = i2
	declare zero_test = vc
	declare newTime = vc
	declare real_test = i4
 
	set zero_test = trim(replace(replace(origTime,".",""),"0",""),3)
	set newTime = trim(replace(origTime,":",""),3)
	set real_test = cnvtreal(newTime)
 
	if(zero_test = "" or (zero_test != "" and real_test != 0.00 ))
		if(textlen(newTime) = 4 and real_test >= 0 and real_test < 2400)
			set iValidate = 1
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("ValidateTimeFormat Runtime: ",
			 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
			 " seconds"))
	endif
 
 	return(iValidate)
end ;End Subroutine
 
 /*************************************************************************
;  Name: UpdateDcpLocks(null) = i2	;600908	dcp_upd_lock_forms_activity
;  Description: Create DCP lock
**************************************************************************/
subroutine UpdateDcpLocks(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("UpdateDcpLocks Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 600701
	set iRequest = 600908
 
	set 600908_req->forms_activity_id = dInterventionId
	set 600908_req->prsnl_id = dPrsnlId
 
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",600908_req,"REC",600908_rep)
 
	if(600908_rep->status_data.status = "S")
		set iValidate = 1
	endif
 
	if(idebugFlag > 0)
		call echo(concat("UpdateDcpLocks Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
 /*************************************************************************
;  Name: CheckDcpLocks(null)	= i2		;600907 dcp_chk_lock_forms_activity
;  Description: Check DCP Locks
**************************************************************************/
subroutine CheckDcpLocks(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("CheckDcpLocks Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 600701
	set iRequest = 600907
 
	set 600907_req->forms_activity_id = dInterventionId
	set 600907_req->prsnl_id = dPrsnlId
 
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",600907_req,"REC",600907_rep)
 
	if(600907_rep->status_data.status= "S" and 600907_rep->lock_create_dt_tm > 0)
		set iValidate = 1
	endif
 
	if(idebugFlag > 0)
		call echo(concat("CheckDcpLocks Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: PostPowerform(null)			= i2 with protect ;1000012 	Add to Clinical Event Table
;  Description:  Post the powerform to the clinical event table
**************************************************************************/
subroutine PostPowerform(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostPowerform Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	declare iApplication = i4 WITH protect ,constant (380000)
	declare iTask = i4 WITH protect ,constant (600108)
	declare iRequest = i4 WITH protect ,constant (1000012)
 
	declare stepnum = i4
	declare happ = i4
	declare tasknum = i4
	declare htask = i4
	declare hstep = i4
	declare hrequest = i4
	declare hreply = i4
	declare hperson = i4
	declare htemplate = i4
	declare hfield = i4
	declare crmstatus = i2
 
	;Set Reference number
	declare iRefSeq = i2
	set iRefSeq = 0
	declare refLen = i4
	set sReferenceNumber = build(cnvtstring(dTaskId),".000000!",
						datetimezoneformat(cnvtdatetime(curdate,curtime3),iTimeZone,"yyyyMMddhhmmsscc ZZZ"),"!")
 
	;Set Collating Seq
	declare coll_seq_lg = vc
	set coll_seq_lg = "000000000"
 
	declare coll_seq_sm = vc
	set coll_seq_sm= "00000000"
 
	declare coll_seq = c40
 
	execute crmrtl
	execute srvrtl
 
	call echo ("Beginning the Application" )
	set crmstatus = uar_crmbeginapp (iApplication ,happ )
	if ((crmstatus = 0 ) )
		set crmstatus = uar_crmbegintask (happ ,iTask ,htask )
		if ((crmstatus != 0 ) )
			call ErrorHandler2("PUT INTERVENTION", "F", "UAR_CRMBEGINTASK",
			build2("Invalid uar_crmbegintask: ",cnvtstring(crmstatus)),"9999",
			build2("Invalid uar_crmbegintask: ",cnvtstring(crmstatus)), intervention_reply_out)
			call uar_crmendapp (happ )
			go to exit_script
		endif
	else
	  call ErrorHandler2("PUT INTERVENTION", "F", "UAR_CRMBEGINAPP",
	  build2("Invalid uar_crmbeginapp: ",cnvtstring(crmstatus)),"9999",
	  build2("Invalid uar_crmbeginapp: ",cnvtstring(crmstatus)), intervention_reply_out)
	  go to exit_script
	endif
 
	call echo ("Beginning the Request" )
	set crmstatus = uar_crmbeginreq (htask ,"" ,iRequest ,hstep )
	if ((crmstatus != 0 ) )
		call ErrorHandler2("PUT INTERVENTION", "F", "UAR_CRMBEGINREQ",
		build2("Invalid uar_crmbeginreq: ",cnvtstring(crmstatus)),"9999",
		build2("Invalid uar_crmbeginreq: ",cnvtstring(crmstatus)), intervention_reply_out)
		go to exit_script
		call uar_crmendapp (happ )
	else
		set hrequest = uar_crmgetrequest (hstep )
 
		; Ensure Type
		set stat = uar_srvsetshort(hrequest,"ensure_type", 2) ;1 - add new; 2 - update existing
 
		;Clinical Event - form level
		set hce = uar_srvgetstruct(hrequest,"clin_event")
		if(hce)
			set stat = uar_srvsetdouble(hce,"event_id",1000011_rep->rb_list[1].event_id)
			set stat = uar_srvsetlong(hce,"view_level",1000011_rep->rb_list[1].view_level)
			set stat = uar_srvsetdouble(hce,"order_id",1000011_rep->rb_list[1].order_id)
			set stat = uar_srvsetdouble(hce,"catalog_cd",1000011_rep->rb_list[1].catalog_cd)
			set stat = uar_srvsetdouble(hce,"person_id",1000011_rep->rb_list[1].person_id)
			set stat = uar_srvsetdouble(hce,"encntr_id",1000011_rep->rb_list[1].encntr_id)
			set stat = uar_srvsetdouble(hce,"contributor_system_cd",1000011_rep->rb_list[1].contributor_system_cd)
 
			set sReferenceNumber = build(sReferenceNumber,iRefSeq)
			set refLen = size(sReferenceNumber)
			set stat = uar_srvsetstringfixed(hce,"reference_nbr",sReferenceNumber,refLen)
 
			set stat = uar_srvsetdouble(hce,"parent_event_id",1000011_rep->rb_list[1].parent_event_id)
			set stat = uar_srvsetdouble(hce,"event_class_cd",1000011_rep->rb_list[1].event_class_cd)
			set stat = uar_srvsetdouble(hce,"event_cd",1000011_rep->rb_list[1].event_cd)
			set stat = uar_srvsetdouble(hce,"event_reltn_cd",1000011_rep->rb_list[1].event_reltn_cd)
			set stat = uar_srvsetdate(hce,"event_end_dt_tm",c_now_dt_tm)
			set stat = uar_srvsetdouble(hce,"record_status_cd",1000011_rep->rb_list[1].record_status_cd)
			set stat = uar_srvsetdouble(hce,"result_status_cd",dStatusCd)
 
			if(sStatusMean in ("AUTH","MODIFIED"))
				set stat = uar_srvsetshort(hce,"authentic_flag",1)
				set stat = uar_srvsetshort(hce,"publish_flag",1)
			else
				set stat = uar_srvsetshort(hce,"authentic_flag",0)
				set stat = uar_srvsetshort(hce,"publish_flag",0)
			endif
 
			set stat = uar_srvsetstring(hce,"event_title_text",trim(1000011_rep->rb_list[1].event_title_text,3))
			set stat = uar_srvsetstring(hce,"collating_seq",1000011_rep->rb_list[1].collating_seq)
			set stat = uar_srvsetdouble(hce,"entry_mode_cd",1000011_rep->rb_list[1].entry_mode_cd)
			set stat = uar_srvsetlong(hce,"event_end_tz",iTimeZone)
 
			; Event_prsnl_list
			set currPrsnlSize = size(1000011_rep->rb_list[1].event_prsnl_list,5)
			if(sStatusMean = "AUTH")
				set ePrsnlSize =  currPrsnlSize + 2
			else
				set ePrsnlSize = currPrsnlSize + 1
			endif
 
			for(i = 1 to ePrsnlSize)
				set hprsnl = uar_srvadditem(hce,"event_prsnl_list")
				if(hprsnl)
					if(i <= currPrsnlSize)
						set stat = uar_srvsetdouble(hprsnl,"event_prsnl_id",1000011_rep->rb_list[1].event_prsnl_list[i].event_prsnl_id)
						set stat = uar_srvsetdouble(hprsnl,"action_type_cd",1000011_rep->rb_list[1].event_prsnl_list[i].action_type_cd)
 
						set stat = uar_srvsetdate(hprsnl,"action_dt_tm",
						cnvtdatetime(1000011_rep->rb_list[1].event_prsnl_list[i].action_dt_tm))
 
						set stat = uar_srvsetdouble(hprsnl,"action_prsnl_id",1000011_rep->rb_list[1].event_prsnl_list[i].action_prsnl_id)
						set stat = uar_srvsetdouble(hprsnl,"action_status_cd",1000011_rep->rb_list[1].event_prsnl_list[i].action_status_cd)
						set stat = uar_srvsetlong(hprsnl,"action_tz",1000011_rep->rb_list[1].event_prsnl_list[i].action_tz)
 					else
 						set caseIdx = i - currPrsnlSize
						case(caseIdx)
							of 1: set stat = uar_srvsetdouble(hprsnl,"action_type_cd",c_modify_action_type_cd)
							of 2: set stat = uar_srvsetdouble(hprsnl,"action_type_cd",c_verify_action_type_cd)
						endcase
 
						set stat = uar_srvsetdate(hprsnl,"action_dt_tm",c_now_dt_tm)
						set stat = uar_srvsetdouble(hprsnl,"action_prsnl_id",dPrsnlId)
						set stat = uar_srvsetdouble(hprsnl,"action_status_cd",c_completed_action_status_cd)
						set stat = uar_srvsetlong(hprsnl,"action_tz",iTimeZone)
					endif
				else
					call ErrorHandler2("PUT INTERVENTION", "F", "HPRSNL",
					build2("Could not create HPRSNL"),"9999",
					build2("Could not create HPRSNL"), intervention_reply_out)
					go to exit_script
				endif
			endfor
 
			; Child Event - Section level
			set sec = 0
			for(sectIdx = 1 to size(powerform->sections,5))
 
				; Only add sections that should be posted
				if(powerform->sections[sectIdx].post_ind)
 
					; Set section index when needed from 1000011_rep structure
					select into "nl:"
					from (dummyt d with seq = size(1000011_rep->rb_list[1].child_event_list,5))
					plan d where 1000011_rep->rb_list[1].child_event_list[d.seq].event_id =
						powerform->sections[sectIdx].section_event_id
					detail
						sec = d.seq
					with nocounter
 
					set hce_type = uar_srvcreatetypefrom(hrequest,"clin_event")
					set hce_struct = uar_srvgetstruct(hrequest,"clin_event")
					set stat = uar_srvbinditemtype (hce_struct ,"child_event_list" ,hce_type)
					set hsection = uar_srvadditem(hce_struct,"child_event_list")
 
					if(hsection)
						call uar_srvbinditemtype (hsection ,"child_event_list" ,hce_type )
						set stat = uar_srvsetdouble(hsection,"event_id",powerform->sections[sectIdx].section_event_id)
						set stat = uar_srvsetdouble(hsection,"order_id",dOrderId)
						set stat = uar_srvsetdouble(hsection,"catalog_cd",500415_rep->catalog_cd)
						set stat = uar_srvsetdouble(hsection,"person_id",dPatientId)
						set stat = uar_srvsetdouble(hsection,"encntr_id",dEncounterId)
						set stat = uar_srvsetdouble(hsection,"contributor_system_cd",c_contributor_system_cd)
						set stat = uar_srvsetdouble(hsection,"parent_event_id",1000011_rep->rb_list[1].event_id)
						set stat = uar_srvsetdouble(hsection,"event_class_cd",c_grp_event_class_cd)
						set stat = uar_srvsetdouble(hsection,"event_cd",c_dcpgeneric_event_cd)
						set stat = uar_srvsetdouble(hsection,"event_reltn_cd",c_child_event_reltn_cd)
						set stat = uar_srvsetdate(hsection,"event_end_dt_tm",c_now_dt_tm)
						set stat = uar_srvsetdouble(hsection,"record_status_cd",c_active_record_status_cd)
						set stat = uar_srvsetdouble(hsection,"result_status_cd",dStatusCd)
 
						if(sStatusMean in ("AUTH","MODIFIED"))
							set stat = uar_srvsetshort(hsection,"authentic_flag",1)
							set stat = uar_srvsetshort(hsection,"publish_flag",1)
						else
							set stat = uar_srvsetshort(hsection,"authentic_flag",0)
							set stat = uar_srvsetshort(hsection,"publish_flag",0)
						endif
 
						set stat = uar_srvsetstring(hsection,"event_title_text",trim(powerform->sections[sectIdx].description,3))
 
						set coll_seq = trim(cnvtstring(powerform->sections[sectIdx].dcp_section_ref_id),3)
						set stat = uar_srvsetstring(hsection,"collating_seq",coll_seq)
 
						set iRefSeq = iRefSeq + 1
						set sReferenceNumber = build(sReferenceNumber,iRefSeq)
						set refLen = size(sReferenceNumber)
						set stat = uar_srvsetstringfixed(hsection,"reference_nbr",sReferenceNumber,refLen)
 
						set stat = uar_srvsetdouble(hsection,"entry_mode_cd",c_powerform_entry_mode_cd)
						set stat = uar_srvsetlong(hsection,"event_end_tz",iTimeZone)
 
						; Event Prsnl
						if(sec)
							set currPrsnl = size(1000011_rep->rb_list[1].child_event_list[sec].event_prsnl_list,5)
							set ePrsnlList =  currPrsnl + 1
 
							for(i = 1 to ePrsnlList)
								set hsecprsnl = uar_srvadditem(hsection,"event_prsnl_list")
								if(hsecprsnl)
									if(i <= currPrsnl)
										set stat = uar_srvsetdouble(hsecprsnl,"event_prsnl_id",
										1000011_rep->rb_list[1].child_event_list[sec].event_prsnl_list[i].event_prsnl_id)
 
										set stat = uar_srvsetdouble(hsecprsnl,"action_type_cd",
										1000011_rep->rb_list[1].child_event_list[sec].event_prsnl_list[i].action_type_cd)
 
										set stat = uar_srvsetdate(hsecprsnl,"action_dt_tm",
										cnvtdatetime(1000011_rep->rb_list[1].child_event_list[sec].event_prsnl_list[i].action_dt_tm))
 
										set stat = uar_srvsetdouble(hsecprsnl,"action_prsnl_id",
										1000011_rep->rb_list[1].child_event_list[sec].event_prsnl_list[i].action_prsnl_id)
 
										set stat = uar_srvsetdouble(hsecprsnl,"action_status_cd",
										1000011_rep->rb_list[1].child_event_list[sec].event_prsnl_list[i].action_status_cd)
 
										set stat = uar_srvsetlong(hsecprsnl,"action_tz",
										1000011_rep->rb_list[1].child_event_list[sec].event_prsnl_list[i].action_tz)
									else
										set stat = uar_srvsetdouble(hsecprsnl,"action_type_cd",c_modify_action_type_cd)
										set stat = uar_srvsetdate(hsecprsnl,"action_dt_tm",c_now_dt_tm)
										set stat = uar_srvsetdouble(hsecprsnl,"action_prsnl_id",dPrsnlId)
										set stat = uar_srvsetdouble(hsecprsnl,"action_status_cd",c_completed_action_status_cd)
										set stat = uar_srvsetlong(hsecprsnl,"action_tz",iTimeZone)
									endif
								else
									call ErrorHandler2("PUT INTERVENTION", "F", "HSECPRSNL",
									build2("Could not create HSECPRSNL"),"9999",
									build2("Could not create HSECPRSNL"), intervention_reply_out)
									go to exit_script
								endif
							endfor
						else
							set hsecprsnl = uar_srvadditem(hsection,"event_prsnl_list")
							if(hsecprsnl)
								set stat = uar_srvsetdouble(hsecprsnl,"action_type_cd",c_perform_action_type_cd)
								set stat = uar_srvsetdate(hsecprsnl,"action_dt_tm",c_now_dt_tm)
								set stat = uar_srvsetdouble(hsecprsnl,"action_prsnl_id",dPrsnlId)
								set stat = uar_srvsetdouble(hsecprsnl,"action_status_cd",c_completed_action_status_cd)
								set stat = uar_srvsetlong(hsecprsnl,"action_tz",iTimeZone)
							else
								call ErrorHandler2("PUT INTERVENTION", "F", "HSECPRSNL",
								build2("Could not create HSECPRSNL"),"9999",
								build2("Could not create HSECPRSNL"), intervention_reply_out)
								go to exit_script
							endif
						endif
 
						; Child Event - input item level
						for(inpIdx = 1 to powerform->sections[sectIdx].input_cnt)
							set ceIdx = 0
							set responseSize = 0
 
							; Set response size
							set responseSize = size(powerform->sections[sectIdx].inputs[inpIdx].response_values,5)
 
							; Get 1000011_rep index based on input event id
							select into "nl:"
							from (dummyt d with seq = size(1000011_rep->rb_list[1].child_event_list[sec].child_event_list,5))
							plan d where 1000011_rep->rb_list[1].child_event_list[sec].child_event_list[d.seq].event_id =
							powerform->sections[sectIdx].inputs[inpIdx].input_event_id
							detail
								ceIdx = d.seq
							with nocounter
 
							if(responseSize > 0)
								set hinput = uar_srvadditem(hsection,"child_event_list")
								if(hinput)
									call uar_srvbinditemtype (hinput ,"child_event_list" ,hce_type)
 
									set stat = uar_srvsetdouble(hinput,"event_id",powerform->sections[sectIdx].inputs[inpIdx].input_event_id)
									set stat = uar_srvsetlong(hinput,"view_level",1)
									set stat = uar_srvsetdouble(hinput,"order_id",dOrderId)
									set stat = uar_srvsetdouble(hinput,"catalog_cd",500415_rep->catalog_cd)
									set stat = uar_srvsetdouble(hinput,"person_id",dPatientId)
									set stat = uar_srvsetdouble(hinput,"encntr_id",dEncounterId)
									set stat = uar_srvsetdouble(hinput,"contributor_system_cd",c_contributor_system_cd)
 
									set iRefSeq = iRefSeq + 1
									set sReferenceNumber = build(sReferenceNumber,iRefSeq)
									set refLen = size(sReferenceNumber)
									set stat = uar_srvsetstringfixed(hinput,"reference_nbr",sReferenceNumber,refLen)
 
									set stat = uar_srvsetdouble(hinput,"parent_event_id",powerform->sections[sectIdx].section_event_id)
 
									set stat = uar_srvsetdouble(hinput,"event_class_cd",
									powerform->sections[sectIdx].inputs[inpIdx].response_values[1].event_class_cd)
 
									set stat = uar_srvsetdouble(hinput,"event_cd",
									powerform->sections[sectIdx].inputs[inpIdx].discrete_task_assay.event_cd)
 
									set stat = uar_srvsetdate(hinput,"event_end_dt_tm",c_now_dt_tm)
 
									set stat = uar_srvsetdouble(hinput,"task_assay_cd",
									powerform->sections[sectIdx].inputs[inpIdx].discrete_task_assay.task_assay_cd)
 
									set stat = uar_srvsetdouble(hinput,"record_status_cd",c_active_record_status_cd)
									set stat = uar_srvsetdouble(hinput,"result_status_cd",dStatusCd)
 
									if(sStatusMean in ("AUTH","MODIFIED"))
										set stat = uar_srvsetshort(hinput,"authentic_flag",1)
										set stat = uar_srvsetshort(hinput,"publish_flag",1)
									else
										set stat = uar_srvsetshort(hinput,"authentic_flag",0)
										set stat = uar_srvsetshort(hinput,"publish_flag",0)
									endif
 
									set stat = uar_srvsetstring(hinput,"event_title_text",
									trim(powerform->sections[sectIdx].inputs[inpIdx].description,3))
 
									if(powerform->sections[sectIdx].inputs[inpIdx].input_ref_seq < 10)
										set coll_seq = trim(concat(coll_seq_lg,trim(cnvtstring(powerform->sections[sectIdx].inputs[inpIdx].input_ref_seq),3)),3)
									else
										set coll_seq = trim(concat(coll_seq_sm,trim(cnvtstring(powerform->sections[sectIdx].inputs[inpIdx].input_ref_seq),3)),3)
									endif
									set stat = uar_srvsetstring(hinput,"collating_seq",coll_seq)
 
									set stat = uar_srvsetdouble(hinput,"entry_mode_cd",c_powerform_entry_mode_cd)
									set stat = uar_srvsetlong(hinput,"event_end_tz",iTimeZone)
									if(ceIdx)
										set stat = uar_srvsetlong(hinput,"updt_cnt",
										1000011_rep->rb_list[1].child_event_list[sec].child_event_list[ceIdx].updt_cnt)
									endif
 
									; Event Prsnl
									if(ceIdx)
										set currSize = size(1000011_rep->rb_list[1].child_event_list[sec].child_event_list[ceIdx].event_prsnl_list,5)
										set ePrsnlSize = currSize + 1
 
										for(h = 1 to ePrsnlSize)
											set hinpprsnl = uar_srvadditem(hinput,"event_prsnl_list")
											if(hinpprsnl)
												if(h <= currSize)
													set stat = uar_srvsetdouble(hinpprsnl,"event_prsnl_id",
													1000011_rep->rb_list[1].child_event_list[sec].child_event_list[ceIdx].event_prsnl_list[h].event_prsnl_id)
 
													set stat = uar_srvsetdouble(hinpprsnl,"action_type_cd",
													1000011_rep->rb_list[1].child_event_list[sec].child_event_list[ceIdx].event_prsnl_list[h].action_type_cd)
 
													set stat = uar_srvsetdate(hinpprsnl,"action_dt_tm",
													cnvtdatetime(1000011_rep->rb_list[1].child_event_list[sec].child_event_list[ceIdx].event_prsnl_list[h].action_dt_tm))
 
													set stat = uar_srvsetdouble(hinpprsnl,"action_prsnl_id",
													1000011_rep->rb_list[1].child_event_list[sec].child_event_list[ceIdx].event_prsnl_list[h].action_prsnl_id)
 
													set stat = uar_srvsetdouble(hinpprsnl,"action_status_cd",
													1000011_rep->rb_list[1].child_event_list[sec].child_event_list[ceIdx].event_prsnl_list[h].action_status_cd)
 
													set stat = uar_srvsetlong(hinpprsnl,"action_tz",
													1000011_rep->rb_list[1].child_event_list[sec].child_event_list[ceIdx].event_prsnl_list[h].action_tz)
												else
													set stat = uar_srvsetdouble(hinpprsnl,"action_type_cd",c_modify_action_type_cd)
													set stat = uar_srvsetdate(hinpprsnl,"action_dt_tm",c_now_dt_tm)
													set stat = uar_srvsetdouble(hinpprsnl,"action_prsnl_id",dPrsnlId)
													set stat = uar_srvsetdouble(hinpprsnl,"action_status_cd",c_completed_action_status_cd)
													set stat = uar_srvsetlong(hinpprsnl,"action_tz",iTimeZone)
												endif
											else
												call ErrorHandler2("PUT INTERVENTION", "F", "HINPPRSNL",
											  	build2("Could not create HINPPRSNL"),"9999",
											  	build2("Could not create HINPPRSNL"), intervention_reply_out)
											  	go to exit_script
											endif
										endfor
									else
										set hinpprsnl = uar_srvadditem(hinput,"event_prsnl_list")
										if(hinpprsnl)
											set stat = uar_srvsetdouble(hinpprsnl,"action_type_cd",c_perform_action_type_cd)
											set stat = uar_srvsetdate(hinpprsnl,"action_dt_tm",c_now_dt_tm)
											set stat = uar_srvsetdouble(hinpprsnl,"action_prsnl_id",dPrsnlId)
											set stat = uar_srvsetdouble(hinpprsnl,"action_status_cd",c_completed_action_status_cd)
											set stat = uar_srvsetlong(hinpprsnl,"action_tz",iTimeZone)
										else
											call ErrorHandler2("PUT INTERVENTION", "F", "HINPPRSNL",
										  	build2("Could not create HINPPRSNL"),"9999",
										  	build2("Could not create HINPPRSNL"), intervention_reply_out)
										  	go to exit_script
										endif
									endif
 
 
									; Results
									set crCnt = 0
									for(r = 1 to responseSize)
 
										; Coded Results List
										if(powerform->sections[sectIdx].inputs[inpIdx].response_values[r].coded_result_check)
											set crCnt = crCnt + 1
 
											set hcoded = uar_srvadditem(hinput,"coded_result_list")
											if(hcoded)
												if(ceIdx)
													set stat = uar_srvsetshort(hcoded,"ensure_type",258)
												else
													set stat = uar_srvsetshort(hcoded,"ensure_type",2)
												endif
 
												set stat = uar_srvsetlong(hcoded,"sequence_nbr",crCnt)
 
												set test = 0
												select into "nl:"
												from (dummyt d with seq = size(powerform->sections[sectIdx].inputs[inpIdx].\
													discrete_task_assay.ref_range_factor.alpha_responses,5))
												plan d where powerform->sections[sectIdx].inputs[inpIdx].discrete_task_assay.\
													ref_range_factor.alpha_responses[d.seq].nomenclature_id =
													powerform->sections[sectIdx].inputs[inpIdx].response_values[r].response_id
												detail
													test = 1
													stat = uar_srvsetdouble(hcoded,"nomenclature_id",
													powerform->sections[sectIdx].inputs[inpIdx].discrete_task_assay.ref_range_factor.\
													alpha_responses[d.seq].nomenclature_id)
 
													stat = uar_srvsetstring(hcoded,"mnemonic",
													powerform->sections[sectIdx].inputs[inpIdx].discrete_task_assay.ref_range_factor.\
													alpha_responses[d.seq].mnemonic)
 
													stat = uar_srvsetstring(hcoded,"short_string",
													powerform->sections[sectIdx].inputs[inpIdx].discrete_task_assay.ref_range_factor.\
													alpha_responses[d.seq].short_string)
 
													stat = uar_srvsetstring(hcoded,"descriptor",
													powerform->sections[sectIdx].inputs[inpIdx].discrete_task_assay.ref_range_factor.\
													alpha_responses[d.seq].description)
 
													stat = uar_srvsetdouble(hcoded,"unit_of_measure_cd",
													powerform->sections[sectIdx].inputs[inpIdx].discrete_task_assay.ref_range_factor.units_cd)
												with nocounter
											else
												call ErrorHandler2("PUT INTERVENTION", "F", "HCODED",
											  	build2("Could not create HCODED"),"9999",
											  	build2("Could not create HCODED"), intervention_reply_out)
											  	go to exit_script
											endif
										endif ;End Coded Results List
 
										; String Result
										set stringLen = 0
										if(powerform->sections[sectIdx].inputs[inpIdx].response_values[r].string_result_check)
											set hstring = uar_srvadditem(hinput,"string_result")
											if(hstring)
												set stringLen = size(powerform->sections[sectIdx].inputs[inpIdx].response_values[r].response)
 
												set stat = uar_srvsetstringfixed(hstring,"string_result_text",
												powerform->sections[sectIdx].inputs[inpIdx].response_values[r].response,stringLen)
 
												set stat = uar_srvsetdouble(hstring,"string_result_format_cd",
												powerform->sections[sectIdx].inputs[inpIdx].response_values[r].string_result_format_cd)
 
												set stat = uar_srvsetdouble(hstring,"unit_of_measure_cd",
												powerform->sections[sectIdx].inputs[inpIdx].discrete_task_assay.ref_range_factor.units_cd)
 
												;set stat = uar_srvsetdouble(hstring,"string_long_text_id")
											else
												call ErrorHandler2("PUT INTERVENTION", "F", "HSTRING",
											  	build2("Could not create HSTRING"),"9999",
											  	build2("Could not create HSTRING"), intervention_reply_out)
											  	go to exit_script
											endif
										endif
 
										; Date Result
										if(powerform->sections[sectIdx].inputs[inpIdx].response_values[r].date_result_check)
											set hdate = uar_srvadditem(hinput,"date_result")
											if(hdate)
												set stat = uar_srvsetdate(hdate,"result_dt_tm",
												powerform->sections[sectIdx].inputs[inpIdx].response_values[r].date_time_response)
 
												set stat = uar_srvsetshort(hdate,"date_type_flag",
												powerform->sections[sectIdx].inputs[inpIdx].response_values[r].date_type_flag)
											else
												call ErrorHandler2("PUT INTERVENTION", "F", "HDATE",
											  	build2("Could not create HDATE"),"9999",
											  	build2("Could not create HDATE"), intervention_reply_out)
											  	go to exit_script
											endif
										endif
 
									endfor ;End response_values
								else
									call ErrorHandler2("PUT INTERVENTION", "F", "HINPUT",
								  	build2("Could not create HINPUT"),"9999",
								  	build2("Could not create HINPUT"), intervention_reply_out)
								  	go to exit_script
	 							endif ;End hinput
							endif ;End size response_values > 0
						endfor ;End input_cnt
					else
						call ErrorHandler2("PUT INTERVENTION", "F", "HSECTION",
					  	build2("Could not create HSECTION"),"9999",
					  	build2("Could not create HSECTION"), intervention_reply_out)
					  	go to exit_script
					endif ; End hsection
				endif ;End post_ind
			endfor ;End size(powerform->sections)
		else
			call ErrorHandler2("PUT INTERVENTION", "F", "HCE",
		  	build2("Could not create HCE"),"9999",
		  	build2("Could not create HCE"), intervention_reply_out)
		  	go to exit_script
		endif ;End hce
 
		; Perform the request
		set crmstatus = uar_crmperform (hstep )
		if (crmstatus = 0)
			set hreply = uar_crmgetreply (hstep )
			if (hreply = 0)
		  	  	call ErrorHandler2("PUT INTERVENTION", "F", "UAR_CRMGETREPLY",
		  	  	build2("Invalid uar_crmgetreply: ",cnvtstring(hreply)),"9999",
		  	  	build2("Invalid uar_crmbeginapp: ",cnvtstring(hreply)), intervention_reply_out)
		  	  	go to exit_script
			else
				; Status
				set hstatus = uar_srvgetstruct(hreply,"sb")
				if(hstatus)
					call echo(build2("severityCd: ",uar_srvgetdouble(hstatus,"severityCd")))
					call echo(build2("statusCd: ",uar_srvgetdouble(hstatus,"statusCd")))
					call echo(build2("statusText: ",uar_srvgetstringptr(hstatus,"statusText")))
				else
					call ErrorHandler2("PUT INTERVENTION", "F", "HSTATUS",
					  build2("Could not create HSTATUS"),"9999",
					  build2("Could not create HSTATUS"), intervention_reply_out)
					  go to exit_script
				endif
 
				; Get the Event Ids
				set rb_cnt = uar_srvgetitemcount (hreply ,"rb_list" )
				if (rb_cnt > 0)
					set stat = alterlist(temp_events->qual,rb_cnt)
					for(i = 1 to rb_cnt)
						set hrb = uar_srvgetitem (hreply ,"rb_list" ,i )
						if(i = 1)
							set dFormEventId = uar_srvgetdouble (hrb ,"parent_event_id" )
							set iValidate = 1
						endif
						set temp_events->qual[i].event_id = uar_srvgetdouble (hrb ,"event_id")
					endfor
				else
					call ErrorHandler2("VALIDATE", "F", " UAR_SRVGETSTRUCT ", "Reply rb_list is empty",
					"9999", "Reply rb_list is empty", intervention_reply_out)
					go to exit_script
				endif
			endif
		else
			  call ErrorHandler2("PUT INTERVENTION", "F", "UAR_CRMPERFORM",
			  build2("Invalid uar_crmperform: ",cnvtstring(crmstatus)),"9999",
			  build2("Invalid uar_crmperform: ",cnvtstring(crmstatus)), intervention_reply_out)
			  go to exit_script
		endif
	endif ; End crmstatus != 0
 
	if(idebugFlag > 0)
		call echo(concat("PostPowerform Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: UpdateFormsActivity(null)	= i2 with protect ;600353 dcp_upd_forms_activity
;  Description:  Update forms activity table
**************************************************************************/
subroutine UpdateFormsActivity(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("UpdateFormsActivity Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 	set iApplication = 600005
	set iTask = 600701
	set iRequest = 600353
 
	set 600353_req->form_activity_id = dInterventionId
	set 600353_req->form_reference_id = 600373_rep->dcp_forms_ref_id
	set 600353_req->person_id = dPatientId
	set 600353_req->encntr_id = dEncounterId
	set 600353_req->task_id = dTaskId
	set 600353_req->form_dt_tm = c_now_dt_tm
	set 600353_req->form_tz = iTimeZone
	set 600353_req->form_status_cd = dStatusCd
	set 600353_req->flags = 1
	set 600353_req->description = 600373_rep->description
	set 600353_req->version_dt_tm = c_now_dt_tm
	set 600353_req->reference_nbr = build(sReferenceNumber,0)
 
	; Components
	set componentSize = 3
	set stat = alterlist(600353_req->component,componentSize)
	for(i = 1 to componentSize)
		case(i)
			of 1:
				set 600353_req->component[i].parent_entity_name = "CLINICAL_EVENT"
				set 600353_req->component[i].parent_entity_id = dFormEventId
				set 600353_req->component[i].component_cd = c_clinicalevent_activity_component_cd
			of 2:
				set 600353_req->component[i].parent_entity_name = "Order"
				set 600353_req->component[i].parent_entity_id = dOrderId
				set 600353_req->component[i].component_cd = c_order_activity_component_cd
			of 3:
				set 600353_req->component[i].parent_entity_name = "Order"
				set 600353_req->component[i].parent_entity_id = dOrderId
				set 600353_req->component[i].component_cd = c_pharminterv_activity_component_cd
		endcase
	endfor
 
	;Prsnl
	set stat = alterlist(600353_req->prsnl,1)
	set 600353_req->prsnl[1].prsnl_id = dPrsnlId
	set 600353_req->prsnl[1].prsnl_ft = GetNameFromPrsnID(dPrsnlId)
	set 600353_req->prsnl[1].activity_dt_tm = c_now_dt_tm
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600353_req,"REC",600353_rep)
 
	if(600353_rep->status_data.status = "S")
		set iValidate = 1
		set intervention_reply_out->intervention_id = dInterventionId
	endif
 
	if(idebugFlag > 0)
		call echo(concat("CheckPrivileges Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ; EnsureDcpEvents(null) = null - 600345 dcp_events_ensured
;  Description:  Ensure DCP events
**************************************************************************/
subroutine EnsureDcpEvents(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("EnsureDcpEvents Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication  = 380000
	set iTask = 600108
	set iRequest = 600345
 
	for(i = 1 to size(temp_events->qual,5))
		set stat = alterlist(600345_req->elist,i)
		set 600345_req->elist[i].event_id = temp_events->qual[i].event_id
		set 600345_req->elist[i].order_id = dOrderId
		set 600345_req->elist[i].task_id = dTaskId
	endfor
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600345_req,"REC",600345_rep)
 
	set iValidate = stat
 
	if(idebugFlag > 0)
		call echo(concat("EnsureDcpEvents Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ModifyOrderTask(null)		= i2 with protect ;560303	DCP.ModTask
;  Description:  Modify the task that was generated above
**************************************************************************/
subroutine ModifyOrderTask(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ModifyOrderTask Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication  = 380000
	set iTask = 560300
	set iRequest = 560303
 
	set stat = alterlist(560303_req->mod_list,1)
	set 560303_req->mod_list[1].task_id = dTaskId
	if(sStatusMean in ("AUTH","MODIFIED"))
		set 560303_req->mod_list[1].task_status_meaning = uar_get_code_meaning(c_complete_task_status_cd)
	else
		set 560303_req->mod_list[1].task_status_meaning = uar_get_code_meaning(c_inprocess_task_status_cd)
	endif
 
	set 560303_req->mod_list[1].task_dt_tm = c_now_dt_tm
	set 560303_req->mod_list[1].event_id = dFormEventId
	set 560303_req->mod_list[1].charted_by_agent_cd = c_charting_agent_cd
	set 560303_req->mod_list[1].result_set_id = 1000011_rep->rb_list[1].result_set_link_list[1].result_set_id
	set 560303_req->mod_list[1].performed_prsnl_id = dPrsnlId
	set 560303_req->mod_list[1].performed_dt_tm = c_now_dt_tm
 
	set stat = alterlist(560303_req->workflow,1)
	set 560303_req->workflow[1].bagCountingInd = 1
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",560303_req,"REC",560303_rep)
 
	if(560303_rep->task_status = "S")
		set iValidate = 1
	endif
 
	if(idebugFlag > 0)
		call echo(concat("ModifyOrderTask Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
end go
set trace notranslatelock go
 
 
