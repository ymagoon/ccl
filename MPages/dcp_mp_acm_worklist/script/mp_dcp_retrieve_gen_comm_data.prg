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

        Source file name:                   mp_dcp_retrieve_gen_comm_data.PRG
        Object name:                        mp_dcp_retrieve_gen_comm_data

        Product:
        Product Team:

        Program purpose:                    Retrieves needed data for the Generate 
        									Communication Dialog

        Tables read:                        NOTE_TYPE, CODE_VALUE

        Tables updated:                     None

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
     0001   06/23/17	539569	PK021483                     Removed the logic to query note types from note_type table
                                                             and instead retrieving it from a service retrieveNoteTypes(969540)
*******************************  END OF ALL MODCONTROL BLOCKS  **************************/

drop program mp_dcp_retrieve_gen_comm_data:dba go
create program mp_dcp_retrieve_gen_comm_data:dba

free record reply
record reply
(
	1 note_types[*]
		2 note_type_cd = f8
		2 note_type_disp = vc
	1 subjects[*]
		2 subject_cd = f8
		2 subject_disp = vc
	1 address_types[*]
		2 address_type_cd = f8
		2 address_type_disp = vc
	1 subject_other_cd = f8
%i cclsource:status_block.inc
)

%i cclsource:mp_script_logging.inc
%i cclsource:mp_pie_get_note_types.inc
set modify maxvarlen 52428800
call log_message("In mp_dcp_retrieve_gen_comm_data", LOG_LEVEL_DEBUG)

/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
declare GetActiveNoteTypes(NULL) = NULL
declare GetSubjects(NULL) = NULL
declare GetAddressTypes(NULL) = NULL
declare replyFailure(NULL) = NULL
declare CnvtCCLRec(NULL) = NULL

/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare error_string = vc
declare fail_operation = vc
declare failed = i2 with NOCONSTANT(0)
declare stat = i4 with protect, noconstant(0)

set ERRMSG =  FILLSTRING(132," ")
set ERRCODE = error(ERRMSG,1)
set reply->status_data->status = "Z"

/**************************************************************
; DVDev Start Coding
**************************************************************/
call GetActiveNoteTypes(null)
call GetSubjects(null)
call GetAddressTypes(null)

#exit_script
 
if (reply->status_data->status = "Z")
	if(size(reply->note_types, 5) > 0 or size(reply->subjects, 5) > 0 or
		size(reply->address_types, 5) > 0)
		set reply->status_data->status = "S"
	endif
endif

call echorecord(reply)
if(failed = 0)
	call CnvtCCLRec(null)
endif

/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
subroutine GetActiveNoteTypes(NULL)
	call log_message("In GetActiveNoteTypes()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare record_size = i4 with protect, noconstant(0)
        declare note_count = i4 with noconstant(0)
 	
 	record noteTypesOutRec(	
		1 note_types[*]
			2 note_type_cd = f8
			2 note_type_display = vc
			2 note_type_display_key = vc
	) with protect
	
 	call GetNoteTypes(noteTypesOutRec) 
 	
 	set record_size = size(noteTypesOutRec->note_types,5)
  
        for (note_count = 1 to record_size)
        	if(mod(note_count, 20) = 1)
        		set stat = alterlist(reply->note_types, note_count + 19)
      		endif
      		set reply->note_types[note_count].note_type_cd = noteTypesOutRec->note_types[note_count].note_type_cd
      		set reply->note_types[note_count].note_type_disp = noteTypesOutRec->note_types[note_count].note_type_display
    	endfor
  
    	set stat = alterlist(reply->note_types, record_size)
 	
 	set ERRCODE = ERROR(ERRMSG,0)
    	if(ERRCODE != 0)
     	  set failed = 1
       	  set fail_operation = "GetActiveNoteTypes"
       	  call replyFailure("retrieveNoteTypes")
    	endif
 		
 	call log_message(build2("Exit GetActiveNoteTypes(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms","GetActiveNoteTypes found ", record_size), LOG_LEVEL_DEBUG)
end

subroutine GetSubjects(NULL)
	call log_message("In GetSubjects()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare subject_cnt = i2 with noconstant(0)
	set reply->subject_other_cd = uar_get_code_by("MEANING",4112000,"OTHER")
	
	select into "nl:"
	from
		code_value c
	where c.code_set = 4112000 and
			c.code_value > 0 and
			c.active_ind = 1
	order by c.display
	head report
		subject_cnt = 0
	detail
		subject_cnt = subject_cnt + 1
		if(mod(subject_cnt,20) = 1)
			stat = alterlist(reply->subjects, subject_cnt + 19)
		endif
		reply->subjects[subject_cnt].subject_cd = c.code_value
		reply->subjects[subject_cnt].subject_disp = c.display
		
	foot report
		stat = alterlist(reply->subjects, subject_cnt)
	with nocounter
	
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "GetSubjects"
       call replyFailure("SELECT")
    endif
	
	call log_message(build2("Exit GetSubjects(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms","GetSubjects found ", subject_cnt), LOG_LEVEL_DEBUG)
end

subroutine GetAddressTypes(NULL)
	call log_message("In GetAddressTypes()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare address_type_cnt = i2 with noconstant(0)
	declare ADDRESS_TYPE_SIZE = i4 with constant(5)
	declare ADDRESS_TYPE_CODESET = i4 with constant(212)
	
	set stat = alterlist(reply->address_types, ADDRESS_TYPE_SIZE)
	
	set address_type_cnt = address_type_cnt + 1
	set reply->address_types[address_type_cnt].address_type_cd = uar_get_code_by("MEANING",ADDRESS_TYPE_CODESET,"ALTERNATE")
	set reply->address_types[address_type_cnt].address_type_disp = 
			uar_get_code_display(reply->address_types[address_type_cnt].address_type_cd)
	
	set address_type_cnt = address_type_cnt + 1
	set reply->address_types[address_type_cnt].address_type_cd = uar_get_code_by("MEANING",ADDRESS_TYPE_CODESET,"BUSINESS")
	set reply->address_types[address_type_cnt].address_type_disp = 
			uar_get_code_display(reply->address_types[address_type_cnt].address_type_cd)
	
	set address_type_cnt = address_type_cnt + 1
	set reply->address_types[address_type_cnt].address_type_cd = uar_get_code_by("MEANING",ADDRESS_TYPE_CODESET,"EPRESCRIBING")
	set reply->address_types[address_type_cnt].address_type_disp = 
			uar_get_code_display(reply->address_types[address_type_cnt].address_type_cd)
	
	set stat = alterlist(reply->address_types, address_type_cnt)
	call log_message(build2("Exit GetAddressTypes(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms","GetAddressTypes found ", address_type_cnt), LOG_LEVEL_DEBUG)
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

end
go
