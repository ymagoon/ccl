/*~BB~*******************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

*************************************************************************
          Date Written:       12/18/15
          Source file name:   vigilanz_get_immunizations
          Object name:        vigilanz_get_immunizations
          Program purpose:    Returns immunization results by component
          Tables read:	      CLINICAL_EVENT, ORDER_ACTION, PRSNL
          Tables updated:     NONE
          Executing from:     EMISSARY SERVICES
 ***********************************************************************
                   GENERATED MODIFICATION CONTROL LOG
 ***********************************************************************
 Mod Date     Engineer             Comment
 -----------------------------------------------------------------------
  000 12/18/15  JCO				    Initial write
  001 01/04/15  AAB					Changed immunization_result to immunization_results
  002 02/09/16  AAB 				Check size of med_result_list before using it
  003 02/22/16  AAB 				Add encntr_type_cd and encntr_type_disp
  004 04/29/16  AAB 				Added version
  005 10/10/16  AAB 				Add DEBUG_FLAG
  006 06/14/17  DJP					Fixed Reply Record Structure for Invalid User
  007 07/27/17 	JCO					Changed %i to execute; update ErrorHandler2
  008 03/21/18 	RJC					Added version code and copyright block
  009 04/05/19	RJC					Added person_id to final reply
  010 04/11/19	RJC					Code cleanup. Fixed issue with uar failing when multiple values exist
  011 01/30/19  KD                  Added Vaccine information
  012 2/1/20    STV                 adjustment for comments being decompressed
 ***********************************************************************/
drop program vigilanz_get_immunizations go
create program vigilanz_get_immunizations
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Username: " = ""						;User for audit purposes (optional)
	, "UserType: " = 0						;0 = EMR (DEFAULT), 1 = PORTAL
	, "PersonId: " = 0.0					;Patient Identifier (required)
	, "Debug Flag" = 0						;OPTIONAL. Verbose logging when set to one (1). 005
 
