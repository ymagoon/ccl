/*****************************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

******************************************************************************************
	Source file name: snsro_get_orderdetails.prg
	Object name: vigilanz_get_orderdetails
	Program purpose: returns order details from an order_format field
	Executing from: Emmissary getorderdetail call
	Special Notes:
******************************************************************************************
                  MODIFICATION CONTROL LOG
******************************************************************************************
Mod 	Date     Engineer    	Comment
------------------------------------------------------------------------------------------
000	    08/16/18 STV			Initial write
001		09/26/18 RJC			Minor changes to handle 0 flags. Validation of existence of OE format id
******************************************************************************************/
drop program vigilanz_get_orderdetails go
create program vigilanz_get_orderdetails
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "User Id" = ""			;Required
	, "OrderFormatId" = ""		;Required
	, "Action" = ""				;Required - default to 1
	, "Debug Flag" = ""
 
with OUTDEV, userId, orderFormat_id, action, debug_flag
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/*************************************************************************
;DECLARE RECORDS
**************************************************************************/
free record orderdetail_reply_out
record orderdetail_reply_out(
 1 order_detail_cnt = i4
 1 order_field[*]
 	2 field_id = f8
 	2 name = vc
 	2 default_value = vc
 	2 is_multi_response = i2
 	2 required_indicator = i2
 	2 required_flag
 		3 id = f8
 		3 name = vc
 	2 type_id = f8
 	2 type = vc
 	2 visible_flag
 		3 id = f8
 		3 name = vc
 	2 value[*]
 		3 id = f8
 		3 name = vc
 1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
1 audit
		2 user_id							= f8
		2 user_firstname					= vc
		2 user_lastname						= vc
		2 patient_id						= f8
		2 patient_firstname					= vc
		2 patient_lastname					= vc
 	    2 service_version					= vc
 	    2 query_execute_time				= vc
	    2 query_execute_units				= vc
)
 
set orderdetail_reply_out->status_data->status = "F"
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Inputs
declare sUserName = vc with protect, noconstant("")
declare dOrderFormatId = f8 with protect, noconstant(0.00)
declare iAction = i4 with protect, noconstant(0)
declare iDebugFlag = i2 with protect, noconstant(0)

;Other
declare c_action_type_cd = f8 with protect, noconstant(0.0)
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set sUserName = trim($userId,3)
set dOrderFormatId = cnvtreal(trim($orderFormat_id,3))
set iAction = cnvtint($action)
set iDebugFlag = cnvtint($debug_flag)
 
; Getting the action_type_cd from enumerated paramater
case(iAction)
	of 1: set c_action_type_cd = uar_get_code_by("MEANING",6003,"ORDER");new order
	of 2: set c_action_type_cd = uar_get_code_by("MEANING",6003,"CANCEL");cancel
	of 3: set c_action_type_cd = uar_get_code_by("MEANING",6003,"SUSPEND");suspend
	of 4: set c_action_type_cd = uar_get_code_by("MEANING",6003,"DELETE");Void
	else
		set c_action_type_cd = uar_get_code_by("MEANING",6003,"ORDER")
endcase
 
if(iDebugFlag > 0)
 	call echo(build("sUserName->",sUserName))
	call echo(build("dOrderFormatId->",cnvtstring(dOrderFormatId)))
	call echo(build("iAction->",cnvtstring(iAction)))
	call echo(build("c_action_type_cd->",cnvtstring(c_action_type_cd)," display->",trim(uar_get_code_display(c_action_type_cd))))
endif
 
