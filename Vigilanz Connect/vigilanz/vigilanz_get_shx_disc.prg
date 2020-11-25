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
      Source file name:    snsro_get_shx_disc.prg
      Object name:         vigilanz_get_shx_disc
      Program purpose:    Posts Social History Information
      Tables read:        MANY
      Tables updated:     NA
      Executing from:     mPages Discern Web Service
      Special Notes:        NA
*********************************************************************************/
/********************************************************************************
*                   MODIFICATION CONTROL LOG                                    *
*********************************************************************************
 Mod Date     Engineer              Comment                                     *
 --- -------- -------------------   --------------------------------------------*
 001 03/03/20 DSH                   Initial Write
*********************************************************************************/
/********************************************************************************/
drop program vigilanz_get_shx_disc go
create program vigilanz_get_shx_disc
 
prompt
  "Output to File/Printer/MINE" = "MINE" ;Required
  , "Username" = "" ;Required
  , "CategoryId" = "" ;Optional
  , "DebugFlag" = "" ;Optional
 
with OUTDEV, USERNAME, CATEGORY_ID, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
  go to exit_version
endif

/*************************************************************************
;DATA STRUCTURES
**************************************************************************/
free record get_shx_disc_reply_out
record get_shx_disc_reply_out (
  1 categories[*]
    2 category_id = f8
    2 name = vc
    2 comment_allowed_ind = i2
    2 fields[*]
      3 field_id = f8
      3 name = vc
      3 type
        4 id = f8
        4 name = vc
      3 required_ind = i2
      3 is_multi_response = i2
      3 other_response_ind = i2
      3 reference_ranges[*]
        4 age_from
          5 code = f8
          5 description = vc
          5 value = i4
        4 age_to
          5 code = f8
          5 description = vc
          5 value = i4
        4 gender
          5 id = f8
          5 name = vc
        4 value_codes[*]
          5 id = f8
          5 name = vc
      3 modifiers[*]
        4 id = f8
        4 name = vc
  1 audit
    2 user_id = f8
    2 user_firstname = vc
    2 user_lastname = vc
    2 patient_id = f8
    2 patient_firstname = vc
    2 patient_lastname = vc
    2 service_version = vc
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
;INCLUDES
**************************************************************************/
execute snsro_common

/*************************************************************************
;DECLARE VARIABLES
**************************************************************************/
; Constants
declare c_script_name = vc with protect, constant("vigilanz_get_shx_disc")
declare c_error_handler = vc with protect, constant("GET SOCIAL HISTORY DISCOVERY")
declare c_application_id = i4 with protect, constant(600005)

; Minutes in time units
declare c_minutes_in_hour = i4 with protect, constant(60)
declare c_minutes_in_day = i4 with protect, constant(c_minutes_in_hour * 24)
declare c_minutes_in_week = i4 with protect, constant(c_minutes_in_day * 7)
declare c_minutes_in_month = i4 with protect, constant(c_minutes_in_day * 30)
declare c_minutes_in_year = i4 with protect, constant(c_minutes_in_week * 52)

; Social History Response Modifier Flags
declare c_shx_modifier_actual_age = i4 with persistscript, constant(0)
declare c_shx_modifier_about_age = i4 with persistscript, constant(1)
declare c_shx_modifier_before_age = i4 with persistscript, constant(2)
declare c_shx_modifier_after_age = i4 with persistscript, constant(3)
declare c_shx_modifier_unknown = i4 with persistscript, constant(4)

; Social History Response Modifier Displays
declare c_shx_modifier_actual_age_display = vc with persistscript, constant("Age")
declare c_shx_modifier_about_age_display = vc with persistscript, constant("About")
declare c_shx_modifier_before_age_display = vc with persistscript, constant("Before")
declare c_shx_modifier_after_age_display = vc with persistscript, constant("After")
declare c_shx_modifier_unknown_display = vc with persistscript, constant("Unknown")

; Code Values
; Code Set 289 - DTA Result Type
declare c_result_type_text_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"1"))
declare c_result_type_alpha_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"2"))
declare c_result_type_numeric_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"3"))
declare c_result_type_interp_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"4"))
declare c_result_type_multi_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"5"))
declare c_result_type_date_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"6"))
declare c_result_type_freetext_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"7"))
declare c_result_type_calculation_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"8"))
declare c_result_type_on_line_code_set_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"9"))
declare c_result_type_time_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"10"))
declare c_result_type_date_time_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"11"))
declare c_result_type_read_only_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"12"))
declare c_result_type_count_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"13"))
declare c_result_type_provider_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"14"))
declare c_result_type_orc_select_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"15"))
declare c_result_type_inventory_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"16"))
declare c_result_type_bill_only_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"17"))
declare c_result_type_yes_no_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"18"))
declare c_result_type_date_time_time_zone_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"19"))
declare c_result_type_alpha_freetext_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"21"))
declare c_result_type_multi_alpha_freetext_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"22"))

