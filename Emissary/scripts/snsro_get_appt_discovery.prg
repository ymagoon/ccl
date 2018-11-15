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
  ~BE~*************************************************************************
          Date Written:       08/28/18
          Source file name:   snsro_get_appt_discovery.prg
          Object name:        snsro_get_appt_discovery
          Program purpose:    Provides a list of appointment types and associated details
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 ***********************************************************************
                   GENERATED MODIFICATION CONTROL LOG
 ***********************************************************************
 Mod Date        Engineer     Comment
 ---   --------    ----------------------------------------------------
 000 08/28/18 RJC			Initial Write
 ***********************************************************************/
drop program snsro_get_appt_discovery go
create program snsro_get_appt_discovery
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "UserName" = ""        	;Optional
		, "ResourceId" = ""			;Optional
		, "LocationId" = ""			;Optional
		, "SearchString" = ""		;Optional
		, "Debug Flag" = 0			;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV,USERNAME,RESOURCE,LOCATION,SEARCH,DEBUG_FLAG
 
/*************************************************************************
;VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
;650613 - sch_get_appt_type_by_id
free record 650613_req
record 650613_req (
  1 qual [*]
    2 appt_type_cd = f8
)
 
free record 650613_rep
record 650613_rep (
  1 qual_cnt = i4
  1 catalog_type_cd = f8
  1 catalog_type_meaning = vc
  1 mnemonic_type_cd = f8
  1 mnemonic_type_meaning = vc
  1 qual [*]
    2 appt_type_cd = f8
    2 appt_type_flag = i2
    2 desc = vc
    2 oe_format_id = f8
    2 info_sch_text_id = f8
    2 info_sch_text = vc
    2 info_sch_text_updt_cnt = i4
    2 recur_cd = f8
    2 recur_meaning = vc
    2 person_accept_cd = f8
    2 person_accept_meaning = vc
    2 grp_resource_cd = f8
    2 grp_resource_mnem = vc
    2 updt_cnt = i4
    2 active_ind = i2
    2 candidate_id = f8
    2 object_cnt = i4
    2 object [*]
      3 assoc_type_cd = f8
      3 sch_object_id = f8
      3 object_mnemonic = vc
      3 assoc_type_meanin = vc
      3 assoc_type_disp = vc
      3 seq_nbr = i4
      3 candidate_id = f8
      3 active_ind = i2
      3 updt_cnt = i4
    2 routing_cnt = i4
    2 routing [*]
      3 object_mnemonic = vc
      3 location_cd = f8
      3 location_meaning = vc
      3 location_disp = vc
      3 sch_action_cd = f8
      3 sch_action_disp = vc
      3 seq_nbr = i4
      3 action_meaning = vc
      3 beg_units = i4
      3 beg_units_cd = f8
      3 beg_units_meaning = vc
      3 beg_units_disp = vc
      3 end_units = i4
      3 end_units_cd = f8
      3 end_units_meaning = vc
      3 end_units_disp = vc
      3 routing_table = vc
      3 routing_id = f8
      3 routing_meaning = vc
      3 candidate_id = f8
      3 active_ind = i2
      3 updt_cnt = i4
      3 sch_flex_id = f8
    2 catalog_qual_cnt = i4
    2 catalog_qual [*]
      3 child_cd = f8
      3 child_meaning = vc
      3 child_disp = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
    2 mnemonic_qual_cnt = i4
    2 mnemonic_qual [*]
      3 child_cd = f8
      3 child_meaning = vc
      3 child_disp = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
    2 syn_cnt = i4
    2 syn [*]
      3 appt_synonym_cd = f8
      3 mnem = vc
      3 allow_selection_flag = i2
      3 info_sch_text_id = f8
      3 info_sch_text = vc
      3 info_sch_text_updt_cnt = i4
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
      3 primary_ind = i2
      3 order_sentence_id = f8
    2 states_cnt = i4
    2 states [*]
      3 sch_state_cd = f8
      3 disp_scheme_id = f8
      3 state_meaning = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
    2 locs_cnt = i4
    2 locs [*]
      3 location_cd = f8
      3 location_disp = vc
      3 location_desc = vc
      3 location_mean = vc
      3 sch_flex_id = f8
      3 res_list_id = f8
      3 res_list_mnem = vc
      3 grp_res_list_id = f8
      3 grp_res_list_mnem = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
    2 option_cnt = i4
    2 option [*]
      3 sch_option_cd = f8
      3 option_disp = vc
      3 option_mean = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
    2 product_cnt = i4
    2 product [*]
      3 product_cd = f8
      3 product_disp = vc
      3 product_mean = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
    2 text_cnt = i4
    2 text [*]
      3 text_link_id = f8
      3 location_cd = f8
      3 location_meaning = vc
      3 location_display = vc
      3 text_type_cd = f8
      3 text_type_meaning = vc
      3 sub_text_cd = f8
      3 sub_text_meaning = vc
      3 text_accept_cd = f8
      3 text_accept_meaning = vc
      3 template_accept_cd = f8
      3 template_accept_meaning = vc
      3 sch_action_cd = f8
      3 action_meaning = vc
      3 expertise_level = i4
      3 lapse_units = i4
      3 lapse_units_cd = f8
      3 lapse_units_meaning = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
      3 sub_list_cnt = i4
      3 sub_list [*]
        4 template_id = f8
        4 seq_nbr = i4
        4 mnem = vc
        4 required_ind = i2
        4 updt_cnt = i4
        4 active_ind = i2
        4 candidate_id = f8
        4 sch_flex_id = f8
        4 temp_flex_cnt = i4
        4 temp_flex [*]
          5 parent2_table = vc
          5 parent2_id = f8
          5 flex_seq_nbr = i4
          5 updt_cnt = i4
          5 active_ind = i2
          5 candidate_id = f8
          5 mnemonic = vc
    2 order_cnt = i4
    2 orders [*]
      3 required_ind = i2
      3 seq_nbr = i4
      3 synonym_id = f8
      3 alt_sel_category_id = f8
      3 mnemonic = vc
      3 catalog_cd = f8
      3 catalog_type_cd = f8
      3 activity_type_cd = f8
      3 mnemonic_type_cd = f8
      3 oe_format_id = f8
      3 order_sentence_id = f8
      3 orderable_type_flag = i2
      3 ref_text_mask = i4
      3 hide_flag = i2
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
    2 comp_cnt = i4
    2 comp [*]
      3 appt_type_cd = f8
      3 location_cd = f8
      3 location_disp = vc
      3 location_meaning = vc
      3 seq_nbr = i4
      3 comp_appt_synonym = vc
      3 comp_appt_synonym_cd = f8
      3 comp_appt_type_cd = f8
      3 offset_from_cd = f8
      3 offset_from_meaning = vc
      3 offset_type_cd = f8
      3 offset_type_meaning = vc
      3 offset_seq_nbr = i4
      3 offset_beg_units = i4
      3 offset_beg_units_cd = f8
      3 offset_beg_units_meaning = vc
      3 offset_end_units = i4
      3 offset_end_units_cd = f8
      3 offset_end_units_meaning = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
      3 comp_loc_cnt = i4
      3 comp_loc [*]
        4 comp_location_cd = f8
        4 comp_location_disp = vc
        4 comp_location_desc = vc
        4 comp_location_mean = vc
        4 updt_cnt = i4
        4 active_ind = i2
        4 candidate_id = f8
    2 inter_cnt = i4
    2 inter [*]
      3 location_cd = f8
      3 inter_type_cd = f8
      3 inter_type_meaning = vc
      3 seq_group_id = f8
      3 mnemonic = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
    2 dup_cnt = i4
    2 dup [*]
      3 dup_type_cd = f8
      3 dup_disp = vc
      3 dup_mean = vc
      3 location_cd = f8
      3 location_disp = vc
      3 location_mean = vc
      3 seq_nbr = i4
      3 beg_units = i4
      3 beg_units_cd = f8
      3 beg_units_meaning = vc
      3 beg_units_disp = vc
      3 end_units = i4
      3 end_units_cd = f8
      3 end_units_meaning = vc
      3 end_units_disp = vc
      3 dup_action_cd = f8
      3 dup_action_meaning = vc
      3 holiday_weekend_flag = i2
      3 updt_cnt = i4
      3 candidate_id = f8
      3 active_ind = i2
    2 nomen_cnt = i4
    2 nomen [*]
      3 appt_nomen_cd = f8
      3 appt_nomen_disp = vc
      3 appt_nomen_mean = vc
      3 updt_cnt = i4
      3 candidate_id = f8
      3 active_ind = i2
      3 nomen_list_cnt = i4
      3 nomen_list [*]
        4 seq_nbr = i4
        4 beg_nomenclature_id = f8
        4 end_nomenclature_id = f8
        4 source_string = vc
        4 updt_cnt = i4
        4 candidate_id = f8
        4 active_ind = i2
    2 notify_cnt = i4
    2 notify [*]
      3 location_cd = f8
      3 sch_flex_id = f8
      3 location_disp = vc
      3 sch_action_cd = f8
      3 action_mean = vc
      3 seq_nbr = i4
      3 beg_units = i4
      3 beg_units_cd = f8
      3 beg_units_meaning = vc
      3 end_units = i4
      3 end_units_cd = f8
      3 end_units_meaning = vc
      3 sch_route_id = f8
      3 route_mnemonic = vc
      3 updt_cnt = i4
      3 candidate_id = f8
      3 active_ind = i2
    2 appt_action_cnt = i4
    2 appt_action [*]
      3 location_cd = f8
      3 location_disp = vc
      3 location_mean = vc
      3 sch_action_cd = f8
      3 sch_action_disp = vc
      3 sch_action_mean = vc
      3 seq_nbr = i4
      3 child_appt_syn_cd = f8
      3 child_appt_syn_disp = vc
      3 child_appt_syn_mean = vc
      3 sch_flex_id = f8
      3 candidate_id = f8
      3 active_ind = i2
      3 updt_cnt = i4
      3 offset_beg_units = i4
      3 offset_beg_units_cd = f8
      3 offset_beg_units_disp = vc
      3 offset_beg_units_mean = vc
      3 offset_end_units = i4
      3 offset_end_units_cd = f8
      3 offset_end_units_disp = vc
      3 offset_end_units_mean = vc
    2 grp_prompt_cd = f8
    2 grp_prompt_meaning = vc
    2 rel_appt_syn_qual_cnt = i4
    2 rel_appt_syn_qual [*]
      3 appt_synonym_cd = f8
      3 mnem = vc
      3 allow_selection_flag = i2
      3 info_sch_text_id = f8
      3 info_sch_text = vc
      3 info_sch_text_updt_cnt = i4
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
      3 primary_ind = i2
      3 order_sentence_id = f8
      3 sch_appt_type_syn_r_id = f8
      3 appt_type_cd = f8
      3 rel_syn_type_cd = f8
      3 default_ind = i2
    2 rel_med_svc_cnt = i4
    2 rel_med_svc_qual [*]
      3 med_service_id = f8
      3 med_service_cd = f8
      3 med_service_disp = vc
      3 med_service_mean = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
      3 sch_action_cd = f8
    2 rel_enc_type_cnt = i4
    2 rel_enc_type_qual [*]
      3 encntr_type_id = f8
      3 encntr_type_cd = f8
      3 encntr_type_disp = vc
      3 encntr_type_mean = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
      3 sch_action_cd = f8
      3 seq_nbr = i4
    2 rel_specialty_cnt = i4
    2 rel_specialty_qual [*]
      3 sch_at_specialty_r_id = f8
      3 specialty_cd = f8
      3 specialty_disp = vc
      3 specialty_mean = vc
      3 updt_cnt = i4
      3 active_ind = i2
      3 candidate_id = f8
    2 priority_seq = i4
  1 status_data
    2 status = c1
    2 subeventstatus [*]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
)
 
free record appt_discovery_reply_out
record appt_discovery_reply_out (
	1 qual[*]
		2 appointment_type
			3 id = f8
			3 name = vc
		2 appt_details
			3 id = f8
			3 name = vc
		2 synonyms[*]
				4 id = f8
				4 name = vc
		2 resource_roles[*]
			3 role
				4 id = f8
				4 name = vc
			3 duration
				4 time = i4
				4 units
					5 id = f8
					5 name = vc
			3 location_resources
				4 location
					5 id = f8
					5 name = vc
				4 resources[*]
					5 resource_id = f8
					5 resource_name = vc
		2 attributes[*]
			3 id = f8
			3 name = vc
	1 audit
		2 user_id					= f8
		2 user_firstname			= vc
		2 user_lastname				= vc
		2 patient_id				= f8
		2 patient_firstname			= vc
		2 patient_lastname			= vc
		2 service_version			= vc
	1 status_data
		2 status = c1
		2 subeventstatus[1]
			3 OperationName = c25
			3 OperationStatus = c1
			3 TargetObjectName = c25
			3 TargetObjectValue = vc
			3 Code = c4
			3 Description = vc
)
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
; Input
declare sUserName						= vc with protect, noconstant("")
declare dResourceCd						= f8 with protect, noconstant(0.0)
declare dLocationCd						= f8 with protect, noconstant(0.0)
declare sSearchString					= vc with protect, noconstant("")
declare iDebugFlag						= i2 with protect, noconstant(0)
 
; Constants
declare c_error_handler_name 			= vc with protect, constant("APPT_DISCOVERY")
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
; Input
set sUserName							= trim($USERNAME, 3)
set dResourceCd							= cnvtreal($RESOURCE)
set dLocationCd							= cnvtreal($LOCATION)
set sSearchString						= trim(concat("*",cnvtupper($SEARCH),"*"),3)
set iDebugFlag							= cnvtint($DEBUG_FLAG)
 
if(iDebugFlag > 0)
	call echo(build("sUserName  	->", sUserName))
	call echo(build("dResourceCd  	->", dResourceCd))
	call echo(build("dLocationCd  	->", dLocationCd))
	call echo(build("sSearchString  ->", sSearchString))
	call echo(build("iDebugFlag  	->", iDebugFlag))
endif
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetAppointmentTypes(null)		= null with protect
declare GetAppointmentTypeDetails(null)	= null with protect ;650613 - sch_get_appt_type_by_id
 
/*************************************************************************
; MAIN
**************************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, appt_discovery_reply_out, sVersion)
if(iRet = 0)
 	call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid User for Audit.",
	"1001",build("Invlid user: ",sUserName), appt_discovery_reply_out)
 	go to exit_script
endif
 
; Validate ResourceId if provided
if(dResourceCd > 0)
	set iRet = GetCodeSet(dResourceCd)
	if(iRet != 14231)
		call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid ResourceId.",
		"9999",build("Invalid ResourceId: ",dResourceCd), appt_discovery_reply_out)
 		go to exit_script
	endif
endif
 
; Validate LocationId if provided
if(dLocationCd > 0)
	set iRet = GetCodeSet(dLocationCd)
	if(iRet != 220)
		call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid LocationId.",
		"2040",build("Invalid LocationId: ",dLocationCd), appt_discovery_reply_out)
 		go to exit_script
	endif
endif
 
; Get Appointment Types
call GetAppointmentTypes(null)
 
; Get Appointment Type Details
call GetAppointmentTypeDetails(null)
 
; Post Amble
call PostAmble(null)
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
#EXIT_SCRIPT
 
set JSONout = CNVTRECTOJSON(appt_discovery_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)  																;008
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_appt_type_discovery.json")
	call echo(build2("_file : ", _file))
	call echorecord(appt_discovery_reply_out)
	call echojson(appt_discovery_reply_out, _file, 0)
endif
 
#EXIT_VERSION
 
/*************************************************************************
;  Name: GetAppointmentTypes(null)
;  Description: Get Appointment Type List
**************************************************************************/
subroutine GetAppointmentTypes(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAppointmentTypes  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	;Set Resource clause
 	declare resource_clause = vc
 	if(dResourceCd > 0)
 		set resource_clause = " slr.resource_cd = dResourceCd"
 	else
 		set resource_clause = " slr.resource_cd >= 0.0"
 	endif
 
 	;Set location clause
 	declare location_clause = vc
 	if(dLocationCd > 0)
 		set location_clause = " sal.location_cd = dLocationCd"
 	else
 		set location_clause = " sal.location_cd >= 0.0"
 	endif
 
 	; Get appointment type list
 	select into "nl:"
	from sch_appt_type sat
	, sch_appt_syn sas
	, sch_appt_loc sal
	, sch_list_role slro
	, sch_list_res slr
	, sch_resource sr
	plan sat where sat.active_ind = 1
		and sat.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and sat.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and sat.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
	join sas where sas.appt_type_cd = sat.appt_type_cd
		and sas.mnemonic_key = patstring(sSearchString)
		and sas.active_ind = 1
		and sas.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and sas.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and sas.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
	join sal where sal.appt_type_cd = sas.appt_type_cd
		and parser(location_clause)
		and sal.active_ind = 1
		and sal.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and sal.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
	join slro where slro.res_list_id = sal.res_list_id
		and slro.active_ind = 1
		and slro.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and slro.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
	join slr where slr.list_role_id = slro.list_role_id
		and parser(resource_clause)
		and slr.active_ind = 1
		and slr.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
		and slr.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
	join sr where sr.resource_cd = slr.resource_cd
		and sr.active_ind = 1
		and sr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and sr.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
	order by sat.appt_type_cd
	head report
		x = 0
	head sat.appt_type_cd
		x = x + 1
		stat = alterlist(appt_discovery_reply_out->qual,x)
 
		appt_discovery_reply_out->qual[x].appointment_type.id = sat.appt_type_cd
		appt_discovery_reply_out->qual[x].appointment_type.name = uar_get_code_display(sat.appt_type_cd)
	with nocounter
 
	if(curqual > 0)
		call ErrorHandler2(c_error_handler_name, "S", "Success", "Appointment type discovery completed successfully.",
		"0000","Appointment type discovery completed successfully.", appt_discovery_reply_out)
	else
		call ErrorHandler2(c_error_handler_name, "Z", "Success", "Zero records found.",
		"0000","Zero records found.", appt_discovery_reply_out)
		go to exit_script
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetAppointmentTypes Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetAppointmentTypeDetails(null)
;  Description: Get details by the appointment type code - 650613 - sch_get_appt_type_by_id
**************************************************************************/
subroutine GetAppointmentTypeDetails(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAppointmentTypeDetails  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 650001
	set iTask = 650001
	set iRequest = 650613
 
	;Setup request
	set stat = alterlist(650613_req->qual,size(appt_discovery_reply_out->qual,5))
	for(i = 1 to size(appt_discovery_reply_out->qual,5))
		set 650613_req->qual[i].appt_type_cd = appt_discovery_reply_out->qual[i].appointment_type.id
	endfor
 
	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",650613_req,"REC",650613_rep)
 
	if(650613_rep->status_data.status = "F")
		call ErrorHandler2(c_error_handler_name, "F", "Execute", "Could not retrieve AppointmentTypeId details (650613).",
		"9999","Could not retrieve AppointmentTypeId details (650613).", appt_discovery_reply_out)
		go to exit_script
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetAppointmentTypeDetails Runtime: ",
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
		call echo(concat("PostAmble  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set stat = alterlist(appt_discovery_reply_out->qual,650613_rep->qual_cnt)
	for(i = 1 to 650613_rep->qual_cnt)
		set appt_discovery_reply_out->qual[i].appointment_type.id = 650613_rep->qual[i].appt_type_cd
		set appt_discovery_reply_out->qual[i].appointment_type.name = uar_get_code_display(650613_rep->qual[i].appt_type_cd)
 
		;Appt Details
 		select into "nl:"
 		from order_entry_format oef
 		where oef.oe_format_id = 650613_rep->qual[i].oe_format_id
 		detail
 			appt_discovery_reply_out->qual[i].appt_details.id = oef.oe_format_id
 			appt_discovery_reply_out->qual[i].appt_details.name = oef.oe_format_name
 		with nocounter
 
		;Synonyms
		if(650613_rep->qual[i].syn_cnt > 0)
			set stat = alterlist(appt_discovery_reply_out->qual[i].synonyms,650613_rep->qual[i].syn_cnt)
			for(x = 1 to 650613_rep->qual[i].syn_cnt)
				set appt_discovery_reply_out->qual[i].synonyms[x].id = 650613_rep->qual[i].syn[x].appt_synonym_cd
				set appt_discovery_reply_out->qual[i].synonyms[x].name =
					uar_get_code_display(650613_rep->qual[i].syn[x].appt_synonym_cd)
			endfor
		endif
 
		;Locations
		if(650613_rep->qual[i].locs_cnt > 0)
			for(x = 1 to 650613_rep->qual[i].locs_cnt)
 
				;Resources
				select distinct into "nl:"
				 slro.list_role_id
				 , sr.resource_cd
				from sch_list_role slro
				, sch_list_res slr
				, sch_resource sr
				, sch_list_slot sls
				plan slro where slro.res_list_id = 650613_rep->qual[i].locs[x].res_list_id
					and (slro.role_meaning != "PATIENT" or slro.role_meaning is null)
					and slro.sch_role_cd > 0
					and slro.res_list_id > 0
					and slro.active_ind = 1
					and slro.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
					and slro.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
				join slr where slr.list_role_id = slro.list_role_id
					and slr.active_ind = 1
					and slr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
					and slr.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
				join sr where sr.resource_cd = slr.resource_cd
					and sr.active_ind = 1
					and sr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
					and sr.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
				join sls where outerjoin(sls.list_role_id) = slro.list_role_id
					and sls.active_ind = 1
					and sls.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
					and sls.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
				order by slro.list_role_id
				head report
					y = size(appt_discovery_reply_out->qual[i].resource_roles,5)
				head slro.list_role_id
					z = 0
					y = y + 1
					stat = alterlist(appt_discovery_reply_out->qual[i].resource_roles,y)
 
					appt_discovery_reply_out->qual[i].resource_roles[y].location_resources.location.id =
						650613_rep->qual[i].locs[x].location_cd
					appt_discovery_reply_out->qual[i].resource_roles[y].location_resources.location.name =
						650613_rep->qual[i].locs[x].location_disp
 
					appt_discovery_reply_out->qual[i].resource_roles[y].role.id = slro.list_role_id
					appt_discovery_reply_out->qual[i].resource_roles[y].role.name = slro.description
					appt_discovery_reply_out->qual[i].resource_roles[y].duration.time = sls.duration_units
					appt_discovery_reply_out->qual[i].resource_roles[y].duration.units.id = sls.duration_units_cd
					appt_discovery_reply_out->qual[i].resource_roles[y].duration.units.name = uar_get_code_display(sls.duration_units_cd)
				head sr.resource_cd
					z = z + 1
 					stat = alterlist(appt_discovery_reply_out->qual[i].resource_roles[y].location_resources.resources,z)
 
					appt_discovery_reply_out->qual[i].resource_roles[y].location_resources.resources[z].resource_id = sr.resource_cd
					appt_discovery_reply_out->qual[i].resource_roles[y].location_resources.resources[z].resource_name = sr.description
				with nocounter
			endfor
		endif
 
		;Options
		if(650613_rep->qual[i].option_cnt > 0)
			set stat = alterlist(appt_discovery_reply_out->qual[i].attributes,650613_rep->qual[i].option_cnt)
			for(x = 1 to 650613_rep->qual[i].option_cnt)
				set appt_discovery_reply_out->qual[i].attributes[x].id = 650613_rep->qual[i].option[x].sch_option_cd
				set appt_discovery_reply_out->qual[i].attributes[x].name = 650613_rep->qual[i].option[x].option_disp
			endfor
		endif
	endfor
 
	if(iDebugFlag > 0)
		call echo(concat("PostAmble Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
end go
set trace notranslatelock go
 
 
 
 
