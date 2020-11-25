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
      Source file name:    snsro_common_shx.prg
      Object name:         vigilanz_common_shx
      Program purpose:    Common subroutines for social history
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
 001 02/11/20 DSH                   Initial Write
 002 05/08/20 DSH                   Change to assume no social history activity as success
*********************************************************************************/
/********************************************************************************/
drop program vigilanz_common_shx go
create program vigilanz_common_shx

/*************************************************************************
;DATA STRUCTURES
**************************************************************************/
free record shx_common::input
record shx_common::input (
  1 PatientId = vc
  1 FacilityId = vc
  1 dPatientId = f8
  1 dOrganizationId = f8
  1 UnableToObtain = vc
  1 CategoryId = vc ; shx_category_ref_id
  1 AssessmentResponseId = vc
  1 Comment = vc
  1 FieldInputs[*]
    2 FieldId = vc
    2 CodedValueIds[*] = vc
    2 TextValues[*] = vc
    2 NumericValues[*]
      3 Value = vc
      3 UnitId = vc
      3 ModifierId = vc
) with persistscript

free record shx_common::social_history_reference
record shx_common::social_history_reference (
  1 person_id = f8
  1 sex_cd = f8
  1 age_in_minutes = f8
  1 shx_category_ref_id = f8
  1 shx_category_def_id = f8
  1 description = vc
  1 category_cd = f8
  1 comment_ind = i2
  1 required_element_cnt = i4
  1 element_cnt = i4
  1 elements[*]
    2 shx_element_id = f8
    2 element_seq = i4
    2 task_assay_cd = f8
    2 input_type_cd = f8
    2 response_label = vc
    2 response_label_layout_flag = i2
    2 required_ind = i2
    2 event_cd = f8
    2 default_result_type_cd = f8
    2 reference_range_factor_cnt = i4
    2 reference_range_factors[*]
      3 sex_cd = f8
      3 age_from_minutes = i4
      3 age_to_minutes = i4
      3 units_cd = f8
      3 alpha_response_cnt = i4
      3 alpha_responses[*]
        4 nomenclature_id = f8
        4 short_string = vc
    2 modifier_flag_cnt = i4
    2 modifier_flags[*]
      3 flag_value = i2
      3 display = vc
    2 supports_alpha_responses_ind = i2
    2 supports_multiple_responses_ind = i2
    2 supports_other_alpha_response_ind = i2
    2 supports_text_response_ind = i2
    2 supports_numeric_response_ind = i2
) with persistscript

free record shx_common::social_history_activity
record shx_common::social_history_activity (
  1 person_id = f8
  1 has_unable_to_obtain_ind = i2
  1 unable_to_obtain[*]
    2 shx_activity_id = f8
    2 shx_activity_group_id = f8
    2 unable_to_obtain_ind = i2
  1 has_details_ind = i2
  1 details[*]
    2 shx_activity_id = f8
    2 shx_activity_group_id = f8
    2 detail_summary_text_id = f8
    2 response_cnt = i4
    2 responses[*]
      3 social_history_reference_element_idx = i4
      3 alpha_response_cnt = i4
      3 alpha_responses[*]
        4 nomenclature_id = f8
        4 other_text = vc
      3 text_response = vc
      3 numeric_response_cnt = i2
      3 numeric_responses[*]
        4 value = vc
        4 unit_cd = f8
        4 modifier_flag = i2
) with persistscript

free record shx_common::updated_social_history
record shx_common::updated_social_history (
  1 person_id = f8
  1 organization_id = f8
  1 workflow_delete_ind = i2
  1 has_unable_to_obtain_ind = i2
  1 unable_to_obtain[*]
    2 shx_activity_id = f8
    2 shx_activity_group_id = f8
    2 unable_to_obtain_ind = i2
  1 has_details_ind = i2
  1 details[*]
    2 shx_activity_id = f8
    2 shx_activity_group_id = f8
    2 detail_summary_text_id = f8
    2 comment = vc
    2 detail_summary = vc
    2 response_cnt = i4
    2 responses[*]
      3 social_history_reference_element_idx = i4
      3 alpha_response_cnt = i4
      3 alpha_responses[*]
        4 nomenclature_id = f8
        4 short_string = vc
        4 other_text = vc
      3 invalid_alpha_response_cnt = i4
      3 invalid_alpha_responses[*]
        4 nomenclature_id = f8
      3 text_response_cnt = i4
      3 text_response = vc
      3 numeric_response_cnt = i2
      3 numeric_responses[*]
        4 value = vc
        4 unit_cd = f8
        4 modifier_flag = i2
        4 modifier_display = vc
) with persistscript

/*************************************************************************
;DECLARE VARIABLES
**************************************************************************/
declare shx_common::c_time_zone_index = i4 with persistscript, constant(CURTIMEZONEAPP)
declare shx_common::c_now_dt_tm = dq8 with persistscript, constant(cnvtdatetime(curdate,curtime3))

; Social History Response Modifier Flags
declare shx_common::c_shx_modifier_invalid_input = i4 with persistscript, constant(-1)
declare shx_common::c_shx_modifier_actual_age = i4 with persistscript, constant(0)
declare shx_common::c_shx_modifier_about_age = i4 with persistscript, constant(1)
declare shx_common::c_shx_modifier_before_age = i4 with persistscript, constant(2)
declare shx_common::c_shx_modifier_after_age = i4 with persistscript, constant(3)
declare shx_common::c_shx_modifier_unknown = i4 with persistscript, constant(4)

; Social History Response Modifier Displays
declare shx_common::c_shx_modifier_about_age_display = vc with persistscript, constant("About")
declare shx_common::c_shx_modifier_before_age_display = vc with persistscript, constant("Before")
declare shx_common::c_shx_modifier_after_age_display = vc with persistscript, constant("After")
declare shx_common::c_shx_modifier_unknown_display = vc with persistscript, constant("Unknown")

; Social History Label Layout Flags
declare shx_common::c_shx_response_label_layout_none = i4 with persistscript, constant(0)
declare shx_common::c_shx_response_label_layout_prefix = i4 with persistscript, constant(1)
declare shx_common::c_shx_response_label_layout_suffix = i4 with persistscript, constant(2)

; Code Set 48
declare shx_common::c_status_active_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",48,"ACTIVE"))

; Code Set 222 - Location Type
declare shx_common::c_location_facility_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",222,"FACILITY"))

; Code Set 289 - DTA Result Type
declare shx_common::c_result_type_text_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"1"))
declare shx_common::c_result_type_alpha_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"2"))
declare shx_common::c_result_type_numeric_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"3"))
declare shx_common::c_result_type_interp_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"4"))
declare shx_common::c_result_type_multi_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"5"))
declare shx_common::c_result_type_date_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"6"))
declare shx_common::c_result_type_freetext_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"7"))
declare shx_common::c_result_type_calculation_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"8"))
declare shx_common::c_result_type_on_line_code_set_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"9"))
declare shx_common::c_result_type_time_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"10"))
declare shx_common::c_result_type_date_time_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"11"))
declare shx_common::c_result_type_read_only_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"12"))
declare shx_common::c_result_type_count_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"13"))
declare shx_common::c_result_type_provider_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"14"))
declare shx_common::c_result_type_orc_select_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"15"))
declare shx_common::c_result_type_inventory_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"16"))
declare shx_common::c_result_type_bill_only_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"17"))
declare shx_common::c_result_type_yes_no_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"18"))
declare shx_common::c_result_type_date_time_time_zone_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"19"))
declare shx_common::c_result_type_alpha_freetext_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"21"))
declare shx_common::c_result_type_multi_alpha_freetext_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",289,"22"))

; Code Set 340
declare shx_common::c_time_unit_years_cd = f8 with persistscript, constant(uar_get_code_by("MEANING",340,"YEARS"))

; Code Set 6016 (Privilege)
declare shx_common::c_privilege_view_social_history_cd = f8
  with persistscript, constant(uar_get_code_by("MEANING",6016,"VIEWSOCHIST"))
declare shx_common::c_privilege_update_social_history_cd = f8
  with persistscript, constant(uar_get_code_by("MEANING",6016,"UPDSOCHIST"))

; Code Set 4002169
declare shx_common::c_shx_input_type_fuzzy_age_cd = f8
  with persistscript, constant(uar_get_code_by("MEANING",4002169,"FUZZYAGE"))

; Code Set 4002172
declare shx_common::c_shx_activity_status_active_cd = f8
  with persistscript, constant(uar_get_code_by("MEANING",4002172,"ACTIVE"))

declare shx_common::c_application_id = i4 with persistscript, constant(600005)
declare shx_common::iApplicationId = i4 with persistscript, noconstant(0)
declare shx_common::iTransactionTaskId = i4 with persistscript, noconstant(0)
declare shx_common::iStepId = i4 with persistscript, noconstant(0)
declare shx_common::iIndex = i4 with persistscript, noconstant(0)
declare shx_common::iActivitySize = i2 with persistscript, noconstant(0)
declare shx_common::iActivityIndex = i2 with persistscript, noconstant(0)
declare shx_common::iElementSize = i2 with persistscript, noconstant(0)
declare shx_common::iElementIndex = i2 with persistscript, noconstant(0)
declare shx_common::iDTASize = i2 with persistscript, noconstant(0)
declare shx_common::iDTAIndex = i2 with persistscript, noconstant(0)
declare shx_common::iReferenceRangeFactorIndex = i2 with persistscript, noconstant(0)
declare shx_common::iAlphaResponseSize = i2 with persistscript, noconstant(0)
declare shx_common::iAlphaResponseIndex = i2 with persistscript, noconstant(0)
declare shx_common::iSocialHistoryPrivilegeCount = i4 with persistscript, noconstant(2)
declare shx_common::iPrivilegeGrantedCount = i4 with persistscript, noconstant(2)
declare shx_common::iFieldInputIndex = i4 with persistscript, noconstant(0)
declare shx_common::iValueIndex = i4 with persistscript, noconstant(0)
declare shx_common::iResponseIndex = i4 with persistscript, noconstant(0)
declare shx_common::iNumericResponseIndex = i4 with persistscript, noconstant(0)
declare shx_common::iModifierFlag = i4 with persistscript, noconstant(0)
declare shx_common::iRequiredElementsAnsweredCount = i4 with persistscript, noconstant(0)
declare shx_common::iSuccess = i2 with persistscript, noconstant(0)

declare shx_common::dNomenclatureId = f8 with persistscript, noconstant(0.00)
declare shx_common::dFieldId = f8 with persistscript, noconstant(0.00)
declare shx_common::dSocialHistoryId = f8 with persistscript, noconstant(0.00)

declare shx_common::sDetailSummary = vc with persistscript, noconstant("")
declare shx_common::sResponseSummary = vc with persistscript, noconstant("")
declare shx_common::sResponse = vc with persistscript, noconstant("")

/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare shx_common::LoadSocialHistoryReference(dPatientId = f8, dSocialHistoryCategoryReferenceId = f8) = i2 with persistscript
declare shx_common::LoadSocialHistoryActivity(dPatientId = f8, dUserId = f8,
  dSocialHistoryCategoryReferenceId = f8) = i2 with persistscript
declare shx_common::LoadSocialHistoryActivityDetails(dSocialHistoryId = f8) = i2 with persistscript
declare shx_common::HasPrivilegeToUpdateSocialHistory(null) = i2 with persistscript
declare shx_common::PopulateUpdatedSocialHistory(dPatientId = f8, dOrganizationId = f8, dFacilityCd = f8,
  iDeleteInd = i2) = i2 with persistscript
declare shx_common::BuildDetailSummary(sDetailSummary = vc (ref)) = i2 with persistscript
declare shx_common::BuildResponseSummary(iResponseIndex = i4, sResponseSummary = vc (ref)) = i2 with persistscript
declare shx_common::BuildResponse(iResponseIndex = i4, sResponse = vc (ref)) = i2 with persistscript
declare shx_common::ValidateNumericInput(sValue = vc, sFieldName = vc, sFailureMessage = vc (ref)) = i2 with persistscript
declare shx_common::ValidateSocialHistoryInput(sFailureMessage = vc (ref)) = i2 with persistscript
declare shx_common::ValidateUpdatedSocialHistory(sFailureMessage = vc (ref)) = i2 with persistscript
declare shx_common::WriteSocialHistoryActivity(dUserId = f8) = f8 with persistscript

/*************************************************************************
; SUBROUTINES
**************************************************************************/

