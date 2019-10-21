/**************************************************************************************
  *                                                                                   *
  *  Copyright Notice:  (c) 1983 Laboratory Information Systems &                     *
  *                              Technology, Inc.                                     *
  *       Revision      (c) 1984-1997 Cerner Corporation                              *
  *                                                                                   *
  *  Cerner (R) Proprietary Rights Notice:  All rights reserved.                      *
  *  This material contains the valuable properties and trade secrets of              *
  *  Cerner Corporation of Kansas City, Missouri, United States of                    *
  *  America (Cerner), embodying substantial creative efforts and                     *
  *  confidential information, ideas and expressions, no part of which                *
  *  may be reproduced or transmitted in any form or by any means, or                 *
  *  retained in any storage or retrieval system without the express                  *
  *  written permission of Cerner.                                                    *
  *                                                                                   *
  *  Cerner is a registered mark of Cerner Corporation.                               *
  *                                                                                   *
  *************************************************************************************/
/**************************************************************************************
 
        Source file name:                   mp_dcp_updates_communication.PRG
        Object name:                        mp_dcp_updates_communication
 
        Product:
        Product Team:
 
        Program purpose:                    Updates the status of a given communication(s)
 
        Tables read:                        None
 
        Tables updated:                     DCP_MP_PL_COMM, DCP_MP_PL_COMM_PATIENT
 
        Executing from:                     MPages
 
        Special Notes:                      None
 
        Request Number:                     None
 
/**************************************************************************************
 
    ***********************************************************************
    *                   GENERATED MODIFICATION CONTROL LOG                *
    ***********************************************************************
     Mod    Date        Feature Engineer                    Comment
     ----   --------    ------- --------------------------- --------------------------
     0000   09/22/15    450905  KS026860                     Initial release
*******************************  END OF ALL MODCONTROL BLOCKS  **************************/
 
drop program mp_dcp_update_communication:dba go
create program mp_dcp_update_communication:dba
 
prompt
    "Output to File/Printer/MINE" = "MINE" ,
    "JSON_ARGS:" = ""
 
with OUTDEV, JSON_ARGS
 
/*
update_comm_request: {
    1 person_id f8
    1 communications[*]
        2 comm_patient_id f8
    1 prsnl_id f8
    1 update_type_flag i2 ; 0 - phone, 1 - portal message, 2 - letter
    1 message_text vc
    1 note_type_cd = f8
}*/
 
%i cclsource:mp_dcp_blob_in_params.inc
declare args = vc with protect, constant(ExtractParamsFromRequest(request, $JSON_ARGS))
declare stat = i4 with protect, noconstant(0)
 
set stat = cnvtjsontorec(args)
record best_encntr_request
(
    1 persons[*]
        2 person_id      = f8
)
 
record best_encntr_reply
(
    1 persons[*]
        2 person_id = f8
        2 encntr_id = f8
%i cclsource:status_block.inc
)
 
record dateRecord(
    1 datetime = dq8
)
 
free record reply
record reply
(
%i cclsource:status_block.inc
)
 
%i cclsource:mp_script_logging.inc
set log_program_name = "DWL_mp_dcp_update_communication"
set modify maxvarlen 52428800
call log_message("In mp_dcp_generate_communication", LOG_LEVEL_DEBUG)
 
/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
declare ReplyFailure(NULL)                      = NULL
declare CnvtCCLRec(NULL)                        = NULL
declare GetBestEncounter(NULL)                  = NULL
declare SaveMessageToChart(NULL)                = NULL
declare UpdatePhoneToDos(person_id = f8, comm_patient_id = f8)      = NULL
 
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare error_string = vc
declare fail_operation = vc
declare failed = i2 with NOCONSTANT(0)
declare GEN_COMM_STATUS_CODESET = i4 with constant(4116002), protect
declare CALLED_CD = f8 with constant(uar_get_code_by("MEANING",GEN_COMM_STATUS_CODESET,"CALLED")),protect
declare encounter_id = f8 with NOCONSTANT(0.0), protect
 
