/*~BB~**********************************************************************************
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
*                                                                     			*
  ~BE~***********************************************************************************/
/*****************************************************************************************
      Source file name:  	snsro_get_pharm_interv_discovery.prg
      Object name:       	snsro_get_pharm_interv_discovery
      Program purpose:    	Get list of pharmacy interventions available
      Tables read:      	DCP_FORM_REF, DCP_INP_REF, NOMENCLATURE
      Tables updated:   	NONE
      Executing from:   	MPages Discern Web Service
      Special Notes:      	NONE
********************************************************************************/
 /*******************************************************************************
 *                   MODIFICATION CONTROL LOG                      				*
 ********************************************************************************
 *Mod 	Date     	Engineer             	Comment                            	*
 *--- 	-------- 	-------------------- 	-----------------------------------	*
  001	01/29/18	RJC						Initial Write
  002	03/21/18	RJC						Added version code and copyright block
 *******************************************************************************/
/*******************************************************************************/
drop program snsro_get_pha_interv_discovery go
create program snsro_get_pha_interv_discovery
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        		;Required
		, "Debug Flag:" = 0			;Optional
 
with OUTDEV, USERNAME, DEBUG_FLAG

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
 
;Request 600088 - tsk_get_adhoc_tasks
free record 600088_req
record 600088_req (
  1 task_type_cd = f8
  1 task_description = vc
  1 honor_task_security_flag = i2
)
 
free record 600088_rep
record 600088_rep (
   1 qual_cnt = i4
   1 qual [* ]
     2 reference_task_id = f8
     2 task_description = vc
     2 task_type_cd = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c15
       3 operationstatus = c1
       3 targetobjectname = c15
       3 targetobjectvalue = c100
 )
 
;Request 600535 dcp_get_ref_task_def
free record 600535_req
record 600535_req (
  1 reference_task_id = f8
)
 
free record 600535_rep
record 600535_rep (
   1 reference_task_id = f8
   1 description = c100
   1 event_cd = f8
   1 dcp_forms_ref_id = f8
   1 task_type_cd = f8
   1 task_type_meaning = vc
   1 capture_bill_info_ind = i2
   1 ignore_req_ind = i2
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c15
       3 operationstatus = c1
       3 targetobjectname = c15
       3 targetobjectvalue = c100
 )
 
 
;Request 600373 - dcp_get_dcp_form
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
   1 sect_list [* ]
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
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c15
       3 operationstatus = c1
       3 targetobjectname = c15
       3 targetobjectvalue = vc
   1 event_set_name = vc
)
 
;Request 600471 - dcp_get_section_input_runtime
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
 
;Request 600356 - dcp_get_dta_info_all
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
 
; Temp
free record temp
record temp (
	1 interventions[*]
		2 form_id     = f8
		2 intervention_name	= vc
		2 section[*]
			3 section_id = f8
			3 section_name = vc
			3 section_instance_id = f8
			3 field[*]
				4 field_id = f8
				4 field_name = vc
				4 field_type_flag = i4
				4 dta = f8
				4 required_ind = i2
				4 field_type
					5 id = f8
					5 name = vc
				4 values[*]
					5 value_id = f8
					5 value_name = vc
)
 
; Final Reply
free record intervention_reply_out
record intervention_reply_out(
	1 interventions[*]
		2 form_id     = f8
		2 intervention_name	= vc
		2 field[*]
			3 field_id = f8
			3 field_name = vc
			3 field_type = vc
			3 required_ind = i2
			3 values[*]
				4 value_id = f8
				4 value_name = vc
	1 audit
		2 user_id             	= f8
		2 user_firstname        = vc
		2 user_lastname         = vc
		2 patient_id            = f8
		2 patient_firstname     = vc
		2 patient_lastname      = vc
		2 service_version       = vc
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
;Input
declare sUserName			= vc with protect, noconstant("")
declare iDebugFlag			= i2 with protect, noconstant(0)
 
; Constants
declare c_pharmacy_task_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",6026,"CLINPHARM"))
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetInterventionsList(null)		= i2 with protect ;Request 600088 - tsk_get_adhoc_tasks
declare GetRefTaskDef(null)				= i2 with protect ;Request 600535 - dcp_get_ref_task_def
declare GetDcpFormData(null) 			= i2 with protect ;Request 600373 - dcp_get_dcp_form
declare GetDcpSectionInput(null)		= i2 with protect ;Request 600471 - dcp_get_section_input_runtime
declare GetDtaInfo(null)				= i2 with protect ;Request 600356 - dcp_get_dta_info_all
declare PostAmble(null)					= null with protect
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set sUserName							= trim($USERNAME, 3)
set iDebugFlag							= cnvtreal($DEBUG_FLAG)
 
if(idebugFlag > 0)
	call echo(build("sUserName -> ",sUserName))
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, intervention_reply_out, sVersion)
if(iRet = 0)
  call ErrorHandler2("Validate", "F", "GET INTERVENTION DISCOVERY", "Invalid User for Audit.",
  "1001",build("Invalid user: ",sUserName), intervention_reply_out)
  go to exit_script