; Code Set 4002169
declare c_shx_input_type_fuzzy_age_cd = f8 with protect, constant(uar_get_code_by("MEANING",4002169,"FUZZYAGE"))

declare iRet = i2 with protect, noconstant(0)
declare iApplicationId = i4 with protect, noconstant(0)
declare iTransactionTaskId = i4 with protect, noconstant(0)
declare iStepId = i4 with protect, noconstant(0)

declare iCategorySize = i4 with protect, noconstant(0)
declare iCategoryIndex = i4 with protect, noconstant(0)
declare iElementSize = i4 with protect, noconstant(0)
declare iElementIndex = i4 with protect, noconstant(0)
declare iFieldIndex = i4 with protect, noconstant(0)
declare iModifierIndex = i4 with protect, noconstant(0)
declare iDTASize = i4 with protect, noconstant(0)
declare iDTAIndex = i4 with protect, noconstant(0)
declare iDataMapSize = i4 with protect, noconstant(0)
declare iDataMapIndex = i4 with protect, noconstant(0)
declare iReferenceRangeFactorSize = i4 with protect, noconstant(0)
declare iReferenceRangeFactorIndex = i4 with protect, noconstant(0)
declare iAlphaResponseSize = i4 with protect, noconstant(0)
declare iAlphaResponseIndex = i4 with protect, noconstant(0)
declare iValueInMinutes = i4 with protect, noconstant(0)

/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
declare iDebugFlag = i2 with protect, noconstant(cnvtint($DEBUG_FLAG))
declare sUsername = vc with protect, noconstant(trim($USERNAME, 3))
declare dCategoryId = f8 with protect, noconstant(cnvtreal($CATEGORY_ID))

/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ValidateParameters(null) = null with protect ; Validates the script parameters
declare LoadSocialHistoryReference(replyOut = vc (ref)) = null with protect
declare GetValueInUnit(iValueInMinutes = i4, dUnitCd = f8) = i4 with protect

/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
set iRet = PopulateAudit(sUsername, 0.00, get_shx_disc_reply_out, sVersion)
if(iRet = 0)
  call ErrorHandler2(c_error_handler, "F", "PopulateAudit", "PopulateAudit failed", "9999", "PopulateAudit failed",
    get_shx_disc_reply_out)
  go to exit_script
endif

call ValidateParameters(null)

call LoadSocialHistoryReference(get_shx_disc_reply_out)

