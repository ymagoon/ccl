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
*                                                                    *
  ~BE~***********************************************************************/
/*****************************************************************************
          Date Written:       12/13/14
          Source file name:   snsro_get_lab_results
          Object name:        snsro_get_lab_results
          Request #:
          Program purpose:    Returns lab results by component
          Tables read:
          Tables updated:     NONE
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  000 12/13/14  AAB					Initial write
  001 01/01/15  AAB 				Change input to support lab components
  002 01/08/15  AAB 				Add normal_high and normal_low to response
  003 01/09/15  AAB                 Support components as a comma delimited string
									in query parameter
  004 01/12/15  AAB 				Retrieve LOINC for each component
  005 01/13/15  AAB  				Removed the additional fields from response object
  006 01/18/15  AAB 				Support MAX_RECORDS
  007 01/27/15  JCO					Added check for cen.event_id > 0
  008 02/18/15  AAB					Added some better checks for Blank date values
  009 04/28/15  AAB					Add Event Set Query if no Components are passed in
  010 04/29/15  AAB 				Added datetimediff to convert timeframe to seconds
  011 05/16/15  AAB 				Added RESULT_ID to input parameters and query by event_id
  012 05/22/15  AAB 				Use CDF_Meaning when pulling the display value for normalcy_cd
  013 05/26/15  AAB 				Added clinsig_updt_dt_tm to result object
  014 06/24/15  JCO					Added Lab Location
  015 09/14/15  AAB					Add audit object
  016 12/14/15  AAB 				Return patient class
  017 12/19/15  AAB 				Externalize event_set_cd
  018 02/22/16  AAB 				Add encntr_type_cd and encntr_type_disp
  019 04/29/16  AAB 				Added version
  020 10/10/16  AAB 				Add DEBUG_FLAG
  021 07/06/17  JCO					Added person_id to reply
  022 07/27/17 	JCO					Changed %i to execute; update ErrorHandler2; UTC
  023 03/06/18	RJC					Moved UTC to beginning, set sFromDate and sToDate to have defaults, changed default lab eventset
  024 03/21/18	RJC					Added version code and copyright block
 ***********************************************************************/
drop program snsro_get_lab_results go
create program snsro_get_lab_results

prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Person ID:" = 0.00			; Required
		, "Encounter ID:" = 0.00		; Optional
		, "Result ID:" = 0.00		; Optional
		, "Component ID:" = ""			; Event cds of the lab component (Required)
		, "Maximum records:" = 0       ; Number of results to return.  0 is unlimited.
        , "From Date:" = "01-JAN-1900"	; default beginning of time
		, "To Date:" = ""	; default end of time
		, "User Name:" = ""        		;015
		, "Event_set"		= 0.0		;017
		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, PERSON_ID, ENCNTR_ID, RESULT_ID, COMPONENT_ID,
	MAX_RECORDS, FROM_DATE, TO_DATE, USERNAME, EVENT_SET_CD, DEBUG_FLAG   ;020
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;024
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record lab_component_req
record lab_component_req
(
	1 event_cds[*]
		2 event_cd					= f8
		2 source_identifier			= vc
)
 
