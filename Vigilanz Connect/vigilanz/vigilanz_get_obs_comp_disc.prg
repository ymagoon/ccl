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
          Date Written:       01/04/19
          Source file name:   snsro_get_obs_comp_disc.prg
          Object name:        vigilanz_get_obs_comp_disc
          Program purpose:    Provides details of observation component
          Executing from:     Emissary mPages Web Service
 ***********************************************************************
                   GENERATED MODIFICATION CONTROL LOG
 ***********************************************************************
 Mod Date		Engineer	Comment
 -----------------------------------------------------------------------
 000 01/04/19 	RJC			Initial Write
 001 09/09/19   RJC         Renamed file and object
 002 12/12/19   DSH     Added the equations to the reply with an additional
                        DTA lookup for each equation component.
 ***********************************************************************/
;drop program snsro_get_obs_comp_discovery go
drop program vigilanz_get_obs_comp_disc go
create program vigilanz_get_obs_comp_disc
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "UserName" = ""        	;Optional
		, "ComponentList" = ""		;Required
		, "Debug Flag" = 0			;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV,USERNAME,COMPLIST,DEBUG_FLAG
 
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
;600484 - wv_get_template_labels
free record 600484_req
record 600484_req (
  1 event_cd_list [*]
    2 event_cd = f8
)
 
free record 600484_rep
record 600484_rep (
   1 dtas [* ]
     2 task_assay_cd = f8
     2 template_label_id = f8
     2 event_cd = f8
     2 description = vc
     2 equation_ind = i2
     2 io_total_id = f8
     2 conditional_ind = i2
     2 trigger_ind = i2
     2 ref_range [* ]
       3 species_cd = f8
       3 sex_cd = f8
       3 age_from_minutes = i4
       3 age_to_minutes = i4
       3 service_resource_cd = f8
       3 encntr_type_cd = f8
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
       3 minutes_back = i4
       3 age_from = i4
       3 age_to = i4
       3 age_from_units_cd = f8
       3 age_to_units_cd = f8
       3 age_from_units_meaning = vc
       3 age_to_units_meaning = vc
     2 default_result_type_cd = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
 )
 
;600356 - dcp_get_dta_info_all
free record 600356_req
record 600356_req (
  1 dta [*]
    2 task_assay_cd = f8
)
 
