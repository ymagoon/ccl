/*~BB~***********************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

  ~BE~***********************************************************************************/
/*****************************************************************************************
      Source file name:    snsro_common_pwrform.prg
      Object name:         vigilanz_common_pwrform
      Program purpose:    Common subroutines for loading PowerForms
      Tables read:        MANY
      Tables updated:     MANY
      Executing from:     mPages Discern Web Service
      Special Notes:      snsro_common is required
*********************************************************************************/
/********************************************************************************
*                   MODIFICATION CONTROL LOG                                    *
*********************************************************************************
 Mod Date     Engineer              Comment                                     *
 --- -------- -------------------   --------------------------------------------*
 001 05/06/20 DSH                   Initial Write
*********************************************************************************/
/********************************************************************************/
drop program vigilanz_common_pwrform go
create program vigilanz_common_pwrform

/************************************************************************
; DECLARED STRUCTURES
************************************************************************/ 
; Final reply out
free record final_reply_out
record final_reply_out (
	1 list[1]
		2 form_id = f8
		2 form_name = vc
    2 end_effective_dt_tm = dq8
    2 event_cd = f8
    2 activity
      3 event_id = f8
      3 form_activity_id = f8
      3 patient_id = f8
      3 encounter_id = f8
      3 form_updt_dt_tm = dq8
      3 event_end_dt_tm = dq8
      3 result_status
        4 id = f8
        4 name = vc
      3 document_audits[*]
        4 action_type = vc
        4 action_dt_tm = dq8
        4 action_status = vc
        4 action_prsnl = vc
        4 action_prsnl_id = f8
      3 documents[*]
        4 document_id = f8
        4 document_name = vc
        4 document_title = vc
        4 document_dt_tm = dq8
        4 document_status = vc
        4 document_handle = vc
        4 active_ind = i2
        4 storage = vc
        4 format = vc
        4 body = gvc
        4 length = i4
		2 sections[*]
			3 section_id = f8
			3 section_name = vc
			3 section_instance_id = f8
			3 conditional_requirements[*]
				4 field_id = f8
				4 condition = vc
				4 conditional_value = f8
			3 fields[*]
				4 field_id = f8
				4 field_name = vc
				4 field_type = vc
				4 required_ind = i2
				4 conditional_requirements[*]
					5 field_id = f8
					5 condition = vc
					5 conditional_value = f8
				4 default_value = vc
				4 components[*]
					5 component_id = f8
					5 component_name = vc
					5 max_digits = i4
					5 min_digits = i4
					5 decimal_precision = i4
					5 is_multi_response = i2
					5 component_type
						6 id = f8
						6 name = vc
					5 reference_ranges[*]
						6 age_from
							7 code = f8
							7 description = vc
							7 value = i4
						6 age_to
							7 code = f8
							7 description = vc
							7 value = i4
						6 gender
							7 id = f8
							7 name = vc
						6 critical_high = f8
						6 critical_low = f8
						6 normal_high = f8
						6 normal_low = f8
						6 feasible_high = f8
						6 feasible_low = f8
						6 value_codes[*]
							7 id = f8
							7 name = vc
							7 conditional_value = f8
          5 results[*]
            6 result_status
              7 id = f8
              7 name = vc
            6 CodedValues[*]
              7 id = f8
              7 name = vc
            6 TextValues[*] = vc
            6 NumericValues[*]
              7 value = vc
              7 unit
                8 id = f8
                8 name = vc
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
) with persistscript
 
free record common_pwrform::section_conds
record common_pwrform::section_conds (
	1 list[*]
		2 section_id = f8
		2 input_id = f8
		2 condition = vc
		2 condition_total = f8
) with persistscript
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare common_pwrform::GetFormDetail(dFormTemplateId = f8) = i2 with persistscript ;600373 - dcp_get_dcp_form
declare common_pwrform::GetSectionDetail(null) = i2 with persistscript	;600471 - dcp_get_section_input_runtime
declare common_pwrform::GetDtaDetail(null) = i2 with persistscript	;600356 - dcp_get_dta_info_all
declare common_pwrform::PostAmble(null) = null with persistscript
 
