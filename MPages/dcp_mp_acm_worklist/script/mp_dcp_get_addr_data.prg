drop program mp_dcp_get_addr_data:dba go
create program mp_dcp_get_addr_data:dba
 
PROMPT "Output to File/Printer/MINE" ="MINE" ,
"JSON_ARGS:" = ""
WITH  OUTDEV 

/* 
No request needed
*/

free record reply
record reply
(
  	1 states[*]
		2 state_cd = f8
		2 state_disp = vc
	1 countries[*]
		2 country_cd = f8
		2 country_disp = vc
%i cclsource:status_block.inc
)

%i cclsource:mp_script_logging.inc

/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
declare RetrieveStatesAndCountries(NULL) = NULL
declare replyFailure(NULL) = NULL
declare CnvtCCLRec(NULL) = NULL

/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare error_string = vc
declare fail_operation = vc
declare failed = i2 with NOCONSTANT(0)

set ERRMSG =  FILLSTRING(132," ")
set ERRCODE = error(ERRMSG,1)
set reply->status_data->status = "Z"

call RetrieveStatesAndCountries(null)

#exit_script
 
if (reply->status_data->status = "Z")
	if(size(reply->countries, 5) > 0 OR size(reply->states, 5) > 0)
		set reply->status_data->status = "S"
	endif
endif

;call echorecord(reply)

if(failed = 0)
	call CnvtCCLRec(null)
endif
    
subroutine RetrieveStatesAndCountries(null)

	call log_message("Begin RetrieveStatesAndCountries()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
    declare STATE_CD_SET = i4 with constant(62), protect
    declare COUNTRY_CD_SET = i4 with constant(15), protect
    declare BATCH_SIZE = i4 with constant(20), protect
    declare state_idx = i4 with noconstant(0), protect
    declare country_idx = i4 with noconstant(0), protect
    

	select into "nl:"
	from
    	code_value cv
	where
    	cv.code_set IN (STATE_CD_SET,COUNTRY_CD_SET) and
    	cv.active_ind = 1
	order by
    	cv.code_set, cv.display_key
	detail
	 	if(cv.code_set = COUNTRY_CD_SET)
	 		country_idx = country_idx + 1
	 		if(mod(country_idx,BATCH_SIZE) = 1)
				stat = alterlist(reply->countries, country_idx + BATCH_SIZE - 1)
			endif
	 		reply->countries[country_idx].country_cd = cv.code_value
	 		reply->countries[country_idx].country_disp = cv.display
	 	elseif(cv.code_set = STATE_CD_SET)
	 		state_idx = state_idx + 1
	 		if(mod(state_idx,BATCH_SIZE) = 1)
				stat = alterlist(reply->states, state_idx + BATCH_SIZE - 1)
			endif
	 		reply->states[state_idx].state_cd = cv.code_value
	 		reply->states[state_idx].state_disp = cv.display
	 	endif
	foot report
		stat = alterlist(reply->countries, country_idx)
		stat = alterlist(reply->states, state_idx)
	 with nocounter
	
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "getStatesAndCountries"
       call replyFailure("SELECT")
    endif
    
	call log_message(build2("Exit RetrieveStatesAndCountries(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

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

 
end go
