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

        Source file name:                   mp_dcp_retrieve_addresses.PRG
        Object name:                        mp_dcp_retrieve_addresses

        Product:
        Product Team:

        Program purpose:                    Retrieves a list of addresses for a given prsnl id
        									and address type code

        Tables read:                        

        Tables updated:                     

        Executing from:                     MPages

        Special Notes:                      None

        Request Number:                     None

/**************************************************************************************

    ***********************************************************************
    *                   GENERATED MODIFICATION CONTROL LOG                *
    ***********************************************************************
     Mod    Date        Feature Engineer                    Comment
     ----   --------    ------- --------------------------- --------------------------
     0000   10/23/15    450905  KS026860                     Initial release
*******************************  END OF ALL MODCONTROL BLOCKS  **************************/

drop program mp_dcp_retrieve_addresses:dba go
create program mp_dcp_retrieve_addresses:dba

prompt
	"Output to File/Printer/MINE" = "MINE" ,
	"JSON_ARGS:" = ""

with OUTDEV, JSON_ARGS

/*
retrieve_addresses_request: {
	1 prsnl[*] 					(required)
		2 prsnl_id f8
	1 address_types[*] 			(required)
		2 address_type_cd f8
}*/

%i cclsource:mp_dcp_blob_in_params.inc
declare args = vc with protect, constant(ExtractParamsFromRequest(request, $JSON_ARGS))
declare stat = i4 with protect, noconstant(0)

set stat = cnvtjsontorec(args)

record reply
(
	1 prsnl[*]
		2 prsnl_id = f8
		2 addresses[*]
			3 address_id = f8
			3 address_type_cd = f8
			3 address_type_disp = vc
			3 street_addr = vc
			3 street_addr2 = vc
			3 street_addr3 = vc
			3 street_addr4 = vc
			3 city = vc
			3 state_cd = f8
			3 state_disp = vc
			3 zipcode = c25
			3 country_cd = f8
			3 country_disp = vc
%i cclsource:status_block.inc
)

record address_request(
	1 prsnl[*]
		2 prsnl_id = f8
	1 phone_types[*]
		2 phone_type_cd = f8
	1 address_types[*]
		2 address_type_cd = f8
)

record address_reply(
	1 email[*]
		2 email_id = f8
		2 email = vc
	1 addresses[*]
		2 address_id = f8
		2 address_type_cd = f8
		2 address_type_disp = vc
		2 street_addr = vc
		2 street_addr2 = vc
		2 street_addr3 = vc
		2 street_addr4 = vc
		2 city = vc
		2 state_cd = f8
		2 state_disp = vc
		2 zipcode = c25
		2 country_cd = f8
		2 country_disp = vc
	1 phone[*]
		2 phone_id = f8
		2 phone_type_cd = f8
		2 phone_type_disp = vc
		2 phone_num = vc
	1 prsnl[*]
		2 prsnl_id = f8
		2 name_full_formatted = vc
		2 position_cd = f8
		2 position_disp = vc
		2 relationships = vc
		2 email[*]
			3 email_id = f8
		2 addresses[*]
			3 address_id = f8
		2 phone[*]
			3 phone_id = f8
		2 organizations[*]
			3 org_id = f8
			3 org_name = vc
			3 email[*]
				4 email_id = f8
			3 addresses[*]
				4 address_id = f8
			3 phone[*]
				4 phone_id = f8
%i cclsource:status_block.inc
)

%i cclsource:mp_script_logging.inc
set modify maxvarlen 52428800 
call log_message("In mp_dcp_retrieve_addresses", LOG_LEVEL_DEBUG)

/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
declare FillRequest(NULL)	= NULL
declare FillReply(NULL)		= NULL
declare ReplyFailure(NULL)	= NULL
declare CnvtCCLRec(NULL)	= NULL

/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare stat = i4 with noconstant(0), protect
declare PRSNL_CNT = i4 with constant(size(retrieve_addresses_request->prsnl, 5)), protect

set reply->status_data->status = "Z"