free record lab_results_reply_out
record lab_results_reply_out
(
	;1 order_id              		= f8
	1 lab_result[*]
		2 order_id              	= f8
		2 result_id 				= f8	; ce.event_id
	    2 encntr_id 				= f8	;016
	    2 encntr_type_cd			= f8	;016
	    2 encntr_type_disp			= vc	;016
		2 encntr_type_class_cd		= f8	;018
		2 encntr_type_class_disp	= vc	;018
		2 seq_number				= i4
		2 result_date				= dq8 	; ce.performed_dt_tm
		2 result_value				= vc	; ce.result_val
		2 component_id     			= f8	; ce.event_cd
		2 component_desc       		= vc	; ce.event_cd (Disp)
		;2 ref_range					= vc	; ce.normal_low - ce.normal_high
		2 units_of_measure			= vc	; ce.result_units_cd
	    2 clinsig_updt_dt_tm		= dq8	; ce.clinsig_updt_dt_tm
		;2 clinical_display_line     = vc	; ce.clinical_display_line
		2 result_status		       	= vc	; ce.result_status_cd (disp)
		2 normalcy					= vc	; ce.normalcy_cd (disp)
		2 normal_high				= vc	; ce.normal_high
		2 normal_low				= vc	; ce.normal_low
		2 resource_cd				= f8	; ce.resource_cd
		;2 performed_prsnl_id		= f8	; ce.performed_prsnl_id
		;2 verified_prsnl_id			= f8	; ce.verified_prsnl_id
		2 loinc						= vc	; n.source_identifier
		2 result_note [*]
			3 note_body 			= gvc
			3 note_dt_tm 			= dq8
			3 note_format 			= vc
			3 note_provider_id 		= f8
			3 note_provider_name 	= vc
/*014*/	2 lab_loc[*]
	      3 lab_name 				= vc
	      3 address
	      	4 address_id 			= f8
	      	4 address_type_cd 		= f8
	      	4 address_type_disp		= vc
	      	4 address_type_mean 	= vc
	      	4 street_addr 			= vc
	      	4 street_addr2 			= vc
	      	4 city 					= vc
	      	4 state_cd 				= f8
	      	4 state_disp 			= vc
	      	4 state_mean 			= vc
	      	4 zipcode 				= vc
	    2 person_id					= f8 ;021
	1 audit			;015
		2 user_id							= f8
		2 user_firstname					= vc
		2 user_lastname						= vc
		2 patient_id						= f8
		2 patient_firstname					= vc
		2 patient_lastname					= vc
	    2 service_version					= vc		;019
;022 %i cclsource:status_block.inc
/*022 begin */
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
/*022 end */
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
			4 event_id 							= f8
			4 valid_from_dt_tm 					= dq8
			4 valid_until_dt_tm 				= dq8
			4 admin_note 						= vc
			4 admin_prov_id 					= f8
			4 admin_start_dt_tm 				= dq8
			4 admin_start_dt_tm_ind				= i2
			4 admin_end_dt_tm 					= dq8
			4 admin_end_dt_tm_ind				= i2
			4 admin_route_cd 					= f8
			4 admin_route_cd_disp 				= vc
			4 admin_route_cd_mean 				= vc
			4 admin_site_cd 					= f8
			4 admin_site_cd_mean				= vc
			4 admin_site_cd_disp 				= vc
			4 admin_method_cd 					= f8
			4 admin_method_disp 				= vc
			4 admin_pt_loc_cd 					= f8
			4 admin_pt_loc_cd_disp 				= vc
			4 initial_dosage 					= f8
			4 admin_dosage 						= f8
			4 admin_dosage_ind					= i2
			4 dosage_unit_cd 					= f8
			4 initial_dosage_ind				= i2
			4 dosage_unit_cd_disp 				= vc
			4 dosage_unit_cd_mean				= vc
			4 initial_volume 					= f8
			4 initial_volume_ind				= i2
			4 total_intake_volume 				= f8
			4 total_intake_volume_ind			= i2
			4 valid_from_dt_tm_ind				= i2
			4 valid_until_dt_tm_ind				= i2
			4 infused_volume_unit_cd_mean		= vc
			4 diluent_type_cd 					= f8
			4 diluent_type_cd_disp 				= vc
			4 ph_dispense_id 					= f8
			4 infusion_rate 					= f8
			4 infusion_rate_ind 				= i2
			4 infusion_unit_cd 					= f8
			4 infusion_unit_cd_disp 			= vc
			4 infusion_unit_cd_mean 			= vc
			4 infusion_time_cd 					= f8
			4 infusion_time_cd_disp 			= vc
			4 medication_form_cd 				= f8
			4 medication_form_cd_disp 			= vc
			4 reason_required_flag 				= i2
			4 response_required_flag			= i2
			4 admin_strength 					= i4
			4 admin_strength_ind 				= i2
			4 admin_strength_unit_cd 			= f8
			4 admin_strength_unit_cd_disp 		= vc
			4 substance_lot_number 				= vc
			4 substance_exp_dt_tm 				= dq8
			4 substance_manufacturer_cd 		= f8
			4 substance_manufacturer_cd_disp 	= vc
			4 refusal_cd 						= f8
			4 refusal_cd_disp 					= vc
			4 system_entry_dt_tm 				= dq8
			4 iv_event_cd 						= f8
			4 infused_volume 					= f8
			4 infused_volume_unit_cd 			= f8
			4 infused_volume_unit_cd_disp 		= vc
			4 remaining_volume 					= f8
			4 remaining_volume_unit_cd 			= f8
			4 remaining_volume_unit_cd_disp 	= vc
			4 synonym_id 						= f8
			4 immunization_type_cd 				= f8
			4 immunization_type_cd_disp 		= vc
			4 admin_start_tz 					= i4
			4 admin_end_tz 						= i4
			4 weight_value						= i4
			4 weight_unit_cd					= f8
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
 
 
set lab_results_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
 
declare dPersonID  			= f8 with protect, noconstant(0.0)
declare dEncntrID  			= f8 with protect, noconstant(0.0)
declare dOrderID           	= f8 with protect, noconstant(0.0)
declare dResultID  			= f8 with protect, noconstant(0.0)
declare dEventCd  			= f8 with protect, noconstant(0.0)
declare sComponents			= vc with protect, noconstant("")
declare iMax_recs	 		= i4 with protect, noconstant(0)
declare dActivityTypeCd 	= f8 with protect, constant(uar_get_code_by("MEANING",106,"GLB"))
declare dChildCd 			= f8 with protect, constant(uar_get_code_by("MEANING",24,"CHILD"))
declare resultCnt 			= i4 with protect, noconstant (0)
declare sFromDate			= vc with protect, noconstant("")
declare sToDate				= vc with protect, noconstant("")
declare blob_in             = c69999 with noconstant(" ")
declare blob_out            = c69999 with noconstant(" ")
declare blob_out2           = c69999 with noconstant(" ")
declare blob_out3           = c69999 with noconstant(" ")
declare blob_ret_len        = i4 with noconstant(0)
declare section_start_dt_tm = dq8 with protect, noconstant(cnvtdatetime(curdate, curtime3))
declare nocomp_cd           = f8 with protect, constant(UAR_GET_CODE_BY( "MEANING", 120, "NOCOMP"))
declare comp_cd             = f8 with protect, constant(UAR_GET_CODE_BY( "MEANING", 120, "OCFCOMP"))
declare loinc_src_cd		= f8 with protect, constant(UAR_GET_CODE_BY( "MEANING", 400, "LOINC"))
declare lab_event_set_cd 	= f8 with protect, noconstant(uar_get_code_by("DISPLAY_KEY", 93, "LABORATORY"));023
declare iEventQueryInd	 	= i2 with protect, noconstant(0)
declare iEventDetailInd	 	= i2 with protect, noconstant(0)
declare addressTypeCd		= f8 with protect, constant(uar_get_code_by("MEANING",212,"BUSINESS"))	;014
declare sUserName			= vc with protect, noconstant("")   ;015
declare iRet				= i2 with protect, noconstant(0) 	;015
 
declare APPLICATION_NUMBER 		= i4 with protect, constant (600005)
declare TASK_NUMBER 			= i4 with protect, constant (600107)
declare REQ_NUM_EVENT 			= i4 with protect, constant (1000001)
declare REQ_NUM_EVENT_DETAIL	= i4 with protect, constant (1000011)						;011
 
declare event_set_cd 		= f8 with protect, noconstant(0.0) 		;017
declare idebugFlag			= i2 with protect, noconstant(0) ;020
declare UTCmode						= i2 with protect, noconstant(0);022
declare UTCpos 						= i2 with protect, noconstant(0);022
declare qFromDate					= dq8 with protect, noconstant(0);023
declare qToDate						= dq8 with protect, noconstant(0);023
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
 
set dPersonID   	= cnvtint($PERSON_ID)
set dEncntrID    	= cnvtint($ENCNTR_ID)
set dResultID		= cnvtint($RESULT_ID)
set iMax_recs    	= cnvtint($MAX_RECORDS)
set sFromDate		= trim($FROM_DATE, 3)
set sToDate			= trim($TO_DATE, 3)
set sComponents     = trim($COMPONENT_ID, 3)
set sUserName		= trim($USERNAME, 3)   		;015
set event_set_cd    = cnvtreal($EVENT_SET_CD)	;017 +
set idebugFlag		= cnvtint($DEBUG_FLAG)  ;020
set UTCmode			= CURUTC ;022
set UTCpos			= findstring("Z",sFromDate,1,0);022
 
 
 if(event_set_cd > 0.0)
	set lab_event_set_cd = event_set_cd
endif
 
;023 start
if(sFromDate = "")
	set sFromDate = "01-JAN-1900"
endif
if(sToDate = "")
	set sToDate = "31-DEC-2100"
endif											;017 -
 
 
;022 UTC begin
 if (UTCmode = 1 and UTCpos > 0)
	set qFromDate = cnvtdatetimeUTC(sFromDate) ;;;
	set qToDate = cnvtdatetimeUTC(sToDate)
else
	set qFromDate = cnvtdatetime(sFromDate)
	set qToDate = cnvtdatetime(sToDate)
endif
;022 UTC end
;023 End
 
if(idebugFlag > 0)
 
	call echo(build("lab_event_set_cd  ->", lab_event_set_cd))
	call echo(build("sUserName  ->", sUserName))
	call echo(build("dPersonID ->", dPersonID))
	call echo(build("dEncntrID ->", dEncntrID))
	call echo(build("dResultID ->", dResultID))
	call echo(build("sComponents ->",sComponents))
	call echo(build("iMax_recs ->", iMax_recs))
	call echo(build("UTC MODE -->",UTCmode));022
 	call echo(build("UTC POS -->",UTCpos));022
 	call echo(build("qFromDate ->", qFromDate));023
	call echo(build("qToDate ->", qToDate));023
 
 
endif
 
/****************************************************************************
;INCLUDES
****************************************************************************/
;022 %i ccluserdir:snsro_common.inc
execute snsro_common	;022
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetLabResults(null)			= null with protect
declare ParseComponents(null)		= null with protect
declare GetCodingSystem(null)		= null with protect
declare GetLabEventSet(null)		= null with protect
declare PostAmble(null)				= null with protect
declare GetResultByResultID(null)	= null with protect
declare GetOrderLabLocation(null)	= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
if(dPersonID > 0)
	if((dResultID > 0) and (sComponents = ""))			;011
 
		set iRet = PopulateAudit(sUserName, dPersonID, lab_results_reply_out, sVersion)   ;019    ;015
 
		if(iRet = 0)  ;015
			call ErrorHandler2("VALIDATE", "F", "LAB RESULTS", "Invalid User for Audit.",
			"1001", build("UserId is invalid: ", sUserName), lab_results_reply_out)	;022
			go to EXIT_SCRIPT
 
		endif
		call GetResultByResultID(null)		 			;011
		call PostAmble(null)
		call GetCodingSystem(null)
		call GetOrderLabLocation(null)					;014
	elseif(sComponents != "")
		set iRet = PopulateAudit(sUserName, dPersonID, lab_results_reply_out, sVersion)   ;019  ;015
 
		if(iRet = 0)  ;015
			call ErrorHandler2("VALIDATE", "F", "LAB RESULTS", "Invalid User for Audit.",
			"1001", build("UserId is invalid: ", sUserName), lab_results_reply_out)	;022
			go to EXIT_SCRIPT
 
		endif
		call ParseComponents(null)
		call GetLabResults(null)
		call GetCodingSystem(null)
		call GetOrderLabLocation(null)					;014
	else
		set iRet = PopulateAudit(sUserName, dPersonID, lab_results_reply_out, sVersion)   ;019   ;015
 
		if(iRet = 0)  ;015
			call ErrorHandler2("VALIDATE", "F", "LAB RESULTS", "Invalid User for Audit.",
			"1001", build("UserId is invalid: ", sUserName), lab_results_reply_out)	;022
			go to EXIT_SCRIPT
 
		endif
		call GetLabEventSet(null)
		call PostAmble(null)
		call GetCodingSystem(null)
		call GetOrderLabLocation(null) 					;014
	endif
 
 	call ErrorHandler("EXECUTE", "S", "LAB RESULTS", "Success retrieving lab results", lab_results_reply_out )
else
 	call ErrorHandler2("EXECUTE", "F", "LAB RESULTS", "No Person ID was passed in.",
 	"2055", "Missing required field: PatientId", lab_results_reply_out )	;022
	go to EXIT_SCRIPT
 
endif
 
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
	set JSONout = CNVTRECTOJSON(lab_results_reply_out)
 
 
if(idebugFlag > 0)
 
 	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_lab_results.json")
	call echo(build2("_file : ", _file))
	call echojson(lab_results_reply_out, _file, 0)
 
	call echorecord(lab_results_reply_out)
	call echo(JSONout)
 
endif
 
    if(validate(_MEMORY_REPLY_STRING))
		set _MEMORY_REPLY_STRING = trim(JSONout,3)
	endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: ParseComponents(null)
;  Description: Subroutine to parse a comma delimited string
;
**************************************************************************/
subroutine ParseComponents(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("ParseComponents Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
declare notfnd 		= vc with constant("<not_found>")
declare num 		= i4 with noconstant(1)
declare str 		= vc with noconstant("")
 
if(sComponents != "")
 
	while (str != notfnd)
 
     	set str =  piece(sComponents,',',num,notfnd)
 
     	if(str != notfnd)
      		set stat = alterlist(lab_component_req->event_cds, num)
     		set lab_component_req->event_cds[num]->event_cd = cnvtint(str)
     	endif
 
      	set num = num + 1
 
 	endwhile
 
    call echorecord(lab_component_req)
 
endif
 
if(idebugFlag > 0)
 
	call echo(concat("ParseComponents Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
 
/*************************************************************************
;  Name: GetCodingSystem(null)
;  Description: Subroutine to retrieve coding system and value
;
**************************************************************************/
subroutine GetCodingSystem(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetCodingSystem Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
declare compCnt 			= i4 with  protect, noconstant(0)
declare eventCdCnt 			= i4 with  protect, noconstant(0)
set compCnt 				= size(lab_component_req->event_cds,5)
 
if( compCnt > 0)
  select into "nl:"
 
  from clinical_event ce
	, discrete_task_assay dta
	, nomenclature n
	, (dummyt d WITH seq = compCnt)
 
  plan d
 
  join ce
 
	where
	    ce.person_id = dPersonID and ce.event_cd = lab_component_req->event_cds[d.seq].event_cd
 
  join dta
 
	where dta.task_assay_cd = outerjoin(ce.task_assay_cd)
 
  join n
 
	where n.concept_cki = outerjoin(dta.concept_cki) and n.source_vocabulary_cd = loinc_src_cd
 
  detail
 
	lab_component_req->event_cds[d.seq]->source_identifier = n.source_identifier
 
  with nocounter
 
 
  for (x = 1 to size(lab_results_reply_out->lab_result, 5))
 
	for (y = 1 to size(lab_component_req->event_cds, 5))
 
		if (lab_results_reply_out->lab_result[x]->component_id = lab_component_req->event_cds[y]->event_cd)
 
			set lab_results_reply_out->lab_result[x]->loinc = lab_component_req->event_cds[y]->source_identifier
 
		endif
 
	endfor
 
  endfor
 
else
 
	set eventCdCnt = size(lab_results_reply_out->lab_result, 5)
 
	if( eventCdCnt > 0)
		select into "nl:"
			dta.concept_cki
 
		from
		(dummyt d WITH seq = value(eventCdCnt))
		,clinical_event ce
		,discrete_task_assay dta
		,nomenclature n
 
		plan d
 
		join ce
 
		where
			ce.person_id = dPersonID and ce.event_cd = lab_results_reply_out->lab_result[d.seq]->component_id
 
	   join dta
 
		where dta.task_assay_cd = outerjoin(ce.task_assay_cd)
 
	   join n
 
		where n.concept_cki = outerjoin(dta.concept_cki) and n.source_vocabulary_cd = loinc_src_cd
 
		detail
 
			lab_results_reply_out->lab_result[d.seq]->loinc	 = n.source_identifier
 
	   with nocounter
 
	endif
 
endif
 
if(idebugFlag > 0)
 
	call echo(concat("GetCodingSystem Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
/*************************************************************************
;  Name: GetLabResults(null)
;  Description: Subroutine to get Lab Results by Order ID
;
**************************************************************************/
subroutine GetLabResults(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetLabResults Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
declare componentCnt 			= i4 with  protect, noconstant(0)
declare parseEncStr 			= vc with  protect, noconstant("")
 
set componentCnt = size(lab_component_req->event_cds,5)
 
if(dEncntrID > 0.00)
 
	set parseEncStr = ' ce.encntr_id = dEncntrID '
 
else
 
	set parseEncStr = ' ce.encntr_id > 0 '
 
endif
 
 
  select into "nl:"
 
  from clinical_event ce
	, ce_event_note cen
	, long_blob lb
	, prsnl p
	, (dummyt d WITH seq = componentCnt)
 
  plan d
 
  join ce
 
	where
		ce.person_id = dPersonID
		and parser(parseEncStr)
		and ce.event_cd = lab_component_req->event_cds[d.seq].event_cd
 		and ce.clinsig_updt_dt_tm >= cnvtdatetime(qFromDate) ;023
		and ce.clinsig_updt_dt_tm <= cnvtdatetime(qToDate)   ;023
		and ce.event_reltn_cd = dChildCd
		and ce.view_level = 1
 
  join cen
 
	where cen.event_id = outerjoin(ce.event_id)
 
  join lb
 
	where lb.parent_entity_id = outerjoin(cen.ce_event_note_id) and lb.parent_entity_name = outerjoin("CE_EVENT_NOTE")
 
  join p
 
	where p.person_id  = outerjoin(cen.note_prsnl_id) and p.active_ind = outerjoin(1)
 
 
  head report
 
    resultCnt = 0
	cenCnt = 0
 
 ; head o.order_id
 
	;lab_results_reply_out->order_id = o.order_id
 
  head ce.event_id
 
	resultCnt = resultCnt + 1
	cenCnt = 0
	if(idebugFlag > 0)
 
		call echo(build("event ID: ", ce.event_id))
 
	endif
 
    if (mod(resultCnt, 5) = 1)
 
		stat = alterlist(lab_results_reply_out->lab_result,resultCnt + 4)
 
	endif
 
 	lab_results_reply_out->lab_result[resultCnt]->result_id = ce.event_id
	lab_results_reply_out->lab_result[resultCnt]->seq_number = 0
	lab_results_reply_out->lab_result[resultCnt]->order_id = ce.order_id
	lab_results_reply_out->lab_result[resultCnt]->result_date = ce.performed_dt_tm
	lab_results_reply_out->lab_result[resultCnt]->result_value = ce.result_val
	lab_results_reply_out->lab_result[resultCnt]->component_id = ce.event_cd
	lab_results_reply_out->lab_result[resultCnt]->component_desc =  uar_get_code_display(ce.event_cd)
	lab_results_reply_out->lab_result[resultcnt]->units_of_measure = uar_get_code_display(ce.result_units_cd)
	lab_results_reply_out->lab_result[resultcnt]->clinsig_updt_dt_tm = ce.clinsig_updt_dt_tm	  ;013
	lab_results_reply_out->lab_result[resultcnt]->result_status =  uar_get_code_display(ce.result_status_cd)
 	lab_results_reply_out->lab_result[resultcnt]->normalcy = uar_get_code_meaning(ce.normalcy_cd)  ;012
 	lab_results_reply_out->lab_result[resultCnt]->resource_cd = ce.resource_cd
	lab_results_reply_out->lab_result[resultCnt]->normal_high = ce.normal_high
	lab_results_reply_out->lab_result[resultCnt]->normal_low = ce.normal_low
 
/*
	if (ce.normal_low > " " and ce.normal_high > " ")
	 	lab_results_reply_out->lab_result[resultCnt]->ref_range	 = build2((trim(cnvtstring(ce.normal_low)))," - "
 				,(trim(cnvtstring(ce.normal_high))))
 	elseif (ce.normal_low > " " and ce.normal_high = "")
	 	lab_results_reply_out->lab_result[resultCnt]->ref_range = trim(ce.normal_low)
 	elseif (ce.normal_low = "" and ce.normal_high > " ")
	 	lab_results_reply_out->lab_result[resultCnt]->ref_range = trim(ce.normal_high)
 	else
	 	lab_results_reply_out->lab_result[resultCnt]->ref_range= ""
	endif
*/
	;detail
  head cen.event_id
     if(cen.event_id > 0) /*007-- Added check for 0 to avoid [1] empty result_note array */
		cenCnt = cenCnt + 1
 
		stat = alterlist(lab_results_reply_out->lab_result[resultCnt]->result_note, cenCnt)
 
		if(idebugFlag > 0)
 
			call echo(build("resultCnt ", resultCnt))
			call echo(build("cenCnt ", cenCnt))
			call echo(build("cen Event Note Id: ",cen.event_note_id))
			call echo(build("ce event ", ce.event_id))
 
		endif
 
		lab_results_reply_out->lab_result[resultcnt]->result_note[cenCnt]->note_format =
			uar_get_code_display(cen.note_format_cd)
		lab_results_reply_out->lab_result[resultcnt]->result_note[cenCnt]->note_dt_tm = cen.note_dt_tm
		lab_results_reply_out->lab_result[resultcnt]->result_note[cenCnt]->note_provider_id = p.person_id
		lab_results_reply_out->lab_result[resultcnt]->result_note[cenCnt]->note_provider_name = p.name_full_formatted
		blob_out = ""
    	blob_out2 = ""
    	blob_out3 = ""
 
	    if( cen.compression_cd = COMP_CD )
	    	blob_in = lb.long_blob
	        call uar_ocf_uncompress( blob_in, 69999, blob_out, 69999, blob_ret_len )
	        ;call uar_rtf2( blob_out, blob_ret_len, blob_out2, 69999, blob_ret_len, 1 )
	        ;x1 = size( trim( blob_out2, 3 ))
	        ;blob_out3 = substring( 1, x1, blob_out2 )
	        lab_results_reply_out->lab_result[resultcnt]->result_note[cenCnt]->note_body = blob_out
	    else
	        blob_in = replace(lb.long_blob, "ocf_blob", "",2)
	        call uar_rtf2( blob_in, size(blob_in), blob_out, 69999, blob_ret_len, 1 )
	        lab_results_reply_out->lab_result[resultcnt]->result_note[cenCnt]->note_body = blob_out
	    endif
    endif /*007 -- End cen.event_id > 0 check */
  with nocounter
 
  if(idebugFlag > 0)
 
	  call echo(build("Lab COUNT -->", size(lab_results_reply_out->lab_result, 5) ))
	  call echo(build("RESULT COUNT -->", resultCnt ))
 
  endif
 
  if(iMax_recs > 0)
 
		if(size(lab_results_reply_out->lab_result, 5) > iMax_recs )
 
			set stat = alterlist(lab_results_reply_out->lab_result, iMax_recs)
 
		else
 
			set stat = alterlist(lab_results_reply_out->lab_result, resultCnt)
 
		endif
 
  else
 
	set stat = alterlist(lab_results_reply_out->lab_result, resultCnt)
 
  endif
 
if(idebugFlag > 0)
 
	call echo(concat("GetLabResults Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
/***************************************************************************
;  Name: GetLabEventSet (null)
;  Description: Perform an Event Set query to retrieve
;
**************************************************************************/
subroutine GetLabEventSet(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetLabEventSet Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
set iEventQueryInd								= 1
set req_event_query->query_mode  				= 32833
set req_event_query->query_mode_ind 			= 0
set req_event_query->event_set_cd 				= lab_event_set_cd
set req_event_query->person_id 					= dPersonID
set req_event_query->order_id 					= dOrderID
set req_event_query->encntr_id 					= dEncntrID
set req_event_query->encntr_financial_id 		= 0
set req_event_query->contributor_system_cd 		= 0
set req_event_query->accession_nbr 				= ""
set req_event_query->compress_flag 				= 1
set req_event_query->subtable_bit_map 			= -2147483644
set req_event_query->subtable_bit_map_ind 		= 0
set req_event_query->small_subtable_bit_map 	= 4
set req_event_query->small_subtable_bit_map_ind = 0
set req_event_query->search_anchor_dt_tm 		= qToDate ;023
 
if(idebugFlag > 0)
	call echo(build("sFromDate ->", sFromDate))
	call echo(build("sToDate ->", sToDate))
	call echo(build("SECONDS DURATION-->", datetimediff(qFromDate,qToDate,5))) ;023
endif
 
set req_event_query->search_anchor_dt_tm_ind 	= 0
set req_event_query->seconds_duration 			= datetimediff(qFromDate,qToDate,5) ;023
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
	call ErrorHandler2("EXECUTE", "F", "LAB RESULTS", "Error retrieving lab results",
	"9999", "Error retrieving lab results (1000011)", lab_results_reply_out)	;022
	go to EXIT_SCRIPT
endif
 
if(size(rep_event_query->rb_list[1]->event_list, 5) = 0)
 
	call ErrorHandler("EXECUTE", "Z", "LAB RESULTS", "No lab result records found.", lab_results_reply_out)
	go to EXIT_SCRIPT
endif
 
if(idebugFlag > 0)
 
	call echo(concat("GetLabEventSet Runtime: ",
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
 
if(iEventQueryInd > 0)
	set resCnt = size(rep_event_query->rb_list[1]->event_list, 5)
 
	for (x = 1 to resCnt)
 
		set stat = alterlist(lab_results_reply_out->lab_result, x)
 
		set lab_results_reply_out->lab_result[x]->order_id 			=  rep_event_query->rb_list[1]->event_list[x]->order_id
		set lab_results_reply_out->lab_result[x]->result_id 		=  rep_event_query->rb_list[1]->event_list[x]->event_id
		set lab_results_reply_out->lab_result[x]->seq_number		=  cnvtint(rep_event_query->rb_list[1]->event_list[x]->clinical_seq)
		set lab_results_reply_out->lab_result[x]->result_date		=  rep_event_query->rb_list[1]->event_list[x]->performed_dt_tm
		set lab_results_reply_out->lab_result[x]->result_value		=  rep_event_query->rb_list[1]->event_list[x]->result_val
		set lab_results_reply_out->lab_result[x]->component_id     	=  rep_event_query->rb_list[1]->event_list[x]->event_cd
		set lab_results_reply_out->lab_result[x]->component_desc    =  rep_event_query->rb_list[1]->event_list[x]->event_cd_disp
		set lab_results_reply_out->lab_result[x]->units_of_measure	=  rep_event_query->rb_list[1]->event_list[x]->result_units_cd_disp
		set lab_results_reply_out->lab_result[x]->clinsig_updt_dt_tm =
			rep_event_query->rb_list[1]->event_list[x]->clinsig_updt_dt_tm   ;013
		set lab_results_reply_out->lab_result[x]->result_status		=  rep_event_query->rb_list[1]->event_list[x]->result_status_cd_disp
		set lab_results_reply_out->lab_result[x]->normalcy			=
			uar_get_code_meaning(rep_event_query->rb_list[1]->event_list[x]->normalcy_cd)
		set lab_results_reply_out->lab_result[x]->normal_high		=  rep_event_query->rb_list[1]->event_list[x]->normal_high
		set lab_results_reply_out->lab_result[x]->normal_low		=  rep_event_query->rb_list[1]->event_list[x]->normal_low
		set lab_results_reply_out->lab_result[x]->encntr_id			=  rep_event_query->rb_list[1]->event_list[x]->encntr_id
		set lab_results_reply_out->lab_result[x]->encntr_type_cd	=
			GetPatientClass(lab_results_reply_out->lab_result[x]->encntr_id,1)		    ;016
		set lab_results_reply_out->lab_result[x]->encntr_type_disp	=
			uar_get_code_display(lab_results_reply_out->lab_result[x]->encntr_type_cd);016
 		set lab_results_reply_out->lab_result[x]->encntr_type_class_cd	=
			GetPatientClass(lab_results_reply_out->lab_result[x]->encntr_id,2)		    	;018
		set lab_results_reply_out->lab_result[x]->encntr_type_class_disp	=
			uar_get_code_display(lab_results_reply_out->lab_result[x]->encntr_type_class_cd);018
		set lab_results_reply_out->lab_result[x]->person_id = dPersonID	;021
 
	endfor
 
endif
 
if(iEventDetailInd > 0)			;011
 
	set resCnt = size(rep_event_detail->rb_list, 5)
 
	for (y = 1 to resCnt)
 
		set stat = alterlist(lab_results_reply_out->lab_result, y)
		set lab_results_reply_out->lab_result[y]->order_id 			=  rep_event_detail->rb_list[y]->order_id
		set lab_results_reply_out->lab_result[y]->result_id 		=  rep_event_detail->rb_list[y]->event_id
		set lab_results_reply_out->lab_result[y]->seq_number		=  cnvtint(rep_event_detail->rb_list[y]->clinical_seq)
		set lab_results_reply_out->lab_result[y]->result_date		=  rep_event_detail->rb_list[y]->performed_dt_tm
		set lab_results_reply_out->lab_result[y]->result_value		=  rep_event_detail->rb_list[y]->result_val
		set lab_results_reply_out->lab_result[y]->component_id     	=  rep_event_detail->rb_list[y]->event_cd
		set lab_results_reply_out->lab_result[y]->component_desc    =  rep_event_detail->rb_list[y]->event_cd_disp
		set lab_results_reply_out->lab_result[y]->units_of_measure	=  rep_event_detail->rb_list[y]->result_units_cd_disp
		set lab_results_reply_out->lab_result[y]->result_status		=  rep_event_detail->rb_list[y]->result_status_cd_disp
		set lab_results_reply_out->lab_result[y]->normalcy			=  rep_event_detail->rb_list[y]->normalcy_cd_mean
		set lab_results_reply_out->lab_result[y]->normal_high		=  rep_event_detail->rb_list[y]->normal_high
		set lab_results_reply_out->lab_result[y]->normal_low		=  rep_event_detail->rb_list[y]->normal_low
		set lab_results_reply_out->lab_result[y]->encntr_id			=  rep_event_detail->rb_list[y]->encntr_id
		set lab_results_reply_out->lab_result[y]->encntr_type_cd	=
			GetPatientClass(lab_results_reply_out->lab_result[y]->encntr_id,1)		  ;016
		set lab_results_reply_out->lab_result[y]->encntr_type_disp	=
			uar_get_code_display(lab_results_reply_out->lab_result[y]->encntr_type_cd);016
		set lab_results_reply_out->lab_result[y]->encntr_type_class_cd	=
			GetPatientClass(lab_results_reply_out->lab_result[y]->encntr_id,2)		  ;018
		set lab_results_reply_out->lab_result[y]->encntr_type_class_disp	=
			uar_get_code_display(lab_results_reply_out->lab_result[y]->encntr_type_class_cd);018
	endfor
 
endif
 
 
  select into "nl:"
 
  from
	(dummyt d WITH seq = value(resCnt))
	, clinical_event ce
	, ce_event_note cen
	, long_blob lb
	, prsnl p
 
 
  plan d
 
  join ce
 
	where
		ce.event_id  = lab_results_reply_out->lab_result[d.seq]->result_id
 
  join cen
 
	where cen.event_id = outerjoin(ce.event_id)
 
  join lb
 
	where lb.parent_entity_id = outerjoin(cen.ce_event_note_id) and lb.parent_entity_name = outerjoin("CE_EVENT_NOTE")
 
  join p
 
	where p.person_id  = outerjoin(cen.note_prsnl_id) and p.active_ind = outerjoin(1)
 
 
   head ce.event_id
 
	cenCnt = 0
 	lab_results_reply_out->lab_result[d.seq]->resource_cd = ce.resource_cd		;014
 
   head cen.event_id
 
     if(cen.event_id > 0)
		cenCnt = cenCnt + 1
 
		stat = alterlist(lab_results_reply_out->lab_result[d.seq]->result_note, cenCnt)
 
 
		lab_results_reply_out->lab_result[d.seq]->result_note[cenCnt]->note_format =
			uar_get_code_display(cen.note_format_cd)
		lab_results_reply_out->lab_result[d.seq]->result_note[cenCnt]->note_dt_tm = cen.note_dt_tm
		lab_results_reply_out->lab_result[d.seq]->result_note[cenCnt]->note_provider_id = p.person_id
		lab_results_reply_out->lab_result[d.seq]->result_note[cenCnt]->note_provider_name = p.name_full_formatted
		blob_out = ""
    	blob_out2 = ""
    	blob_out3 = ""
 
	    if( cen.compression_cd = COMP_CD )
	    	blob_in = lb.long_blob
	        call uar_ocf_uncompress( blob_in, 69999, blob_out, 69999, blob_ret_len )
	        ;call uar_rtf2( blob_out, blob_ret_len, blob_out2, 69999, blob_ret_len, 1 )
	        ;x1 = size( trim( blob_out2, 3 ))
	        ;blob_out3 = substring( 1, x1, blob_out2 )
	        lab_results_reply_out->lab_result[d.seq]->result_note[cenCnt]->note_body = blob_out
	    else
	        blob_in = replace(lb.long_blob, "ocf_blob", "",2)
	        call uar_rtf2( blob_in, size(blob_in), blob_out, 69999, blob_ret_len, 1 )
	        lab_results_reply_out->lab_result[d.seq]->result_note[cenCnt]->note_body = blob_out
	    endif
    endif
 
  with nocounter
 
  if(idebugFlag > 0)
 
	call echo(build("RESULT COUNT -->", size(lab_results_reply_out->lab_result, 5) ))
 
  endif
 
  if(iMax_recs > 0)
 
		if(size(lab_results_reply_out->lab_result, 5) > iMax_recs )
 
			set stat = alterlist(lab_results_reply_out->lab_result, iMax_recs)
 
		else
 
			set stat = alterlist(lab_results_reply_out->lab_result, resCnt)
 
		endif
 
  else
 
	set stat = alterlist(lab_results_reply_out->lab_result, resCnt)
 
  endif
 
if(idebugFlag > 0)
 
	call echo(concat("PostAmble Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
 
end
 
 
/*************************************************************************
;  Name: GetResultByResultID(null)    011
;  Description: Retrieve a specific Document for patient
;
**************************************************************************/
subroutine GetResultByResultID( null )
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetResultByResultID Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
set iEventDetailInd								= 1
set req_event_detail->query_mode 				= 269615107
set req_event_detail->query_mode_ind 			= 0
set req_event_detail->event_id 					= dResultID
set req_event_detail->contributor_system_cd 	= 0
set req_event_detail->subtable_bit_map 			= 0
set req_event_detail->subtable_bit_map_ind 		= 1
set req_event_detail->valid_from_dt_tm 			= cnvtdatetime("0000-00-00 00:00:00.00")
set req_event_detail->valid_from_dt_tm_ind 		= 1
set req_event_detail->decode_flag 				= 0
set req_event_detail->ordering_provider_id 		= 0
set req_event_detail->action_prsnl_id 			= 0
set req_event_detail->src_event_id_ind 			= 0
set req_event_detail->action_prsnl_group_id 	= 0
 
 
 
set stat = tdbexecute(APPLICATION_NUMBER, TASK_NUMBER, REQ_NUM_EVENT_DETAIL,"REC",req_event_detail,"REC",rep_event_detail)
 
if(idebugFlag > 0)
 
	call echorecord(rep_event_detail)
 
endif
 
if(size(rep_event_detail->rb_list, 5) = 0)
 
	call ErrorHandler("EXECUTE", "Z", "LAB RESULST", "No lab result records found.", lab_results_reply_out)
	go to EXIT_SCRIPT
endif
 
if(idebugFlag > 0)
 
	call echo(concat("GetResultByResultID Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
 
end
 
/***************************************************************************
;  014
;  Name: GetOrderLabLocation (null)
;  Description: Take a list of lab orders and retrieve the lab location
**************************************************************************/
subroutine GetOrderLabLocation(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetOrderLabLocation Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
set locationCd = 0
set addressCnt = 0
 
set resultCnt = 0
set resultCnt = size(lab_results_reply_out->lab_result, 5)
 
;loop through results and look up result location
for (x = 1 to resultCnt)
 
		select into "nl:"
 
		from service_resource sr
		where sr.service_resource_cd = lab_results_reply_out->lab_result[x]->resource_cd
 
		head report
			locationCd = sr.location_cd
		with nocounter
 
		if(idebugFlag > 0)
 
			call echo(build("resource code: ",lab_results_reply_out->lab_result[x]->resource_cd))
			call echo(build("location code: ",locationCd))
			call echo(build("address type: ", addressTypeCd))
 
		endif
 
		if (locationCd > 0)
 
			select into "nl:"
 
			from address a
 
			where a.parent_entity_name = "LOCATION"
				and a.parent_entity_id = locationCd
				and a.address_type_cd = addressTypeCd
				and a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
				and a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
				and a.active_ind = 1
				and a.address_id != 0
 
			head a.address_id
				addressCnt = addressCnt + 1
				stat = alterlist(lab_results_reply_out->lab_result[x]->lab_loc, addressCnt)
				call echo(build("loc code: ", locationCd))
				lab_results_reply_out->lab_result[x]->lab_loc[addressCnt]->lab_name = uar_get_code_display(a.parent_entity_id)
				lab_results_reply_out->lab_result[x]->lab_loc[addressCnt]->ADDRESS->ADDRESS_ID = a.address_id
				lab_results_reply_out->lab_result[x]->lab_loc[addressCnt]->ADDRESS->ADDRESS_TYPE_CD = a.address_type_cd
				lab_results_reply_out->lab_result[x]->lab_loc[addressCnt]->ADDRESS->ADDRESS_TYPE_DISP = UAR_GET_CODE_DISPLAY(a.address_type_cd)
				lab_results_reply_out->lab_result[x]->lab_loc[addressCnt]->ADDRESS->STREET_ADDR = a.street_addr
				lab_results_reply_out->lab_result[x]->lab_loc[addressCnt]->ADDRESS->STREET_ADDR2 = a.street_addr2
				lab_results_reply_out->lab_result[x]->lab_loc[addressCnt]->ADDRESS->CITY = a.city
				lab_results_reply_out->lab_result[x]->lab_loc[addressCnt]->ADDRESS->STATE_CD = a.state_cd
				lab_results_reply_out->lab_result[x]->lab_loc[addressCnt]->ADDRESS->STATE_DISP = UAR_GET_CODE_DISPLAY(a.state_cd)
				lab_results_reply_out->lab_result[x]->lab_loc[addressCnt]->ADDRESS->ZIPCODE = a.zipcode
 
 
			foot a.address_id
				addressCnt = 0
			with nocounter
 
		endif
 
endfor
 
if(idebugFlag > 0)
 
	call echo(concat("GetOrderLabLocation Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
end go
