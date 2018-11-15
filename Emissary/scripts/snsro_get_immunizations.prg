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
*                                                                     *
  ~BE~***********************************************************************/
/*****************************************************************************
          Date Written:       12/18/15
          Source file name:   snsro_get_immunizations
          Object name:        snsro_get_immunizations
          Request #:
          Program purpose:    Returns immunization results by component
          Tables read:	      CLINICAL_EVENT, ORDER_ACTION, PRSNL
          Tables updated:     NONE
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  000 12/18/15  JCO				    Initial write
  001 01/04/15  AAB					Changed immunization_result to immunization_results
  002 02/09/16  AAB 				Check size of med_result_list before using it
  003 02/22/16  AAB 				Add encntr_type_cd and encntr_type_disp
  004 04/29/16  AAB 				Added version
  005 10/10/16  AAB 				Add DEBUG_FLAG
  006 06/14/17  DJP					Fixed Reply Record Structure for Invalid User
  007 07/27/17 	JCO					Changed %i to execute; update ErrorHandler2
  008 03/21/18 	RJC					Added version code and copyright block
 ***********************************************************************/
drop program snsro_get_immunizations go
create program snsro_get_immunizations

prompt
	"Output to File/Printer/MINE" = "MINE"  ;* Enter or select the printer or file name to send this report to.
	, "USERNAME: " = ""						;User for audit purposes (optional)
	, "USERTYPE: " = 0						;0 = EMR (DEFAULT), 1 = PORTAL
	, "PERSON ID: " = 0.0					;Patient Identifier (required)
	, "Debug Flag" = 0						;OPTIONAL. Verbose logging when set to one (1). 005
 
with OUTDEV, USERNAME, USERTYPE, PERSON_ID, DEBUG_FLAG   ;005

/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;008
if($OUTDEV = "VERSION")
	go to exit_version
endif

/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
 
free record immunizations_component_req
record immunizations_component_req
(
	1 event_cds[*]
		2 event_cd					= f8
		2 source_identifier			= vc
)
 
free record immunizations_results_reply_out
record immunizations_results_reply_out
(
	1 person_id              		= f8
	1 immunization_results[*]
		2 order_id              	= f8	; ce.order_id
		2 immunization_id 			= f8	; ce.event_id
	    2 encntr_id 				= f8	; ce.encntr_id
		2 seq_number				= vc	; ce.COLLATING_SEQ
		2 admin_dt_tm				= dq8 	; ce.med_list.ADMIN_START_DT_TM
		2 immunization_status		= vc	; ce.RESULT_STATUS_CD_DISP
		2 component_id     			= f8	; ce.event_cd
		2 component_desc       		= vc	; ce.event_cd (Disp)
		2 body_site					= vc	; ce.med_list.ADMIN_SITE_CD_DISP
		2 admin_route				= vc	; ce.med_list.ADMIN_ROUTE_CD_DISP
		2 dose						= vc	; ce.result_val
		2 dose_unit					= vc	; ce.RESULT_UNITS_CD_DISP
	    2 clinsig_updt_dt_tm		= dq8	; ce.clinsig_updt_dt_tm
	    2 expiration_dt_tm			= dq8	; ce.med_list.SUBSTANCE_EXP_DT_TM
		2 manufacturer_name		    = vc	; ce.med_list.SUBSTANCE_MANUFACTURER_CD_DISP
		2 substance_lot		       	= vc	; ce.SUBSTANCE_LOT_NUMBER
		2 performed_prsnl_id		= f8	; ce.PERFORMED_PRSNL_ID
		2 performed_prsnl			= vc	; PRSNL look-up
		2 ordered_prsnl_id			= f8	; o.order_prsnl_id
		2 ordered_prsnl				= vc	; PRSNL look-up
		2 comment					= vc	; N/A
		2 encntr_type_cd			= f8	;003
		2 encntr_type_disp			= vc	;003
		2 encntr_type_class_cd		= f8	;003
		2 encntr_type_class_disp	= vc	;003
	1 audit
		2 user_id							= f8
		2 user_firstname					= vc
		2 user_lastname						= vc
		2 patient_id						= f8
		2 patient_firstname					= vc
		2 patient_lastname					= vc
 	    2 service_version					= vc		;004
/*007 begin */
    1 status_data
      2 status = c1
      2 subeventstatus[1]
        3 OperationName = c25
        3 OperationStatus = c1
        3 TargetObjectName = c25
        3 TargetObjectValue = vc
        3 Code = c4
        3 Description = vc
/*007 end */
)
 
 
free record req_event_query
record req_event_query (
  1 query_mode  = i4
  1 query_mode_ind = i2
  1 event_set_cd = f8
  1 person_id = f8
  1 order_id = f8
  1 encntr_id = f8
  1 encntr_financial_id = f8
  1 contributor_system_cd = f8
  1 accession_nbr = vc
  1 compress_flag = i2
  1 subtable_bit_map = i4
  1 subtable_bit_map_ind = i2
  1 small_subtable_bit_map = i4
  1 small_subtable_bit_map_ind = i2
  1 search_anchor_dt_tm = dq8
  1 search_anchor_dt_tm_ind = i2
  1 seconds_duration = f8
  1 direction_flag = i2
  1 events_to_fetch = i4
  1 date_flag = i2
  1 view_level = i4
  1 non_publish_flag = i2
  1 valid_from_dt_tm = dq8
  1 valid_from_dt_tm_ind = i2
  1 decode_flag = i2
  1 encntr_list [*]
    2 encntr_id = f8
  1 event_set_list [*]
    2 event_set_name = vc
  1 encntr_type_class_list [*]
    2 encntr_type_class_cd = f8
  1 order_id_list_ext [*]
    2 order_id = f8
  1 event_set_cd_list_ext [*]
    2 event_set_cd = f8
    2 event_set_name = vc
    2 fall_off_seconds_dur = f8
  1 ordering_provider_id = f8
  1 action_prsnl_id = f8
  1 query_mode2  = i4
  1 encntr_type_list [*]
    2 encntr_type_cd = f8
  1 end_of_day_tz = i4
  1 perform_prsnl_list [*]
    2 perform_prsnl_id = f8
  1 result_status_list [*]
    2 result_status_cd = f8
  1 search_begin_dt_tm = dq8
  1 search_end_dt_tm = dq8
  1 action_prsnl_group_id = f8
)
 
