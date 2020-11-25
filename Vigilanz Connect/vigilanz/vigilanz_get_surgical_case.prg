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
          Date Written:       01/17/19
          Source file name:   snsro_get_surgical_case.prg
          Object name:        vigilanz_get_surgical_case
          Program purpose:    Provides details of a surgical case id
          Executing from:     Emissary mPages Web Service
 ***********************************************************************
                   GENERATED MODIFICATION CONTROL LOG
 ***********************************************************************
 Mod Date		Engineer	Comment
 -----------------------------------------------------------------------
 000 01/17/19 	RJC			Initial Write
 001 02/12/19	RJC			Removed hard coded test id
 002 04/17/19	RJC			Removed failure check on request 805010
 003 06/27/19   STV         had to make subeventstatus as dynamic for request 805010
 004 07/11/19   STV         Adjustment for missing surgical details
 005 09/30/19   STV         Adjustment to loop through the surgical detials
 ***********************************************************************/
drop program vigilanz_get_surgical_case go
create program vigilanz_get_surgical_case
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "UserName" = ""        	;Optional
		, "SurgicalCaseId" = ""		;Required
		, "IncludeBody" = 0			;Optional
		, "IncludeDetails" = 0		;Optional
		, "Debug Flag" = 0			;Optional. Verbose logging when set to one (1).
 
with OUTDEV,USERNAME, CASE_ID, INC_BODY, INC_DETAILS, DEBUG_FLAG
 
