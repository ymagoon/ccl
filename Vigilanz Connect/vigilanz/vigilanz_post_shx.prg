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
      Source file name:    snsro_post_shx.prg
      Object name:         vigilanz_post_shx
      Program purpose:    Posts Social History Information
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
drop program vigilanz_post_shx go
create program vigilanz_post_shx
 
prompt
  "Output to File/Printer/MINE" = "MINE" ;Required
  , "Username" = "" ;Required
  , "JSON Args" = "" ;Required
  , "DebugFlag" = "" ;Optional
 
with OUTDEV, USERNAME, JSON_ARGS, DEBUG_FLAG
 
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
  1 PatientId = vc
  1 FacilityId = vc
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
)

free record post_social_history_reply_out
record post_social_history_reply_out (
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
if(validate(snsro_post_shx_includes_executed, 0) = 0)
  declare snsro_post_shx_includes_executed = i2 with persistscript, constant(1)
  execute snsro_common
  execute snsro_common_shx
endif

/*************************************************************************
;DECLARE VARIABLES
**************************************************************************/
; Input
declare c_time_zone_index = i4 with protect, constant(CURTIMEZONEAPP)
declare c_now_dt_tm = dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
declare c_script_name = vc with protect, constant("vigilanz_post_shx")
declare c_error_handler = vc with protect, constant("POST SOCIAL HISTORY")

declare c_application_id = i4 with protect, constant(600005)
declare iApplicationId = i4 with protect, noconstant(0)
declare iTransactionTaskId = i4 with protect, noconstant(0)
declare iStepId = i4 with protect, noconstant(0)

declare sFailureMessage = vc with protect, noconstant("")
declare iRet = i2 with protect, noconstant(0)
declare dPatientId = f8 with protect, noconstant(0.00)
declare dFacilityCd = f8 with protect, noconstant(0.00)
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

if(isnumeric(trim(arglist->PatientId, 3)))
  set dPatientId = cnvtreal(trim(arglist->PatientId, 3))
endif

if(isnumeric(trim(arglist->FacilityId, 3)))
  set dFacilityCd = cnvtreal(trim(arglist->FacilityId, 3))
endif

if(isnumeric(trim(arglist->CategoryId, 3)))
  set dCategoryId = cnvtreal(trim(arglist->CategoryId, 3))
endif

/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ValidateParameters(null) = null with protect ; Validates the script parameters
declare PopulateInput(arglistRec = vc (ref), inputRec = vc (ref)) = null with protect ; Populates the input record structure

/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
set iRet = PopulateAudit(sUsername, dPatientId, post_social_history_reply_out, sVersion)
if(iRet = 0)
  call ErrorHandler2(c_error_handler, "F", "PopulateAudit",
    "PopulateAudit failed", "9999",
    "PopulateAudit failed", post_social_history_reply_out)
  go to exit_script
endif

call ValidateParameters(null)

call PopulateInput(arglist, shx_common::input)

set iRet = shx_common::ValidateSocialHistoryInput(sFailureMessage)
if(iRet = 0)
  call ErrorHandler2(c_error_handler, "F", "shx_common::ValidateSocialHistoryInput",
    sFailureMessage, "9999", sFailureMessage, post_social_history_reply_out)
  go to exit_script
endif

; FUTURE Remove this when unable to obtain and assessments are supported
if(dCategoryId <= 0 or (textlen(trim(arglist->Comment, 3)) = 0 and size(arglist->FieldInputs, 5) < 1))
  call ErrorHandler2(c_error_handler, "F", c_script_name,
    "Unable to obtain and assessments are not supported", "9999",
    "Unable to obtain and assessments are not supported", post_social_history_reply_out)
  go to exit_script
endif

set iRet = shx_common::HasPrivilegeToUpdateSocialHistory(null)
if(iRet = 0)
  call ErrorHandler2(c_error_handler, "F", "shx_common::HasPrivilegeToUpdateSocialHistory",
    "User does not have privileges to update social history information", "9999",
    "User does not have privileges to update social history information", post_social_history_reply_out)
  go to exit_script
endif

set iRet = shx_common::LoadSocialHistoryReference(dPatientId, dCategoryId)
if(iRet = 0)
  call ErrorHandler2(c_error_handler, "F", "shx_common::LoadSocialHistoryReference",
    "Loading social history reference failed", "9999",
    "Loading social history reference failed", post_social_history_reply_out)
  go to exit_script
endif

; Load unable to obtain information
set iRet = shx_common::LoadSocialHistoryActivity(dPatientId, dUserId, 0.00)
if(iRet = 0)
  call ErrorHandler2(c_error_handler, "F", "shx_common::LoadSocialHistoryActivity",
    "Loading social history activity failed", "9999",
    "Loading social history activity failed", post_social_history_reply_out)
  go to exit_script
endif

set iRet = shx_common::PopulateUpdatedSocialHistory(dPatientId, 0.00, dFacilityCd, 0)
if(iRet = 0)
  call ErrorHandler2(c_error_handler, "F", "shx_common::PopulateUpdatedSocialHistory",
    "Populating updated social history failed", "9999",
    "Populating updated social history failed", post_social_history_reply_out)
  go to exit_script
endif

set iRet = shx_common::ValidateUpdatedSocialHistory(sFailureMessage)
if(iRet = 0)
  call ErrorHandler2(c_error_handler, "F", "shx_common::ValidateSocialHistoryInput",
    sFailureMessage, "9999", sFailureMessage, post_social_history_reply_out)
  go to exit_script
endif

set post_social_history_reply_out->social_history_id = shx_common::WriteSocialHistoryActivity(dUserId)
if(post_social_history_reply_out->social_history_id <= 0.00)
  call ErrorHandler2(c_error_handler, "F", "shx_common::WriteSocialHistoryActivity",
    "Call to shx_ens_activity (601051) failed", "9999",
    "Call to shx_ens_activity (601051) failed", post_social_history_reply_out)
  go to exit_script
endif

;Set audit to successful
call ErrorHandler2( c_error_handler, "S", "Success",
  "Social History information posted successfully.", "0000",
  "Social History information posted successfully.", post_social_history_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set sJsonOut = CNVTRECTOJSON(post_social_history_reply_out)
if(validate(_MEMORY_REPLY_STRING))
  set _MEMORY_REPLY_STRING = trim(sJsonOut, 3)
endif
 
if(iDebugFlag > 0)
  set _file = build2(trim(logical("ccluserdir"), 3), "/", c_script_name, ".json")
  call echo(build("_file  ->", _file))

  call echorecord(post_social_history_reply_out)
  call echojson(post_social_history_reply_out, _file, 0)
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
      "Username is required", post_social_history_reply_out)
    go to exit_script
  endif

  if(iDebugFlag > 0)
    call echo(concat("ValidateParameters Runtime: ",
      trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
      " seconds"))
  endif
end ; End subroutine ValidateParameters

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

  set inputRec->PatientId = trim(arglistRec->PatientId, 3)
  set inputRec->FacilityId = trim(arglistRec->FacilityId, 3)
  set inputRec->UnableToObtain = trim(arglistRec->UnableToObtain, 3)
  set inputRec->CategoryId = trim(arglistRec->CategoryId, 3)
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