/***********************************************************************
;MAIN
***********************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, orderdetail_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "ORDERDETAIL DISCOVERY", "Invalid User for Audit.",
	"2016",build2("Invalid UserId: ",sUserName), orderdetail_reply_out)	;001
	go to EXIT_SCRIPT
endif

; Validate OE Format ID exists
if(dOrderFormatId = 0)
	call ErrorHandler2(c_error_handler, "F", "Validate", "Missing required field: OrderDetailId",
	"2055","Missing required field: OrderDetailId", orderdetail_reply_out)
	go to EXIT_SCRIPT
endif
 
;;main query
if(iDebugFlag > 0)
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("Main Query Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
endif
 
select into "nl:"
from oe_format_fields oef
     ,order_entry_fields off
     ,code_value cv
plan oef
	where oef.oe_format_id = dOrderFormatId
		and oef.action_type_cd = c_action_type_cd
		and oef.oe_field_id > 0
join off
	where off.oe_field_id = oef.oe_field_id
join cv
	where cv.code_set = outerjoin(off.codeset)
		and cv.active_ind = 1
		and cv.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and cv.begin_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
 
order by oef.accept_flag,oef.field_seq, off.oe_field_id, cv.code_value
head report
	x = 0
	head off.oe_field_id
		x = x + 1
		z = 0
		stat = alterlist(orderdetail_reply_out->order_field,x)
		orderdetail_reply_out->order_field[x].field_id = off.oe_field_id
		orderdetail_reply_out->order_field[x].name = trim(oef.label_text,3)
		orderdetail_reply_out->order_field[x].default_value = trim(oef.default_value,3)
		orderdetail_reply_out->order_field[x].type_id = off.field_type_flag
		orderdetail_reply_out->order_field[x].required_flag.id = oef.accept_flag
		orderdetail_reply_out->order_field[x].is_multi_response = off.allow_multiple_ind
		orderdetail_reply_out->order_field[x].visible_flag.id = oef.accept_flag
 
		if(oef.accept_flag = 0)
			orderdetail_reply_out->order_field[x].required_flag.name = "YES"
		else
			orderdetail_reply_out->order_field[x].required_flag.name = "NO"
		endif
 
		head cv.code_value
			if(cv.code_value > 0 and cv.code_set > 0)
				z = z + 1
				stat = alterlist(orderdetail_reply_out->order_field[x].value,z)
				orderdetail_reply_out->order_field[x].value[z].id = cv.code_value
				orderdetail_reply_out->order_field[x].value[z].name = trim(cv.display)
			endif
foot report
	orderdetail_reply_out->order_detail_cnt = x
with nocounter
if(iDebugFlag > 0)
	call echo(concat("Main Query: ",
	trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	" seconds"))
endif
 
;;getting the flags
if(orderdetail_reply_out->order_detail_cnt > 0)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Flag Query Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	from dm_flags dm1
		,dm_flags dm2
		,(dummyt d with seq = orderdetail_reply_out->order_detail_cnt)
	plan d
	join dm1
		where dm1.table_name = "ORDER_ENTRY_FIELDS"
			and dm1.column_name = "FIELD_TYPE_FLAG"
			and dm1.flag_value = orderdetail_reply_out->order_field[d.seq].type_id
	join dm2
		where dm2.table_name = "OE_FORMAT_FIELDS"
			and dm2.column_name = "ACCEPT_FLAG"
			and dm2.flag_value = orderdetail_reply_out->order_field[d.seq].visible_flag.id
	order by d.seq
 
	head d.seq
		orderdetail_reply_out->order_field[d.seq].type = trim(dm1.description)
		orderdetail_reply_out->order_field[d.seq].visible_flag.name = trim(dm2.description) 
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("Flag Query: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
endif
 
;;set Final Audit status
if(orderdetail_reply_out->order_detail_cnt < 1)
	call ErrorHandler2("VALIDATE", "Z", "ORDERDETAIL DISCOVERY", "No Results Found",
						"9999","Please check paramters.", orderdetail_reply_out)
	go to EXIT_SCRIPT
else
	call ErrorHandler2("SUCCESS", "S", "ORDERDETAIL DISCOVERY", "Order Details Discovery completed successfully.",
						"0000","Order Details Discovery completed successfully.", orderdetail_reply_out)
endif
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(orderdetail_reply_out)
 
if(idebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_orderdetails.json")
	call echo(build2("_file : ", _file))
	call echojson(orderdetail_reply_out, _file, 0)
    call echorecord(orderdetail_reply_out)
	call echo(JSONout)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
/*************************************************************************
; SUBROUTINES
*************************************************************************/
end
go
 
 
