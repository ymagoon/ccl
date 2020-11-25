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
	Source file name: snsro_get_orderfav_disc.prg
	Object name: vigilanz_get_orderfav_disc
	Program purpose: returns order Sets and orders within set
	Executing from:
	Special Notes:
******************************************************************************************
                  MODIFICATION CONTROL LOG
******************************************************************************************
Mod 	Date     Engineer    	Comment
------------------------------------------------------------------------------------------
000	    11/01/18 STV		Initial write
002     09/09/19 RJC        Renamed file and object 
******************************************************************************************/
;drop program snsro_get_orderfav_discovery go
drop program vigilanz_get_orderfav_disc go
create program vigilanz_get_orderfav_disc
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "User Id" = ""                   ;required
	, "Debug Flag" = ""                ;optional
 
with OUTDEV, USERID, DEBUG_FLAG
 
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
free record orderfav_reply_out
record orderfav_reply_out(
 1 favorite_cnt = i4
 1 favorites[*]
 	2 fav_name = vc
	2 order_set_cnt = i4
	2 order_sets[*]
		3 active = i2
 		3 id = f8
 		3 name = vc
 		3 orderable_codes[*]
 			4 active = i2
 			4 orderable_code_desc = vc
 			4 orderable_code_id = f8
 			4 order_detail[*]
				5 oe_format_id = f8
				5 oe_format_name = vc
				5 action_cnt = i4
				5 action
					6 id = f8
					6 name = vc
 			4 alias[*]
 				5 value		= vc
				5 type
					6 id	= f8
					6 name 	= vc
 			4 orderable_type
 				5 id = f8
 				5 name = vc
 	2 orderable_cnt = i4
 	2 orderable_codes[*]
 		3 active = i2
 		3 orderable_code_desc = vc
 		3 orderable_code_id = f8
 		3 order_detail[*]
				4 oe_format_id = f8
				4 oe_format_name = vc
				4 action_cnt = i4
				4 action
					5 id = f8
					5 name = vc
 		3 alias[*]
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
 
set orderfav_reply_out->status_data->status = "F"
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Inputs
declare sUserName = vc with protect, noconstant("")
declare iDebugFlag = i2 with protect, noconstant(0)
declare dPersonId = f8 with protect, noconstant(0.0)
;other
declare iOrdsetInd = i2 with protect, noconstant(0)
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set sUserName = trim($userId,3)
set iDebugFlag = cnvtint($debug_flag)
set dPersonId = GetPrsnlIDfromUserName(sUserName)
 
if(iDebugFlag > 0)
 	call echo(build("sUserName->",sUserName))
 	call echo(build("dPersonId->",dPersonId))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetOrderFav(null)  		= null with Protect
declare GetPlanFav(null)        = null with Protect
/***********************************************************************
;MAIN
***********************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, orderfav_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "ORDERFAV DISCOVERY", "Invalid User for Audit.",
	"2016",build2("Invalid UserId: ",sUserName), orderfav_reply_out)	;001
	go to EXIT_SCRIPT
endif
 
call GetOrderFav(null)
call GetPlanFav(null)
 
 ;;set Final Audit status
if(orderfav_reply_out->favorite_cnt < 1)
	call ErrorHandler2("VALIDATE", "Z", "ORDERFAV DISCOVERY", "No Results Found",
						"9999","Please check paramters.", orderfav_reply_out)
	go to EXIT_SCRIPT
else
	call ErrorHandler2("SUCCESS", "S", "ORDERFAV DISCOVERY", "Order Fav Discovery completed successfully.",
						"0000","Order Favs Discovery completed successfully.", orderfav_reply_out)
endif
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(orderfav_reply_out)
 
if(idebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_orderfav_discovery.json")
	call echo(build2("_file : ", _file))
	call echojson(orderfav_reply_out, _file, 0)
    call echorecord(orderfav_reply_out)
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
;  Name: GetOrderFav(null)
;  Description: Gets the favorites
**************************************************************************/
 
subroutine GetOrderFav(null)
if(iDebugFlag > 0)
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetOrderFav Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
endif
 
select into "nl:"
from alt_sel_cat ac
	 ,alt_sel_list al
	 ,order_catalog_synonym ocs
	 ,order_entry_format oef
	 ,pathway_catalog pc
plan ac
	where ac.owner_id = dPersonId
join al
	where al.alt_sel_category_id = ac.alt_sel_category_id
join ocs
	where ocs.synonym_id = al.synonym_id
join oef
	where oef.oe_format_id = ocs.oe_format_id
join pc
	where pc.pathway_catalog_id = outerjoin(al.pathway_catalog_id)
order by al.alt_sel_category_id, pc.pathway_catalog_id, ocs.catalog_cd,ocs.synonym_id,oef.action_type_cd
head report
	x = 0
	head al.alt_sel_category_id
		ord_idx = 0
		pw_idx = 0
		ordsyn_idx = 0
		ord_det_idx = 0
		x = x + 1
		stat = alterlist(orderfav_reply_out->favorites,x)
		orderfav_reply_out->favorites[x].fav_name = trim(ac.long_description)
		head pc.pathway_catalog_id
			if(pc.pathway_catalog_id > 0)
				iOrdsetInd = 1
				pw_idx = pw_idx + 1
				stat = alterlist(orderfav_reply_out->favorites[x].order_sets,pw_idx)
				orderfav_reply_out->favorites[x].order_sets[pw_idx].id = pc.pathway_catalog_id
				orderfav_reply_out->favorites[x].order_sets[pw_idx].name = trim(pc.description)
				orderfav_reply_out->favorites[x].order_sets[pw_idx].active = pc.active_ind
 
			endif
 
			head ocs.catalog_cd
				ordsyn_idx = 0
				if(ocs.catalog_cd > 0)
					ord_idx = ord_idx + 1
					stat = alterlist(orderfav_reply_out->favorites[x].orderable_codes, ord_idx)
					orderfav_reply_out->favorites[x].orderable_codes[ord_idx].active = ocs.active_ind
					orderfav_reply_out->favorites[x].orderable_codes[ord_idx].orderable_code_id = ocs.catalog_cd
					orderfav_reply_out->favorites[x].orderable_codes[ord_idx].orderable_code_desc = trim(uar_get_code_display(ocs.catalog_cd))
					orderfav_reply_out->favorites[x].orderable_codes[ord_idx].orderable_type->id = ocs.activity_type_cd
					orderfav_reply_out->favorites[x].orderable_codes[ord_idx].orderable_type->name = 
																	trim(uar_get_code_display(ocs.activity_type_cd))
                 endif
 
                 head ocs.synonym_id
                 	ord_det_idx = 0
                 	if(ocs.synonym_id > 0)
                 		ordsyn_idx = ordsyn_idx + 1
						stat = alterlist(orderfav_reply_out->favorites[x].orderable_codes[ord_idx].alias,ordsyn_idx)
						orderfav_reply_out->favorites[x].orderable_codes[ord_idx].alias[ordsyn_idx].type->id = ocs.synonym_id
						orderfav_reply_out->favorites[x].orderable_codes[ord_idx].alias[ordsyn_idx].type->name = trim(ocs.mnemonic)
						orderfav_reply_out->favorites[x].orderable_codes[ord_idx].alias[ordsyn_idx].value = trim(cnvtstring(ocs.synonym_id))
					endif
 
					head oef.action_type_cd
						if(oef.oe_format_id > 0)
							ord_det_idx = ord_det_idx + 1
							stat = alterlist(orderfav_reply_out->favorites[x].orderable_codes[ord_idx].order_detail,ord_det_idx)
							orderfav_reply_out->favorites[x].orderable_codes[ord_idx].order_detail[ord_det_idx].oe_format_id = oef.oe_format_id
							orderfav_reply_out->favorites[x].orderable_codes[ord_idx].order_detail[ord_det_idx].action.id = oef.action_type_cd
							orderfav_reply_out->favorites[x].orderable_codes[ord_idx].order_detail[ord_det_idx].oe_format_name = trim(oef.oe_format_name)
							orderfav_reply_out->favorites[x].orderable_codes[ord_idx].order_detail[ord_det_idx].action.name = 
																								trim(uar_get_code_display(oef.action_type_cd))
						endif
 
       foot al.alt_sel_category_id
 
			if(ord_idx > 0)
				orderfav_reply_out->favorites[x].orderable_cnt = ord_idx
			endif
			if(pw_idx > 0)
				orderfav_reply_out->favorites[x].order_set_cnt = pw_idx
			endif
	foot report
	 orderfav_reply_out->favorite_cnt = x
with nocounter
 
;;;finding orders within the ordersets
if(iOrdsetInd > 0)
	select into "nl:"
	from (dummyt d with seq = orderfav_reply_out->favorite_cnt)
	     ,(dummyt d2 with seq = 1)
	     ,pathway_comp p
		,order_catalog_synonym ocs
	    ,order_entry_format oef
plan d
	where maxrec(d2,size(orderfav_reply_out->favorites[d.seq].order_sets,5))
join d2
join p
	where p.pathway_catalog_id = orderfav_reply_out->favorites[d.seq].order_sets[d2.seq].id
	and p.parent_entity_name = "ORDER_CATALOG_SYNONYM"
		and p.active_ind = 1
join ocs
	where ocs.synonym_id = p.parent_entity_id
join oef
	where oef.oe_format_id = ocs.oe_format_id
order by d.seq, d2.seq,ocs.catalog_cd, ocs.synonym_id, oef.action_type_cd
head d.seq
	nocnt = 0
	head d2.seq
		x = 0
		head ocs.catalog_cd
			x = x + 1
			y = 0
			stat = alterlist(orderfav_reply_out->favorites[d.seq].order_sets[d2.seq].orderable_codes,x)
			orderfav_reply_out->favorites[d.seq].order_sets[d2.seq].orderable_codes[x].orderable_code_desc
			orderfav_reply_out->favorites[d.seq].order_sets[d2.seq].orderable_codes[x].active = ocs.active_ind
			orderfav_reply_out->favorites[d.seq].order_sets[d2.seq].orderable_codes[x].orderable_code_id = ocs.catalog_cd
			orderfav_reply_out->favorites[d.seq].order_sets[d2.seq].orderable_codes[x].orderable_code_desc = 
																						trim(uar_get_code_display(ocs.catalog_cd))
			orderfav_reply_out->favorites[d.seq].order_sets[d2.seq].orderable_codes[x].orderable_type->id = ocs.activity_type_cd
			orderfav_reply_out->favorites[d.seq].order_sets[d2.seq].orderable_codes[x].orderable_type->name = 
																						trim(uar_get_code_display(ocs.activity_type_cd))
 
			head ocs.synonym_id
			z = 0
			y = y + 1
			stat = alterlist(orderfav_reply_out->favorites[d.seq].order_sets[d2.seq].orderable_codes[x].alias,y)
			orderfav_reply_out->favorites[d.seq].order_sets[d2.seq].orderable_codes[x].alias[y].type.id = ocs.synonym_id
			orderfav_reply_out->favorites[d.seq].order_sets[d2.seq].orderable_codes[x].alias[y].type.name =  trim(ocs.mnemonic)
			orderfav_reply_out->favorites[d.seq].order_sets[d2.seq].orderable_codes[x].alias[y].value = trim(cnvtstring(ocs.synonym_id))
 
			head oef.action_type_cd
				if(oef.oe_format_id > 0)
					z = z + 1
					stat = alterlist(orderfav_reply_out->favorites[d.seq].order_sets[d2.seq].orderable_codes[x].order_detail,z)
					orderfav_reply_out->favorites[d.seq].order_sets[d2.seq].orderable_codes[x].order_detail[z].oe_format_id = oef.oe_format_id
 					orderfav_reply_out->favorites[d.seq].order_sets[d2.seq].orderable_codes[x].order_detail[z].action.id = oef.action_type_cd
 					orderfav_reply_out->favorites[d.seq].order_sets[d2.seq].orderable_codes[x].order_detail[z].action.name = 
 																									trim(uar_get_code_display(oef.action_type_cd))
 					orderfav_reply_out->favorites[d.seq].order_sets[d2.seq].orderable_codes[x].order_detail[z].oe_format_name = 
 																									trim(oef.oe_format_name)
 				endif
with nocounter
endif
 
if(iDebugFlag > 0)
	call echo(concat("GetOrderFav: ",
	trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	" seconds"))
endif
end; end GetOrderFav
 
/*************************************************************************
;  Name: GetPlanFav(null)
;  Description: Grabs the plans that are in "My Favorite plans"
**************************************************************************/
 
subroutine GetPlanFav(null)
if(iDebugFlag > 0)
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetPlanFav Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
endif
 
 
select into "nl:"
from pathway_customized_plan pcp
	,pathway_comp p
	,order_catalog_synonym ocs
	,order_entry_format oef
 
plan pcp
	where pcp.prsnl_id = dPersonId
join p
	where p.pathway_catalog_id = pcp.pathway_catalog_id
		and p.parent_entity_name = "ORDER_CATALOG_SYNONYM"
		and p.active_ind = 1
join ocs
	where ocs.synonym_id = p.parent_entity_id
join oef
	where oef.oe_format_id = ocs.oe_format_id
order by pcp.pathway_catalog_id, ocs.catalog_cd, ocs.synonym_id
 
head report
	x = orderfav_reply_out->favorite_cnt + 1
	stat = alterlist(orderfav_reply_out->favorites,x)
	orderfav_reply_out->favorites[x].fav_name = "My Favorite Plans"
	y = 0
 
	head pcp.pathway_catalog_id
		y = y + 1
		z = 0
		stat = alterlist(orderfav_reply_out->favorites[x].order_sets,y)
		orderfav_reply_out->favorites[x].order_sets[y].id = pcp.pathway_catalog_id
		orderfav_reply_out->favorites[x].order_sets[y].name = trim(pcp.plan_name)
		orderfav_reply_out->favorites[x].order_sets[y].active= pcp.active_ind
 
		head ocs.catalog_cd
			a = 0
			z = z + 1
			stat = alterlist(orderfav_reply_out->favorites[x].order_sets[y].orderable_codes,z)
			orderfav_reply_out->favorites[x].order_sets[y].orderable_codes[z].active = ocs.active_ind
			orderfav_reply_out->favorites[x].order_sets[y].orderable_codes[z].orderable_code_id = ocs.catalog_cd
			orderfav_reply_out->favorites[x].order_sets[y].orderable_codes[z].orderable_code_desc = 
																			trim(uar_get_code_display(ocs.catalog_cd))
			orderfav_reply_out->favorites[x].order_sets[y].orderable_codes[z].orderable_type->id = ocs.activity_type_cd
			orderfav_reply_out->favorites[x].order_sets[y].orderable_codes[z].orderable_type->name = 
																			trim(uar_get_code_display(ocs.activity_type_cd))
 
		head ocs.synonym_id
			b = 0
		    a  = a + 1
			stat = alterlist(orderfav_reply_out->favorites[x].order_sets[y].orderable_codes[z].alias,a)
			orderfav_reply_out->favorites[x].order_sets[y].orderable_codes[z].alias[a].type.id = ocs.synonym_id
			orderfav_reply_out->favorites[x].order_sets[y].orderable_codes[z].alias[a].type.name =  trim(ocs.mnemonic)
			orderfav_reply_out->favorites[x].order_sets[y].orderable_codes[z].alias[a].value = trim(cnvtstring(ocs.synonym_id))
 
			head oef.action_type_cd
				if(oef.oe_format_id > 0)
					b = b + 1
					stat = alterlist(orderfav_reply_out->favorites[x].order_sets[y].orderable_codes[z].order_detail,b)
					orderfav_reply_out->favorites[x].order_sets[y].orderable_codes[z].order_detail[b].oe_format_id = oef.oe_format_id
					orderfav_reply_out->favorites[x].order_sets[y].orderable_codes[z].order_detail[b].oe_format_name = trim(oef.oe_format_name)
					orderfav_reply_out->favorites[x].order_sets[y].orderable_codes[z].order_detail[b].action.id = oef.action_type_cd
					orderfav_reply_out->favorites[x].order_sets[y].orderable_codes[z].order_detail[b].action.name = 
																					trim(uar_get_code_display(oef.action_type_cd))
				endif
 
 
foot report
	orderfav_reply_out->favorite_cnt = x
with nocounter
 
 
if(iDebugFlag > 0)
	call echo(concat("getPlanFav: ",
	trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	" seconds"))
endif
end; end GetplanFav
 
 
end
go
 
 
