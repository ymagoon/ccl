/************************************************************************

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
	Date Written:       03/08/15
    Source file name:   vigilanz_get_flowsheets
    Object name:        vigilanz_get_flowsheets
    Program purpose:    Returns result values for flowsheet items
************************************************************************
                   GENERATED MODIFICATION CONTROL LOG
************************************************************************
 Mod Date     Engineer	Comment
 --------------------------------------------------------------
  000 03/08/15	AAB		Initial write
  001 04/30/15	AAB		Support Component Ids as Input Parameters
  002 06/03/15	AAB		Changed reply to flowsheet_reply_out
  003 06/05/15	AAB		Make Event Set or Component required.
						Cannot make a search for all event sets or all components.
  004 06/12/15	AAB		Default ALL RESULTS if no Section or Component is passed in
  005 06/25/15	AAB		Change to Flowsheets
  006 06/29/15	AAB		Change event_cd to component_id and effective_dt to clin_sig_updt_dt_tm
  007 07/27/15	AAB		Changed FLOWSHEET input parameter to a number
  008 07/30/15	AAB		Add ObservedDateTime to response
  009 07/30/15	AAB		Pull Normalcy MEANING
  010 09/14/15	AAB		Add audit object
  011 12/14/15	AAB		Return patient class
  012 02/22/16	AAB		Return encntr_type and encntr_class
  013 04/29/16	AAB		Added version
  014 10/10/16	AAB		Add DEBUG_FLAG
  015 07/27/17	JCO		Changed %i to execute; update ErrorHandler2
  016 08/17/17	JCO		Added UTC logic
  017 03/21/18	RJC		Added version code and copyright block
  018 06/26/18	RJC		Fixed issue when too many records are found. Code cleanup
  019 11/01/18	RJC		Added observation group; code cleanup - removed unnecessary subroutine
  020 04/05/19	RJC		Fixed date issue on 1000001 request for 2018.01 code
  021 04/22/19  STV     adding task object
  022 08/23/19  STV     Adjustment for result_dt_tm
  023 10/16/19  STV     Added documented by
  024 11/14/19  JJR		Adding Coded Results
  017 01/02/20  KRD     Added long blob results to populate result_val_long_text
  018 1/16/20   KRD     Added long blob results to populate observation_comments
  019 04/30/20  KRD	Fix long "Other" Alpha response text -
			used existing result_val_long_text
 ***********************************************************************/
drop program vigilanz_get_flowsheets go
create program vigilanz_get_flowsheets
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Person ID :" = 0.0
	, "Encounter ID :" = 0.0
	, "Category ID :" = 0.0
	, "Component ID's :" = ""
	, "Max Records :" = 0
	, "From Date:" = ""
	, "To Date:" = ""
	, "User Name:" = ""       		;010
	, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV,PERSON_ID, ENCNTR_ID, CATEGORY, COMPONENTS, MAX_RECS, FROM_DATE, TO_DATE,USERNAME, DEBUG_FLAG   ;014
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL ;017
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record components_req
record components_req (
	1 event_cds[*]
		2 event_cd				= f8
		2 source_identifier		= vc
)
 
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
		3 dynamic_label_list [*]
		    4 ce_dynamic_label_id = f8
			4 label_name = vc
			4 label_prsnl_id = f8
			4 label_status_cd = f8
			4 label_seq_nbr = i4
			4 valid_from_dt_tm = dq8
			4 label_comment = vc
%i cclsource:status_block.inc
)
 
