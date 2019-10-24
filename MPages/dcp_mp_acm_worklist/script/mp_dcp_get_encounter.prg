drop program mp_dcp_get_encounter:dba go
create program mp_dcp_get_encounter:dba

prompt
	"Output to File/Printer/MINE" = "MINE" ,
	"JSON_ARGS:" = ""
 
with OUTDEV, JSON_ARGS
 
declare args = vc with protect, constant($JSON_ARGS)

/*
record best_encounter_request
(
	1 person_id = f8
)
*/

set jrec = cnvtjsontorec(args)
call echorecord(best_encounter_request)

free record reply
record reply
(
	1 encounter_id = f8
%i cclsource:status_block.inc
)

%i cclsource:mp_script_logging.inc
set modify maxvarlen 52428800 
call log_message("In mp_dcp_get_encounter", LOG_LEVEL_DEBUG)

/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
declare replyFailure(null) = null
declare CnvtCCLRec(NULL) = null

/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare fail_operation = vc
declare failed = i2 with NOCONSTANT(0)
set ERRMSG =  FILLSTRING(132," ")
set ERRCODE = error(ERRMSG,1)
set reply->status_data->status = "Z"

/**************************************************************
; DVDev Start Coding
**************************************************************/
free record get_best_request
record get_best_request
(
	1 person_id = F8
	1 select_encntr_meaning = c12  ;013
	1 ignore_security = i2 ;*** MOD 018
	1 restrict_encntr_meaning = I2 ;019
)

free record get_best_reply
record get_best_reply
(
	1 encntr_id = f8
	1 time_zone_index = i4
	1 lookup_status = I4
	
%i cclsource:status_block.inc
)

set get_best_request->person_id = best_encounter_request->person_id
execute pts_get_the_best_encntr with replace("REQUEST", "GET_BEST_REQUEST"), replace("REPLY", "GET_BEST_REPLY")
if(get_best_reply->status_data.status = "F")
	set stat = moverec(get_best_reply->status_data,reply->status_data)
	return
endif
set reply->encounter_id = get_best_reply->encntr_id
set reply->status_data->status = get_best_reply->status_data->status

set ERRCODE = ERROR(ERRMSG,0)
if(ERRCODE != 0)
    set failed = 1
    set fail_operation = "pts_get_the_best_encntr"
    call replyFailure("")
endif

#exit_script
if (reply->status_data->status = "Z")
	set reply->status_data->status = "S"
endif

call echorecord(reply)
if(failed = 0)
	call CnvtCCLRec(null)
endif

/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
subroutine replyFailure(targetObjName)
     call log_message("In replyFailure()", LOG_LEVEL_DEBUG)
     declare BEGIN_TIME = f8 with constant(curtime3), private
     
     call log_message(build("Error: ", targetObjName, " - ", trim(ERRMSG)), LOG_LEVEL_ERROR)
 
     rollback
     set reply->status_data.status = "F"
     set reply->status_data.subeventstatus[1].OperationName = fail_operation
     set reply->status_data.subeventstatus[1].OperationStatus = "F"
     set reply->status_data.subeventstatus[1].TargetObjectName = targetObjName
     set reply->status_data.subeventstatus[1].TargetObjectValue = ERRMSG
 
     call CnvtCCLRec(null)
 
     call log_message(build2("Exit replyFailure(), Elapsed time:",
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

