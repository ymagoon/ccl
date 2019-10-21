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

        Source file name:                   MP_DCP_GET_CHILD_LOCATIONS.PRG
        Object name:                        MP_DCP_GET_CHILD_LOCATIONS

        Product:
        Product Team:

        Program purpose:                    Finds children of a specified location code.

        Tables read:                        LOCATION_GROUP
        									LOCATION
                                            CODE_VALUE

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
     0000   09/02/15    450905  JS022206                    Initial release
*******************************  END OF ALL MODCONTROL BLOCKS  **************************/

drop program mp_dcp_get_child_locations:dba go
create program mp_dcp_get_child_locations:dba

prompt 
	"Output to File/Printer/MINE" = "MINE",
	"JSON_ARGS:" = ""
with OUTDEV, JSON_ARGS

%i cclsource:mp_dcp_blob_in_params.inc
set stat = cnvtjsontorec(ExtractParamsFromRequest(request, $JSON_ARGS))

/*
record loc_request
(
	1 location_cd = f8
)
*/

free record reply
record reply
(
	1 locations[*]
		2 location_cd   = f8
		2 location_disp = vc
%i cclsource:status_block.inc
)

%i cclsource:mp_script_logging.inc

set modify maxvarlen 52428800

call log_message("In mp_dcp_get_child_locations", LOG_LEVEL_DEBUG)

/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
declare CnvtCCLRec(NULL)        = NULL
declare GetChildLocations(NULL) = NULL
declare ReplyFailure(NULL)      = NULL

/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare error_string   = vc 
declare fail_operation = vc
declare failed         = i2 with NOCONSTANT(0)
declare ERRMSG         = C132

/**************************************************************
; DVDev Start Coding
**************************************************************/
set ERRMSG  = FILLSTRING(132," ")
set ERRCODE = error(ERRMSG,1)
set reply->status_data->status = "Z"

call GetChildLocations(NULL)

#exit_script
if(reply->status_data->status = "Z")
	set reply->status_data->status = "S"
endif
if(failed = 0)
	call CnvtCCLRec(NULL)
endif

/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
subroutine CnvtCCLRec(NULL)
	call log_message("In CnvtCCLRec()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private

	declare strJSON = vc with noconstant(""), private

	set strJSON = cnvtrectojson(reply)
	set _Memory_Reply_String = strJSON
	call log_message(build("_Memory_Reply_String: ", _Memory_Reply_String), LOG_LEVEL_DEBUG)

	call log_message(build2("Exit CnvtCCLRec(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

subroutine GetChildLocations(NULL)
	call log_message("In GetChildLocations()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private

	declare BUILDING_TYPE_CD = f8 with constant(uar_get_code_by("MEANING", 222, "BUILDING")),  protect
	declare AMBULATORY_TYPE_CD = f8 with constant(uar_get_code_by("MEANING", 222, "AMBULATORY")),  protect
	declare SURGERY_TYPE_CD = f8 with constant(uar_get_code_by("MEANING", 222, "ANCILSURG")),  protect
	declare UNIT_TYPE_CD     = f8 with constant(uar_get_code_by("MEANING", 222, "NURSEUNIT")), protect
	declare DELETED_TYPE_CD  = f8 with constant(uar_get_code_by("MEANING", 48,  "DELETED")),   protect

	declare loc_cnt = i4 with noconstant(0), protect

	select distinct into "nl:"
		 l.location_cd
		,cv.display
	from location_group lg
		,code_value     cv
		,location       l
	plan lg
		where lg.parent_loc_cd = loc_request->location_cd
			and lg.root_loc_cd = 0 ; Only qualify patient care locations.
			and lg.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and lg.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
			and lg.active_ind = 1
	join cv
		where cv.code_value = lg.child_loc_cd
			and cv.begin_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and cv.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
			and cv.active_type_cd != DELETED_TYPE_CD
			and cv.active_ind = 1
	join l
		where l.location_cd = cv.code_value
			and l.location_type_cd in (
					AMBULATORY_TYPE_CD,
					BUILDING_TYPE_CD,
					SURGERY_TYPE_CD,
					UNIT_TYPE_CD
				)
			and l.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and l.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
			and l.active_ind = 1
	order by
		 lg.sequence    ASC
		,cv.display_key ASC
		,l.location_cd  ASC
	detail
		loc_cnt = loc_cnt + 1
		if(mod(loc_cnt,100) = 1)
			stat = alterlist(reply->locations[loc_cnt], loc_cnt + 99)
		endif
		reply->locations[loc_cnt]->location_cd   = l.location_cd
		reply->locations[loc_cnt]->location_disp = cv.display
	foot report
		stat = alterlist(reply->locations,loc_cnt)
	with nocounter

	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
		set failed = 1
		set fail_operation = "GetChildLocations"
		call replyFailure("SELECT")
	endif

	call log_message(build2("Exit GetChildLocations(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

subroutine ReplyFailure(targetObjName)
	call log_message("In replyFailure()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private

	call log_message(build("Error: ", targetObjName, " - ", trim(ERRMSG)), LOG_LEVEL_ERROR)

	rollback
	set reply->status_data.status = "F"
	set reply->status_data.subeventstatus[1].OperationName = fail_operation
	set reply->status_data.subeventstatus[1].OperationStatus = "F"
	set reply->status_data.subeventstatus[1].TargetObjectName = targetObjName
	set reply->status_data.subeventstatus[1].TargetObjectValue = ERRMSG

	call CnvtCCLRec(NULL)

	call log_message(build2("Exit replyFailure(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)

	go to exit_script
end

end
go

