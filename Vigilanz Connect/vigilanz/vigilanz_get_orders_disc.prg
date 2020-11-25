/*************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.
                         
**************************************************************************
          Date Written:       05/02/17
          Source file name:   vigilanz_get_orders_disc
          Object name:        vigilanz_get_orders_disc
          Request #:
          Program purpose:    Queries for all orderable types
          					  and all orderable codes
          Tables read:
          Tables updated:     NONE
          Services:			  680220  - Orders_GetSearchSuggestions
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 ***********************************************************************
                   GENERATED MODIFICATION CONTROL LOG                 
 ***********************************************************************
 Mod Date     Engineer             Comment                            
 -----------------------------------------------------------------------
  000 05/02/16 JCO		    		Initial write
  001 07/27/17 JCO					Changed %i to execute; update ErrorHandler2
  002 08/07/17 DJP					Added "S" status
  003 02/01/18 RJC					Added search functionality
  004 03/21/18 RJC					Added version code and copyright block
  005 04/18/18 RJC					Added code search functionality
  006 08/08/18 STV                  Removed primary syn filter to grab all and added oe_format_id to structure
  007 08/29/18 STV                  Rework for update to UDM order detail discovery
  008 09/24/18 RJC					Fixed issue with aliases repeating
  009 09/09/19 RJC                  Renamed file and object
************************************************************************/
;drop program snsro_get_orders_discovery go
drop program vigilanz_get_orders_disc go
create program vigilanz_get_orders_disc
 
/************************************************************************
; REQUEST
************************************************************************/
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "UserId"				= ""	;Required
		, "OrderableTypeId"		= ""	;Optional
		, "SearchString"		= ""	;Optional
		, "SearchCode"			= ""	;Optional
		, "CodeType"			= ""	;Optional - required if SearchCode field used
		, "Debug Flag"			= 0		;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, USERNAME, ORDER_TYPE, SEARCH_STRING, SEARCH_CODE, CODE_TYPE, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL - 004
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
set MODIFY MAXVARLEN 200000000
free record orders_discovery_reply_out
record orders_discovery_reply_out
(    1 types_cnt            = i4
	1 types [*]
		2 type_id		 	= f8
		2 type_desc			= vc
		2 codes_cnt         = i4
		2 codes [*]
			3 code			= f8
			3 code_desc		= vc
			3 active_ind	= i4
			3 concept_cki   = vc
			3 order_detail[*]
				4 oe_format_id = f8
				4 oe_format_name = vc
				4 action_cnt = i4
				4 action
					5 id = f8
					5 name = vc
			3 alias [*]
				4 value		= vc
				4 type
					5 id	= f8
					5 name 	= vc
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
 
;001 %i ccluserdir:snsro_status_block.inc
/*001 begin */
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc;001
/*001 end */
 
)
 
set orders_discovery_reply_out->status_data->status = "F"
 
/****************************************************************************
;INCLUDES
****************************************************************************/
;001 %i ccluserdir:snsro_common.inc
execute snsro_common	;001
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Inputs
declare sUserName					= vc with protect, noconstant("")
declare dOrderTypeId 				= f8 with protect, noconstant(0.0)
declare sSearchString				= vc with protect, noconstant("")
declare sSearchCode					= vc with protect, noconstant("")
declare dCodeType					= f8 with protect, noconstant(0.0)
declare iDebugFlag					= i2 with protect, noconstant(0)
 
;Other
declare dPrsnlId					= f8 with protect, noconstant(0.0)
 
;Constants
declare c_primary_mnemonic_cd		= f8 with protect, constant(uar_get_code_by("DISPLAY_KEY", 6011, "PRIMARY"))
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetOrderableTypes(null)							= null with protect
declare GetOrderableCodes(null) 						= null with protect
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set sUserName 			= trim($USERNAME,3)
set dPrsnlId 			= GetPrsnlIDfromUserName(sUserName)
if($ORDER_TYPE > " ")
	set dOrderTypeId   	= cnvtreal(trim($ORDER_TYPE))
endif
set sSearchString		= trim($SEARCH_STRING,3)
set sSearchCode			= trim($SEARCH_CODE,3)
if($CODE_TYPE > " ")
	set dCodeType		= cnvtreal($CODE_TYPE)
endif
set iDebugFlag			= cnvtint($DEBUG_FLAG)
 
if(iDebugFlag > 0)
	call echo(build("sUserName ->", sUserName))
	call echo(build("dPrsnlId ->", dPrsnlId))
	call echo(build("dOrderTypeId ->", dOrderTypeId))
	call echo(build("sSearchString ->", sSearchString))
	call echo(build("sSearchCode ->", sSearchCode))
	call echo(build("dCodeType ->", dCodeType))
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, orders_discovery_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "ORDERS DISCOVERY", "Invalid User for Audit.",
	"2016",build2("Invalid UserId: ",sUserName), orders_discovery_reply_out)	;001
	go to EXIT_SCRIPT