/*************************************************************************
;  Name: common_pwrform::GetFormDetail(dFormTemplateId = f8) = i2 ;Request 600373 - dcp_get_dcp_form
;  Description: Gets the powerform layout data
**************************************************************************/
subroutine common_pwrform::GetFormDetail(dFormTemplateId)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("common_pwrform::GetFormDetail Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif

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
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 600701
	set iRequest = 600373
 
 	;Setup request
	set 600373_req->dcp_forms_ref_id = dFormTemplateId
	set 600373_req->version_dt_tm = cnvtdatetime(curdate,curtime3)
 
 	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600373_req,"REC",600373_rep)
 
	if(600373_rep->status_data.status != "F")
		set iValidate = 1
 
		set final_reply_out->list[1].form_id = 600373_rep->dcp_forms_ref_id
		set final_reply_out->list[1].form_name = 600373_rep->description
    set final_reply_out->list[1].end_effective_dt_tm = cnvtdatetime(600373_rep->end_effective_dt_tm)
    set final_reply_out->list[1].event_cd = 600373_rep->event_cd
 
		for(s = 1 to 600373_rep->sect_cnt)
			set stat = alterlist(final_reply_out->list[1].sections,s)
			set final_reply_out->list[1].sections[s].section_id = 600373_rep->sect_list[s].dcp_section_ref_id
			set final_reply_out->list[1].sections[s].section_name = 600373_rep->sect_list[s].description
			set final_reply_out->list[1].sections[s].section_instance_id = 600373_rep->sect_list[s].
        dcp_section_instance_id
		endfor
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("common_pwrform::GetFormDetail Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: common_pwrform::GetSectionDetail(null)	= i2  ;Request 600471 - dcp_get_section_input_runtime
;  Description: Get powerform section data
**************************************************************************/
subroutine common_pwrform::GetSectionDetail(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("common_pwrform::GetSectionDetail Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif

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
 
	set iValidate = 1
	set iApplication = 380000
	set iTask = 600701
	set iRequest = 600471
 
 	for(s = 1 to size(final_reply_out->list[1].sections,5))
	 	set fieldCnt = 0
 
	 	;Setup request
		set 600471_req->dcp_section_ref_id = final_reply_out->list[1].sections[s].section_id
		set 600471_req->dcp_section_instance_id =final_reply_out->list[1].sections[s].section_instance_id
 
	 	;Execute request
		set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600471_req,"REC",600471_rep)
 
		if(600471_rep->status_data.status != "F")
			if(600471_rep->input_cnt > 0)
				for(x = 1 to 600471_rep->input_cnt)
 
					;Don't return label inputs
					if(600471_rep->input_list[x].input_type != 1)
						set fieldCnt = fieldCnt + 1
						set stat = alterlist(final_reply_out->list[1].sections[s].fields,fieldCnt)
 
						set final_reply_out->list[1].sections[s].fields[fieldCnt].field_id =
						600471_rep->input_list[x].dcp_input_ref_id
 
						set final_reply_out->list[1].sections[s].fields[fieldCnt].field_name =
						600471_rep->input_list[x].description
 
						set final_reply_out->list[1].sections[s].fields[fieldCnt].field_type =
            evaluate(600471_rep->input_list[x].input_type,
						1,"Label Control",
						2,"Numeric Control",
						3,"FlexUnit Control",
						4,"List Control",
                        5,"MAGrid Control",
                        6,"FreeText Control",
                        7,"Calculated Control",
                        8,"StaticUnit Control",
                        9,"AlphaCombo Box Control",
                        10,"DateTime Control",
                        11,"Allergy Control",
                        12,"ImageHolder Control",
                        13,"RTFEditor Control",
                        14,"Discrete Grid",
                        15,"RAlpha Grid",
                        16,"Comment Control",
                        17,"Power Grid",
                        18,"Provider Control",
                        19,"Ultra Grid",
                        20,"Tracking Control1",
                        21,"Conversion Control",
                        22,"Numeric Control2",
                        23,"Nomenclature Control",
                        "Unknown Type")
 
 						set compCnt = 0
						set dtaCondCnt = 0
 
						for(y = 1 to 600471_rep->input_list[x].nv_cnt)
							case(600471_rep->input_list[x].nv[y].pvc_name)
								of "discrete_task_assay":
									set compCnt = compCnt + 1
									set stat = alterlist(final_reply_out->list[1].sections[s].fields[fieldCnt].components,compCnt)
									set final_reply_out->list[1].sections[s].fields[fieldCnt].components[compCnt].component_id =
										600471_rep->input_list[x].nv[y].merge_id
									set final_reply_out->list[1].sections[s].fields[fieldCnt].components[compCnt].component_name =
										uar_get_code_display(600471_rep->input_list[x].nv[y].merge_id)
 
								of "required":
									set final_reply_out->list[1].sections[s].fields[fieldCnt].required_ind = 1
 
								of "default":
									set final_reply_out->list[1].sections[s].fields[fieldCnt].default_value =
									600471_rep->input_list[x].nv[y].pvc_value
 
								of "dta_condition":
									set dtaCondCnt = dtaCondCnt + 1
									set stat = alterlist(final_reply_out->list[1].sections[s].fields[fieldCnt].conditional_requirements,
                    dtaCondCnt)
 
									set final_reply_out->list[1].sections[s].fields[fieldCnt].conditional_requirements[dtaCondCnt].
                    field_id = 600471_rep->input_list[x].nv[y].merge_id
									set final_reply_out->list[1].sections[s].fields[fieldCnt].conditional_requirements[dtaCondCnt].
                    condition = evaluate(cnvtint(piece(600471_rep->input_list[x].nv[y].pvc_value,";",1,"")),
										0,"Exactly Equal",
										1,"Less Than",
										2,"Greater Than",
										3,"Less Than or Equal To",
										4,"Greater Than or Equal To",
										5,"Enable Control/Section",
										6,"Not Equal To",
										7,"Disable Control/Section")
									set final_reply_out->list[1].sections[s].fields[fieldCnt].conditional_requirements[dtaCondCnt].
                    conditional_value = cnvtreal(piece(600471_rep->input_list[x].nv[y].pvc_value,";",2,""))
 
								of "conditional_section":
									set sectCondCnt = size(common_pwrform::section_conds->list,5)
									set sectCondCnt = sectCondCnt + 1
									set stat = alterlist(common_pwrform::section_conds->list,sectCondCnt)
 
									set common_pwrform::section_conds->list[sectCondCnt].section_id = 600471_rep->input_list[x].
                    nv[y].merge_id
 
									set common_pwrform::section_conds->list[sectCondCnt].condition =
										evaluate(cnvtint(piece(600471_rep->input_list[x].nv[y].pvc_value,";",1,"")),
										0,"Exactly Equal",
										1,"Less Than",
										2,"Greater Than",
										3,"Less Than or Equal To",
										4,"Greater Than or Equal To",
										5,"Enable Control/Section",
										6,"Not Equal To",
										7,"Disable Control/Section")
									set common_pwrform::section_conds->list[sectCondCnt].condition_total = cnvtreal(piece(
                    600471_rep->input_list[x].nv[y].pvc_value,";",2,""))
									set common_pwrform::section_conds->list[sectCondCnt].input_id = final_reply_out->list[1].sections[s].
                    fields[fieldCnt].field_id
							endcase
						endfor
					endif
				endfor
			endif
		else
			set iValidate = 0
		endif
	endfor
 
	if(iDebugFlag > 0)
		call echo(concat("common_pwrform::GetSectionDetail Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: common_pwrform::GetDtaDetail(null)	= i2 	;Request 600356 - dcp_get_dta_info_all
;  Description: Get Discrete Task Assay data
**************************************************************************/
subroutine common_pwrform::GetDtaDetail(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("common_pwrform::GetDtaDetail Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif

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
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 600701
	set iRequest = 600356
 
	;Setup request
 	set compCnt = 0
 	for(s = 1 to size(final_reply_out->list[1].sections,5))
 		for(i = 1 to size(final_reply_out->list[1].sections[s].fields,5))
 			if(size(final_reply_out->list[1].sections[s].fields[i].components,5) > 0)
 				for(d = 1 to size(final_reply_out->list[1].sections[s].fields[i].components,5))
 					set compCnt = compCnt + 1
 					set stat = alterlist(600356_req->dta,compCnt)
 					set 600356_req->dta[compCnt].task_assay_cd = final_reply_out->list[1].sections[s].fields[i].
            components[d].component_id
 				endfor
 			endif
 		endfor
 	endfor
 
 	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",600356_req,"REC",600356_rep)
 
	if(600356_rep->status_data.status != "F")
		set iValidate = 1
 
		set idx = 1
		select into "nl:"
		from (dummyt d with seq = size(final_reply_out->list[1].sections,5))
			,(dummyt d1 with seq = 1)
			,(dummyt d2 with seq = 1)
		plan d where maxrec(d1,size(final_reply_out->list[1].sections[d.seq].fields,5))
		join d1 where maxrec(d2,size(final_reply_out->list[1].sections[d.seq].fields[d1.seq].components,5))
		join d2 where final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].component_id > 0
		detail
 			x = locateval(idx,1,size(600356_rep->dta,5),
 			final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].component_id,600356_rep->
        dta[idx].task_assay_cd)
 
 			if(x > 0)
	 			final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].component_type.id =
	 				600356_rep->dta[x].default_result_type_cd
	 			final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].component_type.name =
	 				600356_rep->dta[x].default_result_type_disp
 
	 			if(600356_rep->dta[x].default_result_type_disp in ("Multi","Multi-alpha and Freetext"))
	 				final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].is_multi_response = 1
	 			endif
 
	 			if(size(600356_rep->dta[x].data_map,5) > 0)
	 				final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].decimal_precision =
	 					600356_rep->dta[x].data_map[1].min_decimal_places
	 				final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].max_digits =
	 					600356_rep->dta[x].data_map[1].max_digits
	 				final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].min_digits =
	 					600356_rep->dta[x].data_map[1].min_digits
	 			endif
 
	 			refRange = size(600356_rep->dta[x].ref_range_factor,5)
				if(refRange > 0)
	 				stat = alterlist(final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].reference_ranges,
            refRange)
					for(r = 1 to refRange)
 
						;Gender
						final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].reference_ranges[r].gender.id =
							600356_rep->dta[x].ref_range_factor[r].sex_cd
						final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].reference_ranges[r].gender.name =
							uar_get_code_display(600356_rep->dta[x].ref_range_factor[r].sex_cd)
 
						; Age Vars
						hour = 60
						day = hour * 24
						week = day * 7
						month = 30 * day
						year = 52 * week
 
						;Age From
						if(600356_rep->dta[x].ref_range_factor[r].age_from_units_cd > 0)
							final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].reference_ranges[r].
                age_from.code =
								600356_rep->dta[x].ref_range_factor[r].age_from_units_cd
							final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].reference_ranges[r].
                age_from.description =
								uar_get_code_display(600356_rep->dta[x].ref_range_factor[r].age_from_units_cd)
 
							case(uar_get_code_meaning(600356_rep->dta[x].ref_range_factor[r].age_from_units_cd))
								of "MINUTES": 
									final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].
                    reference_ranges[r].age_from.value =
												600356_rep->dta[x].ref_range_factor[r].age_from_minutes
								of "DAYS": final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].
                  reference_ranges[r].age_from.value =
												600356_rep->dta[x].ref_range_factor[r].age_from_minutes / day
								of "WEEKS": final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].
                  reference_ranges[r].age_from.value =
												600356_rep->dta[x].ref_range_factor[r].age_from_minutes / week
								of "MONTHS": final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].
                  reference_ranges[r].age_from.value =
												600356_rep->dta[x].ref_range_factor[r].age_from_minutes / month
								of "YEARS": final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].
                  reference_ranges[r].age_from.value =
												600356_rep->dta[x].ref_range_factor[r].age_from_minutes / year
							endcase
	 					endif
 
						;Age To
						if(600356_rep->dta[x].ref_range_factor[r].age_to_units_cd > 0)
							final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].reference_ranges[r].
                age_to.code =
								600356_rep->dta[x].ref_range_factor[r].age_to_units_cd
							final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].reference_ranges[r].
                age_to.description =
								uar_get_code_display(600356_rep->dta[x].ref_range_factor[r].age_to_units_cd)
 
							case(uar_get_code_meaning(600356_rep->dta[x].ref_range_factor[r].age_to_units_cd))
								of "MINUTES": final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].
                  reference_ranges[r].age_to.value =
												600356_rep->dta[x].ref_range_factor[r].age_to_minutes
								of "DAYS": final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].
                  reference_ranges[r].age_to.value =
												600356_rep->dta[x].ref_range_factor[r].age_to_minutes / day
								of "WEEKS": final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].
                  reference_ranges[r].age_to.value =
												600356_rep->dta[x].ref_range_factor[r].age_to_minutes / week
								of "MONTHS": final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].
                  reference_ranges[r].age_to.value =
												600356_rep->dta[x].ref_range_factor[r].age_to_minutes / month
								of "YEARS": final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].
                  reference_ranges[r].age_to.value =
												600356_rep->dta[x].ref_range_factor[r].age_to_minutes / year
							endcase
	 					endif
 
						;Critical values
						if(600356_rep->dta[x].ref_range_factor[r].critical_ind)
							final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].reference_ranges[r].
                critical_high =
								600356_rep->dta[x].ref_range_factor[r].critical_high
							final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].reference_ranges[r].
                critical_low =
								600356_rep->dta[x].ref_range_factor[r].critical_low
						endif
 
						;Feasible values
						if(600356_rep->dta[x].ref_range_factor[r].feasible_ind)
							final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].reference_ranges[r].
                feasible_high =
								600356_rep->dta[x].ref_range_factor[r].feasible_high
							final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].reference_ranges[r].
                feasible_low =
								600356_rep->dta[x].ref_range_factor[r].feasible_low
						endif
 
						; Normal values
						if(600356_rep->dta[x].ref_range_factor[r].normal_ind)
							final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].reference_ranges[r].
                normal_high =
								600356_rep->dta[x].ref_range_factor[r].normal_high
							final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].reference_ranges[r].
                normal_low =
								600356_rep->dta[x].ref_range_factor[r].normal_low
						endif
 
						;Alpha Responses
						alphaSize = 600356_rep->dta[x].ref_range_factor[r].alpha_responses_cnt
						if(alphaSize > 0)
							stat = alterlist(final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].
                reference_ranges[r].value_codes, alphaSize)
							for(a = 1 to 600356_rep->dta[x].ref_range_factor[r].alpha_responses_cnt)
								final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].reference_ranges[r].
                  value_codes[a].id =
									600356_rep->dta[x].ref_range_factor[r].alpha_responses[a].nomenclature_id
								final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].reference_ranges[r].
                  value_codes[a].name =
									600356_rep->dta[x].ref_range_factor[r].alpha_responses[a].source_string
								final_reply_out->list[1].sections[d.seq].fields[d1.seq].components[d2.seq].reference_ranges[r].
								  value_codes[a].conditional_value = 600356_rep->dta[x].ref_range_factor[r].alpha_responses[a].
                  result_value
							endfor
						endif
					endfor
				endif
 			endif
 		with nocounter
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("common_pwrform::GetDtaDetail Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: common_pwrform::PostAmble(null) = null
;  Description: Build Final reply
**************************************************************************/
subroutine common_pwrform::PostAmble(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("common_pwrform::PostAmble Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set idx = 1
	set sectSize = size(common_pwrform::section_conds->list,5)
	if(sectSize > 0)
		for(i = 1 to size(final_reply_out->list[1].sections,5))
			set next = 1
			set pos = locateval(idx,next,sectSize,final_reply_out->list[1].sections[i].section_id,
        common_pwrform::section_conds->list[idx].section_id)
 
			while(pos > 0 and next <= sectSize)
				set reqSize = size(final_reply_out->list[1].sections[i].conditional_requirements,5)
				set reqSize  = reqSize + 1
				set stat = alterlist(final_reply_out->list[1].sections[i].conditional_requirements,reqSize)
				set final_reply_out->list[1].sections[i].conditional_requirements[reqSize].field_id =
          common_pwrform::section_conds->list[pos].input_id
				set final_reply_out->list[1].sections[i].conditional_requirements[reqSize].conditional_value = 
					common_pwrform::section_conds->list[pos].condition_total
 				set final_reply_out->list[1].sections[i].conditional_requirements[reqSize].condition =
          common_pwrform::section_conds->list[pos].condition
 
				set next = pos + 1
				set pos = locateval(idx,next,sectSize,final_reply_out->list[1].sections[i].section_id,
          common_pwrform::section_conds->list[idx].section_id)
			endwhile
		endfor
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("common_pwrform::PostAmble Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine

end
go