;Final Reply
free record flowsheets_reply_out
record flowsheets_reply_out
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
	  2 observed_dt_tm			= dq8   ; ce.event_end_dt_tm  ;008
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
	  2 encntr_id 				= f8	;011
	  2 encntr_type_cd			= f8	;011
	  2 encntr_type_disp		= vc	;011
	  2 encntr_type_class_cd	= f8	;012
      2 encntr_type_class_disp	= vc	;012
      2 observation_group				;019
      	3 id 					= f8
      	3 name					= vc
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
 
  	  2 coded_results[*] ;024
  	       3 id = f8
  	       3 name = vc
 
  	2 result_val_long_text[*] ;017
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
 
	1 audit			;010
		2 user_id				= f8
		2 user_firstname		= vc
		2 user_lastname			= vc
		2 patient_id			= f8
		2 patient_firstname		= vc
		2 patient_lastname		= vc
	    2 service_version		= vc	;013
  1 status_data							;015
    2 status 					= c1
    2 subeventstatus[1]
      3 OperationName 			= c25
      3 OperationStatus 		= c1
      3 TargetObjectName 		= c25
      3 TargetObjectValue 		= vc
      3 Code 					= c4
      3 Description 			= vc
)
 
set flowsheets_reply_out->status_data->status = "F"
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common ;015
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare dPersonID  					= f8 with protect, noconstant(0.0)
declare dEncntrID  					= f8 with protect, noconstant(0.0)
declare dEventSetCd					= f8 with protect, noconstant(0.0)
declare sComponents					= vc with protect, noconstant("")
declare iMaxRecs	 				= i4 with protect, noconstant(0)
declare sFromDate					= vc with protect, noconstant("")
declare sToDate						= vc with protect, noconstant("")
declare sUserName					= vc with protect, noconstant("")   	;010
declare iDebugFlag					= i2 with protect, noconstant(0) 		;014
 
;Constants
 
;Other
declare qFromDate					= dq8 with protect, noconstant(0)
declare qToDate						= dq8 with protect, noconstant(0)
 
declare c_noocfcomp_cd = f8 with protect, constant(uar_get_code_by("MEANING",120,"NOCOMP")) ;017
declare c_ocfcomp_cd =  f8 with protect, constant(uar_get_code_by("MEANING",120,"OCFCOMP")) ;017
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
;Inputs
set dPersonID   	= cnvtreal($PERSON_ID)
set dEncntrID    	= cnvtreal($ENCNTR_ID)
set dEventSetCd     = cnvtreal($CATEGORY)
set sComponents     = trim($COMPONENTS,3)
set iMaxRecs    	= cnvtint($MAX_RECS)
set sFromDate		= trim($FROM_DATE, 3)
set sToDate			= trim($TO_DATE, 3)
set sUserName		= trim($USERNAME, 3)   	;010
set iDebugFlag		= cnvtint($DEBUG_FLAG)  ;014
 
if(sFromDate <= " ")
	set sFromDate = "01-JAN-1900"
endif
 
if(sToDate <= " ")
	set sToDate = "31-DEC-2100"
endif
 
if(iMaxRecs = 0)
	set iMaxRecs = 9999 ;018
endif
 
;Other
set qFromDate		= GetDateTime(sFromDate)
set qToDate			= GetDateTime(sToDate)
 
if(iDebugFlag > 0)
	call echo(build("sUserName	->", sUserName))
	call echo(build("dPersonID	->", dPersonID))
	call echo(build("dEncntrID	->", dEncntrID))
	call echo(build("iMaxRecs	->", iMaxRecs))
	call echo(build("sFromDate	->", sFromDate))
	call echo(build("sToDate	->", sToDate))
	call echo(build("dEventSetCd->", dEventSetCd))
	call echo(build("sComponents->", sComponents))
	call echo(build("qFromDate  ->", qFromDate))
	call echo(build("qToDate   	->", qToDate))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare BuildComponentList(null)  		= null with Protect
declare GetFlowsheets(null)				= null with protect
declare PostAmble(null)					= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Validate PatientId exists
if(dPersonID = 0)
	call ErrorHandler2("EXECUTE", "F", "GET OBSERVATIONS", "Missing required field: PersonId.",
 	"2055", "Missing required field: PatientId", flowsheets_reply_out )	;015
	go to EXIT_SCRIPT
endif
 
;Validate Username
set iRet = PopulateAudit(sUserName, dPersonID, flowsheets_reply_out, sVersion)   ;013    ;010
if(iRet = 0)  ;010
	call ErrorHandler2("VALIDATE", "F", "GET OBSERVATIONS", "Invalid User for Audit.",
	"1001", build("UserId is invalid: ", sUserName), flowsheets_reply_out) ;015
	go to EXIT_SCRIPT