endif
 
; Validate Order Type if it exists
if(dOrderTypeId > 0)
	set iRet = GetCodeSet(dOrderTypeId)
	if(iRet != 106)
		call ErrorHandler2("VALIDATE", "F", "ORDERS DISCOVERY", "Orderable Type Id is not valid.",
		"2016","Orderable Type Id is not valid.", orders_discovery_reply_out)	;001
		go to EXIT_SCRIPT
	endif
endif
 
; Validate that only SearchString or SearchCode is set
if(sSearchString > " " and sSearchCode > " ")
	call ErrorHandler2("VALIDATE", "F", "ORDERS DISCOVERY", "Can only search by SearchString or SearchCode, but not both.",
	"9999","Can only search by SearchString or SearchCode, but not both.", orders_discovery_reply_out)
	go to EXIT_SCRIPT
else
	; Validate search string is at least 3 characters
	if(sSearchString > " ")
		set iRet = size(trim(sSearchString),1)
		if(iRet < 3)
			call ErrorHandler2("VALIDATE", "F", "ORDERS DISCOVERY", "The search string must be at least 3 characters.",
			"9999","The search string must be at least 3 characters.", orders_discovery_reply_out)	;001
			go to EXIT_SCRIPT
		else
			set sSearchString = build("*",cnvtupper(trim(sSearchString)),"*")
		endif
	endif
 
	; Validate CodeType if SearchCode exists
	if(sSearchCode > " ")
		set iRet = GetCodeSet(dCodeType)
		if(iRet != 29223)
			call ErrorHandler2("VALIDATE", "F", "ORDERS DISCOVERY", "Invalid code type.",
			"9999",build2("Invalid code type: ",trim($CODE_TYPE,3)), orders_discovery_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
endif
 
; No OrderType & No Search String - return categories
if(dOrderTypeId = 0 and sSearchString = "" and sSearchCode = "")
	call GetOrderableTypes(null)
 
; Perform search and return codes based on OrderType and SearchString
else
	call GetOrderableCodes(null)
endif
 
; Set audit to successfule
call ErrorHandler2("SUCCESS", "S", "ORDERS DISCOVERY", "Orders Discovery completed successfully.",
"0000","Orders Discovery completed successfully.", orders_discovery_reply_out)	;001
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(orders_discovery_reply_out)
 
if(idebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_orders_discovery.json")
	call echo(build2("_file : ", _file))
	call echojson(orders_discovery_reply_out, _file, 0)
    call echorecord(orders_discovery_reply_out)
	call echo(JSONout)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetOrderableTypes(null)
;  Description: Build orderable types list
**************************************************************************/
subroutine GetOrderableTypes(null)
 
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderablesType Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
		cv.code_value
	from code_value cv
	where cv.code_set = 106
	head report
		otCnt = 0
	detail
		otCnt = otCnt + 1
		stat = alterlist(orders_discovery_reply_out->types, otCnt)
 
		orders_discovery_reply_out->types[otCnt].type_id = cv.code_value
		orders_discovery_reply_out->types[otCnt].type_desc = cv.display
	with nocounter
 
end ;End Sub
 
/*************************************************************************
;  Name: GetOrderableCodes(null)
;  Description: Build orderable codes list
**************************************************************************/
subroutine GetOrderableCodes(null)
 
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderablesCodes Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select
	if(dOrderTypeId > 0 and sSearchString = "" and sSearchCode = "")
		plan oc where oc.activity_type_cd = dOrderTypeId
		join ocs
			where ocs.catalog_cd = oc.catalog_cd
				and ocs.oe_format_id > 0
		join oef
			where oef.oe_format_id = ocs.oe_format_id
		join ccm where ccm.concept_cki = outerjoin(ocs.concept_cki)
 		order by oc.activity_type_cd, oc.catalog_cd,ocs.synonym_id,oef.action_type_cd,ccm.cmt_cross_map_id
	elseif(dOrderTypeId = 0 and sSearchString > " ")
		plan ocs
			where ocs.mnemonic_key_cap = patstring(sSearchString)
				and ocs.oe_format_id > 0
		join oc
			where oc.catalog_cd = ocs.catalog_cd
		join oef
			where oef.oe_format_id = ocs.oe_format_id
		join ccm
			where ccm.concept_cki = outerjoin(ocs.concept_cki)
		order by oc.activity_type_cd, oc.catalog_cd,ocs.synonym_id,oef.action_type_cd,ccm.cmt_cross_map_id
 
	elseif(dOrderTypeId > 0 and sSearchString > " ")
		plan oc where oc.activity_type_cd = dOrderTypeId
		join ocs where ocs.catalog_cd = oc.catalog_cd
			and ocs.mnemonic_key_cap = patstring(sSearchString)
			and ocs.oe_format_id > 0
		join oef
			where oef.oe_format_id = ocs.oe_format_id
		join ccm where ccm.concept_cki = outerjoin(ocs.concept_cki)
 		order by oc.activity_type_cd, oc.catalog_cd,ocs.synonym_id,oef.action_type_cd,ccm.cmt_cross_map_id
 	elseif(dOrderTypeId = 0 and sSearchCode > " ")
 		plan ccm
			where ccm.source_identifier = sSearchCode
				and ccm.map_type_cd = dCodeType
		join ocs
			where ocs.concept_cki = ccm.concept_cki
				and ocs.oe_format_id > 0
		join oc
			where oc.catalog_cd = ocs.catalog_cd
		join oef
			where oef.oe_format_id = ocs.oe_format_id
	order by oc.activity_type_cd, oc.catalog_cd,ocs.synonym_id,oef.action_type_cd,ccm.cmt_cross_map_id
 
 	elseif(dOrderTypeId > 0 and sSearchCode > " ")
		plan oc where oc.activity_type_cd = dOrderTypeId
		join ocs
			where ocs.catalog_cd = oc.catalog_cd
				and ocs.oe_format_id > 0
		join oef
			where oef.oe_format_id = ocs.oe_format_id
		join ccm where ccm.concept_cki = ocs.concept_cki
			and ccm.source_identifier = sSearchCode
			and ccm.map_type_cd = dCodeType
 		order by oc.activity_type_cd, oc.catalog_cd,ocs.synonym_id,oef.action_type_cd,ccm.cmt_cross_map_id
	endif
 
	into "nl:"
		ocs.synonym_id
		,ocs.mnemonic
		,ccm.concept_cki
		,ccm.cmt_cross_map_id
		,oef.action_type_cd
 
	from order_catalog oc
	,order_catalog_synonym ocs
	,order_entry_format oef
    ,cmt_cross_map ccm
 
 	head report
 		x = 0
 	head oc.activity_type_cd
 		x = x + 1
 		y = 0
 		t = 0
 		stat = alterlist(orders_discovery_reply_out->types,x)
 
 		orders_discovery_reply_out->types[x].type_id = oc.activity_type_cd
 		orders_discovery_reply_out->types[x].type_desc = uar_get_code_display(oc.activity_type_cd)
	head ocs.synonym_id
 
		y = y + 1
		a = 0
 		stat = alterlist(orders_discovery_reply_out->types[x].codes, y)
		orders_discovery_reply_out->types[x].codes[y].code = ocs.synonym_id
		orders_discovery_reply_out->types[x].codes[y].code_desc = ocs.mnemonic
		orders_discovery_reply_out->types[x].codes[y].active_ind = ocs.active_ind
		orders_discovery_reply_out->types[x].codes[y].concept_cki = trim(ocs.concept_cki)
;;put ocs.concept_cki
		;if(ocs.oe_format_id > 0)
 
			;orders_discovery_reply_out->types[x].codes[y].order_detail.oe_format_id = oef.oe_format_id
			;orders_discovery_reply_out->types[x].codes[y].order_detail.oe_format_name = trim(oef.oe_format_name)
		;endif
 
	head oef.action_type_cd
		if(oef.oe_format_id > 0)
			a = a + 1
			z = 0
			stat = alterlist(orders_discovery_reply_out->types[x].codes[y].order_detail,a)
			orders_discovery_reply_out->types[x].codes[y].order_detail[a].oe_format_id = oef.oe_format_id
			orders_discovery_reply_out->types[x].codes[y].order_detail[a].oe_format_name = trim(oef.oe_format_name)
			orders_discovery_reply_out->types[x].codes[y].order_detail[a].action.name = trim(uar_get_code_display(oef.action_type_cd))
			orders_discovery_reply_out->types[x].codes[y].order_detail[a].action.id = oef.action_type_cd
		endif
	head ccm.cmt_cross_map_id
		if (ccm.concept_cki > " ")
			z = z + 1
 
			stat = alterlist(orders_discovery_reply_out->types[x].codes[y].alias,z)
			orders_discovery_reply_out->types[x].codes[y].alias[z].type.id = ccm.map_type_cd
			orders_discovery_reply_out->types[x].codes[y].alias[z].type.name = uar_get_code_display(ccm.map_type_cd)
			orders_discovery_reply_out->types[x].codes[y].alias[z].value = ccm.source_identifier
		endif
 
	with nocounter
 
 
end ;End Sub
end go
 