/*************************************************************************
;VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
;805010 - sn_get_doc_ce
free record 805010_req
record 805010_req (
  1 person_id = f8
  1 doc_id = f8
  1 surg_proc_event_cd = f8
  1 mnemonic = vc
  1 print_ind = i2
  1 cpt_display_flag = i2
  1 forms [*]
    2 event_cd = f8
    2 input_form_cd = f8
    2 input_form_version_nbr = f8
    2 sup_cab_def_ind = i2
)
free record 805010_rep
record 805010_rep (
     1 user_id = f8
     1 segment_results [* ]
       2 input_form_cd = f8
       2 input_form_version_nbr = i4
       2 event_cd = f8
       2 clinical_event_id = f8
       2 event_id = f8
       2 surg_proc_event_id = f8
       2 seg_cd = f8
       2 notes [* ]
         3 note = vc
         3 note_rtf = vc
         3 note_type_cd = f8
         3 note_type_disp = vc
         3 note_type_desc = vc
         3 note_type_mean = vc
         3 event_note_id = f8
         3 ce_event_note_id = f8
       2 entries [* ]
         3 updt_id = f8
         3 updt_dt_tm = dq8
         3 groups [* ]
           4 group_cd = f8
           4 group_prompt = vc
           4 repeat_ind = i2
           4 controls [* ]
             5 task_assay_cd = f8
             5 event_cd = f8
             5 field_prompt = vc
             5 task_assay_mean = c12
             5 result_type_meaning = c5
             5 control_type_flag = i2
             5 validation_codeset = i4
             5 result_parent_table = vc
             5 values [* ]
               6 val_id = vc
               6 val_disp = vc
               6 val_disp2 = vc
               6 event_id = f8
               6 val_dt_tm = dq8
             5 signatures [* ]
               6 event_id = f8
               6 cosign_ind = i2
               6 action_prsnl_id = f8
               6 action_dt_tm = dq8
               6 action_comment = vc
               6 action_prsnl_name = vc
       2 signatures [* ]
         3 event_id = f8
         3 cosign_ind = i2
         3 action_prsnl_id = f8
         3 action_dt_tm = dq8
         3 action_comment = vc
         3 action_prsnl_name = vc
       2 sup_cab_def_ind = i2
       2 default_data_present_ind = i2
       2 default_data_qual [* ]
         3 default_data_id = f8
     1 status_data
       2 status = c1
       2 subeventstatus [* ]
         3 operationname = c25
         3 operationstatus = c1
         3 targetobjectname = c25
         3 targetobjectvalue = vc
)
 
;951046 - afc_get_charges
free record 951046_req
record 951046_req (
  1 person_id = f8
  1 encntr_id = f8
  1 service_dt_tm_f = dq8
  1 service_dt_tm_t = dq8
  1 ord_phys_id = f8
  1 charge_type_cd = f8
  1 department = f8
  1 tier_group_cd = f8
  1 bill_item_id = f8
  1 pending = i4
  1 suspended = i4
  1 suspense_reasons [*]
    2 suspense_rsn_cd = f8
  1 interfaced = i4
  1 held = i4
  1 reviewed = i4
  1 manual = i4
  1 skipped = i4
  1 combined = i4
  1 absorbed = i4
  1 offset = i4
  1 adjusted = i4
  1 abn = i4
  1 bundled = i4
  1 stats_only = i4
  1 accession_nbr = vc
  1 admit_type = f8
  1 payor_id = f8
  1 building_cd = f8
  1 interface_file_id = f8
  1 verify_phys_id = f8
  1 manual_ind = i2
  1 report_ind = i2
  1 cost_center_cd = f8
  1 perf_loc_cd = f8
  1 activity_type_cd = f8
  1 detail_ind = i2
  1 charge_item_id = f8
  1 omf_stats_only = i4
  1 posted = i4
  1 corsp_activity_id = f8
  1 bundled_profit = i4
  1 bundled_interfaced = i4
  1 activity_type_count = i4
  1 activity_types [*]
    2 activity_type_cd = f8
  1 reviewed_missingicd9 = i4
  1 reviewed_missingrenphys = i4
  1 reviewed_missingpatresp = i4
  1 reviewed_missingmodauth = i4
  1 interfaced_dt_tm_f = dq8
  1 interfaced_dt_tm_t = dq8
  1 unreconciled_credit = i4
  1 departments [*]
    2 department_cd = f8
  1 service_resource [*]
    2 level_flag = i2
    2 service_resource_cd = f8
  1 reviewed_radnetcoding = i4
  1 name_filter [*]
    2 last_name_filter = vc
  1 parent_charge_item_id = f8
  1 order_status_cd = f8
  1 financial_class_cd = f8
  1 abn_status_cd = f8
  1 original_org_id = f8
)
free record 951046_rep
record 951046_rep (
	1 charge_qual = i2
   1 report_file_name = vc
   1 hasmoreind = i2
   1 qual [* ]
     2 suspense_in_list = i2
     2 review_in_list = i2
     2 master_ind = i2
     2 place_holder = i2
     2 bump_up = i2
     2 charge_item_id = f8
     2 charge_event_act_id = f8
     2 charge_event_id = f8
     2 bill_item_id = f8
     2 order_id = f8
     2 encntr_id = f8
     2 person_id = f8
     2 payor_id = f8
     2 ord_loc_cd = f8
     2 ord_loc_disp = c40
     2 ord_loc_desc = c60
     2 ord_loc_mean = c12
     2 perf_loc_cd = f8
     2 perf_loc_disp = c40
     2 perf_loc_desc = c60
     2 perf_loc_mean = c12
     2 ord_phys_id = f8
     2 perf_phys_id = f8
     2 charge_description = vc
     2 price_sched_id = f8
     2 item_quantity = f8
     2 item_price = f8
     2 item_extended_price = f8
     2 item_allowable = f8
     2 item_copay = f8
     2 parent_charge_item_id = f8
     2 charge_type_cd = f8
     2 charge_type_disp = c40
     2 charge_type_desc = c60
     2 charge_type_mean = c12
     2 research_acct_id = f8
     2 suspense_rsn_cd = f8
     2 suspense_rsn_disp = c40
     2 suspense_rsn_desc = c60
     2 suspense_rsn_mean = c12
     2 reason_comment = vc
     2 tier_group_cd = f8
     2 tier_group_disp = c40
     2 tier_group_desc = c60
     2 tier_group_mean = c12
     2 interface_file_id = f8
     2 profit_ind = i2
     2 building_cd = f8
     2 building_disp = c40
     2 building_desc = c60
     2 building_mean = c12
     2 verify_phys_id = f8
     2 def_bill_item_id = f8
     2 department_cd = f8
     2 department_disp = c40
     2 department_desc = c60
     2 department_mean = c12
     2 section_cd = f8
     2 section_disp = c40
     2 section_desc = c60
     2 section_mean = c12
     2 dept = f8
     2 section = f8
     2 posted_cd = f8
     2 posted_desc = c60
     2 posted_mean = c12
     2 posted_disp = c40
     2 provider_specialty_cd = f8
     2 provider_specialty_disp = c40
     2 provider_specialty_desc = c60
     2 provider_specialty_mean = c12
     2 posted_dt_tm = dq8
     2 credited_dt_tm = dq8
     2 adjusted_dt_tm = dq8
     2 service_dt_tm = dq8
     2 activity_dt_tm = dq8
     2 activity_type_cd = f8
     2 activity_type_disp = c40
     2 activity_type_desc = c60
     2 activity_type_mean = c12
     2 updt_cnt = i4
     2 updt_dt_tm = dq8
     2 updt_id = f8
     2 updt_task = i4
     2 updt_applctx = i4
     2 active_ind = i2
     2 active_status_cd = f8
     2 active_status_disp = c40
     2 active_status_desc = c60
     2 active_status_mean = c12
     2 active_status_dt_tm = dq8
     2 active_status_prsnl_id = f8
     2 beg_effective_dt_tm = dq8
     2 end_effective_dt_tm = dq8
     2 person_name = vc
     2 person_dob = dq8
     2 person_sex_cd = f8
     2 person_sex_disp = c40
     2 person_sex_desc = c60
     2 person_sex_mean = c12
     2 process_flg = i4
     2 manual_ind = i2
     2 combine_ind = i2
     2 bundle_id = f8
     2 institution_cd = f8
     2 institution_disp = c40
     2 institution_desc = c60
     2 institution_mean = c12
     2 subsection_cd = f8
     2 subsection_disp = c40
     2 subsection_desc = c60
     2 subsection_mean = c12
     2 level5_cd = f8
     2 level5_disp = c40
     2 level5_desc = c60
     2 level5_mean = c12
     2 admit_type_cd = f8
     2 med_service_cd = f8
     2 inst_fin_nbr = vc
     2 cost_center_cd = f8
     2 cost_center_disp = c40
     2 cost_center_desc = c60
     2 cost_center_mean = c12
     2 gross_price = f8
     2 discount_amount = f8
     2 health_plan_id = f8
     2 fin_class_cd = f8
     2 fin_class_disp = c40
     2 fin_class_desc = c60
     2 fin_class_mean = c12
     2 payor_type_cd = f8
     2 payor_type_disp = c40
     2 payor_type_desc = c60
     2 payor_type_mean = c12
     2 item_reimbursement = f8
     2 item_interval_id = f8
     2 item_list_price = f8
     2 list_price_sched_id = f8
     2 start_dt_tm = dq8
     2 stop_dt_tm = dq8
     2 epsdt_ind = i2
     2 ref_phys_id = f8
     2 late_chrg_flag = i4
     2 offset_charge_item_id = f8
     2 cs_cpp_undo_id = f8
     2 ext_master_event_id = f8
     2 ext_master_event_cont_cd = f8
     2 ext_master_reference_id = f8
     2 ext_master_reference_cont_cd = f8
     2 ext_parent_event_id = f8
     2 ext_parent_event_cont_cd = f8
     2 ext_parent_reference_id = f8
     2 ext_parent_reference_cont_cd = f8
     2 ext_item_event_id = f8
     2 ext_item_event_cont_cd = f8
     2 ext_item_reference_id = f8
     2 ext_item_reference_cont_cd = f8
     2 ext_owner_cd = f8
     2 accession_nbr = vc
     2 location_cd = f8
     2 location_disp = c40
     2 location_desc = c60
     2 location_mean = c12
     2 abn_status_cd = f8
     2 ext_parent_reference_id = f8
     2 ext_parent_contributor_cd = f8
     2 ext_child_reference_id = f8
     2 ext_child_contributor_cd = f8
     2 ext_description = vc
     2 parent_qual_cd = f8
     2 charge_point_cd = f8
     2 physician_name = vc
     2 perf_physician_name = vc
     2 verify_physician_name = vc
     2 org_name = vc
     2 physician_id = f8
     2 username = vc
     2 fin_nbr = vc
     2 mrn_nbr = vc
     2 encntr_type_cd = f8
     2 loc_facility_cd = f8
     2 financial_class_cd = f8
     2 reason_for_visit = vc
     2 requested_start_dt_tm = dq8
     2 careset_ind = i2
     2 item_deductible_amt = f8
     2 patient_responsibility_flag = i2
     2 interfaced_dt_tm = dq8
     2 cea_qty = f8
     2 interval_template_cd = f8
     2 bill_code_qual = i2
     2 bill_code [* ]
       3 bill_code_type = vc
       3 charge_mod_id = f8
       3 charge_item_id = f8
       3 charge_mod_type_cd = f8
       3 field6 = vc
       3 field7 = vc
       3 field1_id = f8
       3 field2_id = f8
       3 field3_id = f8
       3 field4_id = f8
       3 nomen_id = f8
       3 nomen_entity_reltn_id = f8
       3 cm1_nbr = f8
       3 charge_event_mod_id = f8
       3 username = c50
       3 activity_dt_tm = dq8
       3 field8 = vc
     2 interval_qual [* ]
       3 item_interval_id = f8
       3 price = f8
       3 interval_template_cd = f8
       3 parent_entity_id = f8
       3 interval_id = f8
       3 beg_value = f8
       3 end_value = f8
       3 unit_type_cd = f8
       3 calc_type_cd = f8
       3 bc_qual [* ]
         4 bill_item_mod_id = f8
         4 bill_item_type_cd = f8
         4 key1_id = f8
         4 key2_id = f8
         4 key3_id = f8
         4 key6 = vc
         4 key7 = vc
     2 corsp_activity_id = f8
     2 bill_type_cdf = c12
     2 bill_nbr_disp = vc
     2 bill_class_cdf = c12
     2 has_bill_access = i2
     2 order_status_cd = f8
     2 profit_type_cd = f8
     2 discharge_dt_tm = dq8
     2 postedbyid = f8
     2 postedby = c50
     2 changelog = i2
     2 admitting_physician_name = vc
     2 loc_room_disp = vc
     2 ssn_nbr = vc
     2 original_org_id = f8
     2 original_org_name = vc
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c15
       3 operationstatus = c1
       3 targetobjectname = c15
       3 targetobjectvalue = vc
)
 
; Temp record
free record temp
record temp (
	1 list_cnt = i4
	1 list[*]
		2 doc_id = f8
		2 forms[*]
			3 event_cd = f8
			3 input_form_cd = f8
			3 input_form_version_nbr = i4
)
 
 
 
;final reply out
free record final_reply_out
record final_reply_out (
	1 administered_blood_products[*] 			;Null in Cerner - part of details?
		2 blood_product
			3 id 						= f8
			3 name 						= vc
		2 estimated_amount 				= f8
		2 unit
			3 id 						= f8
			3 name 						= vc
	1 anesthesia_type_locations[*] 				;Null in Cerner - part of details?
		2 anesthesia_location
			3 id 						= f8
			3 name 						= vc
		2 anesthesia_type
			3 id 						= f8
			3 name 						= vc
	1 anesthesia_type
		2 id 							= f8
		2 name 							= vc
	1 asa_class
		2 id 							= f8
		2 name 							= vc
	1 case_blocks[*]
		2 block_duration
			3 time 						= i4
			3 units
				4 id 					= f8
				4 name 					= vc
		2 block_type
			3 id 						= f8
			3 name 						= vc
		2 surgeon
			3 provider_id 				= f8
			3 name 						= vc
			3 NPI 						= vc
			3 user_id 					= vc
		2 surgeon_group
			3 id 						= f8
			3 name 						= vc
		2 surgical_service
			3 id 						= f8
			3 name 						= vc
	1 case_class
		2 id 							= f8
		2 name 							= vc
	1 case_creation_date_time 			= dq8
	1 case_delays[*]
		2 delay_comment					= vc
		2 delay_length
			3 time 						= i4
			3 units
				4 id 					= f8
				4 name 					= vc
		2 delay_reason
			3 id 						= f8
			3 name 						= vc
	1 cleanup_duration
		2 time 							= i4
		2 units
			3 id 						= f8
			3 name 						= vc
	1 complexity
		2 id 							= f8
		2 name 							= vc
	1 created_updated_date_time 		= dq8
	1 estimated_blood_loss 				= f8 	;Null in Cerner - part of details?
	1 estimated_blood_loss_unit 				;Null in Cerner - part of details?
		2 id 							= f8
		2 name 							= vc
	1 is_add_on 						= i2
	1 is_first_case 					= i2	;Questionable
	1 number_of_panels 					= i4 	;Questionable
	1 operating_room_id 				= f8
	1 operating_room_name 				= vc
	1 pending_status 							;Null in Cerner
		2 id 							= f8
		2 name 							= vc
	1 pre_op_appointments[*]
		2 appointment_id 				= f8
		2 pre_op_appoinment_id 			= f8
		2 procedure
			3 id 						= f8
			3 name 						= vc
	1 pre_op_preparations[*] 					;Null in Cerner - part of details?
		2 areas[*]
			3 id 						= f8
			3 name 						= vc
		2 laterality
			3 id 						= f8
			3 name 						= vc
		2 scrub_solutions[*]
			3 id 						= f8
			3 name 						= vc
	1 progress_status
		2 id 							= f8
		2 name 							= vc
	1 projected_end_date_time			= dq8
	1 projected_start_date_time 		= dq8
	1 scheduling_status
		2 id 							= f8
		2 name 							= vc
	1 setup_duration
		2 time 							= i4
		2 units
			3 id 						= f8
			3 name 						= vc
	1 surgeon_cost 						= f8
	1 surgery_end_date_time 			= dq8
	1 surgery_start_date_time 			= dq8
	1 surgical_case_id 					= f8
	1 surgical_case_name 				= vc
	1 surgical_details[*]
		2 section
			3 id =  f8
			3 name = vc
			3 description = vc
		2 sequence = i4
		2 field
			3 id 						= f8
			3 name 						= vc
		2 text_values[*] 				= vc
		2 coded_values[*]
			3 id 						= f8
			3 name 						= vc
	1 surgical_events[*]
		2 event_date_time 				= dq8
		2 event_type
			3 id 						= f8
			3 name 						= vc
	1 surgical_procedures[*]
		2 procedure_code_id 			= f8
		2 procedure_code_name 			= vc
		2 anesthesia_type
			3 id 						= f8
			3 name 						= vc
		2 incision_close_date_time 		= dq8
		2 incision_start_date_time 		= dq8
		2 operative_regions[*]
			3 id 						= f8
			3 name 						= vc
		2 preference_cards[*]
			3 id 						= f8
			3 name 						= vc
		2 procedure_duration
			3 time 						= i4
			3 units
				4 id 					= f8
				4 name 					= vc
		2 procedure_ordinal 			= i4
		2 surgical_service
			3 id 						= f8
			3 name 						= vc
		2 wound_class
			3 id 						= f8
			3 name 						= vc
	1 surgical_service
		2 id 							= f8
		2 name 							= vc
 	1 surgical_reports[*]
 		2 report_id 					= f8
 		2 report_type
 			3 id 						= f8
 			3 name 						= vc
 		2 body 							= gvc
 		2 body_length					= i4
 		2 document_pointer 				= vc
 		2 format 						= vc
 		2 storage 						= vc
 	1 surgical_staff[*]
 		2 provider
 			3 provider_id 				= f8
 			3 provider_name 			= vc
 		2 type
 			3 id 						= f8
 			3 name 						= vc
 	1 surgical_staff_cost 				= f8
 	1 time_outs									;Null in Cerner - part of details?
 		2 time_out_id					= f8
 		2 time_out_name 				= vc
 		2 time_out_type 				= vc
 	1 total_cost 						= f8
 	1 total_duration
		2 time 							= i4
		2 units
			3 id 						= f8
			3 name 						= vc
	1 encounter
		2 encounter_id 					= f8
		2 encounter_type
			3 id 						= f8
			3 name 						= vc
		2 patient_class
			3 id 						= f8
			3 name 						= vc
		2 encounter_date_time 			= dq8
		2 discharge_date_time 			= dq8
		2 financial_number 				= vc
		2 location
			3 hospital
				4 id 					= f8
				4 name 					= vc
			3 unit
				4 id					= f8
				4 name 					= vc
			3 room
				4 id 					= f8
				4 name 					= vc
			3 bed
				4 id 					= f8
				4 name 					= vc
	1 patient
		2 patient_id 					= f8
		2 display_name 					= vc
		2 last_name 					= vc
		2 first_name 					= vc
		2 middle_name 					= vc
		2 mrn 							= vc
		2 birth_date_time 				= dq8
		2 gender
			3 id 						= f8
			3 name 						= vc
		2 sdob 							= vc
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
    1 status_data
      	2 status 						= c1
      	2 subeventstatus[1]
	      	3 OperationName 			= c25
	      	3 OperationStatus 			= c1
	      	3 TargetObjectName 			= c25
	      	3 TargetObjectValue 		= vc
	      	3 Code 						= c4
	      	3 Description 				= vc
)
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
set MODIFY MAXVARLEN 200000000
 
;Input
declare sUserName					= vc with protect, noconstant("")
declare dSurgicalCaseId				= f8 with protect, noconstant(0.0)
declare iIncBody					= i2 with protect, noconstant(0)
declare iIncDetails					= i2 with protect, noconstant(0)
declare iDebugFlag					= i2 with protect, noconstant(0)
 
; Constants
declare c_error_handler_name 			= vc with protect, constant("GET SURGICAL CASE")
declare c_mrn_encounter_alias_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",319,"MRN"))
declare c_finnbr_encntr_alias_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare c_minutes_duration_units_cd		= f8 with protect, constant(uar_get_code_by("MEANING",340,"MINUTES"))
declare c_mdoc_event_class_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",53,"MDOC"))
declare c_doc_event_class_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",53,"DOC"))
declare c_npi_prsnl_alias_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",320,"NPI"))
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Input
set sUserName						= trim($USERNAME, 3)
set dSurgicalCaseId					= cnvtreal($CASE_ID)
set iIncBody						= cnvtint($INC_BODY)
set iIncDetails						= cnvtint($INC_DETAILS)
set iDebugFlag						= cnvtint($DEBUG_FLAG)
 
if(iDebugFlag > 0)
	call echo(build("sUserName->", sUserName))
	call echo(build("dSurgicalCaseId->", dSurgicalCaseId))
	call echo(build("iIncBody->", iIncBody))
	call echo(build("iIncDetails->", iIncDetails))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetCaseData(null)			= i2 with protect
declare GetProcedures(null) 		= null with protect
declare GetSurgicalStaff(null) 		= null with protect
declare GetCaseDelays(null) 		= null with protect
declare GetSurgicalEvents(null) 	= null with protect
declare GetSurgicalDetails(null)	= null with protect
declare GetSurgicalReport(null)	 	= null with protect
declare GetSurgicalCharges(null)	= null with protect
declare GetSchedulingDetails(null) 	= null with protect
declare PostAmble(null)				= null with protect
/*************************************************************************
; MAIN
**************************************************************************/
;Validate SurgicalCaseId exists
if(dSurgicalCaseId = 0)
	call ErrorHandler2(c_error_handler_name, "F", "Validate", "Missing required field: SurgicalCaseId.",
	"2055","Missing required field: SurgicalCaseId.", final_reply_out)
 	go to exit_script