free record rep_event_query
record rep_event_query (
  1 sb
    2 severityCd = i4
    2 statusCd = i4
    2 statusText = vc
    2 subStatusList [*]
        3 subStatusCd = i4
  1 query_dt_tm = dq8
  1 query_dt_tm_ind = i2
  1 rb_list [*]
    2 event_set_list [*]
		3 self_name = vc
		3 self_cd = f8
		3 self_disp = vc
		3 self_descr = vc
		3 self_icon_name = vc
		3 primitive_ind = i2
		3 primitive_ind_ind = i2
		3 collating_seq = i4
		3 collating_seq_ind = i2
		3 category_flag = i2
		3 category_flag_ind = i2
		3 parent_event_set_cd = f8
		3 show_if_no_data_ind = i2
		3 show_if_no_data_ind_ind = i2
		3 grouping_rule_flag = i2
		3 grouping_rule_flag_ind = i2
		3 accumulation_ind = i2
		3 accumulation_ind_ind = i2
		3 display_association_ind = i2
		3 display_association_ind_ind = i2
		3 concept_cki = vc
    2 event_list [*]
		3 clinical_event_id = f8
		3 event_id = f8
		3 view_level = i4
		3 encntr_id = f8
		3 order_id = f8
		3 catalog_cd = f8
		3 parent_event_id = f8
		3 event_class_cd = f8
		3 event_cd = f8
		3 event_cd_disp = vc
		3 event_tag = vc
		3 event_end_dt_tm = dq8
		3 event_end_dt_tm_ind = i2
		3 task_assay_cd = f8
		3 record_status_cd = f8
		3 record_status_cd_disp = vc
		3 result_status_cd = f8
		3 result_status_cd_disp = vc
		3 publish_flag = i2
		3 normalcy_cd = f8
		3 subtable_bit_map = i4
		3 event_title_text = vc
		3 result_val = vc
		3 result_units_cd = f8
		3 result_units_cd_disp = vc
		3 performed_dt_tm = dq8
		3 performed_dt_tm_ind = i2
		3 performed_prsnl_id = f8
		3 normal_low = vc
		3 normal_high = vc
		3 reference_nbr = vc
		3 contributor_system_cd = f8
		3 valid_from_dt_tm = dq8
		3 valid_from_dt_tm_ind = i2
		3 valid_until_dt_tm = dq8
		3 valid_until_dt_tm_ind = i2
		3 note_importance_bit_map = i2
		3 updt_dt_tm = dq8
		3 updt_dt_tm_ind = i2
		3 updt_id = f8
		3 clinsig_updt_dt_tm = dq8
		3 clinsig_updt_dt_tm_ind = i2
	    3 collating_seq = vc
		3 order_action_sequence = i4
		3 entry_mode_cd = f8
		3 source_cd = f8
		3 source_cd_disp = vc
		3 source_cd_mean = vc
		3 clinical_seq = vc
		3 event_end_tz = i2
		3 performed_tz = i2
		3 task_assay_version_nbr = f8
		3 modifier_long_text = vc
		3 modifier_long_text_id = f8
		3 endorse_ind = i2
		3 new_result_ind = i2
		3 organization_id = f8
		3 src_event_id = f8
		3 src_clinsig_updt_dt_tm = dq8
		3 person_id = f8
		3 nomen_string_flag = i2
		3 ce_dynamic_label_id = f8
		3 trait_bit_map = i4
		3 order_action_sequence = i4
		3 event_prsnl_list [*]
			4 event_id					= f8
			4 action_type_cd			= f8
			4 action_type_cd_disp   	= vc
			4 request_dt_tm				= dq8
			4 request_dt_tm_ind			= i2
			4 request_prsnl_id			= f8
			4 request_prsnl_ft			= vc
			4 action_dt_tm				= dq8
			4 action_dt_tm_ind			= i2
			4 action_prsnl_id			= f8
			4 action_prsnl_ft			= vc
			4 proxy_prsnl_id			= f8
			4 proxy_prsnl_ft			= vc
			4 action_status_cd			= f8
			4 action_status_cd_disp		= vc
			4 valid_from_dt_tm			= dq8
			4 valid_from_dt_tm_ind		= i2
			4 valid_until_dt_tm			= dq8
			4 valid_until_dt_tm_ind		= i2
			4 linked_event_id			= f8
			4 request_tz				= i2
			4 action_tz					= i2
			4 event_prsnl_id			= f8
			4 system_comment			= vc
			4 digital_signature_ident	= vc
			4 action_prsnl_group_id		= f8
			4 request_prsnl_group_id	= f8
		3 med_result_list[*]
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
		      4 weight_value = f8
      		  4 weight_unit_cd = f8
%i cclsource:status_block.inc
)
 
 
free record req_event_detail
record req_event_detail(
  1 query_mode  			= i4
  1 query_mode_ind 			= i2
  1 event_id 				= f8
  1 contributor_system_cd 	= f8
  1 reference_nbr			= vc
  1 dataset_uid 			= vc
  1 subtable_bit_map 		= i4
  1 subtable_bit_map_ind 	= i2
  1 valid_from_dt_tm 		= dq8
  1 valid_from_dt_tm_ind 	= i2
  1 decode_flag 			= i2
  1 ordering_provider_id 	= f8
  1 action_prsnl_id 		= f8
  1 event_id_list [*]
	2 event_id 				= f8
  1 action_type_cd_list [*]
    2 action_type_cd 		= f8
  1 src_event_id_ind 		= i2
  1 action_prsnl_group_id 	= f8
 
)
 