endif
 
; Build component list if component ids exist
if(sComponents > " ")
	call BuildComponentList(null)
else
	;Validate CategoryId if provided
	if(dEventSetCd > 0)
		set iRet = GetCodeSet(dEventSetCd)
		if(iRet != 93)
			call ErrorHandler2("VALIDATE", "F", "GET OBSERVATIONS", "Invalid CategoryId.",
			"2026", build("Invalid CategoryId: ",dEventSetCd), flowsheets_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
endif
 
;Get flowsheet data
call GetFlowsheets(null)
 
;Post Amble
call PostAmble(null)
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(flowsheets_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_flowsheets.json")
	call echo(build2("_file : ", _file))
	call echojson(flowsheets_reply_out, _file, 0)
    call echorecord(flowsheets_reply_out)
	call echo(JSONout)
endif
 
#EXIT_VERSION
 
/*************************************************************************
;  Name: BuildComponentList(null)
;  Description: Builds component list based on category cd and/or component list
**************************************************************************/
subroutine BuildComponentList(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("BuildComponentList Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
 
	; Build component list based on component ids provided
	if(sComponents > " ")
		while (str != notfnd)
	     	set str =  piece(sComponents,',',num,notfnd)
	     	if(str != notfnd)
 
	     		set iRet = GetCodeSet(cnvtreal(str))
	     		if(iRet != 72)
	     			call ErrorHandler2("VALIDATE", "F", "GET OBSERVATIONS", "Invalid ComponentId.",
					"2018", build("Invalid ComponentId: ",str), flowsheets_reply_out)
					go to EXIT_SCRIPT
				else
	      			set stat = alterlist(components_req->event_cds, num)
	     			set components_req->event_cds[num]->event_cd = cnvtint(str)
	     		endif
	     	endif
	      	set num = num + 1
	 	endwhile
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("BuildComponentList Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetFlowsheets(null)
;  Description: Return All values for flowsheet items
**************************************************************************/
subroutine GetFlowsheets(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetFlowsheets Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare resultCnt 				= i4 with protect, noconstant (0)
	declare replyCnt 				= i4 with protect, noconstant (0)
	declare iResultCnt      		= i4 with protect, noconstant(0)
	set iApplication 				= 600005
	set iTask 						= 600107
	set iRequest 					= 1000001
 
	set iEventQueryInd = 1
	set 1000001_req->query_mode  				= 33793
	set 1000001_req->query_mode_ind 			= 0
	set 1000001_req->event_set_cd 				= dEventSetCd
	set 1000001_req->person_id 					= dPersonID
	set 1000001_req->order_id 					= 0
	set 1000001_req->encntr_id 					= dEncntrID
	set 1000001_req->encntr_financial_id 		= 0
	set 1000001_req->contributor_system_cd 		= 0
	set 1000001_req->accession_nbr 				= ""
	set 1000001_req->compress_flag 				= 1
	set 1000001_req->subtable_bit_map 			= 1
	set 1000001_req->subtable_bit_map_ind 		= 0
	set 1000001_req->small_subtable_bit_map 	= 1
	set 1000001_req->small_subtable_bit_map_ind = 0
	set 1000001_req->search_anchor_dt_tm_ind 	= 1
	set 1000001_req->direction_flag 			= 0
	set 1000001_req->events_to_fetch 			= iMaxRecs
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
	set 1000001_req->search_begin_dt_tm 		= cnvtdatetime(qFromDate)
	set 1000001_req->search_end_dt_tm 			= cnvtdatetime(qToDate)
	set 1000001_req->action_prsnl_group_id 		= 0
 
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",1000001_req,"REC",1000001_rep)
	if (1000001_rep->status_data->status = "F")
		call ErrorHandler2("EXECUTE", "F", "FLOWSHEETS", "Error retrieving observations",
		"9999", "Error retrieving observations 1000001", flowsheets_reply_out)
		go to EXIT_SCRIPT
	else
 		; Update Audit
 		if(size(1000001_rep->rb_list[1].event_list,5) > 0)
			call ErrorHandler("EXECUTE", "S", "GET OBSERVATIONS", "Successfully retrieved flowsheet items", flowsheets_reply_out )
		else
			call ErrorHandler("EXECUTE", "Z", "GET OBSERVATIONS", "No observations found.", flowsheets_reply_out )
			go to EXIT_SCRIPT
	 	endif
 	endif
 
 
	if(iDebugFlag > 0)
		call echo(concat("GetFlowsheets Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: PostAmble(null)
;  Description: Build final reply
**************************************************************************/
subroutine PostAmble(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostAmble Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;Component clause
	set cidx = 1
	declare sComponentStr = vc
	if(size(components_req->event_cds ,5) > 0)
		set sComponentStr = build2(" expand(cidx,1,size(components_req->event_cds ,5),",
		"1000001_rep->rb_list[1]->event_list[d.seq].event_cd,components_req->event_cds[cidx].event_cd)")
	else
		set sComponentStr = " 1000001_rep->rb_list[1]->event_list[d.seq].event_cd > 0"
	endif
 
 	;Encounter clause
 	declare sEncounterStr = vc
	if(dEncntrID > 0)
		set sEncounterStr = " 1000001_rep->rb_list[1].event_list[d.seq].encntr_id = dEncntrID"
	else
		set sEncounterStr = " 1000001_rep->rb_list[1].event_list[d.seq].encntr_id >= 0"
	endif
 
	;Update final reply
	set resSize = size(1000001_rep->rb_list[1]->event_list,5),
	select into "nl:"
	from (dummyt d with seq = resSize)
	where parser(sComponentStr) and parser(sEncounterStr)
	head report
		x = 0
	detail
		x = x + 1
		if(x <= iMaxRecs)
			stat = alterlist(flowsheets_reply_out->events,x)
			flowsheets_reply_out->events[x]->clinical_event_id 	=  1000001_rep->rb_list[1]->event_list[d.seq]->clinical_event_id
			flowsheets_reply_out->events[x]->order_id 			=  1000001_rep->rb_list[1]->event_list[d.seq]->order_id
			flowsheets_reply_out->events[x]->person_id 			=  1000001_rep->rb_list[1]->event_list[d.seq]->person_id
			flowsheets_reply_out->events[x]->result_id 			=  1000001_rep->rb_list[1]->event_list[d.seq]->event_id
			flowsheets_reply_out->events[x].parent_event_id          =  1000001_rep->rb_list[1]->event_list[d.seq].parent_event_id
			flowsheets_reply_out->events[x]->collating_seq		=  1000001_rep->rb_list[1]->event_list[d.seq]->clinical_seq
			flowsheets_reply_out->events[x]->result_date		=  1000001_rep->rb_list[1]->event_list[d.seq]->performed_dt_tm
			flowsheets_reply_out->events[x]->result_val			=  1000001_rep->rb_list[1]->event_list[d.seq]->result_val
			flowsheets_reply_out->events[x]->component_id     	=  1000001_rep->rb_list[1]->event_list[d.seq]->event_cd
			flowsheets_reply_out->events[x]->component_desc    	=  1000001_rep->rb_list[1]->event_list[d.seq]->event_cd_disp
			flowsheets_reply_out->events[x]->unit_disp			=  1000001_rep->rb_list[1]->event_list[d.seq]->result_units_cd_disp
			flowsheets_reply_out->events[x]->unit_cd			=  1000001_rep->rb_list[1]->event_list[d.seq]->result_units_cd
			flowsheets_reply_out->events[x]->clinsig_updt_dt_tm =  1000001_rep->rb_list[1]->event_list[d.seq]->clinsig_updt_dt_tm
			flowsheets_reply_out->events[x]->observed_dt_tm     =  1000001_rep->rb_list[1]->event_list[d.seq]->event_end_dt_tm  ;008
			flowsheets_reply_out->events[x]->result_status		=  1000001_rep->rb_list[1]->event_list[d.seq]->result_status_cd_disp
			flowsheets_reply_out->events[x]->result_status_cd	=  1000001_rep->rb_list[1]->event_list[d.seq]->result_status_cd
			flowsheets_reply_out->events[x]->normalcy_disp		=
				uar_get_code_meaning(1000001_rep->rb_list[1]->event_list[d.seq]->normalcy_cd) ;009
			flowsheets_reply_out->events[x]->normalcy_cd		=  1000001_rep->rb_list[1]->event_list[d.seq]->normalcy_cd
			flowsheets_reply_out->events[x]->normal_high		=  1000001_rep->rb_list[1]->event_list[d.seq]->normal_high
			flowsheets_reply_out->events[x]->normal_low			=  1000001_rep->rb_list[1]->event_list[d.seq]->normal_low
			flowsheets_reply_out->events[x]->event_tag			=  1000001_rep->rb_list[1]->event_list[d.seq]->event_tag
			flowsheets_reply_out->events[x]->event_class_cd		=  1000001_rep->rb_list[1]->event_list[d.seq]->event_class_cd
			flowsheets_reply_out->events[x]->event_class_disp	=
				uar_get_code_display(1000001_rep->rb_list[1]->event_list[d.seq]->event_class_cd)
			flowsheets_reply_out->events[x]->encntr_id			= 1000001_rep->rb_list[1]->event_list[d.seq]->encntr_id
 
			; Set observation group if it exists
			if(1000001_rep->rb_list[1]->event_list[d.seq].ce_dynamic_label_id > 0)
				flowsheets_reply_out->events[x].observation_group.id =
				1000001_rep->rb_list[1]->event_list[d.seq].dynamic_label_list[1].ce_dynamic_label_id
 
				flowsheets_reply_out->events[x].observation_group.name =
				1000001_rep->rb_list[1]->event_list[d.seq].dynamic_label_list[1].label_name
			endif
		endif
	with nocounter
 
	set frSize = size(flowsheets_reply_out->events,5)
	for (x = 1 to frSize)
		; Set Encounter/Patient Type/Class displays
		set flowsheets_reply_out->events[x]->encntr_type_cd		=
			GetPatientClass(flowsheets_reply_out->events[x]->encntr_id,1)				;011
		set flowsheets_reply_out->events[x]->encntr_type_disp	=
			uar_get_code_display(flowsheets_reply_out->events[x]->encntr_type_cd)		;011
		set flowsheets_reply_out->events[x]->encntr_type_class_cd	=
			GetPatientClass(flowsheets_reply_out->events[x]->encntr_id, 2)				;012
		set flowsheets_reply_out->events[x]->encntr_type_class_disp	=
			uar_get_code_display(flowsheets_reply_out->events[x]->encntr_type_class_cd)	;012
 	endfor
 
 	;getting the date result
	select into "nl:"
	from ce_date_result cdr
		 ,(dummyt d with seq = size(flowsheets_reply_out->events,5))
	plan d
		where flowsheets_reply_out->events[d.seq].result_id > 0
	join cdr
			where cdr.event_id = flowsheets_reply_out->events[d.seq].result_id
				and cdr.valid_from_dt_tm <= cnvtdatetime(curdate,curtime3)
				and cdr.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
	head d.seq
		flowsheets_reply_out->events[d.seq].result_dt_tm = cdr.result_dt_tm
	with nocounter
 
 
 	;getting the task object
	select into "nl:"
	from (dummyt d with seq = size(flowsheets_reply_out->events,5))
     	 ,task_activity ta
	plan d
		where flowsheets_reply_out->events[d.seq].parent_event_id > 0
	join ta
		where ta.event_id = flowsheets_reply_out->events[d.seq].parent_event_id
	head d.seq
		x = 0
		detail
			x = x + 1
			stat = alterlist(flowsheets_reply_out->events[d.seq].tasks,x)
			flowsheets_reply_out->events[d.seq].tasks[x].task_id= ta.task_id
			flowsheets_reply_out->events[d.seq].tasks[x].task_class.id = ta.task_class_cd
			flowsheets_reply_out->events[d.seq].tasks[x].task_class.name = trim(uar_get_code_display(ta.task_class_cd))
			flowsheets_reply_out->events[d.seq].tasks[x].task_type.id = ta.task_type_cd
			flowsheets_reply_out->events[d.seq].tasks[x].task_type.name = trim(uar_get_code_display(ta.task_type_cd))
			flowsheets_reply_out->events[d.seq].tasks[x].task_status.id = ta.task_status_cd
			flowsheets_reply_out->events[d.seq].tasks[x].task_status.name = trim(uar_get_code_display(ta.task_status_cd))
	with nocounter
 
	;getting the documented by
	select into "nl:"
	from (dummyt d with seq = size(flowsheets_reply_out->events,5))
	     ,ce_event_prsnl cep
	     ,prsnl p
	plan d
		where flowsheets_reply_out->events[d.seq].result_id > 0
	join cep
		where cep.event_id = flowsheets_reply_out->events[d.seq].result_id
		and cep.valid_until_dt_tm > cnvtdatetime(curdate, curtime3)
	join p
		where p.person_id = cep.action_prsnl_id
	order by d.seq, cep.ce_event_prsnl_id
	head d.seq
		x = 0
		head cep.ce_event_prsnl_id
			x = x + 1
			stat = alterlist(flowsheets_reply_out->events[d.seq].documented_by,x)
			flowsheets_reply_out->events[d.seq].documented_by[x].action.id = cep.action_type_cd
			flowsheets_reply_out->events[d.seq].documented_by[x].action.name = uar_get_code_display(cep.action_type_cd)
			flowsheets_reply_out->events[d.seq].documented_by[x].provider.provider_id = p.person_id
			flowsheets_reply_out->events[d.seq].documented_by[x].provider.provider_name = p.name_full_formatted
	with nocounter
 
 
	;BEG 024
	;getting coded results
	select into "nl:"
	from (dummyt d with seq = size(flowsheets_reply_out->events,5))
	     ,ce_coded_result cer
	     ,nomenclature n
 
	plan d
		where flowsheets_reply_out->events[d.seq].result_id > 0
	join cer
		where cer.event_id = flowsheets_reply_out->events[d.seq].result_id
		   and cer.valid_from_dt_tm <= cnvtdatetime(curdate,curtime3)
				and cer.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
	join n
	where n.nomenclature_id = cer.nomenclature_id
	     and n.active_ind = 1
 
	order by d.seq
	head d.seq
	  x = 0
	 detail
	    x = x + 1
	    stat = alterlist(flowsheets_reply_out->events[d.seq].coded_results,x)
	    flowsheets_reply_out->events[d.seq].coded_results[x].id = n.nomenclature_id
		flowsheets_reply_out->events[d.seq].coded_results[x].name = trim(n.source_string)
 
	with nocounter
    ;END 024
 
;017 getting long blob if it exists
 	set idx = 1
	declare blob = c32768
 
	declare size_blob = i4
	set size_blob = 32768
 
	select into "nl:"
	d.seq
	from (dummyt d with seq = size(flowsheets_reply_out->events,5))
	 ,ce_blob_result cbr
	 ,ce_blob cb
	plan d
		where flowsheets_reply_out->events[d.seq].result_id > 0
	join cbr
		where cbr.event_id = flowsheets_reply_out->events[d.seq].result_id
		and cbr.valid_until_dt_tm > cnvtdatetime(curdate, curtime3)
	join cb
		where cb.event_id =  cbr.event_id
			and cb.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
	order by d.seq, cb.event_id, cb.blob_seq_num
	head report
		next = 0
		head cb.event_id
			x = 0
			next = next + 1
			head cb.blob_seq_num
				x = x + 1
				stat = alterlist(flowsheets_reply_out->events[d.seq].result_val_long_text,x)
				flowsheets_reply_out->events[d.seq].result_val_long_text[x].format.id = cbr.format_cd
				flowsheets_reply_out->events[d.seq].result_val_long_text[x].format.name = uar_get_code_display(cbr.format_cd)
				flowsheets_reply_out->events[d.seq].result_val_long_text[x].note_date_time = cb.valid_from_dt_tm
				;;todo is find the provider
 
				blob = " ";resets the string
				if(cb.compression_cd = c_noocfcomp_cd)
					blob = substring(1,findstring("ocf_blob",cb.blob_contents,1)-1,cb.blob_contents)
				elseif(cb.compression_cd = c_ocfcomp_cd)
					stat = uar_ocf_uncompress(cb.blob_contents, cb.blob_length, blob, size_blob, 32768)
				endif
				flowsheets_reply_out->events[d.seq].result_val_long_text[x].comments = trim(blob)
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
		where expand(idx,1,size(flowsheets_reply_out->events,5),cbr.event_id
								, flowsheets_reply_out->events[idx].result_id)
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
			pos = locateval(idx,1,size(flowsheets_reply_out->events,5),cbr.event_id
								, flowsheets_reply_out->events[idx].result_id)
			head cb.long_blob_id
				x = x + 1
				stat = alterlist(flowsheets_reply_out->events [pos].observation_comment,x)
				flowsheets_reply_out->events[pos].observation_comment[x].format.id = cbr.note_format_cd
				flowsheets_reply_out->events[pos].observation_comment[x].format.name
																			 = uar_get_code_display(cbr.note_format_cd)
				flowsheets_reply_out->events[pos].observation_comment[x].note_date_time = cb.active_status_dt_tm
				flowsheets_reply_out->events[pos].observation_comment[x].provider .provider_id  = pr.person_id
				flowsheets_reply_out->events[pos].observation_comment[x].provider .provider_name = pr.
				name_full_formatted
 
				blob = " ";resets the string
				if(cbr.compression_cd  = c_noocfcomp_cd)
					blob = substring(1,findstring("ocf_blob",cb.long_blob ,1)-1,cb.long_blob)
 
				elseif(cbr.compression_cd = c_ocfcomp_cd)
 
					stat = uar_ocf_uncompress(cb.long_blob, size(cb.long_blob), blob, size_blob, 32768)
 
				endif
			flowsheets_reply_out->events[pos].observation_comment[x].comments = trim(blob)
 	with nocounter
;end of 018
 
   ;begin 019
   set queryStartTm = cnvtdatetime(curdate, curtime3)
   set idx = 0
   select into "nl:"
   from  ce_string_result cer
   plan cer
			where expand(idx,1,size(flowsheets_reply_out->events,5),cer.event_id
						,flowsheets_reply_out->events[idx].result_id)
			and cer.valid_until_dt_tm > cnvtdatetime(curdate, curtime3)
	order by cer.event_id
	detail
		next = 1
		pos = locateval(idx,next,size(flowsheets_reply_out->events,5),cer.event_id,
       		  flowsheets_reply_out->events[idx].result_id)
		x = size(flowsheets_reply_out->events[pos]->result_val_long_text,5)+1
			while(pos > 0 and next <= size(flowsheets_reply_out->events,5))
				stat = alterlist(flowsheets_reply_out->events[pos].result_val_long_text,x)
				flowsheets_reply_out->events[pos].result_val_long_text [x].comments  = trim(cer.string_result_text)
				flowsheets_reply_out->events[pos].result_val_long_text[x].format.id = cer.string_result_format_cd
				flowsheets_reply_out->events[pos].result_val_long_text[x].format.name
																			 = uar_get_code_display(cer.string_result_format_cd)
				flowsheets_reply_out->events[pos].result_val_long_text[x].note_date_time = cer.valid_from_dt_tm
				next = pos + 1
				pos = locateval(idx,next,size(flowsheets_reply_out->events,5),cer.event_id,
				flowsheets_reply_out->events[idx].result_id)
			endwhile
	with nocounter
	;end 019
 
	if(iDebugFlag > 0)
		call echo(concat("PostAmble Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
end go
 