endif
 
; Get Case Details
set iRet = GetCaseData(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid SurgicalCaseId.",
	"9999","Invalid SurgicalCaseId.", final_reply_out)
 	go to exit_script
endif
 
; Validate username
set iRet = PopulateAudit(sUserName, final_reply_out->patient.patient_id, final_reply_out, sVersion)
if(iRet = 0)
 	call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid User for Audit.",
	"1001",build("Invlid user: ",sUserName), final_reply_out)
 	go to exit_script
endif
 
; Get Procedures
call GetProcedures(null)
 
; Get Surgical Staff
call GetSurgicalStaff(null)
 
; Get Case Delays
call GetCaseDelays(null)
 
; Get Surgical Events
call GetSurgicalEvents(null)
 
; Get Surgical Details
if(iIncDetails > 0)
	call GetSurgicalDetails(null)
endif
 
; Get Surgical Document
if(iIncBody > 0)
	call GetSurgicalReport(null)
endif
 
; Get Surgical Charges
call GetSurgicalCharges(null)
 
; Get Scheduling details
call GetSchedulingDetails(null)
 
; Post Amble
call PostAmble(null)
 
; Set audit to success
call ErrorHandler2(c_error_handler_name, "S", "Success", "Process completed successfully.",
"0000","Process completed successfully.", final_reply_out)
 