endif
 
; Get Intervention List -  Request 600088 - tsk_get_adhoc_tasks
set iRet = GetInterventionsList(null)
if(iRet = 0)
	call ErrorHandler2("Execute", "S", "GET INTERVENTION DISCOVERY", "No interventions found.",
	"0000",build( "No interventions found."), intervention_reply_out)
	go to exit_script
elseif(iRet < 0)
	call ErrorHandler2("Execute", "F", "GET INTERVENTION DISCOVERY", "Could not retrieve intervention list.",
	"9999",build( "Could not retrieve intervention list."), intervention_reply_out)
	go to exit_script
endif
 
; Get Reference Task Definition - Request 600535 - dcp_get_ref_task_def
set iRet = GetRefTaskDef(null)
if(iRet = 0)
  call ErrorHandler2("Execute", "F", "GET INTERVENTION DISCOVERY", "Could not retrieve ref task data.",
  "9999","Could not retrieve ref task data.", intervention_reply_out)
  go to exit_script
endif
 
; Get Powerform layout data - Request 600373 - dcp_get_dcp_form
set iRet = GetDcpFormData(null)
if(iRet = 0)
  call ErrorHandler2("Execute", "F", "GET INTERVENTION DISCOVERY", "Could not retrieve form data.",
  "9999","Could not retrieve form data.", intervention_reply_out)
  go to exit_script
endif
 
; Get Powerform section data - Request 600471 - dcp_get_section_input_runtime
set iRet = GetDcpSectionInput(null)
if(iRet = 0)
  call ErrorHandler2("Execute", "F", "GET INTERVENTION DISCOVERY", "Could not retrieve section data.",
  "9999","Could not retrieve section data.", intervention_reply_out)
  go to exit_script
endif
 
; Get Discrete Task Assay info - Request 600356 - dcp_get_dta_info_all
set iRet = GetDtaInfo(null)
if(iRet = 0)
  call ErrorHandler2("Execute", "F", "GET INTERVENTION DISCOVERY", "Could not retrieve DTA info.",
  "9999","Could not retrieve DTA info.", intervention_reply_out)
  go to exit_script
endif
 
; Build final reply
call PostAmble(null)
 