set ERRMSG = FILLSTRING(132," ")
set ERRCODE = error(ERRMSG,1)
set reply->status_data->status = "Z"
 
;CRM variables
declare hApp  = i4 with noconstant(0), protect
declare hTask = i4 with noconstant(0), protect
 
/**************************************************************
; DVDev Start Coding
**************************************************************/
declare num = i4 with noconstant(0), protect
 
declare NUM_COMMUNICATIONS = i4 with constant(size(update_comm_request->communications,5)), protect
 
if(update_comm_request->update_type_flag = 0)
    call GetBestEncounter(NULL)
    for(num = 1 to NUM_COMMUNICATIONS)
        call UpdatePhoneToDos(update_comm_request->person_id, update_comm_request->communications[num].comm_patient_id)
    endfor
    
    if(update_comm_request->note_type_cd > 0.0)
    	call SaveMessageToChart(NULL)
    else
    	call log_message("note_type_cd is not vaild, not Saving to Chart.", LOG_LEVEL_DEBUG)
    endif
endif
 
#exit_script
 
if(reply->status_data->status = "Z")
    set reply->status_data->status = "S"
endif
 
if(failed = 0)
    set reqinfo->commit_ind = 1 ;commit
    call CnvtCCLRec(null)
else
    set reqinfo->commit_ind = 0 ;rollback
endif
 