/*************************************************************************
 EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************
 Convert REC output to JSON
**************************************************************/
set JSONout = CNVTRECTOJSON(final_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_surgical_case.json")
	call echo(build2("_file : ", _file))
	call echojson(final_reply_out, _file, 0)
 	call echorecord(final_reply_out)
   	call echo(JSONout)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetCaseData(null) = i2
;  Description: Get surgery case detail
**************************************************************************/
subroutine GetCaseData(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetCaseData Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 
	select into "nl:"
	from surgical_case   sc
		,person   p
		,encounter   e
		,encntr_alias   ea
		,encntr_alias   ea2
		,prsnl_group pg
	plan sc where sc.surg_case_id = dSurgicalCaseId
	join p where p.person_id = sc.person_id
		and p.active_ind = 1
	join e where e.encntr_id = outerjoin(sc.encntr_id)
	join ea	where ea.encntr_id = outerjoin(e.encntr_id)
		and ea.encntr_alias_type_cd = outerjoin(c_finnbr_encntr_alias_type_cd)
		and ea.active_ind = outerjoin(1)
		and ea.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and ea.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	join ea2	where ea2.encntr_id = outerjoin(e.encntr_id)
		and ea2.encntr_alias_type_cd = outerjoin(c_mrn_encounter_alias_type_cd)
		and ea2.active_ind = outerjoin(1)
		and ea2.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and ea2.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	join pg where pg.prsnl_group_id = outerjoin(sc.surg_specialty_id)
	order by sc.surg_case_id
	head sc.surg_case_id
		iValidate = 1
 
		; Surgical Case
		final_reply_out->anesthesia_type.id = sc.anesth_type_cd
		final_reply_out->anesthesia_type.name = uar_get_code_display(sc.anesth_type_cd)
		final_reply_out->asa_class.id = sc.asa_class_cd
		final_reply_out->asa_class.name = uar_get_code_display(sc.asa_class_cd)
		final_reply_out->case_class.id = sc.sched_type_cd
		final_reply_out->case_class.name = uar_get_code_display(sc.sched_type_cd)
		final_reply_out->case_creation_date_time = sc.create_dt_tm
		final_reply_out->complexity.id = sc.case_level_cd
		final_reply_out->complexity.name = uar_get_code_display(sc.case_level_cd)
		final_reply_out->created_updated_date_time = sc.updt_dt_tm
		final_reply_out->is_add_on = sc.add_on_ind
		final_reply_out->operating_room_id = sc.surg_op_loc_cd
		final_reply_out->operating_room_name = uar_get_code_display(sc.surg_op_loc_cd)
		final_reply_out->progress_status.id = sc.curr_case_status_cd
		final_reply_out->progress_status.name = uar_get_code_display(sc.curr_case_status_cd)
		final_reply_out->projected_start_date_time = sc.sched_start_dt_tm
		final_reply_out->projected_end_date_time = cnvtlookahead(build('"',sc.sched_dur,',',"MIN",'"',sc.sched_start_dt_tm))
		final_reply_out->surgery_start_date_time = sc.surg_start_dt_tm
		final_reply_out->surgery_end_date_time = sc.surg_stop_dt_tm
		final_reply_out->surgical_case_id = sc.surg_case_id
		final_reply_out->surgical_case_name = sc.surg_case_nbr_formatted
		final_reply_out->cleanup_duration.time = sc.sched_cleanup_dur
		final_reply_out->cleanup_duration.units.id = c_minutes_duration_units_cd
		final_reply_out->cleanup_duration.units.name = uar_get_code_display(c_minutes_duration_units_cd)
		final_reply_out->setup_duration.time = sc.sched_cleanup_dur
		final_reply_out->setup_duration.units.id = c_minutes_duration_units_cd
		final_reply_out->setup_duration.units.name = uar_get_code_display(c_minutes_duration_units_cd)
		final_reply_out->surgical_service.id = sc.surg_specialty_id
		final_reply_out->surgical_service.name = pg.prsnl_group_desc
 
		; Person
 		final_reply_out->patient.patient_id = p.person_id
 		final_reply_out->patient.display_name = p.name_full_formatted
 		final_reply_out->patient.first_name = p.name_first
 		final_reply_out->patient.middle_name = p.name_middle
 		final_reply_out->patient.last_name = p.name_last
 		final_reply_out->patient.birth_date_time = p.birth_dt_tm
 		final_reply_out->patient.gender.id = p.sex_cd
 		final_reply_out->patient.gender.name = uar_get_code_display(p.sex_cd)
 		final_reply_out->patient.mrn = ea2.alias
 		final_reply_out->patient.sdob = datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef)
 
		; Encounter
 		final_reply_out->encounter.discharge_date_time = e.disch_dt_tm
		if (e.arrive_dt_tm is null)
			final_reply_out->encounter.encounter_date_time = e.reg_dt_tm
		else
			final_reply_out->encounter.encounter_date_time = e.arrive_dt_tm
		endif
 		final_reply_out->encounter.encounter_id = e.encntr_id
 		final_reply_out->encounter.encounter_type.id = e.encntr_type_cd
 		final_reply_out->encounter.encounter_type.name = uar_get_code_display(e.encntr_type_cd)
 		final_reply_out->encounter.financial_number = ea.alias
 		final_reply_out->encounter.patient_class.id = e.encntr_type_class_cd
 		final_reply_out->encounter.patient_class.name = uar_get_code_display(e.encntr_type_class_cd)
 		final_reply_out->encounter.location.hospital.id = e.loc_facility_cd
 		final_reply_out->encounter.location.hospital.name = uar_get_code_display(e.loc_facility_cd)
 		final_reply_out->encounter.location.unit.id = e.loc_nurse_unit_cd
 		final_reply_out->encounter.location.unit.name = uar_get_code_display(e.loc_nurse_unit_cd)
 		final_reply_out->encounter.location.room.id = e.loc_room_cd
 		final_reply_out->encounter.location.room.name = uar_get_code_display(e.loc_room_cd)
 		final_reply_out->encounter.location.bed.id = e.loc_bed_cd
 		final_reply_out->encounter.location.bed.name = uar_get_code_display(e.loc_bed_cd)
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetCaseData Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Sub
 
/*************************************************************************
;  Name: GetProcedures(null) = null
;  Description: Get Surgical Procedure data
**************************************************************************/
subroutine GetProcedures(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetProcedures Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	select into "nl:"
 	from surgical_case sc
 		, surg_case_procedure scp
 		, prsnl_group pg
 		, surg_case_proc_modifier scpm
 	plan sc where sc.surg_case_id = dSurgicalCaseId
 	join scp where scp.surg_case_id = sc.surg_case_id
 	join pg where pg.prsnl_group_id = outerjoin(scp.surg_specialty_id)
 	join scpm where scpm.surg_case_proc_id = outerjoin(scp.surg_case_proc_id)
 	order by scp.surg_case_proc_id
 	head report
 		x = 0
 	head scp.surg_case_proc_id
 		y = 0
 		x = x + 1
 		stat = alterlist(final_reply_out->surgical_procedures,x)
 
 		final_reply_out->surgical_procedures[x].anesthesia_type.id = scp.anesth_type_cd
 		final_reply_out->surgical_procedures[x].anesthesia_type.name = uar_get_code_display(scp.anesth_type_cd)
 
 		if(final_reply_out->anesthesia_type.id = 0 and scp.primary_proc_ind = 1)
 			final_reply_out->anesthesia_type.id = scp.anesth_type_cd
 			final_reply_out->anesthesia_type.name = uar_get_code_display(scp.anesth_type_cd)
 		endif
 
 		final_reply_out->surgical_procedures[x].incision_close_date_time = scp.proc_end_dt_tm
 		final_reply_out->surgical_procedures[x].incision_start_date_time = scp.proc_start_dt_tm
 		if(scp.pref_card_id > 0)
 			stat = alterlist(final_reply_out->surgical_procedures[x].preference_cards,1)
 			final_reply_out->surgical_procedures[x].preference_cards[1].id = scp.pref_card_id
 		endif
 		final_reply_out->surgical_procedures[x].procedure_code_id = scp.surg_proc_cd
 		final_reply_out->surgical_procedures[x].procedure_code_name = uar_get_code_display(scp.surg_proc_cd)
 		final_reply_out->surgical_procedures[x].procedure_duration.time = scp.proc_dur_min
 		final_reply_out->surgical_procedures[x].procedure_duration.units.id = c_minutes_duration_units_cd
 		final_reply_out->surgical_procedures[x].procedure_duration.units.name = uar_get_code_display(c_minutes_duration_units_cd)
 		final_reply_out->surgical_procedures[x].procedure_ordinal = scp.seq
 		final_reply_out->surgical_procedures[x].surgical_service.id = scp.surg_specialty_id
 		final_reply_out->surgical_procedures[x].surgical_service.name = pg.prsnl_group_desc
 
 		if(scp.wound_class_cd > 0)
 			final_reply_out->surgical_procedures[x].wound_class.id = scp.wound_class_cd
 			final_reply_out->surgical_procedures[x].wound_class.name = uar_get_code_display(scp.wound_class_cd)
 		else
 			final_reply_out->surgical_procedures[x].wound_class.id = sc.wound_class_cd
 			final_reply_out->surgical_procedures[x].wound_class.name = uar_get_code_display(sc.wound_class_cd)
 		endif
 	detail
 		if(scpm.modifier_cd > 0)
	 		y = y + 1
	 		stat = alterlist(final_reply_out->surgical_procedures[x].operative_regions,y)
 
	 		final_reply_out->surgical_procedures[x].operative_regions[y].id = scpm.modifier_cd
	 		final_reply_out->surgical_procedures[x].operative_regions[y].name = uar_get_code_display(scpm.modifier_cd)
	 	endif
 	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetProcedures Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetSurgicalStaff(null) = null
;  Description: Get Surgical staff details
**************************************************************************/
subroutine GetSurgicalStaff(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetSurgicalStaff Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	from case_attendance ca
		,prsnl p
	plan ca where ca.surg_case_id = dSurgicalCaseId
	join p where p.person_id = outerjoin(ca.case_attendee_id)
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(final_reply_out->surgical_staff,x)
 
		if(ca.case_attendee_id > 0)
			final_reply_out->surgical_staff[x].provider.provider_id = ca.case_attendee_id
			final_reply_out->surgical_staff[x].provider.provider_name = p.name_full_formatted
		else
			final_reply_out->surgical_staff[x].provider.provider_name = ca.attendee_free_text_name
		endif
		final_reply_out->surgical_staff[x].type.id = ca.role_perf_cd
		final_reply_out->surgical_staff[x].type.name = uar_get_code_display(ca.role_perf_cd)
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetSurgicalStaff Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetCaseDelays(null) = null
;  Description: Get Case delays details
**************************************************************************/
subroutine GetCaseDelays(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat(" Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	from surgical_delay sd
	plan sd where sd.surg_case_id = dSurgicalCaseId
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(final_reply_out->case_delays,x)
 
		final_reply_out->case_delays[x].delay_comment = sd.delay_desc
		final_reply_out->case_delays[x].delay_length.time = sd.delay_duration
		final_reply_out->case_delays[x].delay_length.units.id = c_minutes_duration_units_cd
		final_reply_out->case_delays[x].delay_length.units.name = uar_get_code_display(c_minutes_duration_units_cd)
		final_reply_out->case_delays[x].delay_reason.id = sd.delay_reason_cd
		final_reply_out->case_delays[x].delay_reason.name = uar_get_code_display(sd.delay_reason_cd)
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat(" Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: ; GetSurgicalEvents(null) = null
;  Description: Get Surgical Events (Case Times data)
**************************************************************************/
subroutine GetSurgicalEvents(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetSurgicalEvents Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	from case_times ct
	plan ct where ct.surg_case_id = dSurgicalCaseId
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(final_reply_out->surgical_events,x)
 
		final_reply_out->surgical_events[x].event_type.id = ct.task_assay_cd
		final_reply_out->surgical_events[x].event_type.name = uar_get_code_display(ct.task_assay_cd)
		final_reply_out->surgical_events[x].event_date_time = ct.case_time_dt_tm
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetSurgicalEvents Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub*/
 
/*************************************************************************
;  Name: GetSurgicalDetails(null)
;  Description: Get coded values from the periop documentation
**************************************************************************/
subroutine GetSurgicalDetails(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetSurgicalDetails Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 820000
	set iTask = 805001
	set iRequest = 805010
 
	select into "nl:"
	from perioperative_document pd
	, segment_header sh
	, input_form_reference ifr
	plan pd where pd.surg_case_id = dSurgicalCaseId
	join sh where sh.periop_doc_id = pd.periop_doc_id
	join ifr where ifr.input_form_cd = sh.input_form_cd
		and ifr.input_form_version_nbr = sh.input_form_ver_nbr
	order by pd.periop_doc_id, sh.input_form_cd
	head report
		x = 0
	head pd.periop_doc_id
		y = 0
		x = x + 1
		stat = alterlist(temp->list,x)
 
		temp->list[x].doc_id = pd.periop_doc_id
	detail
		y = y + 1
		stat = alterlist(temp->list[x].forms,y)
 
		temp->list[x].forms[y].event_cd = ifr.event_cd
		temp->list[x].forms[y].input_form_cd = ifr.input_form_cd
		temp->list[x].forms[y].input_form_version_nbr = ifr.input_form_version_nbr
	foot report
		temp->list_cnt = x
	with nocounter

	if(temp->list_cnt > 0)
		for(i = 1 to temp->list_cnt)
			; Setup request
			set stat = initrec(805010_req)
			set stat = initrec(805010_rep)
 
			set 805010_req->person_id = final_reply_out->patient.patient_id
			set 805010_req->doc_id = temp->list[i].doc_id
			set 805010_req->mnemonic = "SN"
			for(j = 1 to size(temp->list[i].forms,5))
				set stat = alterlist(805010_req->forms,j)
				set 805010_req->forms[j].event_cd = temp->list[i].forms[j].event_cd
				set 805010_req->forms[j].input_form_cd = temp->list[i].forms[j].input_form_cd
				set 805010_req->forms[j].input_form_version_nbr = temp->list[i].forms[j].input_form_version_nbr
			endfor
 
			;Execute request
			set stat = tdbexecute(iApplication,iTask,iRequest,"REC",805010_req,"REC",805010_rep)
 
			;populating the final reply
			select into "nl:"
			from (dummyt d1 with seq = size(805010_rep->segment_results,5))
     			 ,(dummyt d2 with seq = 1)
     			 ,(dummyt d3 with seq = 1)
     			 ,(dummyt d4 with seq = 1)
     			 ,(dummyt d5 with seq = 1)
			plan d1
    			where maxrec(d2,size(805010_rep->segment_results[d1.seq].entries,5))
			join d2
   				where maxrec(d3,size(805010_rep->segment_results[d1.seq].entries[d2.seq].groups,5))
			join d3
  				where maxrec(d4,size(805010_rep->segment_results[d1.seq].entries[d2.seq].groups[d3.seq].controls,5))
			join d4
    			where maxrec(d5,size(805010_rep->segment_results[d1.seq].entries[d2.seq].groups[d3.seq].controls[d4.seq].values,5))
			join d5
			order by d1.seq, d2.seq, d3.seq, d4.seq, d5.seq
			head report
				x = size(final_reply_out->surgical_details,5)
				head d1.seq
       				cnt = 0
    				head d2.seq
       					cnt =  cnt + 1
    					head d3.seq
       						nocnt = 0
       						head d4.seq
       							y = 0
        						z = 0
        						x = x + 1
        						stat = alterlist(final_reply_out->surgical_details,x)
        						final_reply_out->surgical_details[x].field.id =
        									805010_rep->segment_results[d1.seq].entries[d2.seq].groups[d3.seq].controls[d4.seq].event_cd
        						final_reply_out->surgical_details[x].field.name =
            						uar_get_code_display(805010_rep->segment_results[d1.seq].entries[d2.seq].groups[d3.seq].controls[d4.seq].event_cd)
        						final_reply_out->surgical_details[x].section.id = 805010_rep->segment_results[d1.seq].input_form_cd
								final_reply_out->surgical_details[x].section.name = uar_get_code_display(805010_rep->segment_results[d1.seq].input_form_cd)
        						final_reply_out->surgical_details[x].section.description =
        													uar_get_code_description(805010_rep->segment_results[d1.seq].input_form_cd)
        						final_reply_out->surgical_details[x].sequence = cnt
 
        						head d5.seq
       		if(cnvtreal(805010_rep->segment_results[d1.seq].entries[d2.seq].groups[d3.seq].controls[d4.seq].values[d5.seq].val_id) > 0)
             							y = y + 1
            							stat = alterlist(final_reply_out->surgical_details[x].coded_values,y)
            							final_reply_out->surgical_details[x].coded_values[y].id =
                	cnvtreal(805010_rep->segment_results[d1.seq].entries[d2.seq].groups[d3.seq].controls[d4.seq].values[d5.seq].val_id)
            							final_reply_out->surgical_details[x].coded_values[y].name =
               								805010_rep->segment_results[d1.seq].entries[d2.seq].groups[d3.seq].controls[d4.seq].values[d5.seq].val_disp
        							else
            							z = z + 1
            							stat = alterlist(final_reply_out->surgical_details[x].text_values,z)
            							final_reply_out->surgical_details[x].text_values[z] =
                							805010_rep->segment_results[d1.seq].entries[d2.seq].groups[d3.seq].controls[d4.seq].values[d5.seq].val_disp
        							endif
		with nocounter
 
		endfor
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetSurgicalDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetSurgicalReport(null) = null
;  Description: Get RTF version of periop documents
**************************************************************************/
subroutine GetSurgicalReport(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat(" Begin  GetSurgicalReport", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set blobout = fillstring(32768, ' ')
 
 	select into "nl:"
 	from perioperative_document pd
 	, clinical_event ce
	, ce_blob cb
	, ce_blob_result cbr
	plan pd where pd.surg_case_id = dSurgicalCaseId
	join ce where ce.person_id = final_reply_out->patient.patient_id
		and substring(1,8,ce.reference_nbr) = substring(1,8,cnvtstring(pd.periop_doc_id))
		and ce.valid_from_dt_tm <= sysdate
		and ce.valid_until_dt_tm > sysdate
		and ce.event_class_cd in (c_mdoc_event_class_cd, c_doc_event_class_cd)
	join cbr where cbr.event_id = outerjoin(ce.event_id)
		and cbr.valid_from_dt_tm <= outerjoin(sysdate)
		and cbr.valid_until_dt_tm > outerjoin(sysdate)
	join cb where cb.event_id = outerjoin(ce.event_id)
		and cb.valid_from_dt_tm <= outerjoin(sysdate)
		and cb.valid_until_dt_tm > outerjoin(sysdate)
	order by ce.parent_event_id, ce.event_id
	head report
		x = 0
	head ce.parent_event_id
		if(ce.event_class_cd = c_mdoc_event_class_cd)
			x = x + 1
			stat = alterlist(final_reply_out->surgical_reports,x)
 
			final_reply_out->surgical_reports[x].report_id = ce.event_id
			final_reply_out->surgical_reports[x].report_type.id = ce.event_cd
			final_reply_out->surgical_reports[x].report_type.name = uar_get_code_display(ce.event_cd)
		endif
	detail
		if(cbr.event_id > 0)
			final_reply_out->surgical_reports[x].body_length = cb.blob_length
			final_reply_out->surgical_reports[x].document_pointer = cbr.blob_handle
			final_reply_out->surgical_reports[x].format = uar_get_code_display(cbr.format_cd)
			final_reply_out->surgical_reports[x].storage = uar_get_code_display(cbr.storage_cd)
 
			;Uncompress blob
			stat = uar_ocf_uncompress(cb.blob_contents, textlen(cb.blob_contents), blobout, size(blobout), 32768)
 
			final_reply_out->surgical_reports[x].body = blobout
		endif
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetSurgicalReport Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetSurgicalCharges(null) = null -- 951046 - afc_get_charges
;  Description: Get charge information to update costs
**************************************************************************/
subroutine GetSurgicalCharges(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetSurgicalCharges Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 951060
	set iTask = 951060
	set iRequest = 951046
 
	; Setup request
	set 951046_req->person_id = final_reply_out->patient.patient_id
	set 951046_req->encntr_id = final_reply_out->encounter.encounter_id
	set 951046_req->accession_nbr = final_reply_out->surgical_case_name
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",951046_req,"REC",951046_rep)
 
	if(951046_rep->status_data.status = "F")
		call ErrorHandler2(c_error_handler_name, "F", "Execute", "Could not get surgical charges (951046).",
		"9999","Could not get surgical charges (951046).", final_reply_out)
 		go to exit_script
	else
		declare activity_type = vc
 
		if(951046_rep->charge_qual > 0)
			for(i = 1 to 951046_rep->charge_qual)
				set activity_type = cnvtlower(uar_get_code_display(951046_rep->qual[i].activity_type_cd))
				if(951046_rep->qual[i].charge_type_mean = "DR")
					; Prsnl cost
					if(activity_type like "*prsnl*" or activity_type like "*personnel*")
						set final_reply_out->surgical_staff_cost = final_reply_out->surgical_staff_cost + 951046_rep->qual[i].item_extended_price
					endif
 
					; Surgeon cost
					if(activity_type like "*surgeon*")
						set final_reply_out->surgeon_cost = final_reply_out->surgeon_cost + 951046_rep->qual[i].item_extended_price
					endif
 
					; Total Cost
					set final_reply_out->total_cost = final_reply_out->total_cost + 951046_rep->qual[i].item_extended_price
				endif
			endfor
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetSurgicalCharges Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetSchedulingDetails(null) = null
;  Description: Get scheduling details
**************************************************************************/
subroutine GetSchedulingDetails(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetSchedulingDetails Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; PreOp Appointments & Update Scheduling status
	select into "nl:"
	from surgical_case sc
		, sch_event se
		, sch_event_attach sea
	plan sc where sc.surg_case_id = dSurgicalCaseId
	join se where se.sch_event_id = sc.sch_event_id
	join sea where sea.sch_event_id = se.sch_event_id
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(final_reply_out->pre_op_appointments,x)
 
 		final_reply_out->scheduling_status.id = se.sch_state_cd
		final_reply_out->scheduling_status.name = uar_get_code_display(se.sch_state_cd)
 
		final_reply_out->pre_op_appointments[x].appointment_id = se.sch_event_id
		final_reply_out->pre_op_appointments[x].pre_op_appoinment_id = se.sch_event_id
		final_reply_out->pre_op_appointments[x].procedure.id = sea.order_id
		final_reply_out->pre_op_appointments[x].procedure.name = sea.description
	with nocounter
 
	; Case Blocks
    if(size(final_reply_out->pre_op_appointments,5) > 0)
	select into "nl:"
	from sch_appt sa
		,sch_slot_type slt
		,sch_resource sr
		,prsnl p
		,prsnl_group_reltn pgr
		,prsnl_group pg
		,prsnl_alias pa
	plan sa where sa.sch_event_id = final_reply_out->pre_op_appointments[1].appointment_id
		and sa.time_type_flag > 0
	join slt where slt.slot_type_id = outerjoin(sa.slot_type_id)
	join sr where sr.resource_cd = outerjoin(sa.resource_cd)
	join p where p.person_id = outerjoin(sr.person_id)
	join pgr where pgr.person_id = outerjoin(p.person_id)
	join pg where pg.prsnl_group_id = outerjoin(pgr.prsnl_group_id)
	join pa where pa.person_id = outerjoin(p.person_id)
		and pa.active_ind = outerjoin(1)
		and pa.beg_effective_dt_tm <= outerjoin(sysdate)
		and pa.end_effective_dt_tm > outerjoin(sysdate)
		and pa.prsnl_alias_type_cd = outerjoin(c_npi_prsnl_alias_type_cd)
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(final_reply_out->case_blocks,x)
 
		final_reply_out->case_blocks[x].block_type.id = sa.slot_type_id
		final_reply_out->case_blocks[x].block_type.name = slt.description
		final_reply_out->case_blocks[x].block_duration.time = sa.duration
		final_reply_out->case_blocks[x].block_duration.units.id = c_minutes_duration_units_cd
		final_reply_out->case_blocks[x].block_duration.units.name = uar_get_code_display(c_minutes_duration_units_cd)
 
 		if(sr.person_id > 0)
			final_reply_out->case_blocks[x].surgeon.name = p.name_full_formatted
			final_reply_out->case_blocks[x].surgeon.NPI = pa.alias
			final_reply_out->case_blocks[x].surgeon.provider_id = p.person_id
	 		final_reply_out->case_blocks[x].surgeon.user_id = p.username
	 		final_reply_out->case_blocks[x].surgical_service.id = pg.prsnl_group_id
	 		final_reply_out->case_blocks[x].surgical_service.name = pg.prsnl_group_desc
 		endif
 
 		if(sa.person_id > 0)
 			final_reply_out->case_blocks[x].surgeon_group.id = 0.00
 			final_reply_out->case_blocks[x].surgeon_group.name = uar_get_code_display(sa.sch_role_cd)
 		else
 			final_reply_out->case_blocks[x].surgeon_group.id = sr.resource_cd
 			final_reply_out->case_blocks[x].surgeon_group.name = uar_get_code_display(sr.resource_cd)
 		endif
 
	with nocounter
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetSchedulingDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: PostAmble(null) = null
;  Description: Update final reply
**************************************************************************/
subroutine PostAmble(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostAmble Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Update Total Duration
	declare total_duration = i4
	set total_duration = 0
	set total_duration = total_duration + final_reply_out->cleanup_duration.time
	set total_duration = total_duration + final_reply_out->setup_duration.time
	for(i = 1 to size(final_reply_out->surgical_procedures,5))
		set total_duration = total_duration + final_reply_out->surgical_procedures[i].procedure_duration.time
	endfor
	set final_reply_out->total_duration.time = total_duration
	set final_reply_out->total_duration.units.id = c_minutes_duration_units_cd
	set final_reply_out->total_duration.units.name = uar_get_code_display(c_minutes_duration_units_cd)
 
	if(iDebugFlag > 0)
		call echo(concat("PostAmble Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
end
go