with OUTDEV, USERNAME, USERTYPE, PERSON_ID, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
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
; 1000001 - event_query
free record 1000001_req
record 1000001_req (
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
 
free record 1000001_rep
record 1000001_rep (
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
 
; Final Reply
free record immunizations_results_reply_out
record immunizations_results_reply_out
(
	1 person_id              		= f8
	1 immunization_results[*]
		2 person_id					= f8
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
		2 comment					= gvc
		2 encntr_type_cd			= f8	;003
		2 encntr_type_disp			= vc	;003
		2 encntr_type_class_cd		= f8	;003
		2 encntr_type_class_disp	= vc	;003
		;011
		;2 lot_no					= f8    ;# <----- cmr.substance_lot_number we alrady have these two fields
		; expiration_date			= dq8   ;<----cmr.substance_exp_dt_tm
		2 vis_sheet							; <----- im.vis_cd
			3 id = f8
			3 name = vc
		2 vis_given_date			= dq8   ;<---- im.vis_dt_tm
		2 vis_sheet_pub_date		= dq8 	;<---- im.vis_provided_on_dt_tm
		2 vaccines_for_child		;<---- im.vis_status_cd
			3 id = f8
			3 name = vc
 
	1 audit
		2 user_id					= f8
		2 user_firstname			= vc
		2 user_lastname				= vc
		2 patient_id				= f8
		2 patient_firstname			= vc
		2 patient_lastname			= vc
 	    2 service_version			= vc	;004
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
; Input
declare dPersonId  						= f8 with protect, noconstant(0.0)
declare sUserName						= vc with protect, noconstant("")
declare sUserType						= i2 with protect, noconstant(0)
declare iDebugFlag						= i2 with protect, noconstant(0)
 
; Constants
declare c_error_handler					= vc with protect,constant("Get Immunizations")
declare c_immunizations_event_set_cd 	= f8 with protect, noconstant(uar_get_code_by("DISPLAYKEY",93,"IMMUNIZATIONS"))
declare c_noocfcomp_cd = f8 with protect, constant(uar_get_code_by("MEANING",120,"NOCOMP"))
declare c_ocfcomp_cd =  f8 with protect, constant(uar_get_code_by("MEANING",120,"OCFCOMP"))
/*************************************************************************
;INITIALIZE
**************************************************************************/
; Input
set dPersonId   						= cnvtreal($PERSON_ID)
set iUserType							= cnvtreal($USERTYPE)
set sUserName							= trim($USERNAME, 3)
set iDebugFlag							= cnvtint($DEBUG_FLAG)
 
if(iDebugFlag > 0)
 	call echo(build("dPersonId  ->", dPersonId))
 	call echo(build("sUserName  ->", sUserName))
 	call echo(build("c_immunizations_event_set_cd  ->", c_immunizations_event_set_cd))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetImmunizationCode(null) 	= null with protect
declare GetImmunizations(null)		= null with protect
declare GetComments(null)			= null with protect
declare GetVISinfo(null)			= null with protect  ;011
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate PatientId exists
if(dPersonId = 0)
	call ErrorHandler2(c_error_handler,"F","Validate","Missing required field: PatientId",
	"2055", "Missing required field: PatientId", immunizations_results_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate Username
set iRet = PopulateAudit(sUserName, dPersonId, immunizations_results_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2(c_error_handler,"F","Validate", "Invalid User for Audit.",
	"1001", build("UserId is invalid: ", sUserName), immunizations_results_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate Immunization code
if(c_immunizations_event_set_cd = -1)
	call GetImmunizationCode(null)
endif
 
; Get Immunizations
call GetImmunizations(null)
 
; Get Comments
call GetComments(null)
 
;Get VIS Information - 011
call GetVISinfo(null)
 
; Set Audit to Success
call ErrorHandler(c_error_handler, "S", "Success", "Process completed successfully.", immunizations_results_reply_out)
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
#EXIT_SCRIPT
 
set JSONout = CNVTRECTOJSON(immunizations_results_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
 	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_immunizations.json")
	call echo(build2("_file : ", _file))
	call echojson(immunizations_results_reply_out, _file, 0)
 	call echorecord(immunizations_results_reply_out)
	call echo(JSONout)
endif
 
#EXIT_VERSION
/***************************************************************************
;  Name: GetImmunizationCode (null)
;  Description: Get event set if uar call fails
**************************************************************************/
subroutine GetImmunizationCode(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetImmunizationCode Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select c.*
	from code_value cv
		, v500_event_set_canon vesc
	plan cv where cv.code_set = 93
		and cv.active_ind = 1
		and cv.end_effective_dt_tm > sysdate
		and cv.display_key = "IMMUNIZATIONS"
	join vesc where vesc.event_set_cd = cv.code_value
		and vesc.parent_event_set_cd in (
										select v.event_set_cd
										from code_value c
											,v500_event_set_canon v
										where c.code_set = 93
											and c.active_ind = 1
											and c.end_effective_dt_tm > sysdate
											and c.display_key like "*OCF*"
											and v.parent_event_set_cd = c.code_value)
	detail
		c_immunizations_event_set_cd = cv.code_value
	with nocounter
 
 
	if(iDebugFlag > 0)
		call echo(concat("GetImmunizationCode Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
/***************************************************************************
;  Name: GetImmunizations (null)
;  Description: Perform query to retreive immunization records
**************************************************************************/
subroutine GetImmunizations(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetImmunizations Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication	= 600005
	set iTask 			= 600107
	set iRequest		= 1000001
 
	; Setup request
	set 1000001_req->query_mode  				= 32769
	set 1000001_req->query_mode_ind 			= 0
	set 1000001_req->event_set_cd 				= c_immunizations_event_set_cd
	set 1000001_req->person_id 					= dPersonId
	set 1000001_req->order_id 					= 0
	set 1000001_req->encntr_id 					= 0
	set 1000001_req->encntr_financial_id 		= 0
	set 1000001_req->contributor_system_cd 		= 0
	set 1000001_req->accession_nbr 				= ""
	set 1000001_req->compress_flag 				= 1
	set 1000001_req->subtable_bit_map 			= 4
	set 1000001_req->subtable_bit_map_ind 		= 0
	set 1000001_req->small_subtable_bit_map 	= 0
	set 1000001_req->small_subtable_bit_map_ind = 1
	set 1000001_req->search_anchor_dt_tm		= cnvtdatetime(curdate,curtime3)
	set 1000001_req->search_anchor_dt_tm_ind 	= 0
	set 1000001_req->seconds_duration 			= 0
	set 1000001_req->direction_flag 			= 0
	set 1000001_req->events_to_fetch 			= 0
	set 1000001_req->date_flag 					= 0
	set 1000001_req->view_level 				= 0
	set 1000001_req->non_publish_flag 			= 1
	set 1000001_req->valid_from_dt_tm 			= cnvtdatetime("0000-00-00 00:00:00.00")
	set 1000001_req->valid_from_dt_tm_ind 		= 1
	set 1000001_req->decode_flag 				= 0
	set 1000001_req->ordering_provider_id 		= 0
	set 1000001_req->action_prsnl_id 			= 0
	set 1000001_req->query_mode2  				= 0
	set 1000001_req->end_of_day_tz 				= 0
	set 1000001_req->search_begin_dt_tm 		= cnvtdatetime("0000-00-00 00:00:00.00")
	set 1000001_req->search_end_dt_tm 			= cnvtdatetime("0000-00-00 00:00:00.00")
	set 1000001_req->action_prsnl_group_id 		= 0
 
	; Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",1000001_req,"REC",1000001_rep)
 
	; Validate response
	if (1000001_rep->status_data->status = "F")
		call ErrorHandler2(c_error_handler, "F", "Error", "Error retrieving immunization records",
		"9999", "Error retrieving immunization records", immunizations_results_reply_out)	;007
		go to EXIT_SCRIPT
	endif
 
	; Build final reply
	set resCnt = size(1000001_rep->rb_list[1]->event_list,5)
	if(resCnt = 0)
		call ErrorHandler(c_error_handler, "Z", "Zero Records", "No immunization records found", immunizations_results_reply_out)
		go to EXIT_SCRIPT
	else
		declare comment = vc
 
		set stat = alterlist(immunizations_results_reply_out->immunization_results,resCnt)
		set immunizations_results_reply_out->person_id = dPersonId
 
		;iterate through result list and populate immunizations_results_reply_out struct
		for(x = 1 to resCnt)
			set immunizations_results_reply_out->immunization_results[x].person_id =
				1000001_rep->rb_list[1]->event_list[x].person_id
			set immunizations_results_reply_out->immunization_results[x].order_id =
				1000001_rep->rb_list[1]->event_list[x].order_id
			set immunizations_results_reply_out->immunization_results[x].immunization_id =
				1000001_rep->rb_list[1]->event_list[x].event_id
			set immunizations_results_reply_out->immunization_results[x].encntr_id =
				1000001_rep->rb_list[1]->event_list[x].encntr_id
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
				1000001_rep->rb_list[1]->event_list[x].collating_seq
			if(size(1000001_rep->rb_list[1]->event_list[x]->med_result_list,5) > 0) ;002 +
				set immunizations_results_reply_out->immunization_results[x].admin_dt_tm =
						1000001_rep->rb_list[1]->event_list[x]->med_result_list[1].admin_start_dt_tm
				set immunizations_results_reply_out->immunization_results[x].body_site =
						1000001_rep->rb_list[1]->event_list[x]->med_result_list[1].admin_site_cd_disp
				set immunizations_results_reply_out->immunization_results[x].admin_route =
						1000001_rep->rb_list[1]->event_list[x]->med_result_list[1].admin_route_cd_disp
				set immunizations_results_reply_out->immunization_results[x].expiration_dt_tm =
						1000001_rep->rb_list[1]->event_list[x]->med_result_list[1].substance_exp_dt_tm
				set immunizations_results_reply_out->immunization_results[x].manufacturer_name =
						1000001_rep->rb_list[1]->event_list[x]->med_result_list[1].substance_manufacturer_cd_disp
				set immunizations_results_reply_out->immunization_results[x].substance_lot =
						1000001_rep->rb_list[1]->event_list[x]->med_result_list[1].substance_lot_number
			endif  ;002 -
 
			set immunizations_results_reply_out->immunization_results[x].immunization_status =
				1000001_rep->rb_list[1]->event_list[x] .result_status_cd_disp
			set immunizations_results_reply_out->immunization_results[x].component_id =
				1000001_rep->rb_list[1]->event_list[x].event_cd
			set immunizations_results_reply_out->immunization_results[x].component_desc =
				1000001_rep->rb_list[1]->event_list[x].event_cd_disp
			set immunizations_results_reply_out->immunization_results[x].dose =
				1000001_rep->rb_list[1]->event_list[x].result_val
			set immunizations_results_reply_out->immunization_results[x].dose_unit =
				1000001_rep->rb_list[1]->event_list[x].result_units_cd_disp
			set immunizations_results_reply_out->immunization_results[x].clinsig_updt_dt_tm =
				1000001_rep->rb_list[1]->event_list[x].clinsig_updt_dt_tm
			set immunizations_results_reply_out->immunization_results[x].performed_prsnl_id =
				1000001_rep->rb_list[1]->event_list[x].performed_prsnl_id
			set immunizations_results_reply_out->immunization_results[x].performed_prsnl =
				GetNameFromPrsnlID(1000001_rep->rb_list[1]->event_list[x].performed_prsnl_id)
			set immunizations_results_reply_out->immunization_results[x].ordered_prsnl_id =
				GetOrderPrsnlIDfromOrderID(1000001_rep->rb_list[1]->event_list[x].order_id)
			set immunizations_results_reply_out->immunization_results[x].ordered_prsnl =
				GetNameFromPrsnlID(immunizations_results_reply_out->immunization_results[x].ordered_prsnl_id)
		endfor
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetImmunizations Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
/***************************************************************************
;  Name: GetComments (null)
;  Description: Perform query to retreive immunization comments
**************************************************************************/
subroutine GetComments(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetComments Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare blob = c32768
	declare size_blob = i4
	set size_blob = 32768
 
	select into "nl:"
	from (dummyt d with seq = size(immunizations_results_reply_out->immunization_results,5))
		, ce_event_note cen
		, long_blob lb
	plan d
	join cen where cen.event_id = immunizations_results_reply_out->immunization_results[d.seq].immunization_id
	join lb where lb.parent_entity_name = "CE_EVENT_NOTE"
		and lb.parent_entity_id = cen.ce_event_note_id
	detail
		blob = " "
		
		if(cen.compression_cd = c_noocfcomp_cd)
			blob = substring(1,findstring("ocf_blob",lb.long_blob,1)-1,lb.long_blob)
		elseif(cen.compression_cd = c_ocfcomp_cd)
			stat = uar_ocf_uncompress(lb.long_blob, size(lb.long_blob), blob, size_blob, 32768)
		endif

		immunizations_results_reply_out->immunization_results[d.seq].comment =
		build2(immunizations_results_reply_out->immunization_results[d.seq].comment," ",trim(blob,3))
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetComments Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
/***************************************************************************
;  Name: GetVISinfo (null) ;;011
;  Description: Perform query to retreive immunization Vaccine Information
**************************************************************************/
subroutine GetVISinfo(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetVISinfo Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
	select into "nl:"
	from (dummyt d with seq = size(immunizations_results_reply_out->immunization_results,5))
        ,immunization_modifier im
    plan d
    	where immunizations_results_reply_out->immunization_results[d.seq].immunization_id > 0
	join im
		where im.event_id = immunizations_results_reply_out->immunization_results[d.seq].immunization_id
 		and im.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	detail
		immunizations_results_reply_out->immunization_results[d.seq].vis_sheet.id = im.vis_cd
		immunizations_results_reply_out->immunization_results[d.seq].vis_sheet.name = uar_get_code_display(im.vis_cd)
		immunizations_results_reply_out->immunization_results[d.seq].vis_given_date = im.vis_provided_on_dt_tm
		immunizations_results_reply_out->immunization_results[d.seq].vaccines_for_child.id  = im.vfc_status_cd
		immunizations_results_reply_out->immunization_results[d.seq].vaccines_for_child.name  = uar_get_code_display(im.vfc_status_cd)
		immunizations_results_reply_out->immunization_results[d.seq].vis_sheet_pub_date = im.vis_dt_tm
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetVISinfo Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
 
end go
 