;Destroy CRM Handles
set crmStatus = uar_CrmEndTask(hTask)
set crmStatus = uar_CrmEndApp(hApp)
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
subroutine UpdatePhoneToDos(person_id, comm_patient_id)
    call log_message("In UpdatePhoneToDos()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
    update into dcp_mp_pl_comm_patient c
    set
        c.comm_status_cd = CALLED_CD,
        c.comm_status_dt_tm = cnvtdatetime(curdate,curtime3),
        c.last_updt_prsnl_id = update_comm_request->prsnl_id
    where
        c.dcp_mp_pl_comm_patient_id = comm_patient_id and
        c.person_id = person_id
    with nocounter
 
    set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
        set failed = 1
        set fail_operation = "UpdatePhoneToDos"
        call replyFailure("UPDATE")
    endif
 
    call log_message(build2("Exit UpdatePhoneToDos(), Elapsed time:",
        cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

subroutine GetBestEncounter(NULL)
 	call log_message("In GetBestEncounter()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
    
    declare json = vc with protect, noconstant("")
    set stat = alterlist(best_encntr_request->persons,1)
    set best_encntr_request->persons[1].person_id = update_comm_request->person_id
    set json = cnvtrectojson(best_encntr_request)
    execute mp_dcp_dwl_get_best_encntr "MINE", json
        with replace("REPLY", "BEST_ENCNTR_REPLY"),
             replace("FAIL_OPERATION", "BEST_ENCNTR_FAIL_OPERATION")
    if(best_encntr_reply->status_data.status = "F")
        set stat = moverec(best_encntr_reply->status_data, reply->status_data)
        go to exit_script
    else
        set encounter_id = best_encntr_reply->persons[1].encntr_id
    endif
    
    call log_message(build2("Exit GetBestEncounter(), Elapsed time:",
        cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
subroutine SaveMessageToChart(NULL)
    call log_message("In SaveMessageToChart()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
    
    execute crmrtl
    execute srvrtl
 
    declare EVENT_ENSURE_SERVICE = i4 with constant(1000012), private
    declare EVENT_ENSURE_TYPE_SIGN = i4 with constant(1), private
    declare CONTRIBUTOR_SYSTEM_CODESET = i4 with constant(89), private
    declare CONTRIBUTOR_SYSTEM_POWERCHART = f8
        with constant(uar_get_code_by("MEANING", CONTRIBUTOR_SYSTEM_CODESET, "POWERCHART")), private
    declare EVENT_CLASS_CODESET = i4 with constant(53), private
    declare EVENT_CLASS_MDOC = f8 with constant(uar_get_code_by("MEANING", EVENT_CLASS_CODESET, "MDOC")), private
    declare RECORD_STATUS_CODESET = i4 with constant(48), private
    declare ACTIVE_RECORD_STATUS = f8 with constant(uar_get_code_by("MEANING", RECORD_STATUS_CODESET, "ACTIVE")), private
    declare AUTHENTICATION_STATUS_CODESET = i4 with constant(8), private
    declare AUTHENTICATED_RESULT_STATUS = f8 with constant(uar_get_code_by("MEANING", AUTHENTICATION_STATUS_CODESET, "AUTH")), private
    declare EVENT_ACTION_CODESET = i4 with constant(21), private
    declare EVENT_PERFORM_ACTION = f8 with constant(uar_get_code_by("MEANING", EVENT_ACTION_CODESET, "PERFORM")), private
    declare ACTION_STATUS_CODESET = i4 with constant(103), private
    declare COMPLETED_ACTION_STATUS = f8 with constant(uar_get_code_by("MEANING", ACTION_STATUS_CODESET, "COMPLETED")), private
    declare SUCCESSION_TYPE_CODESET = i4 with constant(63), private
    declare INTERIM_SUCCESSION_TYPE = f8 with constant(uar_get_code_by("MEANING", SUCCESSION_TYPE_CODESET, "INTERIM")), private
    declare DOCUMENT_STORAGE_TYPE_CODESET = i4 with constant(25), private
    declare BLOB_STORAGE = f8 with constant(uar_get_code_by("MEANING", DOCUMENT_STORAGE_TYPE_CODESET, "BLOB"))
    declare DOCUMENT_FORMAT_CODESET = i4 with constant(23), private
    declare HTML_DOCUMENT = f8 with constant(uar_get_code_by("MEANING", DOCUMENT_FORMAT_CODESET, "HTML")), private
    declare AUTHENTIC_FLAG_TRUE = i2 with constant(1)
    declare PUBLISH_FLAG_TRUE = i2 with constant(1)
    
    declare messageBlobSize = i4 with noconstant(0), private
    declare errorMessage = vc with noconstant(""), private
 
    ;CRM Variables
    declare hStep = i4 with noconstant(0), private
    declare hReq = i4 with noconstant(0), private
    declare hReply = i4 with noconstant(0), private
    declare hItem = i4 with noconstant(0), private
    declare hBlob = i4 with noconstant(0), private
    declare hPrsnl = i4 with noconstant(0), private
    declare hStruct = i4 with noconstant(0), private
    declare hStatusBlock = i4 with noconstant(0), private
    declare crmStatus = i2 with noconstant(0), private
    declare srvStat = i4 with noconstant(0), private
    
    set crmStatus = uar_CrmBeginApp(EVENT_ENSURE_SERVICE, hApp)
    if (crmStatus != 0)
        set errorMessage = build2("Error in Begin App for application ", EVENT_ENSURE_SERVICE,
            ". Crm Status: ", crmStatus,
            ". Cannot call Event_Ensure. Exiting Script.")
        set failed = 1
        set fail_operation = "SaveMessageToChart"
        call replyFailure(errorMessage)
        go to exit_script
    endif
 
    set crmStatus = uar_CrmBeginTask(hApp, EVENT_ENSURE_SERVICE, hTask)
    if (crmStatus != 0)
        set errorMessage = build2("Error in Begin Task for task ", EVENT_ENSURE_SERVICE,
            ". Crm Status: ", crmStatus,
            ". Cannot call Event_Ensure. Exiting Script.")
        call uar_CrmEndApp(hApp)
        set failed = 1
        set fail_operation = "SaveMessageToChart"
        call replyFailure(errorMessage)
        go to exit_script
    endif
 
    set crmStatus = uar_CrmBeginReq(hTask, "", EVENT_ENSURE_SERVICE, hStep)
    if(crmStatus != 0)
        set errorMessage = build2("Error in Begin Request for request ", EVENT_ENSURE_SERVICE,
            ". Crm Status: ", crmStatus,
            ". Cannot call Event_Ensure. Exiting Script.")
        set failed = 1
        set fail_operation = "SaveMessageToChart"
        call replyFailure(errorMessage)
        go to exit_script
    else
        set dateRecord->datetime = cnvtdatetime(curdate, curtime)
        set hReq = uar_CrmGetRequest(hStep)
 
        set srvStat = uar_SrvSetShort (hReq, "ensure_type", EVENT_ENSURE_TYPE_SIGN)
 
        set hStruct = uar_SrvGetStruct(hReq, "clin_event")
        set srvStat = uar_SrvSetLong(hStruct, "view_level", EVENT_ENSURE_TYPE_SIGN)
        set srvStat = uar_SrvSetDouble(hStruct, "person_id", update_comm_request->person_id)
        set srvStat = uar_SrvSetDouble(hStruct, "encntr_id", encounter_id)
        set srvStat = uar_SrvSetDouble(hStruct, "event_cd", update_comm_request->note_type_cd)
        set srvStat = uar_SrvSetDouble(hStruct, "contributor_system_cd", CONTRIBUTOR_SYSTEM_POWERCHART)
        set srvStat = uar_SrvSetDouble(hStruct, "event_class_cd", EVENT_CLASS_MDOC)
        set srvStat = uar_SrvSetDouble(hStruct, "record_status_cd", ACTIVE_RECORD_STATUS)
        set srvStat = uar_SrvSetDouble(hStruct, "result_status_cd", AUTHENTICATED_RESULT_STATUS)
        set srvStat = uar_SrvSetDate2(hStruct, "event_end_dt_tm", dateRecord)
        set srvStat = uar_SrvSetLong(hStruct, "event_end_tz", CURTIMEZONEAPP)
        set srvStat = uar_SrvSetShort(hStruct, "authentic_flag", AUTHENTIC_FLAG_TRUE)
        set srvStat = uar_SrvSetShort(hStruct, "publish_flag", PUBLISH_FLAG_TRUE)
        set srvStat = uar_SrvSetString(hStruct, "event_title_text", uar_get_code_display(update_comm_request->note_type_cd))
 
        set hPrsnl = uar_SrvAddItem(hStruct, "event_prsnl_list")
        set srvStat = uar_SrvSetDouble(hPrsnl, "person_id", update_comm_request->person_id)
        set srvStat = uar_SrvSetDate2(hPrsnl, "action_dt_tm", dateRecord)
        set srvStat = uar_SrvSetLong(hPrsnl, "action_tz", CURTIMEZONEAPP)
        set srvStat = uar_SrvSetDouble(hPrsnl, "action_type_cd", EVENT_PERFORM_ACTION)
        set srvStat = uar_SrvSetDouble(hPrsnl, "action_status_cd", COMPLETED_ACTION_STATUS)
        set srvStat = uar_SrvSetDouble(hPrsnl, "action_prsnl_id", update_comm_request->prsnl_id)
 
        set srvstat = uar_SrvBindItemType(hStruct, "child_event_list", uar_SrvCreateTypeFrom(hStruct, 0))
 
        set hChild = uar_SrvAddItem(hStruct, "child_event_list")
        set srvStat = uar_SrvSetDouble(hChild, "person_id", update_comm_request->person_id)
        set srvStat = uar_SrvSetDouble(hChild, "encntr_id", encounter_id)
        set srvStat = uar_SrvSetDouble(hChild, "event_cd", update_comm_request->note_type_cd)
        set srvStat = uar_SrvSetDouble(hChild, "contributor_system_cd", CONTRIBUTOR_SYSTEM_POWERCHART)
        set srvStat = uar_SrvSetDouble(hChild, "event_class_cd", EVENT_CLASS_MDOC)
        set srvStat = uar_SrvSetDouble(hChild, "record_status_cd", ACTIVE_RECORD_STATUS)
        set srvStat = uar_SrvSetDouble(hChild, "result_status_cd", AUTHENTICATED_RESULT_STATUS)
        set srvStat = uar_SrvSetDate2(hChild, "event_end_dt_tm", dateRecord)
        set srvStat = uar_SrvSetLong(hChild, "event_end_tz", CURTIMEZONEAPP)
        set srvStat = uar_SrvSetShort(hChild, "authentic_flag", AUTHENTIC_FLAG_TRUE)
        set srvStat = uar_SrvSetShort(hChild, "publish_flag", PUBLISH_FLAG_TRUE)
 
        set hPrsnlChild = uar_SrvAddItem(hChild, "event_prsnl_list")
        set srvStat = uar_SrvSetDouble(hPrsnlChild, "person_id", update_comm_request->person_id)
        set srvStat = uar_SrvSetDate2(hPrsnlChild, "action_dt_tm", dateRecord)
        set srvStat = uar_SrvSetLong(hPrsnlChild, "action_tz", CURTIMEZONEAPP)
        set srvStat = uar_SrvSetDouble(hPrsnlChild, "action_type_cd", EVENT_PERFORM_ACTION)
        set srvStat = uar_SrvSetDouble(hPrsnlChild, "action_status_cd", COMPLETED_ACTION_STATUS)
        set srvStat = uar_SrvSetDouble(hPrsnlChild, "action_prsnl_id", update_comm_request->prsnl_id)
 
        set hBlobRes = uar_SrvAddItem(hChild, "blob_result")
        set srvStat = uar_SrvSetDouble(hBlobRes, "succession_type_cd", INTERIM_SUCCESSION_TYPE)
        set srvStat = uar_SrvSetDouble(hBlobRes, "storage_cd", BLOB_STORAGE)
        set srvStat = uar_SrvSetDouble(hBlobRes, "format_cd", HTML_DOCUMENT)
 
        set hBlob = uar_SrvAddItem(hBlobRes, "blob")
        set messageBlobSize = size(update_comm_request->message_text, 1)
        set srvStat = uar_SrvSetAsIs(hBlob, "blob_contents", update_comm_request->message_text, messageBlobSize)
 
        ;Call the Clinical Event Server
        set crmStatus = uar_CrmPerform(hStep)
        set hReply = uar_CrmGetReply(hStep)
        set hStatusBlock = uar_SrvGetStruct(hReply, "sb")
 
        if(crmStatus != 0)
            set errorMessage = build2("Error in Perform Request for request ", EVENT_ENSURE_SERVICE,
                ". Crm Status: ", crmStatus,
                ". StatusText: ", uar_SrvGetStringPtr(hStatusBlock, "statusText"),
                ". Cannot call Event_Ensure. Exiting Script.")
            set failed = 1
            set fail_operation = "SaveMessageToChart"
            call replyFailure(errorMessage)
            go to exit_script
        endif
    endif
   call log_message(build2("Exit SaveMessageToChart(), Elapsed time:",
        cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
subroutine ReplyFailure(targetObjName)
    call log_message("In ReplyFailure()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
    call log_message(build("Error: ", targetObjName, " - ", trim(ERRMSG)), LOG_LEVEL_ERROR)
 
    set reply->status_data.status = "F"
    set reply->status_data.subeventstatus[1].OperationName = fail_operation
    set reply->status_data.subeventstatus[1].OperationStatus = "F"
    set reply->status_data.subeventstatus[1].TargetObjectName = targetObjName
    set reply->status_data.subeventstatus[1].TargetObjectValue = ERRMSG
 
    call CnvtCCLRec(null)
 
    call log_message(build2("Exit ReplyFailure(), Elapsed time:",
        cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
    go to exit_script
end
 
subroutine CnvtCCLRec(null)
    call log_message("In CnvtCCLRec()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
    declare strJSON = vc
 
    set strJSON = cnvtrectojson(reply)
    set _Memory_Reply_String = strJSON
 
    call log_message(build2("Exit CnvtCCLRec(), Elapsed time:",
        cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
end
go
 
