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
      Source file name:    snsro_pat_shx.prg
      Object name:         vigilanz_pat_shx
      Program purpose:    Patches Social History Information
      Tables read:        MANY
      Tables updated:     MANY
      Executing from:     mPages Discern Web Service
      Special Notes:        NA
*********************************************************************************/
/********************************************************************************
*                   MODIFICATION CONTROL LOG                                    *
*********************************************************************************
 Mod Date     Engineer              Comment                                     *
 --- -------- -------------------   --------------------------------------------*
 001 02/11/20 DSH                   Initial Write
*********************************************************************************/
/********************************************************************************/
drop program vigilanz_pat_shx go
create program vigilanz_pat_shx
 
prompt
  "Output to File/Printer/MINE" = "MINE" ;Required
  , "Username" = "" ;Required
  , "SocialHistoryId" = "" ;Required
  , "JSON Args" = "" ;Required
  , "DebugFlag" = "" ;Optional
 
with OUTDEV, USERNAME, SOCIAL_HISTORY_ID, JSON_ARGS, DEBUG_FLAG
 
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
; JSON input argument list
free record arglist
record arglist (
  1 UnableToObtain = vc
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
)

free record pat_social_history_reply_out
record pat_social_history_reply_out (
  1 social_history_id = f8
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
if(validate(snsro_pat_shx_includes_executed, 0) = 0)
  declare snsro_pat_shx_includes_executed = i2 with persistscript, constant(1)
  execute snsro_common
  execute snsro_common_shx
endif

/*************************************************************************
;DECLARE VARIABLES
**************************************************************************/
; Input
declare c_time_zone_index = i4 with protect, constant(CURTIMEZONEAPP)
declare c_now_dt_tm = dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
declare c_script_name = vc with protect, constant("vigilanz_pat_shx")
declare c_error_handler = vc with protect, constant("PATCH SOCIAL HISTORY")

declare c_application_id = i4 with protect, constant(600005)
declare iApplicationId = i4 with protect, noconstant(0)
declare iTransactionTaskId = i4 with protect, noconstant(0)
declare iStepId = i4 with protect, noconstant(0)

declare sFailureMessage = vc with protect, noconstant("")
declare iRet = i2 with protect, noconstant(0)
declare dPatientId = f8 with protect, noconstant(0.00)
declare dOrganizationId = f8 with protect, noconstant(0.00)
declare dSocialHistoryId = f8 with protect, noconstant(0.00)
declare dCategoryId = f8 with protect, noconstant(0.00)

/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
declare iDebugFlag = i2 with protect, noconstant(cnvtint($DEBUG_FLAG))
declare sJsonArgs = gvc with protect, noconstant(trim($JSON_ARGS,3))
set jrec = cnvtjsontorec(sJsonArgs)
declare sUsername = vc with protect, noconstant(trim($USERNAME, 3))
; Use snsro_common GetPrsnlIDFromUserName to get the prsnl_id from the username
declare dUserId = f8 with protect, noconstant(GetPrsnlIDFromUserName(sUsername))

if(isnumeric(trim($SOCIAL_HISTORY_ID, 3)))
  set dSocialHistoryId = cnvtreal(trim($SOCIAL_HISTORY_ID, 3))
endif

/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ValidateParameters(null) = null with protect ; Validates the script parameters
declare GetSocialHistoryCategoryReferenceId(dSocialHistoryId = f8) = f8 ; Gets the category id
declare PopulateInput(arglistRec = vc (ref), inputRec = vc (ref)) = null with protect ; Populates the input record structure

/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
set iRet = PopulateAudit(sUsername, dPatientId, pat_social_history_reply_out, sVersion)
if(iRet = 0)
  call ErrorHandler2(c_error_handler, "F", "PopulateAudit",
    "PopulateAudit failed", "9999",
    "PopulateAudit failed", pat_social_history_reply_out)
  go to exit_script
endif

call ValidateParameters(null)

set dCategoryId = GetSocialHistoryCategoryReferenceId(dSocialHistoryId)

set iRet = PopulateAudit(sUsername, dPatientId, pat_social_history_reply_out, sVersion)
if(iRet = 0)
  call ErrorHandler2(c_error_handler, "F", "PopulateAudit",
    "PopulateAudit failed", "9999",
    "PopulateAudit failed", pat_social_history_reply_out)
  go to exit_script
endif

call PopulateInput(arglist, shx_common::input)

set iRet = shx_common::ValidateSocialHistoryInput(sFailureMessage)
if(iRet = 0)
  call ErrorHandler2(c_error_handler, "F", "shx_common::ValidateSocialHistoryInput",
    sFailureMessage, "9999", sFailureMessage, pat_social_history_reply_out)
  go to exit_script
endif

; FUTURE Remove this when unable to obtain and assessments are supported
if(textlen(trim(arglist->Comment, 3)) = 0 and size(arglist->FieldInputs, 5) < 1)
  call ErrorHandler2(c_error_handler, "F", c_script_name,
    "Unable to obtain and assessments are not supported", "9999",
    "Unable to obtain and assessments are not supported", pat_social_history_reply_out)
  go to exit_script
endif

set iRet = shx_common::HasPrivilegeToUpdateSocialHistory(null)
if(iRet = 0)
  call ErrorHandler2(c_error_handler, "F", "shx_common::HasPrivilegeToUpdateSocialHistory",
    "User does not have privileges to update social history information", "9999",
    "User does not have privileges to update social history information", pat_social_history_reply_out)
  go to exit_script
endif

set iRet = shx_common::LoadSocialHistoryReference(dPatientId, dCategoryId)
if(iRet = 0)
  call ErrorHandler2(c_error_handler, "F", "shx_common::LoadSocialHistoryReference",
    "Loading social history reference failed", "9999",
    "Loading social history reference failed", pat_social_history_reply_out)
  go to exit_script
endif

; Load activity information
set iRet = shx_common::LoadSocialHistoryActivity(dPatientId, dUserId, dCategoryId)
if(iRet = 0)
  call ErrorHandler2(c_error_handler, "F", "shx_common::LoadSocialHistoryActivity",
    "Loading social history activity failed", "9999",
    "Loading social history activity failed", pat_social_history_reply_out)
  go to exit_script
endif

; Load activity detail information
set iRet = shx_common::LoadSocialHistoryActivityDetails(dSocialHistoryId)
if(iRet = 0)
  call ErrorHandler2(c_error_handler, "F", "shx_common::LoadSocialHistoryActivity",
    "Loading social history activity details failed", "9999",
    "Loading social history activity details failed", pat_social_history_reply_out)
  go to exit_script
endif

if(shx_common::social_history_activity->has_details_ind = 0)
  call ErrorHandler2(c_error_handler, "F", "shx_common::LoadSocialHistoryActivity",
    "No active social history activity found", "9999",
    "No active social history activity found", pat_social_history_reply_out)
  go to exit_script
endif

set iRet = shx_common::PopulateUpdatedSocialHistory(dPatientId, dOrganizationId, 0.00, 0)
if(iRet = 0)
  call ErrorHandler2(c_error_handler, "F", "shx_common::PopulateUpdatedSocialHistory",
    "Populating updated social history failed", "9999",
    "Populating updated social history failed", pat_social_history_reply_out)
  go to exit_script
endif

set iRet = shx_common::ValidateUpdatedSocialHistory(sFailureMessage)
if(iRet = 0)
  call ErrorHandler2(c_error_handler, "F", "shx_common::ValidateSocialHistoryInput",
    sFailureMessage, "9999", sFailureMessage, pat_social_history_reply_out)
  go to exit_script
endif

set pat_social_history_reply_out->social_history_id = shx_common::WriteSocialHistoryActivity(dUserId)
if(pat_social_history_reply_out->social_history_id <= 0.00)
  call ErrorHandler2(c_error_handler, "F", "shx_common::WriteSocialHistoryActivity",
    "Call to shx_ens_activity (601051) failed", "9999",
    "Call to shx_ens_activity (601051) failed", pat_social_history_reply_out)
  go to exit_script
endif

;Set audit to successful
call ErrorHandler2( c_error_handler, "S", "Success",
  "Social History information patched successfully.", "0000",
  "Social History information patched successfully.", pat_social_history_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set sJsonOut = CNVTRECTOJSON(pat_social_history_reply_out)
if(validate(_MEMORY_REPLY_STRING))
  set _MEMORY_REPLY_STRING = trim(sJsonOut, 3)
endif
 
if(iDebugFlag > 0)
  set _file = build2(trim(logical("ccluserdir"), 3), "/", c_script_name, ".json")
  call echo(build("_file  ->", _file))

  call echorecord(pat_social_history_reply_out)
  call echojson(pat_social_history_reply_out, _file, 0)
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
    call ErrorHandler2(c_error_handler, "F", "shx_common::ValidateParameters",
      "Username is required", "9999",
      "Username is required", pat_social_history_reply_out)
    go to exit_script
  endif

  if(dSocialHistoryId <= 0.00)
    call ErrorHandler2(c_error_handler, "F", "shx_common::ValidateParameters",
      "SocialHistoryId is required", "9999",
      "SocialHistoryId is required", pat_social_history_reply_out)
    go to exit_script
  endif

  if(iDebugFlag > 0)
    call echo(concat("ValidateParameters Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine ValidateParameters

/*************************************************************************
;  Name: GetSocialHistoryCategoryReferenceId(dSocialHistoryId = f8) = f8
;  Description:  Gets the Social History category reference id (shx_category_ref_id)
**************************************************************************/
subroutine GetSocialHistoryCategoryReferenceId(dSocialHistoryId)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("GetSocialHistoryCategoryReferenceId Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
  endif

  set dCategoryId = 0.00

  select into "nl:"
    scd.shx_category_ref_id
    , scd.end_effective_dt_tm
  from
    shx_activity sa
    , shx_category_def scd
  plan sa where sa.shx_activity_group_id = dSocialHistoryId
  join scd where scd.shx_category_def_id = sa.shx_category_def_id
  order by scd.end_effective_dt_tm desc
  head report
    dPatientId = sa.person_id
    dOrganizationId = sa.organization_id
    dCategoryId = scd.shx_category_ref_id
    call cancel(0)
  with nocounter

  if(curqual = 0)
    call ErrorHandler2(c_error_handler, "F", "GetSocialHistoryCategoryReferenceId",
      "Unable to find shx_category_ref_id", "9999",
      "Unable to find shx_category_ref_id", pat_social_history_reply_out)
    go to exit_script
  endif

  if(iDebugFlag > 0)
    call echo(concat("GetSocialHistoryCategoryReferenceId Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif

  return(dCategoryId)
end ; End subroutine GetSocialHistoryCategoryReferenceId

/*************************************************************************
;  Name: PopulateInput(arglistRec = vc (ref), inputRec = vc (ref)) = null
;  Description:  Populates the input record structure
**************************************************************************/
subroutine PopulateInput(arglistRec, inputRec)
  if(iDebugFlag > 0)
    set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
    call echo(concat("PopulateInput Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))

    call echorecord(arglistRec)
  endif

  set inputRec->dPatientId = dPatientId
  set inputRec->dOrganizationId = dOrganizationId
  set inputRec->UnableToObtain = trim(arglistRec->UnableToObtain, 3)
  set inputRec->CategoryId = cnvtstring(dCategoryId)
  set inputRec->Comment = trim(arglistRec->Comment, 3)
  set inputRec->AssessmentResponseId = trim(arglistRec->AssessmentResponseId, 3)

  set stat = alterlist(inputRec->FieldInputs, size(arglistRec->FieldInputs, 5))
  for(i = 1 to size(arglistRec->FieldInputs, 5))
    set inputRec->FieldInputs[i].FieldId = trim(arglistRec->FieldInputs[i].FieldId, 3)

    set stat = alterlist(inputRec->FieldInputs[i].CodedValueIds, size(arglistRec->FieldInputs[i].CodedValueIds, 5))
    for(j = 1 to size(arglistRec->FieldInputs[i].CodedValueIds, 5))
      set inputRec->FieldInputs[i].CodedValueIds[j] = trim(arglistRec->FieldInputs[i].CodedValueIds[j], 3)
    endfor

    set stat = alterlist(inputRec->FieldInputs[i].TextValues, size(arglistRec->FieldInputs[i].TextValues, 5))
    for(j = 1 to size(arglistRec->FieldInputs[i].TextValues, 5))
      set inputRec->FieldInputs[i].TextValues[j] = trim(arglistRec->FieldInputs[i].TextValues[j], 3)
    endfor

    set stat = alterlist(inputRec->FieldInputs[i].NumericValues, size(arglistRec->FieldInputs[i].NumericValues, 5))
    for(j = 1 to size(arglistRec->FieldInputs[i].NumericValues, 5))
      set inputRec->FieldInputs[i].NumericValues[j].Value = trim(arglistRec->FieldInputs[i].NumericValues[j].Value, 3)
      set inputRec->FieldInputs[i].NumericValues[j].UnitId = trim(arglistRec->FieldInputs[i].NumericValues[j].UnitId, 3)
      set inputRec->FieldInputs[i].NumericValues[j].ModifierId = trim(arglistRec->FieldInputs[i].NumericValues[j].ModifierId, 3)
    endfor
  endfor

  if(iDebugFlag > 0)
    call echorecord(inputRec)

    call echo(concat("PopulateInput Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine PopulateInput

end
go