; Set audit to a successful status
call ErrorHandler2("Success", "S", "GET INTERVENTION DISCOVERY", "Completed Successfully.",
"0000","Intervention discovery completed successfully.", intervention_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
  if(idebugFlag > 0)
	  call echorecord(intervention_reply_out)
 
	  set file_path = logical("ccluserdir")
	  set _file = build2(trim(file_path),"/snsro_get_pharm_interv_discovery.json")
	  call echo(build2("_file : ", _file))
	  call echojson(intervention_reply_out, _file, 0)
  endif
 
  set JSONout = CNVTRECTOJSON(intervention_reply_out,4)
 
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
;  Name: GetInterventionsList(null) = i2 Request 600088 - tsk_get_adhoc_tasks
;  Description:  Gets list of interventions based on task type
**************************************************************************/
subroutine GetInterventionsList(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetInterventionsList Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 600526
	set iRequest = 600088
 
 	set 600088_req->task_type_cd = c_pharmacy_task_type_cd
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600088_req,"REC",600088_rep)
 
	if(600088_rep->status_data.status != "F")
		set iValidate = 600088_rep->qual_cnt
	else
		set iValidate = -1
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetInterventionsList Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetRefTaskDef(null) = i2 ;Request 600535 - dcp_get_ref_task_def
;  Description:  Gets the reference task def for each form
**************************************************************************/
subroutine GetRefTaskDef(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetRefTaskDef Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 600526
	set iRequest = 600535
 
	for(i = 1 to 600088_rep->qual_cnt)
		set 600535_req->reference_task_id = 600088_rep->qual[i].reference_task_id
 
 	 	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600535_req,"REC",600535_rep)
 
		if(600535_rep->status_data.status = "S")
			set iValidate = 1
			set stat = alterlist(temp->interventions,i)
			set temp->interventions[i].form_id = 600535_rep->dcp_forms_ref_id
 			set temp->interventions[i].intervention_name = 600535_rep->description
 		endif
 	endfor
 
	if(idebugFlag > 0)
		call echo(concat("GetRefTaskDef Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetDcpFormData(null) = i2 ;Request 600373 - dcp_get_dcp_form
;  Description: Gets the powerform layout data
**************************************************************************/
subroutine GetDcpFormData(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetDcpFormData Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 600701
	set iRequest = 600373
 
	for(i = 1 to size(temp->interventions,5))
 
		set 600373_req->dcp_forms_ref_id = temp->interventions[i].form_id
		set 600373_req->version_dt_tm = cnvtdatetime(curdate,curtime3)
 
		set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600373_req,"REC",600373_rep)
 
		if(600373_rep->status_data.status != "F")
			set iValidate = 1
			for(s = 1 to 600373_rep->sect_cnt)
				set stat = alterlist(temp->interventions[i].section,s)
				set temp->interventions[i].section[s].section_id = 600373_rep->sect_list[s].dcp_section_ref_id
				set temp->interventions[i].section[s].section_name = 600373_rep->sect_list[s].description
				set temp->interventions[i].section[s].section_instance_id = 600373_rep->sect_list[s].dcp_section_instance_id
			endfor
		endif
 	endfor
 
	if(idebugFlag > 0)
		call echo(concat("GetDcpFormData Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetDcpSectionInput(null)	= i2  ;Request 600471 - dcp_get_section_input_runtime
;  Description: Get powerform section data
**************************************************************************/
subroutine GetDcpSectionInput(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetDcpSectionInput Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 600701
	set iRequest = 600471
 
 
 
 	for(i = 1 to size(temp->interventions,5))
 		for(s = 1 to size(temp->interventions[i].section,5))
 			set fieldCnt = 0
			set 600471_req->dcp_section_ref_id = temp->interventions[i].section[s].section_id
			set 600471_req->dcp_section_instance_id = temp->interventions[i].section[s].section_instance_id
 
			set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600471_req,"REC",600471_rep)
 
			if(600471_rep->status_data.status != "F")
				set iValidate = 1
 
				if(600471_rep->input_cnt > 0)
					for(x = 1 to 600471_rep->input_cnt)
						if(600471_rep->input_list[x].input_type != 1)
							set fieldCnt = fieldCnt + 1
							set stat = alterlist(temp->interventions[i].section[s].field,fieldCnt)
 
							set temp->interventions[i].section[s].field[fieldCnt].field_id =
							600471_rep->input_list[x].dcp_input_ref_id
 
							set temp->interventions[i].section[s].field[fieldCnt].field_name =
							600471_rep->input_list[x].description
 
							set temp->interventions[i].section[s].field[fieldCnt].field_type_flag =
							600471_rep->input_list[x].input_type
 
							for(y = 1 to 600471_rep->input_list[x].nv_cnt)
								case(600471_rep->input_list[x].nv[y].pvc_name)
									of "discrete_task_assay":
										set temp->interventions[i].section[s].field[fieldCnt].dta =
										600471_rep->input_list[x].nv[y].merge_id
									of "required":
										set temp->interventions[i].section[s].field[fieldCnt].required_ind = 1
								endcase
							endfor
						endif
					endfor
				endif
			endif
		endfor
	endfor
 
	if(idebugFlag > 0)
		call echo(concat("GetDcpSectionInput Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetDtaInfo(null)	= i2 	;Request 600356 - dcp_get_dta_info_all
;  Description: Get Discrete Task Assay data
**************************************************************************/
subroutine GetDtaInfo(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetDtaInfo Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 600701
	set iRequest = 600356
 
 	set dtaCnt = 0
	for(i = 1 to size(temp->interventions,5))
 		for(s = 1 to size(temp->interventions[i].section,5))
 			for(x = 1 to size(temp->interventions[i].section[s].field,5))
 				if(temp->interventions[i].section[s].field[x].dta > 0)
 					set dtaCnt = dtaCnt + 1
 					set stat = alterlist(600356_req->dta,dtaCnt)
 					set 600356_req->dta[dtaCnt].task_assay_cd = temp->interventions[i].section[s].field[x].dta
 				endif
 			endfor
 		endfor
 	endfor
 
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600356_req,"REC",600356_rep)
 
	if(600356_rep->status_data.status != "F")
		set iValidate = 1
 
		for(i = 1 to size(temp->interventions,5))
 			for(s = 1 to size(temp->interventions[i].section,5))
 				for(x = 1 to size(temp->interventions[i].section[s].field,5))
 
 					for(y = 1 to size(600356_rep->dta,5))
 						if(600356_rep->dta[y].task_assay_cd = temp->interventions[i].section[s].field[x].dta)
 							set temp->interventions[i].section[s].field[x].field_type.id =
 							600356_rep->dta[y].default_result_type_cd
 
 							set temp->interventions[i].section[s].field[x].field_type.name =
 							600356_rep->dta[y].default_result_type_disp
 
 							if(600356_rep->dta[y].ref_range_factor[1].alpha_responses_cnt > 0)
 								set stat = alterlist(temp->interventions[i].section[s].field[x].values,
 								600356_rep->dta[y].ref_range_factor[1].alpha_responses_cnt)
 
 								for(z = 1 to 600356_rep->dta[y].ref_range_factor[1].alpha_responses_cnt)
 									set temp->interventions[i].section[s].field[x].values[z].value_id =
 									600356_rep->dta[y].ref_range_factor[1].alpha_responses[z].nomenclature_id
 
 									set temp->interventions[i].section[s].field[x].values[z].value_name =
 									600356_rep->dta[y].ref_range_factor[1].alpha_responses[z].source_string
 								endfor
 							endif
 						endif
 					endfor
 				endfor
 			endfor
 		endfor
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetDtaInfo Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
 
/*************************************************************************
;  Name: PostAmble(null) = null
;  Description: Build Final reply
**************************************************************************/
subroutine PostAmble(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostAmble Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	for(i = 1 to size(temp->interventions,5))
		set stat = alterlist(intervention_reply_out->interventions,i)
 
		set intervention_reply_out->interventions[i].form_id = temp->interventions[i].form_id
		set intervention_reply_out->interventions[i].intervention_name = temp->interventions[i].intervention_name
 
		for(x = 1 to size(temp->interventions[i].section,5))
			set fieldCnt = 0
			for(y = 1 to size(temp->interventions[i].section[x].field,5))
				set fieldCnt = fieldCnt + 1
				set stat = alterlist(intervention_reply_out->interventions[i].field,fieldCnt)
 
				set intervention_reply_out->interventions[i].field[fieldCnt].field_id =
				temp->interventions[i].section[x].field[y].field_id
 
				set intervention_reply_out->interventions[i].field[fieldCnt].field_name =
				temp->interventions[i].section[x].field[y].field_name
 
				set intervention_reply_out->interventions[i].field[fieldCnt].field_type =
				temp->interventions[i].section[x].field[y].field_type.name
 
				set intervention_reply_out->interventions[i].field[fieldCnt].required_ind =
				temp->interventions[i].section[x].field[y].required_ind
 
				set valSize = size(temp->interventions[i].section[x].field[y].values,5)
				if(valSize > 0)
					set stat = alterlist(intervention_reply_out->interventions[i].field[fieldCnt].values,valSize)
 
					for(v = 1 to valSize)
						set intervention_reply_out->interventions[i].field[fieldCnt].values[v].value_id =
						temp->interventions[i].section[x].field[y].values[v].value_id
 
						set intervention_reply_out->interventions[i].field[fieldCnt].values[v].value_name =
						temp->interventions[i].section[x].field[y].values[v].value_name
					endfor
				endif
			endfor
		endfor
	endfor
 
	if(idebugFlag > 0)
		call echo(concat("PostAmble Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
end go
set trace notranslatelock go
 
 
