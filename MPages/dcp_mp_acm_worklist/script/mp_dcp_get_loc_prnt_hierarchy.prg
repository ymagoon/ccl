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

        Source file name:                   MP_DCP_GET_LOC_PRNT_HIERARCHY.PRG
        Object name:                        MP_DCP_GET_LOC_PRNT_HIERARCHY

        Product:
        Product Team:

        Program purpose:                    Finds parent hierarchy of a specified location.

        Tables read:                        None

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

drop program mp_dcp_get_loc_prnt_hierarchy:dba go
create program mp_dcp_get_loc_prnt_hierarchy:dba

prompt 
	"Output to File/Printer/MINE" = "MINE",
	"JSON_ARGS:" = ""
with OUTDEV, JSON_ARGS

%i cclsource:mp_dcp_blob_in_params.inc
set stat = cnvtjsontorec(ExtractParamsFromRequest(request, $JSON_ARGS))

/*
record loc_request
(
	1 locations[*]
		2 location_cd = f8		 (required)
	1 skip_org_security_ind = i2 (required)
	1 skip_fill_reply_ind   = i2 (optional)
)
*/

free record loc_reply
record loc_reply
(
	1 facilities[*]
		2 facility_cd     = f8
		2 facility_disp   = vc
		2 facility_desc   = vc
		2 buildings[*]
			3 building_cd   = f8
			3 building_disp = vc
			3 building_desc = vc
			3 units[*]
				4 unit_cd     = f8
				4 unit_disp   = vc
				4 unit_desc   = vc
				4 rooms[*]
					5 room_cd   = f8
					5 room_disp = vc
					5 room_desc = vc
%i cclsource:status_block.inc
)

%i cclsource:mp_script_logging.inc

set modify maxvarlen 52428800

call log_message("In mp_dcp_get_loc_prnt_hierarchy", LOG_LEVEL_DEBUG)

/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
declare CnvtCCLRec(NULL)      = NULL
declare FillReply(NULL)       = NULL
declare ReplyFailure(NULL)    = NULL
declare ValidateRequest(NULL) = NULL

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
set loc_reply->status_data->status = "Z"

call ValidateRequest(NULL)

if(checkprg("DCP_GET_LOC_PARENT_HIERARCHY") <= 0)
	set failed_ind = 1
	set fail_operation = "ValidateRequest"
	call ReplyFailure("dependent script not found")
endif

execute dcp_get_loc_parent_hierarchy with replace ("REQUEST","LOC_REQUEST"), replace ("REPLY","LOC_REPLY")

if(validate(loc_request->skip_fill_reply_ind) = 1)
	if(loc_request->skip_fill_reply_ind = 0)
		call FillReply(NULL)
	endif
endif

#exit_script
if(loc_reply->status_data->status = "Z")
	set loc_reply->status_data->status = "S"
endif
if(failed = 0)
	call CnvtCCLRec(NULL)
endif
call log_message("Exit mp_dcp_get_loc_prnt_hierarchy", LOG_LEVEL_DEBUG)