free record rep_event_detail
record rep_event_detail(
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
	  3 event_order_link_list[*]
		4 event_id						= f8
		4 order_id						= f8
		4 order_action_sequence			= i4
		4 valid_from_dt_tm				= dq8
		4 valid_from_dt_tm_ind			= i2
		4 valid_until_dt_tm				= dq8
		4 valid_until_dt_tm_ind			= i2
		4 updt_dt_tm					= dq8
		4 updt_dt_tm_ind				= i2
		4 updt_id						= f8
		4 updt_task						= i4
		4 updt_task_ind					= i2
		4 updt_cnt						= i4
		4 updt_cnt_ind					= i2
		4 updt_applctx					= i4
		4 updt_applctx_ind				= i2
		4 template_order_id				= f8
		4 event_end_dt_tm				= dq8
		4 parent_order_ident			= f8
		4 person_id						= f8
		4 encntr_id						= f8
		4 catalog_type_cd				= f8
		4 ce_event_order_link_id		= f8
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
 
 
set immunizations_results_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare dPersonID  			= f8 with protect, noconstant(0.0)
declare immun_event_set_cd 	= f8 with protect, constant(uar_get_code_by("DISPLAY_KEY", 93, "IMMUNIZATIONS"))
declare sUserName			= vc with protect, noconstant("")
declare sUserType			= i2 with protect, noconstant(0)
declare iRet				= i2 with protect, noconstant(0)
declare section_start_dt_tm = dq8 with protect, noconstant(cnvtdatetime(curdate, curtime3))
declare sFromDate			= vc with protect, noconstant("")
declare sToDate				= vc with protect, noconstant("")
 
declare APPLICATION_NUMBER 	= i4 with protect, constant (600005)
declare TASK_NUMBER 		= i4 with protect, constant (600107)
declare REQ_NUM_EVENT 		= i4 with protect, constant (1000001)
declare idebugFlag			= i2 with protect, noconstant(0) ;005
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
 
set dPersonID   	= cnvtint($PERSON_ID)
set iUserType		= cnvtint($USERTYPE)
set sUserName		= trim($USERNAME, 3)
set idebugFlag		= cnvtint($DEBUG_FLAG)  ;005
 
if(idebugFlag > 0)
 
	call echo(build("Immunizations Code: ",immun_event_set_cd))
	call echo(build("sUserName  ->", sUserName))
	call echo(build("dPersonID ->", dPersonID))
 
endif
 
/****************************************************************************
;INCLUDES
****************************************************************************/
;007 %i ccluserdir:snsro_common.inc
execute snsro_common	;007
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetImmunizations(null)		= null with protect
declare ParseComponents(null)		= null with protect
declare GetCodingSystem(null)		= null with protect
declare GetLabEventSet(null)		= null with protect
declare PostAmble(null)				= null with protect
declare GetResultByResultID(null)	= null with protect
declare GetOrderLabLocation(null)	= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
call GetImmunizations(null)
call PostAmble(null)
set iRet = PopulateAudit(sUserName, dPersonID, immunizations_results_reply_out, sVersion)   ;004
 
 
if(iRet = 0)  ;004
 
	call ErrorHandler2("IMMUNIZATIONS", "F", "User is invalid", "Invalid User for Audit.",
	"1001", build("Invalid user: ",sUsername),immunizations_results_reply_out)	;007
 
	go to exit_script
 
endif
 
	call ErrorHandler("EXECUTE", "S", "Success", "Immunization records found", immunizations_results_reply_out)
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
	set JSONout = CNVTRECTOJSON(immunizations_results_reply_out)
 
	if(idebugFlag > 0)
 
	 	set file_path = logical("ccluserdir")
		set _file = build2(trim(file_path),"/snsro_get_immunizations.json")
		call echo(build2("_file : ", _file))
		call echojson(immunizations_results_reply_out, _file, 0)
	 	call echorecord(immunizations_results_reply_out)
		call echo(JSONout)
 
	endif
 
    if(validate(_MEMORY_REPLY_STRING))
		set _MEMORY_REPLY_STRING = trim(JSONout,3)
	endif
 
#EXIT_VERSION
/***************************************************************************
;  Name: GetImmunizations (null)
;  Description: Perform query to retreive immunization records
;
**************************************************************************/
subroutine GetImmunizations(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetImmunizations Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
set iEventQueryInd								= 1
set req_event_query->query_mode  				= 32769 ;32833
set req_event_query->query_mode_ind 			= 0
set req_event_query->event_set_cd 				= immun_event_set_cd
set req_event_query->person_id 					= dPersonID
set req_event_query->order_id 					= 0;dOrderID
set req_event_query->encntr_id 					= 0;dEncntrID
set req_event_query->encntr_financial_id 		= 0
set req_event_query->contributor_system_cd 		= 0
set req_event_query->accession_nbr 				= ""
set req_event_query->compress_flag 				= 1
set req_event_query->subtable_bit_map 			= 4;-2147483644
set req_event_query->subtable_bit_map_ind 		= 0
set req_event_query->small_subtable_bit_map 	= 0
set req_event_query->small_subtable_bit_map_ind = 1
 
 
if(sToDate = "")
 
	set req_event_query->search_anchor_dt_tm 		= cnvtdatetime(curdate,curtime3)
 
else
 
	set req_event_query->search_anchor_dt_tm 		= cnvtdatetime(sToDate)
 
endif
 
set start_dt_tm = cnvtdatetime(sFromDate)
set end_dt_tm = cnvtdatetime(req_event_query->search_anchor_dt_tm)
if(idebugFlag > 0)
 
	call echo(build("sFromDate ->", sFromDate))
	call echo(build("sToDate ->", sToDate))
	call echo(build("SECONDS DURATION-->", datetimediff(start_dt_tm,end_dt_tm,5)))
 
endif
 
set req_event_query->search_anchor_dt_tm_ind 	= 0
set req_event_query->seconds_duration 			= datetimediff(start_dt_tm,end_dt_tm,5)
set req_event_query->direction_flag 			= 0
set req_event_query->events_to_fetch 			= 0
set req_event_query->date_flag 					= 0
set req_event_query->view_level 				= 0
set req_event_query->non_publish_flag 			= 1
set req_event_query->valid_from_dt_tm 			= cnvtdatetime("0000-00-00 00:00:00.00")
set req_event_query->valid_from_dt_tm_ind 		= 1
set req_event_query->decode_flag 				= 0
;set req_event_query->encntr_list [*]->encntr_id = 0
set req_event_query->ordering_provider_id 		= 0
set req_event_query->action_prsnl_id 			= 0
set req_event_query->query_mode2  				= 0
set req_event_query->end_of_day_tz 				= 0
set req_event_query->search_begin_dt_tm 		= cnvtdatetime("0000-00-00 00:00:00.00")
set req_event_query->search_end_dt_tm 			= cnvtdatetime("0000-00-00 00:00:00.00")
set req_event_query->action_prsnl_group_id 		= 0
 
if(idebugFlag > 0)
 
	call echorecord(req_event_query)
 
endif
 
set stat = tdbexecute(APPLICATION_NUMBER, TASK_NUMBER, REQ_NUM_EVENT,"REC",req_event_query,"REC",rep_event_query)
 
if(idebugFlag > 0)
 
	call echorecord(rep_event_query)
 
endif
 
if (rep_event_query->status_data->status = "F")
	call ErrorHandler2("EXECUTE", "F", "Error", "Error retrieving immunization records",
	"9999", "Error retrieving immunization records", immunizations_results_reply_out)	;007
	go to EXIT_SCRIPT
endif
 
if(size(rep_event_query->rb_list[1]->event_list, 5) = 0)
 
	call ErrorHandler("EXECUTE", "Z", "Zero Records", "No immunization records found", immunizations_results_reply_out)
	go to EXIT_SCRIPT
endif
 
if(idebugFlag > 0)
 
	call echo(concat("GetImmunizations Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
/*************************************************************************
;  Name: PostAmble(null)
;  Description: Perform any post-processing steps
;
**************************************************************************/
 
subroutine PostAmble(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("PostAmble Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
declare resCnt 				= i4 with  protect, noconstant(0)
declare x 					= i4 with  protect, noconstant(0)
declare y 					= i4 with  protect, noconstant(0)
 
;get number of immunizations by looking at rb_list[1].event_list size
set resCnt = size(rep_event_query->rb_list[1]->event_list,5)
if(idebugFlag > 0)
 
	call echo(build("resCnt: ",resCnt))
 
endif
 
if(resCnt > 0)
	set stat = alterlist(immunizations_results_reply_out->immunization_results,resCnt)
	set immunizations_results_reply_out->person_id = dPersonId
 
	;iterate through result list and populate immunizations_results_reply_out struct
	for(x = 1 to resCnt)
		set immunizations_results_reply_out->immunization_results[x].order_id =
					rep_event_query->rb_list[1]->event_list[x].order_id
		set immunizations_results_reply_out->immunization_results[x].immunization_id
					= rep_event_query->rb_list[1]->event_list[x].event_id
		set immunizations_results_reply_out->immunization_results[x].encntr_id = rep_event_query->rb_list[1]->event_list[x].encntr_id
		;003 +
		set immunizations_results_reply_out->immunization_results[x].encntr_type_cd =
			GetPatientClass(immunizations_results_reply_out->immunization_results[x].encntr_id, 1)
		set immunizations_results_reply_out->immunization_results[x].encntr_type_disp =
			uar_get_code_display(immunizations_results_reply_out->immunization_results[x].encntr_type_cd )
		set immunizations_results_reply_out->immunization_results[x].encntr_type_class_cd =
			GetPatientClass(immunizations_results_reply_out->immunization_results[x].encntr_id, 2)
		set immunizations_results_reply_out->immunization_results[x].encntr_type_class_disp	=
			uar_get_code_display(immunizations_results_reply_out->immunization_results[x].encntr_type_class_cd )
		;003 -
		set immunizations_results_reply_out->immunization_results[x].seq_number =
					rep_event_query->rb_list[1]->event_list[x].collating_seq
		if(size(rep_event_query->rb_list[1]->event_list[x]->med_result_list,5) > 0) ;002 +
			set immunizations_results_reply_out->immunization_results[x].admin_dt_tm =
					rep_event_query->rb_list[1]->event_list[x]->med_result_list[1].admin_start_dt_tm
			set immunizations_results_reply_out->immunization_results[x].body_site =
					rep_event_query->rb_list[1]->event_list[x]->med_result_list[1].admin_site_cd_disp
			set immunizations_results_reply_out->immunization_results[x].admin_route =
					rep_event_query->rb_list[1]->event_list[x]->med_result_list[1].admin_route_cd_disp
			set immunizations_results_reply_out->immunization_results[x].expiration_dt_tm =
					rep_event_query->rb_list[1]->event_list[x]->med_result_list[1].substance_exp_dt_tm
			set immunizations_results_reply_out->immunization_results[x].manufacturer_name =
					rep_event_query->rb_list[1]->event_list[x]->med_result_list[1].substance_manufacturer_cd_disp
			set immunizations_results_reply_out->immunization_results[x].substance_lot =
					rep_event_query->rb_list[1]->event_list[x]->med_result_list[1].substance_lot_number
		endif  ;002 -
 
		set immunizations_results_reply_out->immunization_results[x].immunization_status =
					rep_event_query->rb_list[1]->event_list[x] .result_status_cd_disp
		set immunizations_results_reply_out->immunization_results[x].component_id =
					rep_event_query->rb_list[1]->event_list[x].event_cd
		set immunizations_results_reply_out->immunization_results[x].component_desc =
					rep_event_query->rb_list[1]->event_list[x].event_cd_disp
		set immunizations_results_reply_out->immunization_results[x].dose =
					rep_event_query->rb_list[1]->event_list[x].result_val
		set immunizations_results_reply_out->immunization_results[x].dose_unit =
					rep_event_query->rb_list[1]->event_list[x].result_units_cd_disp
		set immunizations_results_reply_out->immunization_results[x].clinsig_updt_dt_tm =
					rep_event_query->rb_list[1]->event_list[x].clinsig_updt_dt_tm
		set immunizations_results_reply_out->immunization_results[x].performed_prsnl_id =
					rep_event_query->rb_list[1]->event_list[x].performed_prsnl_id
		set immunizations_results_reply_out->immunization_results[x].performed_prsnl =
					GetNameFromPrsnlID(rep_event_query->rb_list[1]->event_list[x].performed_prsnl_id)
		set immunizations_results_reply_out->immunization_results[x].ordered_prsnl_id =
					GetOrderPrsnlIDfromOrderID(rep_event_query->rb_list[1]->event_list[x].order_id)
		set immunizations_results_reply_out->immunization_results[x].ordered_prsnl =
					GetNameFromPrsnlID(immunizations_results_reply_out->immunization_results[x].ordered_prsnl_id)
		set immunizations_results_reply_out->immunization_results[x].comment = "" ;N/A at this time
 
	endfor
 
 
endif
 
if(idebugFlag > 0)
 
	call echo(concat("PostAmble Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
 
end
 
end go