; Set audit to successful
call ErrorHandler2( c_error_handler, "S", "Success", "Social History found successfully.", "0000",
  "Social History found successfully.", get_shx_disc_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set sJsonOut = CNVTRECTOJSON(get_shx_disc_reply_out)
if(validate(_MEMORY_REPLY_STRING))
  set _MEMORY_REPLY_STRING = trim(sJsonOut, 3)
endif
 
if(iDebugFlag > 0)
  set _file = build2(trim(logical("ccluserdir"), 3), "/", c_script_name, ".json")
  call echo(build("_file  ->", _file))

  call echorecord(get_shx_disc_reply_out)
  call echojson(get_shx_disc_reply_out, _file, 0)
  call echo(build("sJsonOut  ->", sJsonOut))
endif
 
#EXIT_VERSION
/*************************************************************************
; SUBROUTINES
**************************************************************************/

/*************************************************************************
;  Name: ValidateParameters(null) = null
;  Description:  Validates the script parameters
**************************************************************************/
subroutine ValidateParameters(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("ValidateParameters Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif

  if(textlen(sUsername) = 0)
    call ErrorHandler2(c_error_handler, "F", "ValidateParameters", "Username is required", "9999", "Username is required",
      get_shx_disc_reply_out)
    go to exit_script
  endif

  if(iDebugFlag > 0)
    call echo(concat("ValidateParameters Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine ValidateParameters

/*************************************************************************
;  Name: LoadSocialHistoryReference(replyOut = vc (ref)) = null
;  Description:  Loads social history reference information
**************************************************************************/
subroutine LoadSocialHistoryReference(replyOut)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("LoadSocialHistoryReference Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif

  ; Request shx_get_social_history_def (601050)
  free record 601050_req
  record 601050_req (
    1 category_qual [*]
      2 category_ref_id = f8
    1 all_categories_ind = i2
  )

  ; Reply shx_get_social_history_def (601050)
  free record 601050_rep
  record 601050_rep (
    1 category_qual [* ]
      2 shx_category_ref_id = f8
      2 category_cd = f8
      2 description = vc
      2 shx_category_def_id = f8
      2 comment_ind = i2
      2 element_qual [* ]
        3 shx_element_id = f8
        3 element_seq = i4
        3 task_assay_cd = f8
        3 input_type_cd = f8
        3 response_label = vc
        3 response_label_layout_flag = i2
        3 required_ind = i2
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
  )

  ; Populate request to shx_get_social_history_def (601050)
  if(dCategoryId <= 0.00)
    set 601050_req->all_categories_ind = 1
  else
    set stat = alterlist(601050_req->category_qual, 1)
    set 601050_req->category_qual[1].category_ref_id = dCategoryId
  endif

  ; Call shx_get_social_history_def (601050)
  set iTransactionTaskId = 601029
  set iStepId = 601050
  set stat = tdbexecute(c_application_id, iTransactionTaskId, iStepId, "REC", 601050_req, "REC", 601050_rep)

  ; Handle reply from shx_get_social_history_def (601050)
  if(601050_rep->status_data.status != "S")
    if(iDebugFlag > 0)
      call echorecord(601050_req)
      call echorecord(601050_rep)
    endif
  
    free record 601050_req
    free record 601050_rep

    call ErrorHandler2(c_error_handler, "F", "LoadSocialHistoryReference",
      "Call to shx_get_social_history_def (601050) failed", "9999",
      "Call to shx_get_social_history_def (601050) failed", get_shx_disc_reply_out)
    go to exit_script
  elseif(iDebugFlag > 0)
    call echorecord(601050_req)
    call echorecord(601050_rep)
  endif

  ; Request dcp_get_dta_info_all
  free record 600356_req
  record 600356_req (
    1 dta [*]
      2 task_assay_cd = f8
  )
  
  ; Reply dcp_get_dta_info_all
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

  ; Populate request to dcp_get_dta_info_all (600356)
  for(iElementIndex = 1 to iElementSize)
    if(social_history_reference->elements[iElementIndex].task_assay_cd > 0.00)
      set stat = alterlist(600356_req->dta, size(600356_req->dta, 5) + 1)
      set 600356_req->dta[size(600356_req->dta, 5)].task_assay_cd =
        social_history_reference->elements[iElementIndex].task_assay_cd
    endif
  endfor

  set CURALIAS = 601050_category 601050_rep->category_qual[iCategoryIndex]
  set CURALIAS = 601050_element 601050_rep->category_qual[iCategoryIndex].element_qual[iElementIndex]

  set iCategorySize = size(601050_rep->category_qual, 5)
  for(iCategoryIndex = 1 to iCategorySize)
    set iElementSize = size(601050_category->element_qual, 5)
    for(iElementIndex = 1 to iElementSize)
      if(601050_element->task_assay_cd > 0.00)
        set stat = alterlist(600356_req->dta, size(600356_req->dta, 5) + 1)
        set 600356_req->dta[size(600356_req->dta, 5)].task_assay_cd = 601050_element->task_assay_cd
      endif
    endfor
  endfor

  set CURALIAS 601050_category OFF
  set CURALIAS 601050_element OFF

  ; Load DTA information
  if(size(600356_req->dta, 5) > 0)
    ; Call dcp_get_dta_info_all (600356)
    set iTransactionTaskId = 600701
    set iStepId = 600356
    set stat = tdbexecute(c_application_id, iTransactionTaskId, iStepId, "REC", 600356_req, "REC", 600356_rep)

    ; Handle reply from dcp_get_dta_info_all (600356)
    set iDTASize = size(600356_rep->dta, 5)
    if(600356_rep->status_data.status != "S" and iDTASize < 1)
      if(iDebugFlag > 0)
        call echorecord(600356_req)
        call echorecord(600356_rep)
      endif

      free record 601050_req
      free record 601050_rep
      free record 600356_req
      free record 600356_rep

      call ErrorHandler2(c_error_handler, "F", "LoadSocialHistoryReference",
        "Call to dcp_get_dta_info_all (600356) failed", "9999",
        "Call to dcp_get_dta_info_all (600356) failed", get_shx_disc_reply_out)
      go to exit_script
    elseif(iDebugFlag > 0)
      call echorecord(600356_req)
      call echorecord(600356_rep)
    endif

    ; Populate reply out
    set CURALIAS = 601050_category 601050_rep->category_qual[iCategoryIndex]
    set CURALIAS = 601050_element 601050_rep->category_qual[iCategoryIndex].element_qual[iElementIndex]
    set CURALIAS = 600356_dta 600356_rep->dta[iDTAIndex]
    set CURALIAS = 600356_data_map 600356_rep->dta[iDTAIndex].data_map[iDataMapIndex]
    set CURALIAS = 600356_reference_range_factor 600356_rep->dta[iDTAIndex].ref_range_factor[iReferenceRangeFactorIndex]
    set CURALIAS = 600356_alpha_response 600356_rep->dta[iDTAIndex].ref_range_factor[iReferenceRangeFactorIndex].
      alpha_responses[iAlphaResponseIndex]
    set CURALIAS = reply_category replyOut->categories[iCategoryIndex]
    set CURALIAS = reply_field replyOut->categories[iCategoryIndex].fields[iFieldIndex]
    set CURALIAS = reply_modifier replyOut->categories[iCategoryIndex].fields[iFieldIndex].modifiers[iModifierIndex]
    set CURALIAS = reply_reference_range replyOut->categories[iCategoryIndex].fields[iFieldIndex].
      reference_ranges[iReferenceRangeFactorIndex]
    set CURALIAS = reply_value_code replyOut->categories[iCategoryIndex].fields[iFieldIndex].
      reference_ranges[iReferenceRangeFactorIndex].value_codes[iAlphaResponseIndex]

    ; Social History Categories
    set iCategorySize = size(601050_rep->category_qual, 5)
    set stat = alterlist(replyOut->categories, iCategorySize)
    for(iCategoryIndex = 1 to iCategorySize)
      set reply_category->category_id = 601050_category->shx_category_ref_id
      set reply_category->name = trim(601050_category->description, 3)
      set reply_category->comment_allowed_ind = 601050_category->comment_ind

      ; Social History Elements (Controls)
      set iFieldIndex = 0
      set iElementSize = size(601050_category->element_qual, 5)
      for(iElementIndex = 1 to iElementSize)
        if(601050_element->task_assay_cd > 0.00)
          set iFieldIndex += 1
          set stat = alterlist(reply_category->fields, iFieldIndex)
          set reply_field->field_id = 601050_element->shx_element_id
          set reply_field->name = trim(601050_element->response_label, 3)
          set reply_field->type.id = 601050_element->input_type_cd
          set reply_field->type.name = trim(uar_get_code_display(601050_element->input_type_cd), 3)
          set reply_field->required_ind = 601050_element->required_ind

          ; Add supported modifier flags
          if(601050_element->input_type_cd = c_shx_input_type_fuzzy_age_cd)
            set stat = alterlist(reply_field->modifiers, 5)

            ; Actual
            set iModifierIndex = 1
            set reply_modifier->id = c_shx_modifier_actual_age
            set reply_modifier->name = c_shx_modifier_actual_age_display

            ; About
            set iModifierIndex += 1
            set reply_modifier->id = c_shx_modifier_about_age
            set reply_modifier->name = c_shx_modifier_about_age_display

            ; Before
            set iModifierIndex += 1
            set reply_modifier->id = c_shx_modifier_before_age
            set reply_modifier->name = c_shx_modifier_before_age_display

            ; After
            set iModifierIndex += 1
            set reply_modifier->id = c_shx_modifier_after_age
            set reply_modifier->name = c_shx_modifier_after_age_display

            ; Unknown
            set iModifierIndex += 1
            set reply_modifier->id = c_shx_modifier_unknown
            set reply_modifier->name = c_shx_modifier_unknown_display
          endif

          ; DTA Information
          set iDTAIndex = locateval(iDTAIndex, 1, iDTASize, 601050_element->task_assay_cd, 600356_dta->task_assay_cd)
          if(iDTAIndex <= 0)
            free record 601050_req
            free record 601050_rep
            free record 600356_req
            free record 600356_rep

            set stat = alterlist(replyOut->categories, 0)
            call ErrorHandler2(c_error_handler, "F", "LoadSocialHistoryReference",
              "Unable to find DTA information for all fields", "9999",
              "Unable to find DTA information for all fields", get_shx_disc_reply_out)
            go to exit_script
          endif

          ; Multi-Alpha DTA Type
          if(600356_dta->default_result_type_cd in (c_result_type_multi_cd, c_result_type_multi_alpha_freetext_cd))
            set reply_field->is_multi_response = 1
            set reply_field->other_response_ind = 1
          endif

          ; Reference Range Factors
          set iReferenceRangeFactorSize = size(600356_dta->ref_range_factor, 5)
          set stat = alterlist(reply_field->reference_ranges, iReferenceRangeFactorSize)
          for(iReferenceRangeFactorIndex = 1 to iReferenceRangeFactorSize)
            ; Age From
            set iValueInMinutes = GetValueInUnit(600356_reference_range_factor->age_from_minutes,
              600356_reference_range_factor->age_from_units_cd)
            if(iValueInMinutes > 0)
              set reply_reference_range->age_from.code = 600356_reference_range_factor->age_from_units_cd
              set reply_reference_range->age_from.description =
                trim(uar_get_code_display(600356_reference_range_factor->age_from_units_cd), 3)
              set reply_reference_range->age_from.value = iValueInMinutes
            endif

            ; Age To
            set iValueInMinutes = GetValueInUnit(600356_reference_range_factor->age_to_minutes,
              600356_reference_range_factor->age_to_units_cd)
            if(iValueInMinutes > 0)
              set reply_reference_range->age_to.code = 600356_reference_range_factor->age_to_units_cd
              set reply_reference_range->age_to.description =
                trim(uar_get_code_display(600356_reference_range_factor->age_to_units_cd), 3)
              set reply_reference_range->age_to.value = iValueInMinutes
            endif

            ; Gender
            set reply_reference_range->gender.id = 600356_reference_range_factor->sex_cd
            set reply_reference_range->gender.name = trim(uar_get_code_display(600356_reference_range_factor->sex_cd), 3)

            ; Alpha Responses
            set iAlphaResponseSize = 600356_reference_range_factor->alpha_responses_cnt
            set stat = alterlist(reply_reference_range->value_codes, iAlphaResponseSize)
            for(iAlphaResponseIndex = 1 to iAlphaResponseSize)
              set reply_value_code->id = 600356_alpha_response->nomenclature_id
              set reply_value_code->name = trim(600356_alpha_response->source_string, 3)
            endfor
          endfor
        endif
      endfor
    endfor

    set CURALIAS 601050_category OFF
    set CURALIAS 601050_element OFF
    set CURALIAS 600356_dta OFF
    set CURALIAS 600356_data_map OFF
    set CURALIAS 600356_reference_range_factor OFF
    set CURALIAS 600356_alpha_response OFF
    set CURALIAS reply_category OFF
    set CURALIAS reply_field OFF
    set CURALIAS reply_modifier OFF
    set CURALIAS reply_reference_range OFF
    set CURALIAS reply_value_code OFF

    free record 601050_req
    free record 601050_rep
    free record 600356_req
    free record 600356_rep
  endif

  if(iDebugFlag > 0)
    call echo(concat("LoadSocialHistoryReference Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine LoadSocialHistoryReference

declare GetValueInUnit(iValueInMinutes, dUnitCd) = i4 with protect

/*************************************************************************
;  Name: GetValueInUnit(iValueInMinutes = i4, dUnitCd = f8)
;  Description:  Gets the value in the given unit
**************************************************************************/
subroutine GetValueInUnit(iValueInMinutes, dUnitCd)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("GetValueInUnit Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif

  if(dUnitCd > 0.00)
    case(uar_get_code_meaning(dUnitCd))
      of "MINUTES":
        return(iValueInMinutes)
      of "DAYS":
        return(iValueInMinutes / c_minutes_in_day)
      of "WEEKS":
        return(iValueInMinutes / c_minutes_in_week)
      of "MONTHS":
        return(iValueInMinutes / c_minutes_in_month)
      of "YEARS":
        return(iValueInMinutes / c_minutes_in_year)
    endcase
  endif

  if(iDebugFlag > 0)
    call echo(concat("GetValueInUnit Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif

  return(0)
end ; End subroutine GetValueInUnit

end
go