/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
subroutine CnvtCCLRec(NULL)
	call log_message("In CnvtCCLRec()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private

	declare strJSON = vc with noconstant(""), private

	set strJSON = cnvtrectojson(loc_reply)
	set _Memory_Reply_String = strJSON
	call log_message(build("_Memory_Reply_String: ", _Memory_Reply_String), LOG_LEVEL_DEBUG)

	call log_message(build2("Exit CnvtCCLRec(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

subroutine FillReply(NULL)
	call log_message("In FillReply()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private

	declare facilityCnt = i4 with noconstant(0), protect
	declare facilityIdx = i4 with noconstant(0), protect
	declare buildingCnt = i4 with noconstant(0), protect
	declare buildingIdx = i4 with noconstant(0), protect
	declare unitCnt     = i4 with noconstant(0), protect
	declare unitIdx     = i4 with noconstant(0), protect
	declare roomCnt     = i4 with noconstant(0), protect
	declare roomIdx     = i4 with noconstant(0), protect

	set facilityCnt = size(loc_reply->facilities, 5)
	for(facilityIdx=1 to facilityCnt)
		set loc_reply->facilities[facilityIdx]->facility_desc =
			uar_get_code_description(loc_reply->facilities[facilityIdx]->facility_cd)
		set loc_reply->facilities[facilityIdx]->facility_disp =
			uar_get_code_display(loc_reply->facilities[facilityIdx]->facility_cd)
		set buildingCnt = size(loc_reply->facilities[facilityIdx]->buildings, 5)
		for(buildingIdx=1 to buildingCnt)
			set loc_reply->facilities[facilityIdx]->buildings[buildingIdx]->building_desc =
				uar_get_code_description(loc_reply->facilities[facilityIdx]->buildings[buildingIdx]->building_cd)
			set loc_reply->facilities[facilityIdx]->buildings[buildingIdx]->building_disp =
				uar_get_code_display(loc_reply->facilities[facilityIdx]->buildings[buildingIdx]->building_cd)
			set unitCnt = size(loc_reply->facilities[facilityIdx]->buildings[buildingIdx]->units, 5)
			for(unitIdx=1 to unitCnt)
				set loc_reply->facilities[facilityIdx]->buildings[buildingIdx]->units[unitIdx]->unit_desc =
					uar_get_code_description(loc_reply->facilities[facilityIdx]->buildings[buildingIdx]->units[unitIdx]->unit_cd)
				set loc_reply->facilities[facilityIdx]->buildings[buildingIdx]->units[unitIdx]->unit_disp =
					uar_get_code_display(loc_reply->facilities[facilityIdx]->buildings[buildingIdx]->units[unitIdx]->unit_cd)
				set roomCnt = size(loc_reply->facilities[facilityIdx]->buildings[buildingIdx]->units[unitIdx]->rooms, 5)
				for(roomIdx=1 to roomCnt)
					set loc_reply->facilities[facilityIdx]->buildings[buildingIdx]->units[unitIdx]->rooms[roomIdx]->room_desc =
						uar_get_code_description(loc_reply->facilities[facilityIdx]->buildings[buildingIdx]->units[unitIdx]->rooms
							[roomIdx]->room_cd)
					set loc_reply->facilities[facilityIdx]->buildings[buildingIdx]->units[unitIdx]->rooms[roomIdx]->room_disp =
						uar_get_code_display(loc_reply->facilities[facilityIdx]->buildings[buildingIdx]->units[unitIdx]->rooms
							[roomIdx]->room_cd)
				endfor
			endfor
		endfor
	endfor

	call log_message(build2("Exit FillReply(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

subroutine ReplyFailure(targetObjName)
	call log_message("In replyFailure()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private

	call log_message(build("Error: ", targetObjName, " - ", trim(ERRMSG)), LOG_LEVEL_ERROR)

	rollback
	set loc_reply->status_data.status = "F"
	set loc_reply->status_data.subeventstatus[1].OperationName = fail_operation
	set loc_reply->status_data.subeventstatus[1].OperationStatus = "F"
	set loc_reply->status_data.subeventstatus[1].TargetObjectName = targetObjName
	set loc_reply->status_data.subeventstatus[1].TargetObjectValue = ERRMSG

	call CnvtCCLRec(NULL)

	call log_message(build2("Exit replyFailure(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)

	go to exit_script
end

subroutine ValidateRequest(NULL)
	call log_message("In ValidateRequest()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private

	declare i = i4 with noconstant(0), protect

	if(validate(loc_request->locations) = 0)
		set failed_ind = 1
		set fail_operation = "ValidateRequest"
		call ReplyFailure("invalid locations")
	else
		for(i=1 to size(loc_request->locations, 5))
			if(validate(loc_request->locations[i].location_cd, 0) = 0)
				set failed_ind = 1
				set fail_operation = "ValidateRequest"
				call ReplyFailure("invalid location_cd")
			endif
		endfor
	endif

	if(validate(loc_request->skip_org_security_ind) = 0)
		set failed_ind = 1
		set fail_operation = "ValidateRequest"
		call ReplyFailure("invalid skip_org_security_ind")
	endif

	if(validate(loc_request->skip_fill_reply_ind) = 1)
		if(loc_request->skip_fill_reply_ind < 0 or loc_request->skip_fill_reply_ind > 1)
			set failed_ind = 1
			set fail_operation = "ValidateRequest"
			call ReplyFailure("invalid skip_fill_reply_ind")
		endif
	endif

	call log_message(build2("Exit ValidateRequest(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

end
go