/*************************************************************************
;  Name: shx_common::LoadSocialHistoryReference(dPatientId = f8, dSocialHistoryCategoryReferenceId = f8) = i2
;  Description:  Loads social history reference information
;  Return: 1 if successful. Otherwise, 0.
**************************************************************************/
subroutine shx_common::LoadSocialHistoryReference(dPatientId, dSocialHistoryCategoryReferenceId)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("shx_common::LoadSocialHistoryReference Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif

  if(dPatientId <= 0.00)
    call echo("dPatientId was not positive")
    return(0)
  endif

  if(dSocialHistoryCategoryReferenceId <= 0.00)
    call echo("dSocialHistoryCategoryReferenceId was not positive")
    return(0)
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
  set stat = alterlist(601050_req->category_qual, 1)
  set 601050_req->category_qual[1].category_ref_id = dSocialHistoryCategoryReferenceId

  ; Call shx_get_social_history_def (601050)
  set shx_common::iTransactionTaskId = 601029
  set shx_common::iStepId = 601050
  set stat = tdbexecute(shx_common::c_application_id, shx_common::iTransactionTaskId, shx_common::iStepId, "REC",
    601050_req, "REC", 601050_rep)

  ; Handle reply from shx_get_social_history_def (601050)
  if(601050_rep->status_data.status != "S" and size(601050_rep->category_qual, 5) < 1)
    if(iDebugFlag > 0)
      call echorecord(601050_req)
      call echorecord(601050_rep)
    endif
  
    free record 601050_req
    free record 601050_rep

    call echo("Call to shx_get_social_history_def (601050) failed")
    return(0)
  elseif(iDebugFlag > 0)
    call echorecord(601050_req)
    call echorecord(601050_rep)
  endif

  set shx_common::social_history_reference->person_id = dPatientId
  set shx_common::social_history_reference->shx_category_ref_id = dSocialHistoryCategoryReferenceId
  set shx_common::social_history_reference->shx_category_ref_id = 601050_rep->category_qual[1].shx_category_ref_id
  set shx_common::social_history_reference->shx_category_def_id = 601050_rep->category_qual[1].shx_category_def_id
  set shx_common::social_history_reference->description = trim(601050_rep->category_qual[1].description, 3)
  set shx_common::social_history_reference->category_cd = 601050_rep->category_qual[1].category_cd
  set shx_common::social_history_reference->comment_ind = 601050_rep->category_qual[1].comment_ind
  
  ; Elements
  set shx_common::iElementSize = size(601050_rep->category_qual[1].element_qual, 5)
  set shx_common::social_history_reference->element_cnt = shx_common::iElementSize
  set stat = alterlist(shx_common::social_history_reference->elements, shx_common::iElementSize)
  for(shx_common::iElementIndex = 1 to shx_common::iElementSize)
    set shx_common::social_history_reference->elements[shx_common::iElementIndex].shx_element_id =
      601050_rep->category_qual[1].element_qual[shx_common::iElementIndex].shx_element_id
    set shx_common::social_history_reference->elements[shx_common::iElementIndex].element_seq =
      601050_rep->category_qual[1].element_qual[shx_common::iElementIndex].element_seq
    set shx_common::social_history_reference->elements[shx_common::iElementIndex].task_assay_cd =
      601050_rep->category_qual[1].element_qual[shx_common::iElementIndex].task_assay_cd
    set shx_common::social_history_reference->elements[shx_common::iElementIndex].input_type_cd =
      601050_rep->category_qual[1].element_qual[shx_common::iElementIndex].input_type_cd
    set shx_common::social_history_reference->elements[shx_common::iElementIndex].response_label =
      601050_rep->category_qual[1].element_qual[shx_common::iElementIndex].response_label
    set shx_common::social_history_reference->elements[shx_common::iElementIndex].response_label_layout_flag =
      601050_rep->category_qual[1].element_qual[shx_common::iElementIndex].response_label_layout_flag
    set shx_common::social_history_reference->elements[shx_common::iElementIndex].required_ind =
      601050_rep->category_qual[1].element_qual[shx_common::iElementIndex].required_ind

    ; Required element count
    set shx_common::social_history_reference->required_element_cnt +=
      shx_common::social_history_reference->elements[shx_common::iElementIndex].required_ind
    
    ; Add supported modifier flags
    if(shx_common::social_history_reference->elements[shx_common::iElementIndex].input_type_cd =
        shx_common::c_shx_input_type_fuzzy_age_cd)
      set shx_common::social_history_reference->elements[shx_common::iElementIndex].modifier_flag_cnt = 5
      set stat = alterlist(shx_common::social_history_reference->elements[shx_common::iElementIndex].modifier_flags, 5)
      
      ; Actual
      set shx_common::social_history_reference->elements[shx_common::iElementIndex].modifier_flags[1].flag_value =
        shx_common::c_shx_modifier_actual_age
      set shx_common::social_history_reference->elements[shx_common::iElementIndex].modifier_flags[1].display = ""

      ; About
      set shx_common::social_history_reference->elements[shx_common::iElementIndex].modifier_flags[2].flag_value =
        shx_common::c_shx_modifier_about_age
      set shx_common::social_history_reference->elements[shx_common::iElementIndex].modifier_flags[2].display =
        shx_common::c_shx_modifier_about_age_display
      
      ; Before
      set shx_common::social_history_reference->elements[shx_common::iElementIndex].modifier_flags[3].flag_value =
        shx_common::c_shx_modifier_before_age
      set shx_common::social_history_reference->elements[shx_common::iElementIndex].modifier_flags[3].display =
        shx_common::c_shx_modifier_before_age_display

      ; After
      set shx_common::social_history_reference->elements[shx_common::iElementIndex].modifier_flags[4].flag_value =
        shx_common::c_shx_modifier_after_age
      set shx_common::social_history_reference->elements[shx_common::iElementIndex].modifier_flags[4].display =
        shx_common::c_shx_modifier_after_age_display
      
      ; Unknown
      set shx_common::social_history_reference->elements[shx_common::iElementIndex].modifier_flags[5].flag_value =
        shx_common::c_shx_modifier_unknown
      set shx_common::social_history_reference->elements[shx_common::iElementIndex].modifier_flags[5].display =
        shx_common::c_shx_modifier_unknown_display
    endif
  endfor

  free record 601050_req
  free record 601050_rep

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
  for(shx_common::iElementIndex = 1 to shx_common::iElementSize)
    if(shx_common::social_history_reference->elements[shx_common::iElementIndex].task_assay_cd > 0.00)
      set stat = alterlist(600356_req->dta, size(600356_req->dta, 5) + 1)
      set 600356_req->dta[size(600356_req->dta, 5)].task_assay_cd =
        shx_common::social_history_reference->elements[shx_common::iElementIndex].task_assay_cd
    endif
  endfor

  ; Load DTA information
  if(size(600356_req->dta, 5) > 0)
    ; Call dcp_get_dta_info_all (600356)
    set shx_common::iTransactionTaskId = 600701
    set shx_common::iStepId = 600356
    set stat = tdbexecute(shx_common::c_application_id, shx_common::iTransactionTaskId, shx_common::iStepId, "REC",
      600356_req, "REC", 600356_rep)

    ; Handle reply from dcp_get_dta_info_all (600356)
    set shx_common::iDTASize = size(600356_rep->dta, 5)
    if(600356_rep->status_data.status != "S" and shx_common::iDTASize < 1)
      if(iDebugFlag > 0)
        call echorecord(600356_req)
        call echorecord(600356_rep)
      endif

      free record 600356_req
      free record 600356_rep

      call echo("Call to dcp_get_dta_info_all (600356) failed")
      return(0)
    elseif(iDebugFlag > 0)
      call echorecord(600356_req)
      call echorecord(600356_rep)
    endif

    ; Load the patient's demographics for filtering the reference ranges
    select into "nl:"
      p.sex_cd,
      age_in_minutes = datetimediff(cnvtdatetime(curdate,curtime3), cnvtdatetime(p.birth_dt_tm) ,4)
    from
      person p
    plan p where p.person_id = dPatientId
    detail
      shx_common::social_history_reference->sex_cd = p.sex_cd
      shx_common::social_history_reference->age_in_minutes = age_in_minutes
    with nocounter

    ; Handle no patient data returned
    if(curqual < 1)
      call echo("Query to load patient demographics did not return any data")

      free record 600356_req
      free record 600356_rep
      return(0)
    endif

    ; Populate DTAs
    for(shx_common::iElementIndex = 1 to shx_common::iElementSize)
      if(shx_common::social_history_reference->elements[shx_common::iElementIndex].task_assay_cd > 0.00)
        set shx_common::iDTAIndex = locateval(shx_common::iDTAIndex, 1, shx_common::iDTASize,
          shx_common::social_history_reference->elements[shx_common::iElementIndex].task_assay_cd,
          600356_rep->dta[shx_common::iDTAIndex].task_assay_cd)
        if(shx_common::iDTAIndex < 1)
          call echo(build2("Unable to find dta=", shx_common::social_history_reference->
            elements[shx_common::iElementIndex].task_assay_cd))

          free record 600356_req
          free record 600356_rep
          return(0)
        else
          set shx_common::social_history_reference->elements[shx_common::iElementIndex].event_cd =
            600356_rep->dta[shx_common::iDTAIndex].event_cd
          set shx_common::social_history_reference->elements[shx_common::iElementIndex].default_result_type_cd =
            600356_rep->dta[shx_common::iDTAIndex].default_result_type_cd
          
          ; Nomenclature Values
          if(600356_rep->dta[shx_common::iDTAIndex].default_result_type_cd
            in (shx_common::c_result_type_alpha_cd, shx_common::c_result_type_multi_cd,
              shx_common::c_result_type_alpha_freetext_cd, shx_common::c_result_type_multi_alpha_freetext_cd))
            
            set shx_common::social_history_reference->elements[shx_common::iElementIndex].supports_alpha_responses_ind = 1

            if(600356_rep->dta[shx_common::iDTAIndex].default_result_type_cd
              in (shx_common::c_result_type_multi_cd, shx_common::c_result_type_multi_alpha_freetext_cd))
              set shx_common::social_history_reference->elements[shx_common::iElementIndex].supports_multiple_responses_ind = 1
              set shx_common::social_history_reference->elements[shx_common::iElementIndex].supports_other_alpha_response_ind = 1
            endif
          ; Freetext Values
          elseif(600356_rep->dta[shx_common::iDTAIndex].default_result_type_cd
            in (shx_common::c_result_type_text_cd, shx_common::c_result_type_freetext_cd, shx_common::c_result_type_provider_cd))
            
            set shx_common::social_history_reference->elements[shx_common::iElementIndex].supports_text_response_ind = 1
          ; Numeric Values
          elseif(600356_rep->dta[shx_common::iDTAIndex].default_result_type_cd
            in (shx_common::c_result_type_numeric_cd, shx_common::c_result_type_count_cd))

            set shx_common::social_history_reference->elements[shx_common::iElementIndex].supports_numeric_response_ind = 1
          endif

          ; Reference Range Factors
          set shx_common::iReferenceRangeFactorIndex = 0
          for(i = 1 to size(600356_rep->dta[shx_common::iDTAIndex].ref_range_factor, 5))
            ; Only add the reference range factor if the patient demographics match
            if((600356_rep->dta[shx_common::iDTAIndex].ref_range_factor[i].sex_cd = 0
                or 600356_rep->dta[shx_common::iDTAIndex].ref_range_factor[i].sex_cd =
                shx_common::social_history_reference->sex_cd)
              and
              600356_rep->dta[shx_common::iDTAIndex].ref_range_factor[i].age_from_minutes <
                shx_common::social_history_reference->age_in_minutes
              and
              600356_rep->dta[shx_common::iDTAIndex].ref_range_factor[i].age_to_minutes >
                shx_common::social_history_reference->age_in_minutes
            )
              set shx_common::iReferenceRangeFactorIndex += 1
              set shx_common::social_history_reference->elements[shx_common::iElementIndex].reference_range_factor_cnt =
                shx_common::iReferenceRangeFactorIndex
              set stat = alterlist(shx_common::social_history_reference->elements[shx_common::iElementIndex].
                reference_range_factors, shx_common::iReferenceRangeFactorIndex)

              set shx_common::social_history_reference->
                  elements[shx_common::iElementIndex].
                  reference_range_factors[shx_common::iReferenceRangeFactorIndex].
                units_cd = 600356_rep->dta[shx_common::iDTAIndex].ref_range_factor[i].units_cd
              set shx_common::social_history_reference->
                  elements[shx_common::iElementIndex].
                  reference_range_factors[shx_common::iReferenceRangeFactorIndex].
                sex_cd = 600356_rep->dta[shx_common::iDTAIndex].ref_range_factor[i].sex_cd
              set shx_common::social_history_reference->
                  elements[shx_common::iElementIndex].
                  reference_range_factors[shx_common::iReferenceRangeFactorIndex].
                age_from_minutes = 600356_rep->dta[shx_common::iDTAIndex].ref_range_factor[i].age_from_minutes
              set shx_common::social_history_reference->
                  elements[shx_common::iElementIndex].
                  reference_range_factors[shx_common::iReferenceRangeFactorIndex].
                age_to_minutes = 600356_rep->dta[shx_common::iDTAIndex].ref_range_factor[i].age_to_minutes

              ; Alpha Responses
              set shx_common::iAlphaResponseSize = 600356_rep->dta[shx_common::iDTAIndex].ref_range_factor[i].alpha_responses_cnt
              set shx_common::social_history_reference->
                  elements[shx_common::iElementIndex].
                  reference_range_factors[shx_common::iReferenceRangeFactorIndex].
                alpha_response_cnt = shx_common::iAlphaResponseSize
              set stat = alterlist(shx_common::social_history_reference->
                  elements[shx_common::iElementIndex].
                  reference_range_factors[shx_common::iReferenceRangeFactorIndex].
                alpha_responses, shx_common::iAlphaResponseSize)
              for(shx_common::iAlphaResponseIndex = 1 to shx_common::iAlphaResponseSize)
                set shx_common::social_history_reference->
                    elements[shx_common::iElementIndex].
                    reference_range_factors[shx_common::iReferenceRangeFactorIndex].
                    alpha_responses[shx_common::iAlphaResponseIndex].
                  nomenclature_id =
                  600356_rep->
                    dta[shx_common::iDTAIndex].
                    ref_range_factor[i].
                    alpha_responses[shx_common::iAlphaResponseIndex].
                  nomenclature_id
                set shx_common::social_history_reference->
                    elements[shx_common::iElementIndex].
                    reference_range_factors[shx_common::iReferenceRangeFactorIndex].
                    alpha_responses[shx_common::iAlphaResponseIndex].
                  short_string =
                  trim(600356_rep->
                    dta[shx_common::iDTAIndex].
                    ref_range_factor[i].
                    alpha_responses[shx_common::iAlphaResponseIndex].
                  short_string, 3)
              endfor
            endif
          endfor
        endif
      endif
    endfor

    free record 600356_req
    free record 600356_rep
  endif ; Load DTA information

  if(iDebugFlag > 0)
    call echorecord(shx_common::social_history_reference)

    call echo(concat("shx_common::LoadSocialHistoryReference Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif

  return(1)
end ; End subroutine shx_common::LoadSocialHistoryReference

/*************************************************************************
;  Name: shx_common::LoadSocialHistoryActivity(dPatientId = f8, dUserId = f8, dSocialHistoryCategoryReferenceId = f8) = i2
;  Description:  Loads social history activity information
;  Return: 1 if successful. Otherwise, 0.
**************************************************************************/
subroutine shx_common::LoadSocialHistoryActivity(dPatientId, dUserId, dSocialHistoryCategoryReferenceId)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("shx_common::LoadSocialHistoryActivity Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif

  if(dPatientId <= 0.00)
    call echo("dPatientId was not positive")
    return(0)
  endif

  if(dUserId <= 0.00)
    call echo("dUserId was not positive")
    return(0)
  endif

  if(dSocialHistoryCategoryReferenceId < 0.00)
    call echo("dSocialHistoryCategoryReferenceId was negative")
    return(0)
  endif

  set shx_common::social_history_activity->person_id = dPatientId

  ; Request shx_get_activity (601052)
  free record 601052_req 
  record 601052_req (
    1 person_id = f8   
    1 prsnl_id = f8   
    1 category_qual [*]   
      2 shx_category_ref_id = f8   
  )

  ; Reply shx_get_activity (601052)
  free record 601052_rep
  record 601052_rep (
    1 activity_qual [* ]
      2 shx_category_ref_id = f8
      2 shx_category_def_id = f8
      2 shx_activity_id = f8
      2 shx_activity_group_id = f8
      2 person_id = f8
      2 organization_id = f8
      2 type_mean = c12
      2 unable_to_obtain_ind = i2
      2 status_cd = f8
      2 assessment_cd = f8
      2 detail_summary_text_id = f8
      2 detail_summary = vc
      2 last_review_dt_tm = dq8
      2 last_updt_prsnl_id = f8
      2 last_updt_prsnl_name = vc
      2 last_updt_dt_tm = dq8
      2 updt_cnt = i4
      2 comment_qual [* ]
        3 shx_comment_id = f8
        3 long_text_id = f8
        3 long_text = vc
        3 comment_prsnl_id = f8
        3 comment_prsnl_full_name = vc
        3 comment_dt_tm = dq8
        3 comment_dt_tm_tz = i4
        3 updt_cnt = i4
      2 action_qual [* ]
        3 shx_action_id = f8
        3 prsnl_id = f8
        3 prsnl_full_name = vc
        3 action_type_mean = c12
        3 action_dt_tm = dq8
        3 action_tz = i4
        3 updt_cnt = i4
      2 beg_effective_dt_tm = dq8
      2 last_updt_tz = i4
    1 incomplete_data_ind = i2
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
  )

  ; Populate request to shx_get_activity (601052)
  set 601052_req->person_id = dPatientId
  set 601052_req->prsnl_id = dUserId
  set stat = alterlist(601052_req->category_qual, 1)
  set 601052_req->category_qual[1].shx_category_ref_id = dSocialHistoryCategoryReferenceId

  ; Call shx_get_activity (601052)
  set shx_common::iTransactionTaskId = 601029
  set shx_common::iStepId = 601052
  set stat = tdbexecute(shx_common::c_application_id, shx_common::iTransactionTaskId, shx_common::iStepId, "REC",
    601052_req, "REC", 601052_rep)

  ; Handle reply from shx_get_activity (601052)
  if(601052_rep->status_data.status not in ("S", "Z"))
    if(iDebugFlag > 0)
      call echorecord(601052_req)
      call echorecord(601052_rep)
    endif

    free record 601052_req
    free record 601052_rep

    call echo("Call to shx_get_activity failed (step_id=601052)")
    return(0)
  elseif(iDebugFlag > 0)
    call echorecord(601052_req)
    call echorecord(601052_rep)
  endif

  set shx_common::iActivitySize = size(601052_rep->activity_qual, 5)
  set shx_common::iActivityIndex = 0
  for(shx_common::iActivityIndex = 1 to shx_common::iActivitySize)
    ; Only process active activity information
    if(601052_rep->activity_qual[shx_common::iActivityIndex].status_cd = shx_common::c_shx_activity_status_active_cd)
      ; Populate unable to obtain
      if(trim(601052_rep->activity_qual[shx_common::iActivityIndex].type_mean, 3) = "PERSON")
        set shx_common::social_history_activity->has_unable_to_obtain_ind = 1
        set stat = alterlist(shx_common::social_history_activity->unable_to_obtain, 1)
        set shx_common::social_history_activity->unable_to_obtain[1].shx_activity_id =
          601052_rep->activity_qual[shx_common::iActivityIndex].shx_activity_id
        set shx_common::social_history_activity->unable_to_obtain[1].shx_activity_group_id =
          601052_rep->activity_qual[shx_common::iActivityIndex].shx_activity_group_id
        set shx_common::social_history_activity->unable_to_obtain[1].unable_to_obtain_ind =
          601052_rep->activity_qual[shx_common::iActivityIndex].unable_to_obtain_ind
      endif
    endif
  endfor

  free record 601052_req
  free record 601052_rep

  if(iDebugFlag > 0)
    call echo(concat("shx_common::LoadSocialHistoryActivity Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif

  return(1)
end ;End subroutine shx_common::LoadSocialHistoryActivity

/*************************************************************************
;  Name: shx_common::LoadSocialHistoryActivityDetails(dSocialHistoryId = f8) = i2
;  Description:  Loads social history activity detail information
;  Return: 1 if successful. Otherwise, 0.
**************************************************************************/
subroutine shx_common::LoadSocialHistoryActivityDetails(dSocialHistoryId)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("shx_common::LoadSocialHistoryActivityDetails Begin",
      format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif

  if(dSocialHistoryId <= 0.00)
    call echo("dSocialHistoryId was not positive")
    return(0)
  endif

  set shx_common::social_history_activity->person_id = dPatientId

  ; Request shx_get_activity_detail (601053)
  free record 601053_req 
  record 601053_req (
    1 qual [*]   
      2 shx_activity_group_id = f8   
  )

  ; Reply shx_get_activity_detail (601053)
  free record 601053_rep
  record 601053_rep (
    1 activity_qual [* ]
      2 shx_category_def_id = f8
      2 shx_activity_id = f8
      2 shx_activity_group_id = f8
      2 person_id = f8
      2 organization_id = f8
      2 type_mean = c12
      2 status_cd = f8
      2 assessment_cd = f8
      2 detail_summary_text_id = f8
      2 detail_summary = vc
      2 perform_dt_tm = dq8
      2 last_review_dt_tm = dq8
      2 updt_cnt = i4
      2 response_qual [* ]
        3 shx_response_id = f8
        3 task_assay_cd = f8
        3 response_type = c12
        3 response_val = c255
        3 response_unit_cd = f8
        3 modifier_flag = i2
        3 long_text_id = f8
        3 long_text = vc
        3 updt_cnt = i4
        3 alpha_response_qual [* ]
          4 shx_alpha_response_id = f8
          4 nomenclature_id = f8
          4 other_text = c255
          4 updt_cnt = i4
      2 comment_qual [* ]
        3 shx_comment_id = f8
        3 long_text_id = f8
        3 long_text = vc
        3 comment_prsnl_id = f8
        3 comment_prsnl_full_name = vc
        3 comment_dt_tm = dq8
        3 comment_dt_tm_tz = i4
        3 updt_cnt = i4
      2 beg_effective_dt_tm = dq8
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
  )

  ; Populate request to shx_get_activity_detail (601053)
  set stat = alterlist(601053_req->qual, 1)
  set 601053_req->qual[1].shx_activity_group_id = dSocialHistoryId

  ; Call shx_get_activity_detail (601053)
  set shx_common::iTransactionTaskId = 601029
  set shx_common::iStepId = 601053
  set stat = tdbexecute(shx_common::c_application_id, shx_common::iTransactionTaskId, shx_common::iStepId, "REC",
    601053_req, "REC", 601053_rep)

  ; Handle reply from shx_get_activity_detail (601053)
  if(601053_rep->status_data.status != "S")
    if(iDebugFlag > 0)
      call echorecord(601053_req)
      call echorecord(601053_rep)
    endif

    free record 601053_req
    free record 601053_rep

    call echo("Call to shx_get_activity_detail failed (step_id=601053)")
    return(0)
  elseif(iDebugFlag > 0)
    call echorecord(601053_req)
    call echorecord(601053_rep)
  endif

  set shx_common::iActivitySize = size(601053_rep->activity_qual, 5)
  set shx_common::iActivityIndex = 0
  for(shx_common::iActivityIndex = 1 to shx_common::iActivitySize)
    ; Only process active activity information
    if(601053_rep->activity_qual[shx_common::iActivityIndex].status_cd = shx_common::c_shx_activity_status_active_cd)
      ; Populate unable to obtain
      if(trim(601053_rep->activity_qual[shx_common::iActivityIndex].type_mean, 3) = "DETAIL")
        set shx_common::social_history_activity->has_details_ind = 1
        set stat = alterlist(shx_common::social_history_activity->details, 1)
        set shx_common::social_history_activity->details[1].shx_activity_id =
          601053_rep->activity_qual[shx_common::iActivityIndex].shx_activity_id
        set shx_common::social_history_activity->details[1].shx_activity_group_id =
          601053_rep->activity_qual[shx_common::iActivityIndex].shx_activity_group_id
        set shx_common::social_history_activity->details[1].detail_summary_text_id =
          601053_rep->activity_qual[shx_common::iActivityIndex].detail_summary_text_id
        
        ; Responses
        set shx_common::social_history_activity->details[1].response_cnt =
          size(601053_rep->activity_qual[shx_common::iActivityIndex].response_qual, 5)
        set stat = alterlist(shx_common::social_history_activity->details[1].responses,
          shx_common::social_history_activity->details[1].response_cnt)
        for(shx_common::iResponseIndex = 1 to shx_common::social_history_activity->details[1].response_cnt)
          ; Find the reference for the response
          set shx_common::iElementIndex = locateval(shx_common::iElementIndex, 1,
            shx_common::social_history_reference->element_cnt,
            601053_rep->activity_qual[shx_common::iActivityIndex].response_qual[shx_common::iResponseIndex].task_assay_cd,
            shx_common::social_history_reference->elements[shx_common::iElementIndex].task_assay_cd)

          if(shx_common::iElementIndex > 0)
            set shx_common::social_history_activity->details[1].responses[shx_common::iResponseIndex].
              social_history_reference_element_idx= shx_common::iElementIndex

            case(trim(601053_rep->activity_qual[shx_common::iActivityIndex].response_qual[shx_common::iResponseIndex].
              response_type, 3))
              of "ALPHA":
                ; Alpha responses
                set shx_common::iAlphaResponseSize =
                  size(601053_rep->activity_qual[shx_common::iActivityIndex].response_qual[shx_common::iResponseIndex].
                    alpha_response_qual, 5)
                set shx_common::social_history_activity->details[1].responses[shx_common::iResponseIndex].
                  alpha_response_cnt = shx_common::iAlphaResponseSize
                set stat = alterlist(shx_common::social_history_activity->details[1].responses[shx_common::iResponseIndex].
                  alpha_responses, shx_common::iAlphaResponseSize)
                for(shx_common::iAlphaResponseIndex = 1 to shx_common::iAlphaResponseSize)
                  ; Nomenclature id
                  set shx_common::social_history_activity->details[1].responses[shx_common::iResponseIndex].
                    alpha_responses[shx_common::iAlphaResponseIndex].nomenclature_id =
                      601053_rep->activity_qual[shx_common::iActivityIndex].response_qual[shx_common::iResponseIndex].
                        alpha_response_qual[shx_common::iAlphaResponseIndex].nomenclature_id
                  ; Other text
                  set shx_common::social_history_activity->details[1].responses[shx_common::iResponseIndex].text_response =
                      trim(601053_rep->activity_qual[shx_common::iActivityIndex].response_qual[shx_common::iResponseIndex].
                        alpha_response_qual[shx_common::iAlphaResponseIndex].other_text, 3)
                endfor
              of "FREETEXT":
                ; Text response
                set shx_common::social_history_activity->details[1].responses[shx_common::iResponseIndex].text_response =
                  trim(601053_rep->activity_qual[shx_common::iActivityIndex].response_qual[shx_common::iResponseIndex].
                    response_val, 3)
              of "NUMERIC":
                set shx_common::iNumericResponseIndex = 1
                set shx_common::social_history_activity->details[1].responses[shx_common::iResponseIndex].
                  numeric_response_cnt = shx_common::iNumericResponseIndex
                set stat = alterlist(shx_common::social_history_activity->details[1].responses[shx_common::iResponseIndex].
                  numeric_responses, shx_common::iNumericResponseIndex)
                ; Numeric value
                set shx_common::social_history_activity->details[1].responses[shx_common::iResponseIndex].
                  numeric_responses[shx_common::iNumericResponseIndex].value =
                    trim(601053_rep->activity_qual[shx_common::iActivityIndex].response_qual[shx_common::iResponseIndex].
                      response_val, 3)
                ; Numeric unit cd
                set shx_common::social_history_activity->details[1].responses[shx_common::iResponseIndex].
                  numeric_responses[shx_common::iNumericResponseIndex].unit_cd =
                    601053_rep->activity_qual[shx_common::iActivityIndex].response_qual[shx_common::iResponseIndex].
                      response_unit_cd
                ; Numeric modifier flag
                set shx_common::social_history_activity->details[1].responses[shx_common::iResponseIndex].
                  numeric_responses[shx_common::iNumericResponseIndex].modifier_flag =
                    601053_rep->activity_qual[shx_common::iActivityIndex].response_qual[shx_common::iResponseIndex].
                      modifier_flag
              endcase
          endif
        endfor
      endif
    endif
  endfor

  free record 601053_req
  free record 601053_rep

  if(iDebugFlag > 0)
    call echo(concat("shx_common::LoadSocialHistoryActivityDetails Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif

  return(1)
end ;End subroutine shx_common::LoadSocialHistoryActivityDetails

/*************************************************************************
;  Name: shx_common::HasPrivilegeToUpdateSocialHistory(null) = i2
;  Description: Checks privileges to ensure the user can both view and update Social History
;  Return: 1 if the user has the privileges to view and update Social History. Otherwise, 0.
**************************************************************************/
subroutine shx_common::HasPrivilegeToUpdateSocialHistory(null)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("shx_common::HasPrivilegeToUpdateSocialHistory Begin",
      format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif

  ; Request MSVC_GetPrivilegesByCodes (680500)
  free record 680500_req
  record 680500_req (
    1 patient_user_criteria
      2 user_id = f8
      2 patient_user_relationship_cd = f8
    1 privilege_criteria
      2 privileges [*]
        3 privilege_cd = f8
      2 locations [*]
        3 location_id = f8
  )
  
  ; Reply MSVC_GetPrivilegesByCodes (680500)
  free record 680500_rep
  record 680500_rep (
    1 patient_user_information
      2 user_id = f8
      2 patient_user_relationship_cd = f8
      2 role_id = f8
    1 privileges [*]
      2 privilege_cd = f8
      2 default [*]
        3 granted_ind = i2
        3 exceptions [*]
          4 entity_name = vc
          4 type_cd = f8
          4 id = f8
        3 status
          4 success_ind = i2
      2 locations [*]
        3 location_id = f8
        3 privilege
          4 granted_ind = i2
          4 exceptions [*]
            5 entity_name = vc
            5 type_cd = f8
            5 id = f8
          4 status
            5 success_ind = i2
    1 transaction_status
      2 success_ind = i2
      2 debug_error_message = vc
  )

  ; Populate request to MSVC_GetPrivilegesByCodes (680500)
  set 680500_req->patient_user_criteria.user_id = dUserId
  set shx_common::iSocialHistoryPrivilegeCount = 2
  set stat = alterlist(680500_req->privilege_criteria.privileges, shx_common::iSocialHistoryPrivilegeCount)
  set 680500_req->privilege_criteria.privileges[1].privilege_cd = shx_common::c_privilege_view_social_history_cd
  set 680500_req->privilege_criteria.privileges[2].privilege_cd = shx_common::c_privilege_update_social_history_cd

  ; Call MSVC_GetPrivilegesByCodes (680500)
  set shx_common::iTransactionTaskId = 3202004
  set shx_common::iStepId = 680500
  set stat = tdbexecute(shx_common::c_application_id, shx_common::iTransactionTaskId, shx_common::iStepId, "REC",
    680500_req, "REC", 680500_rep)

  ; Handle reply from MSVC_GetPrivilegesByCodes (680500)
  if(680500_rep->transaction_status.success_ind = 0 or size(680500_rep->privileges, 5) != shx_common::iSocialHistoryPrivilegeCount)
    if(iDebugFlag > 0)
      call echorecord(680500_req)
      call echorecord(680500_rep)
    endif

    free record 680500_req
    free record 680500_rep

    call echo("Call to MSVC_GetPrivilegesByCodes failed (step_id=680500)")
    return(0)
  elseif(iDebugFlag > 0)
    call echorecord(680500_req)
    call echorecord(680500_rep)
  endif

  set shx_common::iPrivilegeGrantedCount = shx_common::iSocialHistoryPrivilegeCount
  for(i = 1 to shx_common::iSocialHistoryPrivilegeCount)
    if(680500_rep->privileges[i].default[1].granted_ind = 0)
      call echo(concat('The "', trim(uar_get_code_display(680500_rep->privileges[i].privilege_cd), 3),
        '" was not granted (step_id=680500,privilege_cd=', build(680500_rep->privileges[i].privilege_cd), ')'))
      set shx_common::iPrivilegeGrantedCount -= 1
    endif
  endfor

  if(shx_common::iPrivilegeGrantedCount != shx_common::iSocialHistoryPrivilegeCount)
    if(iDebugFlag > 0)
      call echorecord(680500_req)
      call echorecord(680500_rep)
    endif

    free record 680500_req
    free record 680500_rep

    call echo("Not all social histgory privileges were granted (step_id=680500)")
    return(0)
  endif

  free record 680500_req
  free record 680500_rep

  if(iDebugFlag > 0)
    call echo(concat("shx_common::HasPrivilegeToUpdateSocialHistory Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif

  return(1)
end ; End subroutine shx_common::HasPrivilegeToUpdateSocialHistory

/*************************************************************************
;  Name: PopulateUpdatedSocialHistory(dPatientId = f8, dOrganizationId = f8, dFacilityCd = f8, iDeleteInd = i2) = i2
;  Description:  Populates the shx_common::updated_social_history record structure
;  Return: 1 if successful. Otherwise, 0.
**************************************************************************/
subroutine shx_common::PopulateUpdatedSocialHistory(dPatientId, dOrganizationId, dFacilityCd, iDeleteInd)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("shx_common::PopulateUpdatedSocialHistory Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))

    call echorecord(shx_common::social_history_activity)
  endif

  if(dOrganizationId > 0.00)
    set shx_common::updated_social_history->organization_id = dOrganizationId
  else
    select into "nl:"
      l.organization_id
    from
      location l
    plan l where l.active_ind = 1 and l.active_status_cd = shx_common::c_status_active_cd
      and l.beg_effective_dt_tm <= cnvtdatetime(shx_common::c_now_dt_tm)
      and l.end_effective_dt_tm > cnvtdatetime(shx_common::c_now_dt_tm)
      and l.location_type_cd = shx_common::c_location_facility_cd
      and l.location_cd = dFacilityCd
    detail
      shx_common::updated_social_history->organization_id = l.organization_id
    with nocounter
  endif

  set shx_common::updated_social_history->person_id = dPatientId
  set shx_common::updated_social_history->workflow_delete_ind = iDeleteInd

  ; Set "unable to obtain" to off
  if(shx_common::social_history_activity->has_unable_to_obtain_ind = 1
    and shx_common::social_history_activity->unable_to_obtain[1].unable_to_obtain_ind = 1)
    set shx_common::updated_social_history->has_unable_to_obtain_ind = 1
    set stat = alterlist(shx_common::updated_social_history->unable_to_obtain, 1)
    set shx_common::updated_social_history->unable_to_obtain[1].shx_activity_id =
      shx_common::social_history_activity->unable_to_obtain[1].shx_activity_id
    set shx_common::updated_social_history->unable_to_obtain[1].shx_activity_group_id =
      shx_common::social_history_activity->unable_to_obtain[1].shx_activity_group_id
    set shx_common::updated_social_history->unable_to_obtain[1].unable_to_obtain_ind = 0
  endif

  ; Setup aliases
  ; input record aliases
  set CURALIAS = shx_common::input_FieldInput shx_common::input->FieldInputs[shx_common::iFieldInputIndex]
  set CURALIAS = shx_common::input_NumericValue
    shx_common::input->FieldInputs[shx_common::iFieldInputIndex].NumericValues[shx_common::iValueIndex]
  ; social_history_reference record aliases
  set CURALIAS = shx_common::shx_reference_element shx_common::social_history_reference->elements[shx_common::iElementIndex]
  set CURALIAS = shx_common::shx_reference_range_factor
    shx_common::social_history_reference->elements[shx_common::iElementIndex].reference_range_factors[1]
  set CURALIAS = shx_common::shx_reference_alpha_response
    shx_common::social_history_reference->elements[shx_common::iElementIndex].reference_range_factors[1].
      alpha_responses[shx_common::iAlphaResponseIndex]
  set CURALIAS = shx_common::shx_reference_modifier_flag
    shx_common::social_history_reference->elements[shx_common::iElementIndex].modifier_flags[shx_common::iIndex]
  ; updated_social_history record aliases
  set CURALIAS = shx_common::shx_detail shx_common::updated_social_history->details[1]
  set CURALIAS = shx_common::shx_response shx_common::updated_social_history->details[1].responses[shx_common::iResponseIndex]
  set CURALIAS = shx_common::shx_alpha_response
    shx_common::updated_social_history->details[1].responses[shx_common::iResponseIndex].alpha_responses[shx_common::iIndex]
  set CURALIAS = shx_common::shx_invalid_alpha_response
    shx_common::updated_social_history->details[1].responses[shx_common::iResponseIndex].
      invalid_alpha_responses[shx_common::iIndex]
  set CURALIAS = shx_common::shx_numeric_response
    shx_common::updated_social_history->details[1].responses[shx_common::iResponseIndex].
      numeric_responses[shx_common::iNumericResponseIndex]
  ; social_history_activity record aliases
  set CURALIAS = shx_common::shx_activity_detail shx_common::social_history_activity->details[1]
  set CURALIAS = shx_common::shx_activity_response shx_common::social_history_activity->details[1].
    responses[shx_common::iFieldInputIndex]
  set CURALIAS = shx_common::shx_activity_alpha_response
    shx_common::social_history_activity->details[1].responses[shx_common::iFieldInputIndex].alpha_responses[shx_common::iValueIndex]
  set CURALIAS = shx_common::shx_activity_numeric_response
    shx_common::social_history_activity->details[1].responses[shx_common::iFieldInputIndex].
      numeric_responses[shx_common::iValueIndex]

  ; Populate updated details
  if((size(shx_common::input->FieldInputs, 5) > 0 or textlen(trim(shx_common::input->Comment, 3)) > 0)
    or iDeleteInd = 1)
    set shx_common::updated_social_history->has_details_ind = 1
    set stat = alterlist(shx_common::updated_social_history->details, 1)

    ; Comment
    if(textlen(trim(shx_common::input->Comment, 3)) > 0)
      set shx_common::shx_detail->comment = trim(shx_common::input->Comment, 3)
    endif

    if(shx_common::social_history_activity->has_details_ind = 1)
      set shx_common::shx_detail->shx_activity_id = shx_common::shx_activity_detail->shx_activity_id
      set shx_common::shx_detail->shx_activity_group_id = shx_common::shx_activity_detail->shx_activity_group_id
      set shx_common::shx_detail->detail_summary_text_id = shx_common::shx_activity_detail->detail_summary_text_id
    endif

    ; Social history reference elements
    for(shx_common::iElementIndex = 1 to shx_common::social_history_reference->element_cnt)
      ; See if there are any inputs for the given reference element
      set shx_common::iFieldInputIndex = locateval(shx_common::iFieldInputIndex, 1, size(shx_common::input->FieldInputs, 5),
        shx_common::shx_reference_element->shx_element_id, cnvtreal(trim(shx_common::input_FieldInput->FieldId, 3)))

      ; If the field id is found then add the element to the list of updated details      
      if(shx_common::iFieldInputIndex > 0)
        ; Only write responses with answers
        if(size(shx_common::input_FieldInput->CodedValueIds, 5) > 0 or size(shx_common::input_FieldInput->TextValues, 5) > 0
          or size(shx_common::input_FieldInput->NumericValues, 5) > 0)
          set shx_common::iResponseIndex = shx_common::shx_detail->response_cnt + 1
          set shx_common::shx_detail->response_cnt = shx_common::iResponseIndex
          set stat = alterlist(shx_common::shx_detail->responses, shx_common::iResponseIndex)

          set shx_common::shx_response->social_history_reference_element_idx = shx_common::iElementIndex

          ; Loop through the available alpha responses
          for(shx_common::iAlphaResponseIndex = 1 to shx_common::shx_reference_range_factor->alpha_response_cnt)

            ; Loop through each provided CodedValueId
            for(shx_common::iValueIndex = 1 to size(shx_common::input_FieldInput->CodedValueIds, 5))
              set shx_common::dNomenclatureId =
                cnvtreal(trim(shx_common::input_FieldInput->CodedValueIds[shx_common::iValueIndex], 3))

              if(shx_common::dNomenclatureId = shx_common::shx_reference_alpha_response->nomenclature_id)
                set shx_common::iIndex = shx_common::shx_response->alpha_response_cnt + 1
                set shx_common::shx_response->alpha_response_cnt = shx_common::iIndex
                set stat = alterlist(shx_common::shx_response->alpha_responses, shx_common::iIndex)
                set shx_common::shx_alpha_response->nomenclature_id = shx_common::dNomenclatureId
                set shx_common::shx_alpha_response->short_string = trim(shx_common::shx_reference_alpha_response->short_string, 3)
              endif
            endfor
          endfor

          ; Validate that there were no invalid alpha responses provided
          if(shx_common::shx_response->alpha_response_cnt != size(shx_common::input_FieldInput->CodedValueIds, 5))
            for(shx_common::iValueIndex = 1 to size(shx_common::input_FieldInput->CodedValueIds, 5))
              set shx_common::dNomenclatureId =
                cnvtreal(trim(shx_common::input_FieldInput->CodedValueIds[shx_common::iValueIndex], 3))
              
              set shx_common::iIndex = locateval(shx_common::iIndex, 1, shx_common::shx_response->alpha_response_cnt,
                shx_common::dNomenclatureId, shx_common::shx_alpha_response->nomenclature_id)
              
              if(shx_common::iIndex = 0)
                set shx_common::iIndex = shx_common::shx_response->invalid_alpha_response_cnt + 1
                set shx_common::shx_response->invalid_alpha_response_cnt = shx_common::iIndex
                set stat = alterlist(shx_common::shx_response->invalid_alpha_responses, shx_common::iIndex)
                set shx_common::shx_invalid_alpha_response->nomenclature_id = shx_common::dNomenclatureId
              endif
            endfor
          endif

          ; Populate the text response
          set shx_common::shx_response->text_response_cnt = size(shx_common::input_FieldInput->TextValues, 5)
          if(size(shx_common::input_FieldInput->TextValues, 5) > 0)
            set shx_common::shx_response->text_response = trim(shx_common::input_FieldInput->TextValues[1], 3)
          endif

          ; Loop through each provided NumericValue
          for(shx_common::iValueIndex = 1 to size(shx_common::input_FieldInput->NumericValues, 5))
            set shx_common::iNumericResponseIndex = shx_common::shx_response->numeric_response_cnt + 1
            set shx_common::shx_response->numeric_response_cnt =shx_common::iNumericResponseIndex
            set stat = alterlist(shx_common::shx_response->numeric_responses, shx_common::iNumericResponseIndex)
            set shx_common::shx_numeric_response->value = trim(shx_common::input_NumericValue->Value, 3)
            set shx_common::shx_numeric_response->unit_cd = cnvtreal(trim(shx_common::input_NumericValue->UnitId, 3))
            set shx_common::shx_numeric_response->modifier_flag = shx_common::c_shx_modifier_actual_age

            if(shx_common::shx_numeric_response->unit_cd <= 0.00)
              if(shx_common::shx_reference_range_factor->units_cd > 0.00)
                set shx_common::shx_numeric_response->unit_cd = shx_common::shx_reference_range_factor->units_cd
              elseif(shx_common::social_history_reference->elements[shx_common::iElementIndex].input_type_cd =
                shx_common::c_shx_input_type_fuzzy_age_cd)
                set shx_common::shx_numeric_response->unit_cd = shx_common::c_time_unit_years_cd
              endif
            endif

            if(textlen(trim(shx_common::input_NumericValue->ModifierId, 3)) > 0)
              if(shx_common::shx_reference_element->modifier_flag_cnt > 0)
                set shx_common::iModifierFlag = cnvtreal(trim(shx_common::input_NumericValue->ModifierId, 3))
                set shx_common::iIndex = locateval(shx_common::iIndex, 1, shx_common::shx_reference_element->modifier_flag_cnt,
                  shx_common::iModifierFlag, shx_common::shx_reference_modifier_flag->flag_value)
                if(shx_common::iIndex > 0)
                  set shx_common::shx_numeric_response->modifier_flag = shx_common::iModifierFlag
                  set shx_common::shx_numeric_response->modifier_display = trim(shx_common::shx_reference_modifier_flag->display, 3)
                else
                  set shx_common::shx_numeric_response->modifier_flag = shx_common::c_shx_modifier_invalid_input
                endif
              else
                set shx_common::shx_numeric_response->modifier_flag = shx_common::c_shx_modifier_invalid_input
              endif
            endif
          endfor
        endif
      elseif(shx_common::social_history_activity->has_details_ind = 1)
        set shx_common::iFieldInputIndex = locateval(shx_common::iFieldInputIndex, 1,
          shx_common::shx_activity_detail->response_cnt, shx_common::iElementIndex,
          shx_common::shx_activity_response->social_history_reference_element_idx)
        if(shx_common::iFieldInputIndex > 0)
          set shx_common::iResponseIndex = shx_common::shx_detail->response_cnt + 1
          set shx_common::shx_detail->response_cnt = shx_common::iResponseIndex
          set stat = alterlist(shx_common::shx_detail->responses, shx_common::iResponseIndex)

          set shx_common::shx_response->social_history_reference_element_idx = shx_common::iElementIndex

          ; Loop through the available alpha responses
          for(shx_common::iAlphaResponseIndex = 1 to shx_common::shx_reference_range_factor->alpha_response_cnt)

            ; Loop through each provided CodedValueId
            for(shx_common::iValueIndex = 1 to shx_common::shx_activity_response->alpha_response_cnt)
              set shx_common::dNomenclatureId = shx_common::shx_activity_alpha_response->nomenclature_id

              if(shx_common::dNomenclatureId = shx_common::shx_reference_alpha_response->nomenclature_id)
                set shx_common::iIndex = shx_common::shx_response->alpha_response_cnt + 1
                set shx_common::shx_response->alpha_response_cnt = shx_common::iIndex
                set stat = alterlist(shx_common::shx_response->alpha_responses, shx_common::iIndex)
                set shx_common::shx_alpha_response->nomenclature_id = shx_common::dNomenclatureId
                set shx_common::shx_alpha_response->short_string = trim(shx_common::shx_reference_alpha_response->short_string, 3)
              endif
            endfor
          endfor

          ; Validate that there were no invalid alpha responses provided
          if(shx_common::shx_response->alpha_response_cnt != shx_common::shx_activity_response->alpha_response_cnt)
            for(shx_common::iValueIndex = 1 to shx_common::shx_activity_response->alpha_response_cnt)
              set shx_common::dNomenclatureId = shx_common::shx_activity_alpha_response->nomenclature_id
              
              set shx_common::iIndex = locateval(shx_common::iIndex, 1, shx_common::shx_response->alpha_response_cnt,
                shx_common::dNomenclatureId, shx_common::shx_alpha_response->nomenclature_id)
              
              if(shx_common::iIndex = 0)
                set shx_common::iIndex = shx_common::shx_response->invalid_alpha_response_cnt + 1
                set shx_common::shx_response->invalid_alpha_response_cnt = shx_common::iIndex
                set stat = alterlist(shx_common::shx_response->invalid_alpha_responses, shx_common::iIndex)
                set shx_common::shx_invalid_alpha_response->nomenclature_id = shx_common::dNomenclatureId
              endif
            endfor
          endif

          ; Populate the text response
          if(textlen(trim(shx_common::shx_activity_response->text_response, 3)) > 0)
            set shx_common::shx_response->text_response_cnt = 1
            set shx_common::shx_response->text_response = trim(shx_common::shx_activity_response->text_response, 3)
          endif

          ; Loop through each provided NumericValue
          for(shx_common::iValueIndex = 1 to shx_common::shx_activity_response->numeric_response_cnt)
            set shx_common::iNumericResponseIndex = shx_common::shx_response->numeric_response_cnt + 1
            set shx_common::shx_response->numeric_response_cnt =shx_common::iNumericResponseIndex
            set stat = alterlist(shx_common::shx_response->numeric_responses, shx_common::iNumericResponseIndex)
            set shx_common::shx_numeric_response->value = trim(shx_common::shx_activity_numeric_response->value, 3)
            set shx_common::shx_numeric_response->unit_cd = shx_common::shx_activity_numeric_response->unit_cd
            set shx_common::shx_numeric_response->modifier_flag = shx_common::shx_activity_numeric_response->modifier_flag

            if(shx_common::shx_numeric_response->unit_cd <= 0.00)
              if(shx_common::shx_reference_range_factor->units_cd > 0.00)
                set shx_common::shx_numeric_response->unit_cd = shx_common::shx_reference_range_factor->units_cd
              elseif(shx_common::social_history_reference->elements[shx_common::iElementIndex].input_type_cd =
                shx_common::c_shx_input_type_fuzzy_age_cd)
                set shx_common::shx_numeric_response->unit_cd = shx_common::c_time_unit_years_cd
              endif
            endif

            if(shx_common::shx_reference_element->modifier_flag_cnt > 0)
              set shx_common::iModifierFlag = shx_common::shx_activity_numeric_response->modifier_flag
              set shx_common::iIndex = locateval(shx_common::iIndex, 1, shx_common::shx_reference_element->modifier_flag_cnt,
                shx_common::iModifierFlag, shx_common::shx_reference_modifier_flag->flag_value)
              if(shx_common::iIndex > 0)
                set shx_common::shx_numeric_response->modifier_flag = shx_common::iModifierFlag
                set shx_common::shx_numeric_response->modifier_display = trim(shx_common::shx_reference_modifier_flag->display, 3)
              else
                set shx_common::shx_numeric_response->modifier_flag = shx_common::c_shx_modifier_invalid_input
              endif
            endif
          endfor
        endif
      endif
    endfor
  endif

  ; Clean up aliases
  set CURALIAS shx_common::input_FieldInput OFF
  set CURALIAS shx_common::input_NumericValue OFF
  set CURALIAS shx_common::shx_reference_element OFF
  set CURALIAS shx_common::shx_reference_range_factor OFF
  set CURALIAS shx_common::shx_reference_alpha_response OFF
  set CURALIAS shx_common::shx_reference_modifier_flag OFF
  set CURALIAS shx_common::shx_detail OFF
  set CURALIAS shx_common::shx_response OFF
  set CURALIAS shx_common::shx_alpha_response OFF
  set CURALIAS shx_common::shx_invalid_alpha_response OFF
  set CURALIAS shx_common::shx_numeric_response OFF
  set CURALIAS shx_common::shx_activity_detail OFF
  set CURALIAS shx_common::shx_activity_response OFF
  set CURALIAS shx_common::shx_activity_alpha_response OFF
  set CURALIAS shx_common::shx_activity_numeric_response OFF


  if(shx_common::updated_social_history->has_details_ind = 1)
    if(shx_common::BuildDetailSummary(shx_common::updated_social_history->details[1].detail_summary) = 0)
      if(iDebugFlag > 0)
        call echorecord(shx_common::updated_social_history)

        call echo(concat("shx_common::PopulateUpdatedSocialHistory Runtime: ",
          trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
          " seconds"))
      endif

      return(0)
    endif
  endif

  if(iDebugFlag > 0)
    call echorecord(shx_common::updated_social_history)

    call echo(concat("shx_common::PopulateUpdatedSocialHistory Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif

  return(1)
end ; End subroutine PopulateUpdatedSocialHistory

/*************************************************************************
;  Name: shx_common::BuildDetailSummary(sDetailSummary = vc (ref)) = i2
;  Description:  Builds a response.
;  Return: 1 if successful. Otherwise, 0.
**************************************************************************/
subroutine shx_common::BuildDetailSummary(sDetailSummary)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("shx_common::BuildDetailSummary Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))

    call echo(build("sDetailSummary  ->", sDetailSummary))
  endif

  set shx_common::iSuccess = 0

  set sDetailSummary = nullterm("")
  set shx_common::sResponseSummary = nullterm("")

  if(shx_common::updated_social_history->has_details_ind = 1)
    set shx_common::iSuccess = 1

    for(shx_common::iResponseIndex = 1 to shx_common::updated_social_history->details[1].response_cnt)
      if(shx_common::iSuccess = 1)
        set shx_common::iSuccess = shx_common::BuildResponseSummary(shx_common::iResponseIndex, shx_common::sResponseSummary)
        if(shx_common::iSuccess = 1)
          if(textlen(trim(sDetailSummary, 3)) = 0)
            set sDetailSummary = notrim(shx_common::sResponseSummary)
          else
            set sDetailSummary = concat(notrim(sDetailSummary), "  ", notrim(shx_common::sResponseSummary))
          endif
        endif
      endif
    endfor
  endif

  if(iDebugFlag > 0)
    call echo(build("sDetailSummary  ->", sDetailSummary))

    call echo(concat("shx_common::BuildDetailSummary Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif

  return(shx_common::iSuccess)
end ; End subroutine BuildDetailSummary

/*************************************************************************
;  Name: shx_common::BuildResponseSummary(iResponseIndex, sResponseSummary = vc (ref)) = i2
;  Description:  Builds a response.
;  Return: 1 if successful. Otherwise, 0.
**************************************************************************/
subroutine shx_common::BuildResponseSummary(iResponseIndex, sResponseSummary)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("shx_common::BuildResponseSummary Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))

    call echo(build("iResponseIndex  ->", iResponseIndex))
    call echo(build("sResponseSummary  ->", sResponseSummary))
  endif

  set shx_common::iSuccess = 0

  set sResponseSummary = nullterm("")
  set shx_common::sResponse = nullterm("")

  if(shx_common::updated_social_history->has_details_ind = 1 and iResponseIndex > 0)
    set shx_common::iElementIndex =
      shx_common::updated_social_history->details[1].responses[iResponseIndex].social_history_reference_element_idx

    set shx_common::iSuccess = shx_common::BuildResponse(iResponseIndex, shx_common::sResponse)

    if(shx_common::iSuccess = 1)
      case(shx_common::social_history_reference->elements[shx_common::iElementIndex].response_label_layout_flag)
        of 0:
          set sResponseSummary = concat(notrim(shx_common::sResponse), " ",
            notrim(shx_common::social_history_reference->elements[shx_common::iElementIndex].response_label), ".")
        of 1:
          set sResponseSummary =
            concat(notrim(shx_common::social_history_reference->elements[shx_common::iElementIndex].response_label), " ",
              notrim(shx_common::sResponse), ".")
        of 2:
          set sResponseSummary = concat(notrim(shx_common::sResponse), ".") 
      endcase
    endif
  endif
  

  if(iDebugFlag > 0)
    call echo(build("sResponseSummary  ->", sResponseSummary))

    call echo(concat("shx_common::BuildResponseSummary Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif

  return(shx_common::iSuccess)
end ; End subroutine BuildResponseSummary

/*************************************************************************
;  Name: shx_common::BuildResponse(iResponseIndex, sResponse = vc (ref)) = i2
;  Description:  Builds a response.
;  Return: 1 if successful. Otherwise, 0.
**************************************************************************/
subroutine shx_common::BuildResponse(iResponseIndex, sResponse)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("shx_common::BuildResponse Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))

    call echo(build("iResponseIndex  ->", iResponseIndex))
    call echo(build("sResponse  ->", sResponse))
  endif

  set shx_common::iSuccess = 0

  set sResponse = nullterm("")

  if(shx_common::updated_social_history->has_details_ind = 1 and iResponseIndex > 0)
    set shx_common::iSuccess = 1

    set CURALIAS = shx_common::element shx_common::social_history_reference->elements[shx_common::iElementIndex]
    set CURALIAS = shx_common::response shx_common::updated_social_history->details[1].responses[iResponseIndex]
    set CURALIAS = shx_common::alpha_response shx_common::updated_social_history->details[1].responses[iResponseIndex].
      alpha_responses[shx_common::iAlphaResponseIndex]
    set CURALIAS = shx_common::numeric_response shx_common::updated_social_history->details[1].responses[iResponseIndex].
      numeric_responses[1]

    set shx_common::iElementIndex = shx_common::response->social_history_reference_element_idx

    ; Alpha Responses
    if(shx_common::element->supports_alpha_responses_ind = 1)
      ; Alpha responses
      for(shx_common::iAlphaResponseIndex = 1 to shx_common::response->alpha_response_cnt)
        if(textlen(trim(sResponse, 3)) = 0)
          set sResponse = trim(shx_common::alpha_response->short_string, 3)
        else
          set sResponse = concat(notrim(sResponse), ", ", trim(shx_common::alpha_response->short_string, 3))
        endif
      endfor

      ; "Other" response
      if(shx_common::response->text_response_cnt > 0)
        if(textlen(trim(sResponse, 3)) = 0)
          set sResponse = trim(shx_common::response->text_response, 3)
        else
          set sResponse = concat(notrim(sResponse), ", ", trim(shx_common::response->text_response, 3))
        endif
      endif
    ; Text response
    elseif(shx_common::element->supports_text_response_ind = 1)
      set sResponse = trim(shx_common::response->text_response, 3)
    ; Numeric response
    elseif(shx_common::element->supports_numeric_response_ind = 1 and shx_common::response->numeric_response_cnt > 0)
      if(shx_common::numeric_response->modifier_flag = shx_common::c_shx_modifier_unknown)
        set sResponse = trim(shx_common::numeric_response->modifier_display, 3)
      elseif(shx_common::numeric_response->modifier_flag = shx_common::c_shx_modifier_actual_age)
        set sResponse = trim(shx_common::numeric_response->value, 3)

        if(shx_common::numeric_response->unit_cd > 0.00
          and textlen(trim(uar_get_code_display(shx_common::numeric_response->unit_cd), 3)) > 0)
          set sResponse = concat(notrim(sResponse), " ", trim(uar_get_code_display(shx_common::numeric_response->unit_cd), 3))
        endif
      else
        set sResponse = concat(trim(shx_common::numeric_response->modifier_display, 3), " ",
          trim(shx_common::numeric_response->value, 3))

        if(shx_common::numeric_response->unit_cd > 0.00
          and textlen(trim(uar_get_code_display(shx_common::numeric_response->unit_cd), 3)) > 0)
          set sResponse = concat(notrim(sResponse), " ", trim(uar_get_code_display(shx_common::numeric_response->unit_cd), 3))
        endif
      endif
    endif

    set CURALIAS shx_common::element OFF
    set CURALIAS shx_common::response OFF
    set CURALIAS shx_common::alpha_response OFF
    set CURALIAS shx_common::numeric_response OFF
  endif
  

  if(iDebugFlag > 0)
    call echo(build("sResponse  ->", sResponse))

    call echo(concat("shx_common::BuildResponse Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif

  return(shx_common::iSuccess)
end ; End subroutine BuildResponse

/*************************************************************************
;  Name: shx_common::ValidateNumericInput(sValue = vc, sFieldName = vc, sFailureMessage = vc (ref)) = i2
;  Description:  Validates that the input is numeric
;  Return: 1 if the value is numeric. Otherwise, 0.
**************************************************************************/
subroutine shx_common::ValidateNumericInput(sValue, sFieldName, sFailureMessage)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("shx_common::ValidateUpdatedSocialHistory Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif

  if(isnumeric(trim(sValue, 3)) <= 0)
    set sFailureMessage = concat('The value of ', sFieldName, ' must be numeric (value="', sValue, '")')
    return(0)
  endif

  if(iDebugFlag > 0)
    call echo(concat("shx_common::ValidateUpdatedSocialHistory Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif

  return(1)
end ; End subroutine shx_common::ValidateUpdatedSocialHistory

/*************************************************************************
;  Name: shx_common::ValidateSocialHistoryInput(sFailureMessage = vc (ref)) = i2
;  Description:  Validates the social history input
;  Return: 1 if successful. Otherwise, 0.
**************************************************************************/
subroutine shx_common::ValidateSocialHistoryInput(sFailureMessage)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("shx_common::ValidateSocialHistoryInput Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))

    call echorecord(shx_common::input)
  endif

  ; Validate the PatientId
  if(shx_common::input->dPatientId <= 0.00)
    if(shx_common::ValidateNumericInput(shx_common::input->PatientId, "PatientId", sFailureMessage) = 0)
      return(0)
    elseif(cnvtreal(trim(shx_common::input->PatientId, 3)) <= 0.00)
      set sFailureMessage = concat('The value of PatientId must be positive (value="', shx_common::input->PatientId, '")')
      return(0)
    endif
  endif

  ; Validate the FacilityId
  if(shx_common::input->dOrganizationId <= 0.00)
    if(shx_common::ValidateNumericInput(shx_common::input->FacilityId, "FacilityId", sFailureMessage) = 0)
      return(0)
    elseif(cnvtreal(trim(shx_common::input->FacilityId, 3)) <= 0.00)
      set sFailureMessage = concat('The value of FacilityId must be positive (value="', shx_common::input->FacilityId, '")')
      return(0)
    else
      select into "nl:"
        l.organization_id
      from
        location l
      plan l where l.active_ind = 1 and l.active_status_cd = shx_common::c_status_active_cd
        and l.beg_effective_dt_tm <= cnvtdatetime(shx_common::c_now_dt_tm)
        and l.end_effective_dt_tm > cnvtdatetime(shx_common::c_now_dt_tm)
        and l.location_type_cd = shx_common::c_location_facility_cd
        and l.location_cd = cnvtreal(trim(shx_common::input->FacilityId, 3))
      with nocounter

      if(CURQUAL = 0)
        set sFailureMessage = concat('The value of FacilityId must be for an active facility (value="',
          shx_common::input->FacilityId, '")')
        return(0)
      endif
    endif
  endif

  ; Validate UnableToObtain
  if(textlen(trim(shx_common::input->UnableToObtain, 3)) > 0)
    if(cnvtupper(trim(shx_common::input->UnableToObtain, 3)) not in ("TRUE", "FALSE"))
      set sFailureMessage = concat('The value of UnableToObtain must be either "True" or "False" (value="',
        shx_common::input->UnableToObtain, '")')
      return(0)
    endif

    if(textlen(trim(shx_common::input->CategoryId, 3)) > 0)
      set sFailureMessage = "UnableToObtain and a CategoryId may not both be provided"
      return(0)
    elseif(textlen(trim(shx_common::input->Comment, 3)) > 0)
      set sFailureMessage = "UnableToObtain and a Comment may not both be provided"
      return(0)
    elseif(textlen(trim(shx_common::input->AssessmentResponseId, 3)) > 0)
      set sFailureMessage = "UnableToObtain and an AssessmentResponseId may not both be provided"
      return(0)
    elseif(size(shx_common::input->FieldInputs, 5) > 0)
      set sFailureMessage = "UnableToObtain and FieldInputs may not both be provided"
      return(0)
    endif
  endif

  ; Validate the CategoryId
  if(textlen(trim(shx_common::input->CategoryId, 3)) > 0)
    if(shx_common::ValidateNumericInput(shx_common::input->CategoryId, "CategoryId", sFailureMessage) = 0)
      return(0)
    elseif(cnvtreal(trim(shx_common::input->CategoryId, 3)) <= 0.00)
      set sFailureMessage = concat('The value of CategoryId must be positive (value="', shx_common::input->CategoryId, '")')
      return(0)
    endif
  elseif(textlen(trim(shx_common::input->Comment, 3)) > 0)
    set sFailureMessage = "The CategoryId is required if a Comment is provided"
    return(0)
  elseif(textlen(trim(shx_common::input->AssessmentResponseId, 3)) > 0)
    set sFailureMessage = "The CategoryId is required if AssessmentResponseId is provided"
    return(0)
  elseif(size(shx_common::input->FieldInputs, 5) > 0)
    set sFailureMessage = "The CategoryId is required if FieldInputs are provided"
    return(0)
  endif

  ; Validate AssessmentResponseId
  if(textlen(trim(shx_common::input->AssessmentResponseId, 3)) > 0)
    if(shx_common::ValidateNumericInput(shx_common::input->AssessmentResponseId, "AssessmentResponseId",
      sFailureMessage) = 0)
      return(0)
    elseif(cnvtreal(trim(shx_common::input->AssessmentResponseId, 3)) <= 0.00)
      set sFailureMessage = concat('The value of AssessmentResponseId must be positive (value="',
        shx_common::input->AssessmentResponseId, '")')
      return(0)
    elseif(textlen(trim(shx_common::input->Comment, 3)) > 0)
      set sFailureMessage = "AssessmentResponseId and a Comment may not both be provided"
      return(0)
    elseif(size(shx_common::input->FieldInputs, 5) > 0)
      set sFailureMessage = "AssessmentResponseId and FieldInputs may not both be provided"
      return(0)
    endif
  endif

  ; Validate FieldInputs
  for(i = 1 to size(shx_common::input->FieldInputs, 5))
    if(shx_common::ValidateNumericInput(shx_common::input->FieldInputs[i].FieldId, "FieldInputs.FieldId", sFailureMessage) = 0)
      return(0)
    elseif(cnvtreal(trim(shx_common::input->FieldInputs[i].FieldId, 3)) <= 0.00)
      set sFailureMessage = concat('The value of FieldInputs.FieldId must be positive (value="',
        shx_common::input->FieldInputs[i].FieldId, '")')
      return(0)
    endif

    ; Validate CodedValueIds
    for(j = 1 to size(shx_common::input->FieldInputs[i].CodedValueIds, 5))
      if(shx_common::ValidateNumericInput(shx_common::input->FieldInputs[i].CodedValueIds[j], "FieldInputs.CodedValueId",
        sFailureMessage) = 0)
        return(0)
      elseif(cnvtreal(trim(shx_common::input->FieldInputs[i].CodedValueIds[j], 3)) <= 0.00)
        set sFailureMessage = concat('The value of FieldInputs.CodedValueId must be positive (value="',
          shx_common::input->FieldInputs[i].CodedValueIds[j], '")')
        return(0)
      endif
    endfor

    ; Validate TextValues
    if(size(shx_common::input->FieldInputs[i].TextValues, 5) > 1)
      set sFailureMessage = "Only one FieldInputs.TextValues may be provided"
      return(0)
    endif

    ; Validate NumericValues
    if(size(shx_common::input->FieldInputs[i].NumericValues, 5) > 1)
      set sFailureMessage = "Only one FieldInputs.NumericValues may be provided"
      return(0)
    endif
  
    for(j = 1 to size(shx_common::input->FieldInputs[i].NumericValues, 5))
      ; Validate Value
      if(textlen(trim(shx_common::input->FieldInputs[i].NumericValues[j].Value, 3)) > 0)
        if(shx_common::ValidateNumericInput(shx_common::input->FieldInputs[i].NumericValues[j].Value,
          "FieldInputs.NumericValues.Value",sFailureMessage) = 0)
          return(0)
        endif
      endif

      ; Validate UnitId
      if(textlen(trim(shx_common::input->FieldInputs[i].NumericValues[j].UnitId, 3)) > 0)
        if(shx_common::ValidateNumericInput(shx_common::input->FieldInputs[i].NumericValues[j].UnitId,
          "FieldInputs.NumericValues.UnitId", sFailureMessage) = 0)
          return(0)
        elseif(cnvtreal(trim(shx_common::input->FieldInputs[i].NumericValues[j].UnitId, 3)) <= 0.00)
          set sFailureMessage = concat('The value of FieldInputs.NumericValues.UnitId must be positive (value="',
            shx_common::input->FieldInputs[i].NumericValues[j].UnitId, '")')
          return(0)
        endif
      endif

      ; Validate ModifierId
      if(textlen(trim(shx_common::input->FieldInputs[i].NumericValues[j].ModifierId, 3)) > 0)
        if(shx_common::ValidateNumericInput(shx_common::input->FieldInputs[i].NumericValues[j].ModifierId,
          "FieldInputs.NumericValues.ModifierId", sFailureMessage) = 0)
          return(0)
        elseif(cnvtreal(trim(shx_common::input->FieldInputs[i].NumericValues[j].ModifierId, 3)) <= 0.00)
          set sFailureMessage = concat('The value of FieldInputs.NumericValues.ModifierId must be positive (value="',
            shx_common::input->FieldInputs[i].NumericValues[j].ModifierId, '")')
          return(0)
        endif
      endif
    endfor
  endfor

  if(iDebugFlag > 0)
    call echo(concat("shx_common::ValidateSocialHistoryInput Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif

  return(1)
end ; End subroutine shx_common::ValidateSocialHistoryInput

/*************************************************************************
;  Name: shx_common::ValidateUpdatedSocialHistory(sFailureMessage = vc (ref)) = i2
;  Description:  Validates the updated social history
;  Return: 1 if successful. Otherwise, 0.
**************************************************************************/
subroutine shx_common::ValidateUpdatedSocialHistory(sFailureMessage)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("shx_common::ValidateUpdatedSocialHistory Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif

  set shx_common::iRequiredElementsAnsweredCount = 0

  set CURALIAS = shx_common::response shx_common::updated_social_history->details[1].responses[shx_common::iResponseIndex]
  set CURALIAS = shx_common::element shx_common::social_history_reference->elements[shx_common::iElementIndex]

  if(shx_common::updated_social_history->has_details_ind = 1)
    for(shx_common::iResponseIndex = 1 to shx_common::updated_social_history->details[1].response_cnt)
      set shx_common::iElementIndex = shx_common::response->social_history_reference_element_idx
      set shx_common::dFieldId = shx_common::element->shx_element_id

      ; FUTURE Remove this when date fields are supported
      if(shx_common::element->supports_alpha_responses_ind = 0
        and shx_common::element->supports_multiple_responses_ind = 0
        and shx_common::element->supports_other_alpha_response_ind = 0
        and shx_common::element->supports_text_response_ind = 0
        and shx_common::element->supports_numeric_response_ind = 0)
        set sFailureMessage = build("Field not currently supported (fieldId=", shx_common::dFieldId, ")")
        set CURALIAS shx_common::response OFF
        set CURALIAS shx_common::element OFF
        return(0)
      endif
      
      ; Alpha responses provided when not supported
      if(shx_common::element->supports_alpha_responses_ind = 0 and shx_common::response->alpha_response_cnt > 0)
        set sFailureMessage = build("Alpha response(s) provided but not supported (fieldId=", shx_common::dFieldId, ")")
        set CURALIAS shx_common::response OFF
        set CURALIAS shx_common::element OFF
        return(0)
      endif

      ; Text responses provided when not supported
      if(shx_common::element->supports_text_response_ind = 0 and shx_common::element->supports_other_alpha_response_ind = 0
        and shx_common::response->text_response_cnt > 0)
        set sFailureMessage = build("Text response(s) provided but not supported (fieldId=", shx_common::dFieldId, ")")
        set CURALIAS shx_common::response OFF
        set CURALIAS shx_common::element OFF
        return(0)
      endif

      ; Numeric responses provided when not supported
      if(shx_common::element->supports_numeric_response_ind = 0 and shx_common::response->numeric_response_cnt > 0)
        set sFailureMessage = build("Numeric response(s) provided but not supported (fieldId=", shx_common::dFieldId, ")")
        set CURALIAS shx_common::response OFF
        set CURALIAS shx_common::element OFF
        return(0)
      endif

      ; Too many alpha responses provided (either multiple alpha responses or an alpha response with "other")
      if(shx_common::element->supports_multiple_responses_ind = 0)
        if(shx_common::response->alpha_response_cnt > 1)
          set sFailureMessage = build("Too many alpha responses provided (fieldId=", shx_common::dFieldId, ")")
          set CURALIAS shx_common::response OFF
          set CURALIAS shx_common::element OFF
          return(0)
        elseif(shx_common::response->alpha_response_cnt = 1 and shx_common::response->text_response_cnt > 0)
          set sFailureMessage = build("Cannot provide both alpha and an other alpha response (fieldId=", shx_common::dFieldId, ")")
          set CURALIAS shx_common::response OFF
          set CURALIAS shx_common::element OFF
          return(0)
        endif
      endif

      ; Other response provided when not supported
      if(shx_common::element->supports_alpha_responses_ind = 1
        and shx_common::element->supports_other_alpha_response_ind = 0
        and shx_common::response->text_response_cnt > 0)
        set sFailureMessage = concat("Other alpha response provided but not supported (fieldId=",
          build(shx_common::element->shx_element_id), ")")
        set CURALIAS shx_common::response OFF
        set CURALIAS shx_common::element OFF
        return(0)
      endif

      ; Numeric response has invalid modifier flag
      if(shx_common::response->numeric_response_cnt > 0
        and shx_common::response->numeric_responses[1].modifier_flag = shx_common::c_shx_modifier_invalid_input)
        set sFailureMessage = build("An invalid ModifierId was provided (fieldId=", shx_common::dFieldId, ")")
        set CURALIAS shx_common::response OFF
        set CURALIAS shx_common::element OFF
        return(0)
      endif

      ; Numeric response has invalid modifier flag
      if(shx_common::response->numeric_response_cnt > 0
        and shx_common::response->numeric_responses[1].modifier_flag = shx_common::c_shx_modifier_unknown
        and textlen(trim(shx_common::response->numeric_responses[1].value, 3)) > 0)
        set sFailureMessage = build("Cannot provide a ModifierId of Unknown with a discrete numeric value (fieldId=",
          shx_common::dFieldId, ")")
        set CURALIAS shx_common::response OFF
        set CURALIAS shx_common::element OFF
        return(0)
      endif

      ; If the element is required then mark it as answered
      if(shx_common::social_history_reference->elements[shx_common::iElementIndex].required_ind = 1)
        set shx_common::iRequiredElementsAnsweredCount += 1
      endif
    endfor

    if(shx_common::social_history_reference->required_element_cnt != shx_common::iRequiredElementsAnsweredCount)
      set sFailureMessage = "Missing required fields"
      set CURALIAS shx_common::response OFF
      set CURALIAS shx_common::element OFF
      return(0)
    endif
  endif

  set CURALIAS shx_common::response OFF
  set CURALIAS shx_common::element OFF

  if(iDebugFlag > 0)
    call echo(concat("shx_common::ValidateUpdatedSocialHistory Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif

  return(1)
end ; End subroutine shx_common::ValidateUpdatedSocialHistory

/*************************************************************************
;  Name: shx_common::WriteSocialHistoryActivity(dUserId = f8) = i2
;  Description:  Writes social history activity
;  Return: 1 if successful. Otherwise, 0.
**************************************************************************/
subroutine shx_common::WriteSocialHistoryActivity(dUserId)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("shx_common::WriteSocialHistoryActivity Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif

  set shx_common::dSocialHistoryId = 0.00

  ; Request shx_ens_activity (601051)
  free record 601051_req  
  record 601051_req (
    1 organization_id = f8   
    1 person_id = f8   
    1 activity_qual [*]   
      2 ensure_type = c12  
      2 shx_category_ref_id = f8   
      2 shx_category_def_id = f8   
      2 shx_activity_id = f8   
      2 shx_activity_group_id = f8   
      2 type_mean = c12  
      2 unable_to_obtain_ind = i2   
      2 assessment_cd = f8   
      2 detail_summary_text_id = f8   
      2 detail_summary = vc  
      2 shx_comment_id = f8   
      2 comment = vc  
      2 perform_dt_tm = dq8   
      2 perform_tz = i4   
      2 updt_cnt = i4   
      2 response_qual [*]   
        3 shx_response_id = f8   
        3 task_assay_cd = f8   
        3 response_type = c12  
        3 response_val = c255  
        3 response_unit_cd = f8   
        3 modifier_flag = i4   
        3 long_text_id = f8   
        3 long_text = vc  
        3 alpha_response_qual [*]   
          4 shx_alpha_response_id = f8   
          4 nomenclature_id = f8   
          4 other_text = c255  
      2 shx_pre_generated_id = f8   
  )

  ; Reply shx_ens_activity (601051)
  free record 601051_rep
  record 601051_rep (
    1 person_id = f8
    1 activity_qual [* ]
      2 shx_category_ref_id = f8
      2 shx_category_def_id = f8
      2 shx_activity_id = f8
      2 shx_activity_group_id = f8
      2 type_mean = c12
      2 detail_summary_text_id = f8
      2 shx_comment_id = f8
      2 updt_cnt = i4
      2 response_qual [* ]
        3 shx_response_id = f8
        3 task_assay_cd = f8
        3 long_text_id = f8
        3 alpha_response_qual [* ]
          4 shx_alpha_response_id = f8
          4 nomenclature_id = f8
          4 other_text = c255
      2 beg_effective_dt_tm = dq8
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
  )

  ; Populate request to shx_ens_activity (601051)
  set 601051_req->organization_id = shx_common::updated_social_history->organization_id
  set 601051_req->person_id = shx_common::updated_social_history->person_id

  set shx_common::iActivityIndex = 0
  set CURALIAS = shx_common::activity_qual 601051_req->activity_qual[shx_common::iActivityIndex]
  set CURALIAS = shx_common::response_qual 601051_req->activity_qual[shx_common::iActivityIndex].
    response_qual[shx_common::iResponseIndex]
  set CURALIAS = shx_common::alpha_response_qual 601051_req->activity_qual[shx_common::iActivityIndex].
    response_qual[shx_common::iResponseIndex].alpha_response_qual[shx_common::iAlphaResponseIndex]
  set CURALIAS = shx_common::unable_to_obtain shx_common::updated_social_history->unable_to_obtain[1]
  set CURALIAS = shx_common::details shx_common::updated_social_history->details[1]
  set CURALIAS = shx_common::element shx_common::social_history_reference->elements[shx_common::iElementIndex]
  set CURALIAS = shx_common::response shx_common::updated_social_history->details[1].responses[shx_common::iResponseIndex]
  set CURALIAS = shx_common::alpha_response shx_common::updated_social_history->details[1].responses[shx_common::iResponseIndex].
    alpha_responses[shx_common::iAlphaResponseIndex]
  set CURALIAS = shx_common::numeric_response shx_common::updated_social_history->details[1].responses[shx_common::iResponseIndex].
    numeric_responses[1]

  ; Unable to obtain
  if(shx_common::updated_social_history->has_unable_to_obtain_ind = 1 and
    shx_common::unable_to_obtain->shx_activity_group_id > 0)
    set shx_common::iActivityIndex = size(601051_req->activity_qual, 5) + 1
    set stat = alterlist(601051_req->activity_qual, shx_common::iActivityIndex)
    set shx_common::activity_qual->ensure_type = "MODIFY"
    set shx_common::activity_qual->type_mean = "PERSON"
    set shx_common::activity_qual->shx_activity_id = shx_common::unable_to_obtain->shx_activity_id
    set shx_common::activity_qual->shx_activity_group_id = shx_common::unable_to_obtain->shx_activity_group_id
    set shx_common::activity_qual->unable_to_obtain_ind = shx_common::unable_to_obtain->unable_to_obtain_ind
    set shx_common::activity_qual->perform_dt_tm = shx_common::c_now_dt_tm
    set shx_common::activity_qual->perform_tz = shx_common::c_time_zone_index
  endif

  ; New Details
  if(shx_common::updated_social_history->has_details_ind = 1)
    set shx_common::iActivityIndex = size(601051_req->activity_qual, 5) + 1
    set stat = alterlist(601051_req->activity_qual, shx_common::iActivityIndex)
    set shx_common::activity_qual->type_mean = "DETAIL"
    set shx_common::activity_qual->shx_category_ref_id = shx_common::social_history_reference->shx_category_ref_id
    set shx_common::activity_qual->shx_category_def_id = shx_common::social_history_reference->shx_category_def_id
    set shx_common::activity_qual->perform_dt_tm = shx_common::c_now_dt_tm
    set shx_common::activity_qual->perform_tz = shx_common::c_time_zone_index
    set shx_common::activity_qual->detail_summary = trim(shx_common::details->detail_summary, 3)

    if(shx_common::details->shx_activity_group_id <= 0.00)
      set shx_common::activity_qual->ensure_type = "CREATE"
      set shx_common::activity_qual->shx_activity_group_id = -1.00
    else
      if(shx_common::updated_social_history->workflow_delete_ind = 1)
        set shx_common::activity_qual->ensure_type = "REMOVE"
      else
        set shx_common::activity_qual->ensure_type = "MODIFY"
      endif

      set shx_common::activity_qual->shx_activity_id = shx_common::details->shx_activity_id
      set shx_common::activity_qual->shx_activity_group_id = shx_common::details->shx_activity_group_id
      set shx_common::activity_qual->detail_summary_text_id = shx_common::details->detail_summary_text_id
    endif

    ; Comment
    if(textlen(trim(shx_common::details->comment, 3)) > 0)
      set shx_common::activity_qual->shx_comment_id = -1.00
      set shx_common::activity_qual->comment = trim(shx_common::details->comment, 3)
    endif

    ; Responses
    set stat = alterlist(shx_common::activity_qual->response_qual, shx_common::details->response_cnt)
    for(shx_common::iResponseIndex = 1 to shx_common::details->response_cnt)
      set shx_common::iElementIndex = shx_common::response->social_history_reference_element_idx
      set shx_common::response_qual->shx_response_id = -shx_common::iResponseIndex
      set shx_common::response_qual->task_assay_cd = shx_common::element->task_assay_cd

      ; Response type
      ; Alpha Responses
      if(shx_common::element->supports_alpha_responses_ind = 1)
        set shx_common::response_qual->response_type = "ALPHA"

        ; Alpha responses
        set stat = alterlist(shx_common::response_qual->alpha_response_qual, shx_common::response->alpha_response_cnt)
        for(shx_common::iAlphaResponseIndex = 1 to shx_common::response->alpha_response_cnt)
          set shx_common::alpha_response_qual->shx_alpha_response_id = -shx_common::iAlphaResponseIndex
          set shx_common::alpha_response_qual->nomenclature_id = shx_common::alpha_response->nomenclature_id
        endfor

        ; "Other" response
        if(shx_common::response->text_response_cnt > 0)
          set shx_common::iAlphaResponseIndex = size(shx_common::response_qual->alpha_response_qual, 5) + 1
          set stat = alterlist(shx_common::response_qual->alpha_response_qual, shx_common::iAlphaResponseIndex)
          set shx_common::alpha_response_qual->shx_alpha_response_id = -shx_common::iAlphaResponseIndex
          set shx_common::alpha_response_qual->other_text = trim(shx_common::response->text_response, 3)
        endif
      ; Text response
      elseif(shx_common::element->supports_text_response_ind = 1)
        set shx_common::response_qual->response_type = "FREETEXT"
        set shx_common::response_qual->response_val = trim(shx_common::response->text_response, 3)
      ; Numeric response
      elseif(shx_common::element->supports_numeric_response_ind = 1 and shx_common::response->numeric_response_cnt > 0)
        set shx_common::response_qual->response_type = "NUMERIC"
        set shx_common::response_qual->response_val = trim(shx_common::numeric_response->value, 3)
        set shx_common::response_qual->response_unit_cd = shx_common::numeric_response->unit_cd
        set shx_common::response_qual->modifier_flag = shx_common::numeric_response->modifier_flag
      endif
    endfor
  endif

  set reqinfo->updt_id = dUserId

  ; Call shx_ens_activity (601051)
  set shx_common::iTransactionTaskId = 601030
  set shx_common::iStepId = 601051
  set stat = tdbexecute(shx_common::c_application_id, shx_common::iTransactionTaskId, shx_common::iStepId, "REC",
    601051_req, "REC", 601051_rep)

  ; Handle reply from shx_ens_activity (601051)
  if(601051_rep->status_data.status != "S" and size(601051_rep->activity_qual, 5) < size(601051_req->activity_qual, 5))
    if(iDebugFlag > 0)
      call echorecord(601051_req)
      call echorecord(601051_rep)
    endif

    free record 601051_req
    free record 601051_rep

    set CURALIAS shx_common::activity_qual OFF
    set CURALIAS shx_common::response_qual OFF
    set CURALIAS shx_common::alpha_response_qual OFF
    set CURALIAS shx_common::unable_to_obtain OFF
    set CURALIAS shx_common::details OFF
    set CURALIAS shx_common::element OFF
    set CURALIAS shx_common::response OFF
    set CURALIAS shx_common::alpha_response OFF
    set CURALIAS shx_common::numeric_response OFF

    call echo("Call to shx_ens_activity (601051) failed")
    return(shx_common::dSocialHistoryId)
  elseif(iDebugFlag > 0)
    call echorecord(601051_req)
    call echorecord(601051_rep)
  endif

  ; Set the Social History Id for details
  if(shx_common::updated_social_history->has_details_ind = 1)
    for(shx_common::iActivityIndex = 1 to size(601051_rep->activity_qual, 5))
      if(trim(601051_rep->activity_qual[shx_common::iActivityIndex].type_mean, 3) = "DETAIL")
        set shx_common::dSocialHistoryId = 601051_rep->activity_qual[shx_common::iActivityIndex].shx_activity_group_id
      endif
    endfor
  endif

  free record 601051_req
  free record 601051_rep

  set CURALIAS shx_common::activity_qual OFF
  set CURALIAS shx_common::response_qual OFF
  set CURALIAS shx_common::alpha_response_qual OFF
  set CURALIAS shx_common::unable_to_obtain OFF
  set CURALIAS shx_common::details OFF
  set CURALIAS shx_common::element OFF
  set CURALIAS shx_common::response OFF
  set CURALIAS shx_common::alpha_response OFF
  set CURALIAS shx_common::numeric_response OFF

  if(iDebugFlag > 0)
    call echo(concat("shx_common::WriteSocialHistoryActivity Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif

  return(shx_common::dSocialHistoryId)
end ; End subroutine shx_common::WriteSocialHistoryActivity

end
go
