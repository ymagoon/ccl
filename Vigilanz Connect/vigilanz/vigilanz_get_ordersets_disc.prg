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
	Source file name: snsro_get_ordersets_disc.prg
	Object name: vigilanz_get_ordersets_disc
	Program purpose: returns order Sets and orders within set
	Executing from:
	Special Notes:
******************************************************************************************
                  MODIFICATION CONTROL LOG
******************************************************************************************
Mod 	Date     Engineer    	Comment
------------------------------------------------------------------------------------------
000	    11/1/18 STV			Initial write
001     09/09/19 RJC        Renamed file and object
******************************************************************************************/
;drop program snsro_get_ordersets_discovery go
drop program vigilanz_get_ordersets_disc go
create program vigilanz_get_ordersets_disc
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "User Id" = ""                   ;required
	, "Search Order Code" = ""         ;optional
	, "Search String" = ""             ;optional
	, "Debug Flag" = ""                ;optional
 
with OUTDEV, USERID, order_cd, ordset_plan_name, DEBUG_FLAG
 
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
free record orderset_reply_out
record orderset_reply_out(
 1 order_set_cnt = i4
 1 order_sets[*]
 	2 id = f8
 	2 name = vc
 	2 orderable_codes[*]
 		3 active = i2
 		3 orderable_code_desc = vc
 		3 orderable_code_id = f8
 		3 orderable_code_identities[*]
 			4 value		= vc
			4 type
				5 id	= f8
				5 name 	= vc
 		3 orderable_type
 			4 id = f8
 			4 name = vc
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
 
;;Helper structure that needs to be global
free record pathway
record pathway(
	1 qual_cnt = i4
	1 qual[*]
		2 pathway_catalog_id = f8
		2 description = vc
)
 
set orderset_reply_out->status_data->status = "F"
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Inputs
declare sUserName = vc with protect, noconstant("")
declare dOrderCode = f8 with protect,noconstant(0.0)
declare sOrdPlanNm = vc with protect,noconstant("")
declare iDebugFlag = i2 with protect, noconstant(0)
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set sUserName = trim($userId,3)
set iDebugFlag = cnvtint($debug_flag)
set dOrderCode = cnvtreal(trim($order_cd,3))
 
;Sets and checks if the searchstring is populated and valid
set searchStrSize = size(trim($ordset_plan_name,3))
if(searchStrSize > 0)
	if(searchStrSize < 3)
		call ErrorHandler2("VALIDATE", "F", "ORDERS DISCOVERY", "The search string must be at least 3 characters.",
			"9999","The search string must be at least 3 characters.", orders_discovery_reply_out)	;001
		go to EXIT_SCRIPT
	else
		set sOrdPlanNm = build("*",cnvtupper(trim($ordset_plan_name,3)),"*")
	endif
endif
 
if(iDebugFlag > 0)
 	call echo(build("sUserName->",sUserName))
 	call echo(build("dOrderCode->",cnvtstring(dOrderCode)))
 	call echo(build("sOrdPlanNm->",sOrdPlanNm))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetOrderSetsOpen(null)  		= null with Protect
declare GetOrderSetsByOrderCd(null)		= null with protect
declare GetOrderSetBySetNm(null)		= null with protect
declare GetOrderSetByBoth(null)         = null with protect
declare OrderCodeHelper(null)           = null with protect
/***********************************************************************
;MAIN
***********************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, orderset_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "ORDERSET DISCOVERY", "Invalid User for Audit.",
	"2016",build2("Invalid UserId: ",sUserName), orderset_reply_out)	;001
	go to EXIT_SCRIPT
endif
 
;Validate Orderable Code
if(dOrderCode > 0)
	set iRet = GetCodeSet(dOrderCode)
	if(iRet != 200)
		call ErrorHandler2("VALIDATE", "F", "ORDERSET DISCOVERY", "Orderable Code Id is not valid.",
		"2056","Orderable Code Id is not valid.", orderset_reply_out)	;001
		go to EXIT_SCRIPT
	endif
endif
 
if(dOrderCode > 0)
	call OrderCodeHelper(null)
		if(size(trim(sOrdPlanNm,3)) > 0)
			call GetOrderSetByBoth(null)
		else
			call GetOrderSetsByOrderCd(null)
		endif
elseif(size(trim(sOrdPlanNm,3)) > 0)
	call GetOrderSetBySetNm(null)
else
	call GetOrderSetsOpen(null)
endif
 
 
;;set Final Audit status
if(orderset_reply_out->order_set_cnt < 1)
	call ErrorHandler2("VALIDATE", "Z", "ORDERSET DISCOVERY", "No Results Found",
						"9999","Please check paramters.", orderset_reply_out)
	go to EXIT_SCRIPT
else
	call ErrorHandler2("SUCCESS", "S", "ORDERSET DISCOVERY", "Order Sets Discovery completed successfully.",
						"0000","Order Sets Discovery completed successfully.", orderset_reply_out)
endif
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(orderset_reply_out)
 
if(idebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_ordersets_discovery.json")
	call echo(build2("_file : ", _file))
	call echojson(orderset_reply_out, _file, 0)
    call echorecord(orderset_reply_out)
	call echo(JSONout)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
/*************************************************************************
; SUBROUTINES
*************************************************************************/
 
/*************************************************************************
;  Name: GetOrderSetsOpen(null)
;  Description: Open query with no orderable code nor search string
**************************************************************************/
 
subroutine GetOrderSetsOpen(null)
if(iDebugFlag > 0)
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetOrderSetsOpen Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
endif
 
select into "nl:"
from pathway_catalog pc
	,pathway_comp p
	,order_catalog_synonym ocs
 
plan pc
	where pc.active_ind > 0
		and pc.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and pc.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
join p
	where p.pathway_catalog_id = pc.pathway_catalog_id
		and p.parent_entity_name = "ORDER_CATALOG_SYNONYM"
		and p.active_ind = 1
join ocs
	where ocs.synonym_id = p.parent_entity_id
 
order by pc.pathway_catalog_id, ocs.catalog_cd, ocs.synonym_id
head report
	x = 0
	head pc.pathway_catalog_id
		y = 0
		x = x + 1
		stat = alterlist(orderset_reply_out->order_sets,x)
		orderset_reply_out->order_sets[x].id = pc.pathway_catalog_id
		orderset_reply_out->order_sets[x].name = trim(pc.description)
 
		head ocs.catalog_cd
			z = 0
			y = y + 1
			stat = alterlist(orderset_reply_out->order_sets[x].orderable_codes,y)
			orderset_reply_out->order_sets[x].orderable_codes[y].active = ocs.active_ind
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_id = ocs.catalog_cd
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_desc = trim(uar_get_code_display(ocs.catalog_cd))
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_type->id = ocs.activity_type_cd
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_type->name = trim(uar_get_code_display(ocs.activity_type_cd))
 
		head ocs.synonym_id
		    z = z + 1
			stat = alterlist(orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_identities,z)
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_identities[z].type.id = ocs.synonym_id
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_identities[z].type.name =  trim(ocs.mnemonic)
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_identities[z].value = trim(cnvtstring(ocs.synonym_id))
 
foot report
	orderset_reply_out->order_set_cnt = x
with nocounter
 
if(iDebugFlag > 0)
	call echo(concat("GetOrderSetsOpen: ",
	trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	" seconds"))
endif
end; end GetOrderSetsOpen
 
 
 
/*************************************************************************
;  Name: GetOrderSetsByOrderCd(null)
;  Description: query with orderable code
**************************************************************************/
;This needs to be looked at too since it will only return orders specific order
subroutine GetOrderSetsByOrderCd(null)
 
if(iDebugFlag > 0)
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetOrderSetsByOrderCd Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
endif
 
 
select into "nl:"
from (dummyt d with seq = pathway->qual_cnt)
	,pathway_comp p
	,order_catalog_synonym ocs
 
 
plan d
	where pathway->qual[d.seq].pathway_catalog_id > 0
join p
	where p.pathway_catalog_id = pathway->qual[d.seq].pathway_catalog_id
		and p.parent_entity_name = "ORDER_CATALOG_SYNONYM"
		and p.active_ind = 1
join ocs
	where ocs.synonym_id = p.parent_entity_id
 
order by d.seq, ocs.catalog_cd, ocs.synonym_id
head report
	x = 0
	head d.seq
		y = 0
		x = x + 1
		stat = alterlist(orderset_reply_out->order_sets,x)
		orderset_reply_out->order_sets[x].id = pathway->qual[d.seq].pathway_catalog_id
		orderset_reply_out->order_sets[x].name = trim(pathway->qual[d.seq].description)
 
		head ocs.catalog_cd
			z = 0
			y = y + 1
			stat = alterlist(orderset_reply_out->order_sets[x].orderable_codes,y)
			orderset_reply_out->order_sets[x].orderable_codes[y].active = ocs.active_ind
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_id = ocs.catalog_cd
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_desc = trim(uar_get_code_display(ocs.catalog_cd))
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_type->id = ocs.activity_type_cd
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_type->name = trim(uar_get_code_display(ocs.activity_type_cd))
 
		head ocs.synonym_id
		    z = z + 1
			stat = alterlist(orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_identities,z)
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_identities[z].type.id = ocs.synonym_id
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_identities[z].type.name =  trim(ocs.mnemonic)
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_identities[z].value = trim(cnvtstring(ocs.synonym_id))
 
foot report
	orderset_reply_out->order_set_cnt = x
with nocounter
 
if(iDebugFlag > 0)
	call echo(concat("GetOrderSetsByOrderCd: ",
	trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	" seconds"))
endif
 
 
end;sub GetOrderSetsByOrderCd(null)
 
/*************************************************************************
;  Name: GetOrderSetBySetNm(null)
;  Description: query with search string(plan name)
**************************************************************************/
 
subroutine GetOrderSetBySetNm(null)
if(iDebugFlag > 0)
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetOrderSetBySetNm Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
endif
 
select into "nl:"
from pathway_catalog pc
	,pathway_comp p
	,order_catalog_synonym ocs
 
plan pc
	where pc.description_key = patstring(sOrdPlanNm)
		and pc.active_ind > 0
		and pc.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and pc.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
join p
	where p.pathway_catalog_id = pc.pathway_catalog_id
		and p.parent_entity_name = "ORDER_CATALOG_SYNONYM"
		and p.active_ind = 1
join ocs
	where ocs.synonym_id = p.parent_entity_id
 
order by pc.pathway_catalog_id, ocs.catalog_cd, ocs.synonym_id
 
head report
	x = 0
	head pc.pathway_catalog_id
		y = 0
		x = x + 1
		stat = alterlist(orderset_reply_out->order_sets,x)
		orderset_reply_out->order_sets[x].id = pc.pathway_catalog_id
		orderset_reply_out->order_sets[x].name = trim(pc.description)
 
		head ocs.catalog_cd
			z = 0
			y = y + 1
			stat = alterlist(orderset_reply_out->order_sets[x].orderable_codes,y)
			orderset_reply_out->order_sets[x].orderable_codes[y].active = ocs.active_ind
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_id = ocs.catalog_cd
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_desc = trim(uar_get_code_display(ocs.catalog_cd))
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_type->id = ocs.activity_type_cd
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_type->name = trim(uar_get_code_display(ocs.activity_type_cd))
 
		head ocs.synonym_id
		    z = z + 1
			stat = alterlist(orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_identities,z)
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_identities[z].type.id = ocs.synonym_id
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_identities[z].type.name =  trim(ocs.mnemonic)
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_identities[z].value = trim(cnvtstring(ocs.synonym_id))
foot report
	orderset_reply_out->order_set_cnt = x
with nocounter
 
if(iDebugFlag > 0)
	call echo(concat("GetOrderSetBySetNm: ",
	trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	" seconds"))
endif
end; end GetOrderSetBySetNm
 
/*************************************************************************
;  Name: GetOrderSetByBoth(null)(null)
;  Description: query with search string(plan name) and orderable code
**************************************************************************/
;;;;;This needs to be restructured becasue right now it will only return the speicific order
subroutine GetOrderSetByBoth(null)
if(iDebugFlag > 0)
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetOrderSetByBoth Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
endif
 
set num = 0
 
select into "nl:"
from pathway_catalog pc
	,pathway_comp p
	,order_catalog_synonym ocs
plan pc
	where expand(num,1,pathway->qual_cnt,pc.pathway_catalog_id,pathway->qual[num].pathway_catalog_id)
		and pc.description_key = patstring(sOrdPlanNm)
		and pc.active_ind > 0
		and pc.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and pc.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
join p
	where p.pathway_catalog_id = pc.pathway_catalog_id
		and p.parent_entity_name = "ORDER_CATALOG_SYNONYM"
		and p.active_ind = 1
join ocs
	where ocs.synonym_id = p.parent_entity_id
 
order by pc.pathway_catalog_id, ocs.catalog_cd, ocs.synonym_id
head report
	x = 0
	head pc.pathway_catalog_id
		y = 0
		x = x + 1
		stat = alterlist(orderset_reply_out->order_sets,x)
		orderset_reply_out->order_sets[x].id = pc.pathway_catalog_id
		orderset_reply_out->order_sets[x].name = trim(pc.description)
 
		head ocs.catalog_cd
			z = 0
			y = y + 1
			stat = alterlist(orderset_reply_out->order_sets[x].orderable_codes,y)
			orderset_reply_out->order_sets[x].orderable_codes[y].active = ocs.active_ind
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_id = ocs.catalog_cd
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_desc = trim(uar_get_code_display(ocs.catalog_cd))
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_type->id = ocs.activity_type_cd
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_type->name = trim(uar_get_code_display(ocs.activity_type_cd))
 
		head ocs.synonym_id
		    z = z + 1
			stat = alterlist(orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_identities,z)
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_identities[z].type.id = ocs.synonym_id
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_identities[z].type.name =  trim(ocs.mnemonic)
			orderset_reply_out->order_sets[x].orderable_codes[y].orderable_code_identities[z].value = trim(cnvtstring(ocs.synonym_id))
 
foot report
	orderset_reply_out->order_set_cnt = x
with nocounter
 
if(iDebugFlag > 0)
	call echo(concat("GetOrderSetByBoth: ",
	trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	" seconds"))
endif
end; end GetOrderSetBySetNm
 
/*************************************************************************
;  Name: OrderCodeHelper(null)
;  Description: Helper to return order sets with the order code in it
**************************************************************************/
subroutine OrderCodeHelper(null)
 
if(iDebugFlag > 0)
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("OrderCodeHelper Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
endif
 
select into "nl:"
from pathway_catalog pc
	,pathway_comp p
	,order_catalog_synonym ocs
 
plan ocs
	where ocs.catalog_cd = dOrderCode
join p
	where p.parent_entity_id = ocs.synonym_id
		and p.parent_entity_name = "ORDER_CATALOG_SYNONYM"
		and p.active_ind = 1
join pc
	where pc.pathway_catalog_id = p.pathway_catalog_id
		and pc.active_ind > 0
		and pc.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and pc.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
order by pc.pathway_catalog_id,ocs.catalog_cd, ocs.synonym_id
head report
	x = 0
	head pc.pathway_catalog_id
		x = x + 1
		stat = alterlist(pathway->qual,x)
		pathway->qual[x].pathway_catalog_id = pc.pathway_catalog_id
		pathway->qual[x].description = trim(pc.description)
foot report
	pathway->qual_cnt = x
with nocounter
 
if(iDebugFlag > 0)
	call echo(concat("GetOrderSetByBoth: ",
	trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	" seconds"))
call echorecord(pathway)
endif
end;OrderCodeHelper
 
 
end
go
 
 