/**************************************************************
; DVDev Start Coding
**************************************************************/
call FillRequest(NULL)
execute dcp_get_provider_address_phone with replace("REQUEST", "ADDRESS_REQUEST"), replace("REPLY", "ADDRESS_REPLY")
call FillReply(NULL)

#exit_script

if(reply->status_data->status = "Z")
	if(size(reply->prsnl, 5) > 0)
		set reply->status_data->status = "S"
	else
		set reply->status_data->status = "F"
	endif
endif

call CnvtCCLRec(null)

/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
subroutine FillRequest(NULL)
	call log_message("In FillRequest()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare ADDRESS_TYPE_CNT = i4 with constant(size(retrieve_addresses_request->address_types, 5)), private
	declare i = i4 with noconstant(0), private
	
	set stat = alterlist(address_request->prsnl, PRSNL_CNT)
	set stat = alterlist(address_request->address_types, ADDRESS_TYPE_CNT)
	
	for(i = 1 to PRSNL_CNT)
		set address_request->prsnl[i].prsnl_id = retrieve_addresses_request->prsnl[i].prsnl_id
	endfor
	
	for(i = 1 to ADDRESS_TYPE_CNT)
		set address_request->address_types[i].address_type_cd = retrieve_addresses_request->address_types[i].address_type_cd
	endfor
	
	call log_message(build2("Exit FillReply(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

subroutine FillReply(NULL)
	call log_message("In FillReply()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare ADDRESS_CNT = i2 with constant(1), private
	declare i = i4 with noconstant(0), private
	declare current_address_cnt = i4 with noconstant(0), private
	
	set stat = alterlist(reply->prsnl, PRSNL_CNT)

	for(i = 1 to PRSNL_CNT)
		set reply->prsnl[i].prsnl_id = address_reply->prsnl[i].prsnl_id
		set current_address_cnt = size(address_reply->prsnl[i].addresses, 5)
		if(current_address_cnt > 0)
			set stat = alterlist(reply->prsnl[i].addresses, ADDRESS_CNT)
			set reply->prsnl[i].addresses[1].address_id = address_reply->prsnl[i].addresses[1].address_id
			set reply->prsnl[i].addresses[1].address_type_cd = address_reply->addresses[1].address_type_cd
			set reply->prsnl[i].addresses[1].address_type_disp = address_reply->addresses[1].address_type_disp
			set reply->prsnl[i].addresses[1].street_addr = address_reply->addresses[1].street_addr
			set reply->prsnl[i].addresses[1].street_addr2 = address_reply->addresses[1].street_addr2
			set reply->prsnl[i].addresses[1].street_addr3 = address_reply->addresses[1].street_addr3
			set reply->prsnl[i].addresses[1].street_addr4 = address_reply->addresses[1].street_addr4
			set reply->prsnl[i].addresses[1].city = address_reply->addresses[1].city
			set reply->prsnl[i].addresses[1].state_cd = address_reply->addresses[1].state_cd
			if(reply->prsnl[i].addresses[1].state_cd = 0)
				set reply->prsnl[i].addresses[1].state_disp = address_reply->addresses[1].state_disp
			else
				set reply->prsnl[i].addresses[1].state_disp = uar_get_code_display(reply->prsnl[i].addresses[1].state_cd)
			endif
			set reply->prsnl[i].addresses[1].zipcode = address_reply->addresses[1].zipcode
			set reply->prsnl[i].addresses[1].country_cd = address_reply->addresses[1].country_cd
			if(reply->prsnl[i].addresses[1].country_cd = 0)
				set reply->prsnl[i].addresses[1].country_disp = address_reply->addresses[1].country_disp
			else
				set reply->prsnl[i].addresses[1].country_disp = uar_get_code_display(reply->prsnl[i].addresses[1].country_cd)
			endif
		endif
	endfor
	
	call log_message(build2("Exit FillReply(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

subroutine CnvtCCLRec(null)
	call log_message("In CnvtCCLRec()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare strJSON = vc with noconstant(""), private

	set strJSON = cnvtrectojson(reply)
	set _Memory_Reply_String = strJSON

	call log_message(build2("Exit CnvtCCLRec(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

end
go