free record additional_dta_info
record additional_dta_info (
  1 dta_count = i4
  1 dtas[*]
    2 task_assay_cd = f8
    2 description = vc
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
          4 included_assay_description = vc
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
 
; Final reply out
free record final_reply_out
record final_reply_out (
	1 components[*]
		2 component_id 			= f8
		2 component_name 		= vc
		2 is_multi_response 	= i2
		2 type 					= vc
		2 reference_ranges[*]
			3 age_from
				4 code			= f8
				4 description 	= vc
				4 value			= i4
			3 age_to
				4 code			= f8
				4 description 	= vc
				4 value			= i4
			3 gender
				4 id			= f8
				4 name			= vc
			3 critical_high 	= f8
			3 critical_low		= f8
			3 normal_high		= f8
			3 normal_low		= f8
			3 feasible_high		= f8
			3 feasible_low		= f8
			3 value_codes[*]
				4 id 			= f8
				4 name 			= vc
    2 equation_count = i4
    2 equations[*]
      3 equation_id = f8
      3 equation_description = vc
      3 equation_postfix = vc
      3 equation_component_count = i4
      3 equation_components[*]
        4 component_id = f8
        4 component_name = vc
        4 equation_component_name = vc
        4 equation_component_sequence = f8
	1 audit
		2 user_id				= f8
		2 user_firstname		= vc
		2 user_lastname			= vc
		2 patient_id			= f8
		2 patient_firstname		= vc
		2 patient_lastname		= vc
	    2 service_version		= vc
	    2 query_execute_time	= vc
	    2 query_execute_units	= vc
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
 
; Component list
free record complist
record complist (
	1 list[*]
		2 id = f8
)
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare sUserName					= vc with protect, noconstant("")
declare sComponentList				= vc with protect, noconstant("")
declare iDebugFlag					= i2 with protect, noconstant(0)
 
; Constants
declare c_error_handler_name 		= vc with protect, constant("OBS_COMPONENT_DISCOVERY")
 
; Program variables
declare iSuccessful = i2 with protect, noconstant(1)
declare iPosition = i4 with protect, noconstant(0)
declare iIndex = i4 with protect, noconstant(0)
declare dTaskAssayCd = f8 with protect, noconstant(0.00)
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Input
set sUserName								= trim($USERNAME, 3)
set sComponentList							= trim($COMPLIST,3)
set iDebugFlag								= cnvtint($DEBUG_FLAG)
 
if(iDebugFlag > 0)
	call echo(build("sUserName  	->", sUserName))
	call echo(build("sComponentList  	->", sComponentList))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ParseComponents(null)	= null with protect
declare GetTaskAssays(null)		= i2 with protect	;600484 wv_get_template_labels
declare GetDtaDetails(null)		= i2 with protect	;600356 dcp_get_dta_info_all
declare LoadAdditionalDTAInformation(null) = i2 with protect
 
/*************************************************************************
; MAIN
**************************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, final_reply_out, sVersion)
if(iRet = 0)
 	call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid User for Audit.",
	"1001",build("Invlid user: ",sUserName), final_reply_out)
 	go to exit_script
endif
 
; Parse Component List
if(sComponentList > " ")
	call ParseComponents(null)
else
	call ErrorHandler2(c_error_handler_name, "F", "Validate", "Missing required field: ComponentList.",
	"2055","Missing required field: ComponentList.", final_reply_out)
 	go to exit_script
endif
 
; Get Discrete Task Assays - 600484 wv_get_template_labels
set iRet = GetTaskAssays(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler_name, "F", "Execute", "Could not retrieve Task Assay data (600484).",
	"9999","Could not retrieve Task Assay data (600484).", final_reply_out)
 	go to exit_script
endif
 
; Get DTA details - 600356 - dcp_get_dta_info_all
set iRet = GetDtaDetails(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler_name, "F", "Execute", "Could not retrieve DTA details (600356).",
	"9999","Could not retrieve DTA details (600356).", final_reply_out)
 	go to exit_script
endif
 
; Set audit to success
call ErrorHandler2(c_error_handler_name, "S", "Success", "Completed successfully.",
"0000","Completed successfully.", final_reply_out)
 
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
 
if(iDebugFlag = 1)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_obs_comp_discovery.json")
	call echo(build2("_file : ", _file))
	call echojson(final_reply_out, _file, 0)
 	call echorecord(final_reply_out)
  call echo(JSONout)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: ParseComponents(null) = null
;  Description: Subroutine to parse a comma delimited string
**************************************************************************/
subroutine ParseComponents(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParseComponents Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
 
	while (str != notfnd)
     	set str =  piece(sComponentList,',',num,notfnd)
     	if(str != notfnd)
        set iRet = GetCodeSet(cnvtreal(str))
        if(iRet != 72)
            call ErrorHandler2(c_error_handler_name, "F", "Validate", build("Invalid Event Code: ",trim(str,3)),
          "2018", build("Invalid Event Code: ",trim(str,3)), final_reply_out)
              go to exit_script
        else
          set stat = alterlist(complist->list, num)
          set complist->list[num].id = cnvtreal(str)
        endif
      endif
      set num = num + 1
 	endwhile
 
	if(iDebugFlag > 0)
		call echo(concat("ParseComponents Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetTaskAssays(null) = i2    600484 wv_get_template_labels
;  Description:  Gets the task_assay_cd for the provided component_ids(event_cds)
**************************************************************************/
subroutine GetTaskAssays(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetTaskAssays Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
	set iApplication = 600005
	set iTask = 600154
 	set iRequest = 600484
 
 	; Setup request
 	for(i = 1 to size(complist->list,5))
		set stat = alterlist(600484_req->event_cd_list,i)
		set 600484_req->event_cd_list[i].event_cd = complist->list[i].id
	endfor
 
 	; Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600484_req,"REC",600484_rep)
 
	; Validate request
	if(600484_rep->status_data.status != "F")
		set iValidate = 1
		if(600484_rep->status_data.status = "Z")
			call ErrorHandler2(c_error_handler_name, "Z", "Success", "No discrete task assays found.",
			"0000","No discrete task assays found.", final_reply_out)
			go to exit_script
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetTaskAssays Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
 	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetDtaDetails(null) = i2    600356 - dcp_get_dta_info_all
;  Description:  Gets the DTA details - reference range, value type(string, num, date), etc
**************************************************************************/
subroutine GetDtaDetails(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetDtaDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
	set iApplication = 600005
	set iTask = 600701
 	set iRequest = 600356
 
 	; Setup request
 	for(i = 1 to size(600484_rep->dtas,5))
	 	set stat = alterlist(600356_req->dta,i)
	 	set 600356_req->dta[i].task_assay_cd = 600484_rep->dtas[i].task_assay_cd
	endfor
 
	; Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600356_req,"REC",600356_rep)
 
	; Validate request
	if(600356_rep->status_data.status = "S")
 
    ; Load additional DTA information
    set iRet = LoadAdditionalDTAInformation(null)
    if(iRet > 0)
 
		  set iValidate = 1
 
      for(i = 1 to size(600356_rep->dta,5))
 
        ;Build final reply
        set stat = alterlist(final_reply_out->components,i)
        set final_reply_out->components[i].component_id = 600356_rep->dta[i].event_cd
        set final_reply_out->components[i].component_name = uar_get_code_display(600356_rep->dta[i].event_cd)
        set final_reply_out->components[i].type = 600356_rep->dta[i].default_result_type_disp
 
        ; Multi Response indicator
        if(final_reply_out->components[i].type in ("Multi","Multi-alpha and Freetext"))
            set final_reply_out->components[i].is_multi_response = 1
        endif
 
        ; Alpha responses
        set refRange = size(600356_rep->dta[i].ref_range_factor,5)
        if(refRange > 0)
          set stat = alterlist(final_reply_out->components[i].reference_ranges,refRange)
          for(r = 1 to refRange)
            ;Gender
            set final_reply_out->components[i].reference_ranges[r].gender.id = 600356_rep->dta[i].ref_range_factor[r].sex_cd
            set final_reply_out->components[i].reference_ranges[r].gender.name =
              uar_get_code_display(600356_rep->dta[i].ref_range_factor[r].sex_cd)
 
            ; Age Vars
            set hour = 60
            set day = hour * 24
            set week = day * 7
            set month = 30 * day
            set year = 52 * week
 
            ;Age From
            if(600356_rep->dta[i].ref_range_factor[r].age_from_units_cd > 0)
              set final_reply_out->components[i].reference_ranges[r].age_from.code =
                600356_rep->dta[i].ref_range_factor[r].age_from_units_cd
              set final_reply_out->components[i].reference_ranges[r].age_from.description =
                uar_get_code_display(600356_rep->dta[i].ref_range_factor[r].age_from_units_cd)
 
              case(uar_get_code_meaning(600356_rep->dta[i].ref_range_factor[r].age_from_units_cd))
                of "MINUTES": set final_reply_out->components[i].reference_ranges[r].age_from.value =
                        600356_rep->dta[i].ref_range_factor[r].age_from_minutes
                of "DAYS": set final_reply_out->components[i].reference_ranges[r].age_from.value =
                        600356_rep->dta[i].ref_range_factor[r].age_from_minutes / day
                of "WEEKS": set final_reply_out->components[i].reference_ranges[r].age_from.value =
                        600356_rep->dta[i].ref_range_factor[r].age_from_minutes / week
                of "MONTHS": set final_reply_out->components[i].reference_ranges[r].age_from.value =
                        600356_rep->dta[i].ref_range_factor[r].age_from_minutes / month
                of "YEARS": set final_reply_out->components[i].reference_ranges[r].age_from.value =
                        600356_rep->dta[i].ref_range_factor[r].age_from_minutes / year
              endcase
            endif
 
            ;Age To
            if(600356_rep->dta[i].ref_range_factor[r].age_to_units_cd > 0)
              set final_reply_out->components[i].reference_ranges[r].age_to.code =
                600356_rep->dta[i].ref_range_factor[r].age_to_units_cd
              set final_reply_out->components[i].reference_ranges[r].age_to.description =
                uar_get_code_display(600356_rep->dta[i].ref_range_factor[r].age_to_units_cd)
 
              case(uar_get_code_meaning(600356_rep->dta[i].ref_range_factor[r].age_to_units_cd))
                of "MINUTES": set final_reply_out->components[i].reference_ranges[r].age_to.value =
                        600356_rep->dta[i].ref_range_factor[r].age_to_minutes
                of "DAYS": set final_reply_out->components[i].reference_ranges[r].age_to.value =
                        600356_rep->dta[i].ref_range_factor[r].age_to_minutes / day
                of "WEEKS": set final_reply_out->components[i].reference_ranges[r].age_to.value =
                        600356_rep->dta[i].ref_range_factor[r].age_to_minutes / week
                of "MONTHS": set final_reply_out->components[i].reference_ranges[r].age_to.value =
                        600356_rep->dta[i].ref_range_factor[r].age_to_minutes / month
                of "YEARS": set final_reply_out->components[i].reference_ranges[r].age_to.value =
                        600356_rep->dta[i].ref_range_factor[r].age_to_minutes / year
              endcase
            endif
 
            ;Critical values
            if(600356_rep->dta[i].ref_range_factor[r].critical_ind)
              set final_reply_out->components[i].reference_ranges[r].critical_high =
              	600356_rep->dta[i].ref_range_factor[r].critical_high
              set final_reply_out->components[i].reference_ranges[r].critical_low =
              	600356_rep->dta[i].ref_range_factor[r].critical_low
            endif
 
            ;Feasible values
            if(600356_rep->dta[i].ref_range_factor[r].feasible_ind)
              set final_reply_out->components[i].reference_ranges[r].feasible_high =
              	600356_rep->dta[i].ref_range_factor[r].feasible_high
              set final_reply_out->components[i].reference_ranges[r].feasible_low =
              	600356_rep->dta[i].ref_range_factor[r].feasible_low
            endif
 
            ; Normal values
            if(600356_rep->dta[i].ref_range_factor[r].normal_ind)
              set final_reply_out->components[i].reference_ranges[r].normal_high =
              	600356_rep->dta[i].ref_range_factor[r].normal_high
              set final_reply_out->components[i].reference_ranges[r].normal_low =
              	600356_rep->dta[i].ref_range_factor[r].normal_low
            endif
 
            ;Alpha Responses
            set alphaSize = 600356_rep->dta[i].ref_range_factor[r].alpha_responses_cnt
            if(alphaSize > 0)
              set stat = alterlist(final_reply_out->components[i].reference_ranges[r].value_codes,alphaSize)
              for(a = 1 to 600356_rep->dta[i].ref_range_factor[r].alpha_responses_cnt)
                set final_reply_out->components[i].reference_ranges[r].value_codes[a].id =
                  600356_rep->dta[i].ref_range_factor[r].alpha_responses[a].nomenclature_id
                set final_reply_out->components[i].reference_ranges[r].value_codes[a].name =
                  600356_rep->dta[i].ref_range_factor[r].alpha_responses[a].source_string
              endfor
            endif
          endfor
        endif ; Reference ranges
 
        ; Set the size of the equations list in final_reply_out
        set final_reply_out->components[i].equation_count = size(600356_rep->dta[i].equation,5)
        set stat = alterlist(final_reply_out->components[i].equations,
          final_reply_out->components[i].equation_count)
 
        ; Equations
        for(j = 1 to size(600356_rep->dta[i].equation,5))
 
          ; Populate equation fields
          set final_reply_out->components[i].equations[j].equation_id =
            600356_rep->dta[i].equation[j].equation_id
          set final_reply_out->components[i].equations[j].equation_description =
            trim(600356_rep->dta[i].equation[j].equation_description, 3)
          set final_reply_out->components[i].equations[j].equation_postfix =
            trim(600356_rep->dta[i].equation[j].equation_postfix, 3)
 
          ; Set the size of the equation components list in final_reply_out
          set final_reply_out->components[i].equations[j].equation_component_count =
            600356_rep->dta[i].equation[j].e_comp_cnt
          set stat = alterlist(final_reply_out->components[i].equations[j].equation_components,
            final_reply_out->components[i].equations[j].equation_component_count)
 
          ; Equation components
          for(k = 1 to 600356_rep->dta[i].equation[j].e_comp_cnt)
 
            ; Populate equation component fields
            set final_reply_out->components[i].equations[j].equation_components[k].component_id =
              600356_rep->dta[i].equation[j].e_comp[k].event_cd
            set final_reply_out->components[i].equations[j].equation_components[k].equation_component_name =
              trim(600356_rep->dta[i].equation[j].e_comp[k].name, 3)
            ; Currently, 600356 (dcp_get_dta_info_all) orders the equation components
            ; ascending by sequence so the sequence used here should be reliable
            set final_reply_out->components[i].equations[j].equation_components[k]
              .equation_component_sequence = k
 
            ; Populate fields from the additional DTA information
            set dTaskAssayCd = 600356_rep->dta[i].equation[j].e_comp[k].included_assay_cd
            set iPosition = locateval(iIndex, 1, additional_dta_info->dta_count,
              dTaskAssayCd, additional_dta_info->dtas[iIndex].task_assay_cd)
 
            if(iPosition > 0)
              set final_reply_out->components[i].equations[j].equation_components[k].component_name =
                trim(additional_dta_info->dtas[iPosition].description, 3)
            endif
          endfor ; Equation components
        endfor ; Equations
      endfor ; DTAs
    endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetDtaDetails Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
 	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: LoadAdditionalDTAInformation(null) = i2
;  Description:  Loads additional DTA information
;  Return: 1 (true) if the additional information was loaded. Otherwise, 0 (false).
**************************************************************************/
subroutine LoadAdditionalDTAInformation(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("LoadAdditionalDTAInformation Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
  ; DTAs
  for(i = 1 to size(600356_rep->dta,5))
    ; DTA equations
    for(j = 1 to size(600356_rep->dta[i].equation,5))
      ; DTA equation components
      for(k = 1 to 600356_rep->dta[i].equation[j].e_comp_cnt)
 
        ; Get the task assay code for the equation component
        set dTaskAssayCd = 600356_rep->dta[i].equation[j].e_comp[k].included_assay_cd
 
        ; Search for the task assay code in the additional_dta_info record structure
        set iPosition = locateval(iIndex, 1, additional_dta_info->dta_count,
          dTaskAssayCd, additional_dta_info->dtas[iIndex].task_assay_cd)
 
        ; Add the DTA for the equation component to the additional_dta_info record structure
        if(iPosition < 1)
          set additional_dta_info->dta_count += 1
          set stat = alterlist(additional_dta_info->dtas, additional_dta_info->dta_count)
          set additional_dta_info->dtas[additional_dta_info->dta_count]
            .task_assay_cd = dTaskAssayCd
        endif
      endfor ; DTA equation components
    endfor ; DTA equations
  endfor ; DTAs
 
  ; Load the additional DTA information
  if (additional_dta_info->dta_count > 0)
    select into "nl:"
      dta.description
    from
      (dummyt d with seq = value(additional_dta_info->dta_count)),
      discrete_task_assay dta
    plan d
    join dta where dta.task_assay_cd = additional_dta_info->dtas[d.seq].task_assay_cd
    detail
      additional_dta_info->dtas[d.seq].description = trim(dta.description, 3)
    with nocounter
 
    if(curqual < 1)
      set iSuccessful = 0
    else ; curqual >= 1
      ; DTAs
      for(i = 1 to size(600356_rep->dta,5))
        ; DTA equations
        for(j = 1 to size(600356_rep->dta[i].equation,5))
          ; DTA equation components
          for(k = 1 to 600356_rep->dta[i].equation[j].e_comp_cnt)
 
            ; Get the task assay code for the equation component
            set dTaskAssayCd = 600356_rep->dta[i].equation[j].e_comp[k].included_assay_cd
 
            ; Search for the task assay code in the additional_dta_info record structure
            set iPosition = locateval(iIndex, 1, additional_dta_info->dta_count,
              dTaskAssayCd, additional_dta_info->dtas[iIndex].task_assay_cd)
 
            ; Populate the additional DTA information
            if(iPosition > 0)
              set 600356_rep->dta[i].equation[j].e_comp[k].included_assay_description =
                trim(additional_dta_info->dtas[iPosition].description, 3)
            endif
          endfor ; DTA equation components
        endfor ; DTA equations
      endfor ; DTAs
    endif ; curqual < 1
  endif ; additional_dta_info->dta_count > 0
 
	if(iDebugFlag > 0)
		call echo(concat("LoadAdditionalDTAInformation Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
  return (iSuccessful)
end ;End subroutine LoadAdditionalDTAInformation
 
end
go
