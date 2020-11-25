/*~BB~**********************************************************************
  
  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

****************************************************************************
      Source file name:     snsro_get_medorders_disc.prg
      Object name:          vigilanz_get_medorders_disc
      Program purpose:      Retrieve medication orders discovery
 
      Tables updated:       NONE
      Executing from:       Emissary Service
      Special Notes:
***********************************************************************
                     MODIFICATION CONTROL LOG
 ***********************************************************************
 Mod Date     Engineer             Comment
 ------------------------------------------------------------------
  000 06/19/19 STV              	Initial write
  001 09/09/19 RJC                  Renamed file and object
 ***********************************************************************/
;drop program snsro_get_medorders_discovery go
drop program vigilanz_get_medorders_disc go
create program vigilanz_get_medorders_disc
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "username" = ""
	, "SearchString" = ""
	, "MedicationId" = ""
	, "SearchCode" = ""
	, "CodeType" = ""
	, "FormularyOnly" = "0"
	, "AdhocPostable" = "0"
	, "DebugFlag" = ""
 
with OUTDEV, username, SearchString, MedicationId, SearchCode, CodeType, FormularyOnly,AdhocPostable, DebugFlag
 
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
 
;structure for adhoc searching job
free record 390401_req
record 390401_req (
  1 search_string = vc
  1 item_id_ind = i2
  1 item_id = f8
  1 ident_qual [*]
    2 identifier_type_cd = f8
  1 other_identifier_cd = f8
  1 med_type_qual [*]
    2 med_type_flag = i2
  1 med_filter_ind = i2
  1 intermittent_filter_ind = i2
  1 continuous_filter_ind = i2
  1 tpn_filter_ind = i2
  1 fac_qual [*]
    2 facility_cd = f8
  1 disp_loc_cd = f8
  1 show_all_ind = i2
  1 formulary_status_cd = f8
  1 set_items_ind = i2
  1 set_med_type_qual [*]
    2 set_med_type_flag = i2
  1 active_ind = i2
  1 pharmacy_type_cd = f8
  1 prev_item_id = f8
  1 max_rec = i4
  1 full_search_string = vc
  1 item_qual [*]
    2 item_id = f8
    2 med_product_id = f8
  1 exclude_fac_flex_ind = i2
  1 qoh_loc1_cd = f8
  1 qoh_loc2_cd = f8
  1 stock_pkg_for_qoh_ind = i2
  1 inv_track_level_ind = i2
)
 
free record 390401_rep
record 390401_rep (
    1 items [* ]
      2 item_id = f8
      2 active_ind = i2
      2 manf_item_id = f8
      2 med_type_flag = i2
      2 med_filter_ind = i2
      2 intermittent_filter_ind = i2
      2 continuous_filter_ind = i2
      2 tpn_filter_ind = i2
      2 oe_format_flag = i2
      2 dispense_category_cd = f8
      2 formulary_status_cd = f8
      2 formulary_status = vc
      2 ndc = vc
      2 mnemonic = vc
      2 generic_name = vc
      2 description = vc
      2 brand_name = vc
      2 charge_number = vc
      2 other_identifier = vc
      2 strength_form = vc
      2 form_cd = f8
      2 form = vc
      2 strength = f8
      2 strength_unit_cd = f8
      2 strength_unit = vc
      2 volume = f8
      2 volume_unit_cd = f8
      2 volume_unit = vc
      2 primary_ind = i2
      2 brand_ind = i2
      2 divisble_ind = i2
      2 price_sched_id = f8
      2 dispense_qty = f8
      2 dispense_qty_unit_cd = f8
      2 manufacturer = vc
      2 facs [* ]
        3 facility_cd = f8
        3 facility = vc
      2 med_product_id = f8
      2 inner_ndc = vc
      2 qoh_exists_ind_loc1 = i2
      2 qoh_loc1 = f8
      2 qoh_loc1_unit = vc
      2 qoh_exists_ind_loc2 = i2
      2 qoh_loc2 = f8
      2 qoh_loc2_unit = vc
    1 elapsed_time = f8
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
  )
 
;Final Reply out
free record medorders_discovery_reply_out
record medorders_discovery_reply_out(
	1 order_syn_cnt = i4
	1 order_syn[*]
		2 synonym_id = f8
		2 mnemonic = vc
		2 oe_format_id = f8
		2 item_cnt = i4
		2 item[*]
			3 item_id = f8
			;3 adhoc_postable = i2
			3 brand_name = vc
			3 generic_name = vc
			3 description = vc
			3 ndc = vc
			3 form
				4 id = f8
				4 name = vc
			3 strength = vc
			3 strength_unit
				4 id = f8
				4 name = vc
			3 volume = vc
			3 volume_unit
				4 id = f8
				4 name = vc
			3 formulary_status
				4 id = f8
				4 name = vc
			3 manf_item_id = f8
			3 med_product_id = f8
			3 manufacture_name = vc
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
	1 status_data
    	2 status = c1
   		2 subeventstatus[1]
      		3 OperationName = c25
      		3 OperationStatus = c1
      		3 TargetObjectName = c25
      		3 TargetObjectValue = vc
      		3 Code = c4
      		3 Description = vc;001
)
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Inputs
declare sUserName					= vc with protect, noconstant("")
declare sSearchString				= vc with protect, noconstant("")
declare sSearchCode					= vc with protect, noconstant("")
declare dCodeType                   = f8 with protect, noconstant(0.0)
declare dMedicationId               = f8 with protect, noconstant(0.0)
declare iFormularyOnly              = i2 with protect, noconstant(0)
declare iAdhocPostable              = i2 with protect, noconstant(0)
declare iDebugFlag					= i2 with protect, noconstant(0)
 
declare sFormularyParser            = vc
/*************************************************************************
;INITIALIZE
**************************************************************************/
set sUserName 			= trim($USERNAME,3)
set sSearchString		= trim($SEARCHSTRING,3)
set dMedicationId       = cnvtreal(trim($MedicationId))
set sSearchCode			= trim($SEARCHCODE,3)
set dCodeType           = cnvtreal(trim($CODETYPE,3))
set iFormularyOnly      = cnvtint($FormularyOnly)
set iAdhocPostable      = cnvtint($AdhocPostable)
set iDebugFlag			= cnvtint($DEBUGFLAG)
 
;other
declare c_pharm_act_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",106,"PHARMACY"))
declare dBrandNameCd            = f8 with protect, constant(uar_get_code_by("MEANING",11000,"BRAND_NAME"))
declare dCdmCd            		= f8 with protect, constant(uar_get_code_by("MEANING",11000,"CDM"))
declare dDescCd                 = f8 with protect, constant(uar_get_code_by("MEANING",11000,"DESC"))
declare dGenericNameCd          = f8 with protect, constant(uar_get_code_by("MEANING",11000,"GENERIC_NAME"))
declare dNdcCd           		= f8 with protect, constant(uar_get_code_by("MEANING",11000,"NDC"))
declare dDescShortCd            = f8 with protect, constant(uar_get_code_by("MEANING",11000,"DESC_SHORT"))
declare dInpatientPharmCd       = f8 with protect, constant(uar_get_code_by("MEANING",4500,"INPATIENT"))
declare c_flex_system_type_cd   = f8 with protect, constant(uar_get_code_by("MEANING",4062,"SYSTEM"))
declare c_flex_medprod_type_cd  = f8 with protect, constant(uar_get_code_by("MEANING",4063,"MEDPRODUCT"))
declare c_desc_cd       		= f8 with protect, constant(uar_get_code_by("MEANING",11000,"DESC"))
declare c_generic_cd       		= f8 with protect, constant(uar_get_code_by("MEANING",11000,"GENERIC_NAME"))
declare c_generic_ndc_cd   		= f8 with protect, constant(uar_get_code_by("MEANING",11000,"NDC"))
declare c_brandname_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",11000,"BRAND_NAME"))
declare c_dispense_object_cd    = f8 with protect, constant(uar_get_code_by("MEANING",4063,"DISPENSE"))
declare c_formulary_cd          = f8 with protect, constant(uar_get_code_by("MEANING",4512,"FORMULARY"))
 
;setting the Formulary Flag
if(iFormularyOnly > 0)
	set sFormularyParser = "mdisp.formulary_status_cd = c_formulary_cd"
else
	set sFormularyParser = "mdisp.formulary_status_cd > -1"
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetMedSearchOpen(null)							= null with protect
declare GetAdHocMedSearch(null) 						= null with protect
declare GetMedsByIdorStr(null)                          = null with protect
declare GetMedsBySearchCd(null)                         = null with protect
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, medorders_discovery_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "MEDORDERS DISCOVERY", "Invalid User for Audit.",
	"2016",build2("Invalid UserId: ",sUserName), medorders_discovery_reply_out)
	go to EXIT_SCRIPT
endif
 
;validate MedicationId
if(dMedicationId > 0)
 	;if the medicationId is filled in it will only allow medicationId
	if(sSearchString > " " or sSearchCode > " " or dCodeType > 0)
		call ErrorHandler2("VALIDATE", "F", "MEDORDERS DISCOVERY", "Can only search by MedicationId",
			"9999","Can only search by MedicationId", medorders_discovery_reply_out)
			go to EXIT_SCRIPT
	endif
 
	declare iValid = i2
	select into "nl:"
	from order_catalog_synonym ocs
	where ocs.synonym_id = dMedicationId
		and ocs.active_ind = 1
	head report
		iValid = 1
	with nocounter
 
	if(iValid < 1)
		call ErrorHandler2("VALIDATE", "F", "MEDORDERS DISCOVERY", "Invalid MedicationId.",
			"9999","Invalid MedicationId", medorders_discovery_reply_out)
			go to EXIT_SCRIPT
	endif
endif
 
; Validate that only SearchString or SearchCode is set
if(sSearchString > " " and sSearchCode > " ")
	call ErrorHandler2("VALIDATE", "F", "MEDORDERS DISCOVERY", "Can only search by SearchString or SearchCode, but not both.",
	"9999","Can only search by SearchString or SearchCode, but not both.", medorders_discovery_reply_out)
	go to EXIT_SCRIPT
endif
 
 
; Validate search string is at least 3 characters
if(size(sSearchString) > 0)
	if(size(sSearchString) < 3)
		call ErrorHandler2("VALIDATE", "F", "MEDORDERS DISCOVERY", "The search string must be at least 3 characters.",
			"9999","The search string must be at least 3 characters.", medorders_discovery_reply_out)	;001
			go to EXIT_SCRIPT
	else
		set sSearchString = build("*",cnvtupper(trim(sSearchString)),"*")
	endif
endif
 
; Validate CodeType if SearchCode exists
if(dCodeType > 0 and size(sSearchCode) < 1)
	call ErrorHandler2("VALIDATE", "F", "MEDORDERS DISCOVERY", "SearchCode required when using Code type",
			"9999","SearchCode required when using Code type", medorders_discovery_reply_out)
			go to EXIT_SCRIPT
endif

if(sSearchCode > " ")
	set iRet = GetCodeSet(dCodeType)
		if(iRet != 29223)
			call ErrorHandler2("VALIDATE", "F", "MEDORDERS DISCOVERY", "Invalid code type(required for searchCode).",
			"9999",build2("Invalid code type(required for searchCode): ",trim($CODETYPE,3)), medorders_discovery_reply_out)
			go to EXIT_SCRIPT
		endif
endif
 
;validate adhoc searchable
if(iAdhocPostable > 0 and size(sSearchString) < 1)
	call ErrorHandler2("VALIDATE", "F", "MEDORDERS DISCOVERY", "Search String required for Adhoc Postable Med Search",
			"9999","Search String required for Adhoc Postable Med Search", medorders_discovery_reply_out)
			go to EXIT_SCRIPT
endif
 
;Calling the subroutines that pull the medinfo
if(iAdhocPostable > 0)
	call GetAdHocMedSearch(null)
elseif(dMedicationId > 0 or size(sSearchstring) > 0)
	call GetMedsByIdorStr(null)
elseif(size(sSearchCode) > 0)
	call GetMedsBySearchCd(null)
else
	call GetMedSearchOpen(null)
endif
 
 
; Set audit to successful
call ErrorHandler2("SUCCESS", "S", "MEDORDERS DISCOVERY", "Medication Orders Discovery completed successfully.",
"0000","Medication Orders Discovery completed successfully.", medorders_discovery_reply_out)
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(medorders_discovery_reply_out)
 
if(idebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_medorders_discovery.json")
	call echo(build2("_file : ", _file))
	call echojson(medorders_discovery_reply_out, _file, 0)
    call echorecord(medorders_discovery_reply_out)
	call echo(JSONout)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
 
/*************************************************************************
;  Name: GetMedSearchOpen(null)
;  Description: Returns just the synonymId no item
**************************************************************************/
subroutine GetMedSearchOpen(null)
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetMedSearchOpen Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
  if(iFormularyOnly > 0)
  	select into "nl:"
  	from order_catalog_synonym ocs
  	     ,synonym_item_r sir
     	 ,medication_definition md
     	 ,med_dispense mdisp
    plan ocs
		where ocs.activity_type_cd = c_pharm_act_type_cd
			and ocs.active_ind = 1
	join sir
		where sir.synonym_id = ocs.synonym_id
	join md
		where md.item_id = sir.item_id
	join mdisp
		where mdisp.item_id = md.item_id
			and mdisp.formulary_status_cd = c_formulary_cd
	order ocs.synonym_id
	head report
		x = 0
		head ocs.synonym_id
			x = x + 1
			stat = alterlist(medorders_discovery_reply_out->order_syn,x)
			medorders_discovery_reply_out->order_syn[x].synonym_id = ocs.synonym_id
			medorders_discovery_reply_out->order_syn[x].mnemonic = trim(ocs.mnemonic)
			medorders_discovery_reply_out->order_syn[x].oe_format_id = ocs.oe_format_id
	 foot report
		medorders_discovery_reply_out->order_syn_cnt = x
	with nocounter
   else
	select into "nl:"
	from order_catalog_synonym ocs
	plan ocs
		where ocs.activity_type_cd = c_pharm_act_type_cd
			and ocs.active_ind = 1
	order by ocs.synonym_id
	head report
		x = 0
		head ocs.synonym_id
			x = x + 1
			stat = alterlist(medorders_discovery_reply_out->order_syn,x)
			medorders_discovery_reply_out->order_syn[x].synonym_id = ocs.synonym_id
			medorders_discovery_reply_out->order_syn[x].mnemonic = trim(ocs.mnemonic)
			medorders_discovery_reply_out->order_syn[x].oe_format_id = ocs.oe_format_id
	foot report
		medorders_discovery_reply_out->order_syn_cnt = x
	with nocounter
   endif;end formularyflag
	if(iDebugFlag > 0)
		call echo(concat("GetMedSearchOpen Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end;end GetMedSearchOpen
 
 
/*************************************************************************
;  Name: GetAdHocMedSearch(null)
;  Description: Performs the same search for the adhocMed search
**************************************************************************/
subroutine GetAdHocMedSearch(null)
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAdHocMedSearch Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;setting up request
	set 390401_req->search_string = sSearchString
	set 390401_req->full_search_string = "*"
	set 390401_req->item_id_ind = 0
	set 390401_req->active_ind = 1
	set 390401_req->med_filter_ind = 1
	set 390401_req->pharmacy_type_cd = dInpatientPharmCd
	;set 390401_req->max_rec = 200
	set 390401_req->show_all_ind = 1
	set stat = alterlist(390401_req->fac_qual,1)
	set 390401_req->fac_qual[1].facility_cd = 0
	set stat = alterlist(390401_req->ident_qual,6)
	set 390401_req->ident_qual[1].identifier_type_cd = dBrandNameCd
	set 390401_req->ident_qual[2].identifier_type_cd = dCdmCd
	set 390401_req->ident_qual[3].identifier_type_cd = dDescCd
	set 390401_req->ident_qual[4].identifier_type_cd = dGenericNameCd
	set 390401_req->ident_qual[5].identifier_type_cd = dNdcCd
	set 390401_req->ident_qual[6].identifier_type_cd = dDescShortCd
	set stat = alterlist(390401_req->med_type_qual,1)
	set 390401_req->med_type_qual[1].med_type_flag = 0
 
	;set's the formulary flag
	if(iFormularyOnly > 0)
		set 390401_req->formulary_status_cd = c_formulary_cd
	endif
 
 	;execute request
	set iAPPLICATION = 600005
	set iTASK = 3202004
	set iREQUEST = 390401
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",390401_req,"REC",390401_rep)
 
	;checking if anything was found with search string
	if(size(390401_rep->items,5) < 1)
		call ErrorHandler2("VALIDATE", "F", "MEDORDERS DISCOVERY", "No Adhoc Meds found with entered search String",
			"9999","No Adhoc Meds found with entered search String", medorders_discovery_reply_out)
			go to EXIT_SCRIPT
	endif
 
	;populating reply structure
	select into "nl:"
	from order_catalog_synonym ocs
		,(dummyt d with seq = size(390401_rep->items,5))
	plan d
		where 390401_rep->items[d.seq].item_id > 0
	join ocs
		where ocs.item_id = 390401_rep->items[d.seq].item_id
			and ocs.oe_format_id > 0
			and ocs.active_ind = 1
	order by ocs.synonym_id, d.seq
	head report
		x = 0
		head ocs.synonym_id
			x = x + 1
			y = 0
			stat = alterlist(medorders_discovery_reply_out->order_syn,x)
			medorders_discovery_reply_out->order_syn[x].synonym_id = ocs.synonym_id
			medorders_discovery_reply_out->order_syn[x].mnemonic = trim(ocs.mnemonic)
			medorders_discovery_reply_out->order_syn[x].oe_format_id = ocs.oe_format_id
 
			head d.seq
				y = y + 1
				stat = alterlist(medorders_discovery_reply_out->order_syn[x].item,y)
				medorders_discovery_reply_out->order_syn[x].item[y].brand_name = 390401_rep->items[d.seq].brand_name
				medorders_discovery_reply_out->order_syn[x].item[y].description = trim(390401_rep->items[d.seq].description)
				medorders_discovery_reply_out->order_syn[x].item[y].form.id = 390401_rep->items[d.seq].form_cd
				medorders_discovery_reply_out->order_syn[x].item[y].form.name = trim(390401_rep->items[d.seq].form)
				medorders_discovery_reply_out->order_syn[x].item[y].formulary_status.id = 390401_rep->items[d.seq].formulary_status_cd
				medorders_discovery_reply_out->order_syn[x].item[y].formulary_status.name = trim(390401_rep->items[d.seq].formulary_status)
				medorders_discovery_reply_out->order_syn[x].item[y].generic_name = trim(390401_rep->items[d.seq].generic_name)
				medorders_discovery_reply_out->order_syn[x].item[y].item_id = 390401_rep->items[d.seq].item_id
				medorders_discovery_reply_out->order_syn[x].item[y].manf_item_id = 390401_rep->items[d.seq].manf_item_id
				medorders_discovery_reply_out->order_syn[x].item[y].manufacture_name = trim(390401_rep->items[d.seq].manufacturer)
				medorders_discovery_reply_out->order_syn[x].item[y].med_product_id = 390401_rep->items[d.seq].med_product_id
				medorders_discovery_reply_out->order_syn[x].item[y].ndc = trim(390401_rep->items[d.seq].ndc)
				medorders_discovery_reply_out->order_syn[x].item[y].strength = trim(cnvtstring(390401_rep->items[d.seq].strength),3)
				medorders_discovery_reply_out->order_syn[x].item[y].strength_unit.id = 390401_rep->items[d.seq].strength_unit_cd
				medorders_discovery_reply_out->order_syn[x].item[y].strength_unit.name = trim(390401_rep->items[d.seq].strength_unit)
				medorders_discovery_reply_out->order_syn[x].item[y].volume = trim(cnvtstring(390401_rep->items[d.seq].volume),3)
				medorders_discovery_reply_out->order_syn[x].item[y].volume_unit.id = 390401_rep->items[d.seq].volume_unit_cd
				medorders_discovery_reply_out->order_syn[x].item[y].volume_unit.name = trim(390401_rep->items[d.seq].volume_unit)
		foot ocs.synonym_id
			medorders_discovery_reply_out->order_syn[x].item_cnt = y
	foot report
		medorders_discovery_reply_out->order_syn_cnt = x
	with nocounter
 
 
	if(iDebugFlag > 0)
		call echo(concat("GetAdHocMedSearch Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end;end GetAdHocMedSearch
 
/*************************************************************************
;  Name: GetMedsByIdorStr(null)
;  Description: Search for med by synonymId or searchstring
**************************************************************************/
subroutine GetMedsByIdorStr(null)
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetMedsByIdorStr Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;sets the parser string to be used for ocs query
	declare sParserString = vc
	if(dMedicationId > 0)
		set sParserString = " ocs.synonym_id = dMedicationId"
	else
		set sParserString = " ocs.mnemonic_key_cap = patstring(sSearchString)"
	endif
 
 	;query to grab data
	select into "nl:"
	from order_catalog_synonym ocs
	     ,synonym_item_r sir
	     ,medication_definition md
	     ,med_dispense mdisp
     	 ,med_def_flex mdf
     	 ,med_flex_object_idx mfoi
     	 ,med_product mp
         ,manufacturer_item mfi
         ,med_identifier mi
         ,med_identifier mi2
    plan ocs
    	where parser(sParserString)
    		and ocs.active_ind = 1
    		and ocs.activity_type_cd = c_pharm_act_type_cd
    		and ocs.oe_format_id > 0
    join sir
    	where sir.synonym_id = ocs.synonym_id
    		and sir.item_id > 0
    join md
    	where md.item_id = sir.item_id
    join mdf
    	where mdf.item_id = md.item_id
    		and mdf.flex_type_cd = c_flex_system_type_cd
    		and mdf.med_def_flex_id > 0
    		and mdf.sequence = 0
    		and mdf.active_ind = 1
    join mfoi
    		where mfoi.med_def_flex_id = mdf.med_def_flex_id
		and mfoi.flex_object_type_cd = c_flex_medprod_type_cd
		and mfoi.active_ind = 1
		and mfoi.parent_entity_id > 0
	join mp
	where mp.med_product_id = mfoi.parent_entity_id
	join mfi
		where mfi.item_id = mp.manf_item_id
	join mi
		where mi.item_id = md.item_id
			and mi.med_identifier_type_cd in(c_desc_cd, c_generic_cd)
			and mi.med_product_id = 0
			and mi.sequence = 1
			and mi.active_ind = 1
	join mi2
		where mi2.item_id = mi.item_id
			and mi2.med_identifier_type_cd in(c_generic_ndc_cd, c_brandname_cd)
			and mi2.med_product_id = mp.med_product_id
			and mi2.active_ind = 1
			and mi2.sequence = 1
	join mdisp
		where mdisp.item_id = md.item_id
			and parser(sFormularyParser)
    order by ocs.synonym_id,mp.med_product_id
    head report
    	x = 0
    	head ocs.synonym_id
 
    		y = 0
    		x = x + 1
    		stat = alterlist(medorders_discovery_reply_out->order_syn,x)
    		medorders_discovery_reply_out->order_syn[x].mnemonic = trim(ocs.mnemonic)
    		medorders_discovery_reply_out->order_syn[x].synonym_id = ocs.synonym_id
    		medorders_discovery_reply_out->order_syn[x].oe_format_id = ocs.oe_format_id
 
    		head mp.med_product_id
    			y = y + 1
    			stat = alterlist(medorders_discovery_reply_out->order_syn[x].item,y)
    			medorders_discovery_reply_out->order_syn[x].item[y].form.id = md.form_cd
    			medorders_discovery_reply_out->order_syn[x].item[y].form.name = uar_get_code_display(md.form_cd)
    			medorders_discovery_reply_out->order_syn[x].item[y].item_id = md.item_id
    			medorders_discovery_reply_out->order_syn[x].item[y].manf_item_id = mp.manf_item_id
    			medorders_discovery_reply_out->order_syn[x].item[y].manufacture_name = uar_get_code_display(mfi.manufacturer_cd)
    			medorders_discovery_reply_out->order_syn[x].item[y].med_product_id = mp.med_product_id
    			medorders_discovery_reply_out->order_syn[x].item[y].strength = trim(cnvtstring(md.strength),3)
    			medorders_discovery_reply_out->order_syn[x].item[y].strength_unit.id = md.strength_unit_cd
    			medorders_discovery_reply_out->order_syn[x].item[y].strength_unit.name = uar_get_code_display(md.strength_unit_cd)
    			medorders_discovery_reply_out->order_syn[x].item[y].volume = trim(cnvtstring(md.volume),3)
    			medorders_discovery_reply_out->order_syn[x].item[y].volume_unit.id = md.volume_unit_cd
    			medorders_discovery_reply_out->order_syn[x].item[y].volume_unit.name = uar_get_code_display(md.volume_unit_cd)
    			medorders_discovery_reply_out->order_syn[x].item[y].formulary_status.id = mdisp.formulary_status_cd
    			medorders_discovery_reply_out->order_syn[x].item[y].formulary_status.name =
    																		uar_get_code_display(mdisp.formulary_status_cd)
 
    			detail
 
    				case(mi2.med_identifier_type_cd)
    					of c_generic_ndc_cd: medorders_discovery_reply_out->order_syn[x].item[y].ndc = trim(mi2.value)
    					of c_brandname_cd: medorders_discovery_reply_out->order_syn[x].item[y].brand_name = trim(mi2.value)
    				endcase
 
    				case(mi.med_identifier_type_cd)
    					of c_desc_cd: medorders_discovery_reply_out->order_syn[x].item[y].description = trim(mi.value)
    					of c_generic_cd: medorders_discovery_reply_out->order_syn[x].item[y].generic_name = trim(mi.value)
    				endcase
    	foot ocs.synonym_id
			medorders_discovery_reply_out->order_syn[x].item_cnt = y
	foot report
		medorders_discovery_reply_out->order_syn_cnt = x
	with nocounter
/*
    	;getting the formulary
	select into "nl:"
	from (dummyt d1 with seq = medorders_discovery_reply_out->order_syn_cnt)
	     ,(dummyt d2 with seq = 1)
	     ,med_def_flex mdf
     	 ,med_flex_object_idx mfoi
     	 ,med_dispense mdisp
    plan d1
    	where maxrec(d2,medorders_discovery_reply_out->order_syn[d1.seq].item_cnt)
    join d2
    	where medorders_discovery_reply_out->order_syn[d1.seq].item[d2.seq].item_id > 0
    join mdf
    	where mdf.item_id = medorders_discovery_reply_out->order_syn[d1.seq].item[d2.seq].item_id
    join mfoi
		where mfoi.med_def_flex_id = mdf.med_def_flex_id
			and mfoi.flex_object_type_cd = c_dispense_object_cd
	join mdisp
		where mdisp.med_dispense_id = mfoi.parent_entity_id
	order by d1.seq, d2.seq
    head d1.seq
    	no_cnt = 0
    	head d2.seq
    		medorders_discovery_reply_out->order_syn[d1.seq].item[d2.seq].formulary_status.id = mdisp.formulary_status_cd
    		medorders_discovery_reply_out->order_syn[d1.seq].item[d2.seq].formulary_status.name =
    																		uar_get_code_display(mdisp.formulary_status_cd)
    with nocounter
*/
	if(iDebugFlag > 0)
		call echo(concat("GetMedsByIdorStr Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end;end GetMedsByIdorStr
 
/*************************************************************************
;  Name: GetMedsBySearchCd(null)
;  Description: Search for med by searchCode
**************************************************************************/
subroutine GetMedsBySearchCd(null)
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetMedsByIdorStr Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	from cmt_cross_map ccm
	     ,order_catalog_synonym ocs
	     ,synonym_item_r sir
	     ,medication_definition md
	     ,med_dispense mdisp
     	 ,med_def_flex mdf
     	 ,med_flex_object_idx mfoi
     	 ,med_product mp
         ,manufacturer_item mfi
         ,med_identifier mi
         ,med_identifier mi2
    plan ccm
    	where ccm.source_identifier = sSearchCode
			and ccm.map_type_cd = dCodeType
	join ocs
		where ocs.concept_cki = ccm.concept_cki
			and ocs.active_ind = 1
    		and ocs.activity_type_cd = c_pharm_act_type_cd
			and ocs.oe_format_id > 0
	join sir
    	where sir.synonym_id = ocs.synonym_id
    		and sir.item_id > 0
    join md
    	where md.item_id = sir.item_id
    join mdf
    	where mdf.item_id = md.item_id
    		and mdf.flex_type_cd = c_flex_system_type_cd
    		and mdf.med_def_flex_id > 0
    		and mdf.sequence = 0
    		and mdf.active_ind = 1
    join mfoi
    		where mfoi.med_def_flex_id = mdf.med_def_flex_id
		and mfoi.flex_object_type_cd = c_flex_medprod_type_cd
		and mfoi.active_ind = 1
		and mfoi.parent_entity_id > 0
	join mp
	where mp.med_product_id = mfoi.parent_entity_id
	join mfi
		where mfi.item_id = mp.manf_item_id
	join mi
		where mi.item_id = md.item_id
			and mi.med_identifier_type_cd in(c_desc_cd, c_generic_cd)
			and mi.med_product_id = 0
			and mi.sequence = 1
			and mi.active_ind = 1
	join mi2
		where mi2.item_id = mi.item_id
			and mi2.med_identifier_type_cd in(c_generic_ndc_cd, c_brandname_cd)
			and mi2.med_product_id = mp.med_product_id
			and mi2.active_ind = 1
			and mi2.sequence = 1
	join mdisp
		where mdisp.item_id = md.item_id
			and parser(sFormularyParser)
    order by ocs.synonym_id,mp.med_product_id
    head report
    	x = 0
    	head ocs.synonym_id
 
    		y = 0
    		x = x + 1
    		stat = alterlist(medorders_discovery_reply_out->order_syn,x)
    		medorders_discovery_reply_out->order_syn[x].mnemonic = trim(ocs.mnemonic)
    		medorders_discovery_reply_out->order_syn[x].synonym_id = ocs.synonym_id
    		medorders_discovery_reply_out->order_syn[x].oe_format_id = ocs.oe_format_id
 
    		head mp.med_product_id
    			y = y + 1
    			stat = alterlist(medorders_discovery_reply_out->order_syn[x].item,y)
    			medorders_discovery_reply_out->order_syn[x].item[y].form.id = md.form_cd
    			medorders_discovery_reply_out->order_syn[x].item[y].form.name = uar_get_code_display(md.form_cd)
    			medorders_discovery_reply_out->order_syn[x].item[y].item_id = md.item_id
    			medorders_discovery_reply_out->order_syn[x].item[y].manf_item_id = mp.manf_item_id
    			medorders_discovery_reply_out->order_syn[x].item[y].manufacture_name = uar_get_code_display(mfi.manufacturer_cd)
    			medorders_discovery_reply_out->order_syn[x].item[y].med_product_id = mp.med_product_id
    			medorders_discovery_reply_out->order_syn[x].item[y].strength = trim(cnvtstring(md.strength),3)
    			medorders_discovery_reply_out->order_syn[x].item[y].strength_unit.id = md.strength_unit_cd
    			medorders_discovery_reply_out->order_syn[x].item[y].strength_unit.name = uar_get_code_display(md.strength_unit_cd)
    			medorders_discovery_reply_out->order_syn[x].item[y].volume = trim(cnvtstring(md.volume),3)
    			medorders_discovery_reply_out->order_syn[x].item[y].volume_unit.id = md.volume_unit_cd
    			medorders_discovery_reply_out->order_syn[x].item[y].volume_unit.name = uar_get_code_display(md.volume_unit_cd)
    			medorders_discovery_reply_out->order_syn[x].item[y].formulary_status.id = mdisp.formulary_status_cd
    			medorders_discovery_reply_out->order_syn[x].item[y].formulary_status.name =
    																		uar_get_code_display(mdisp.formulary_status_cd)
 
    			detail
 
    				case(mi2.med_identifier_type_cd)
    					of c_generic_ndc_cd: medorders_discovery_reply_out->order_syn[x].item[y].ndc = trim(mi2.value)
    					of c_brandname_cd: medorders_discovery_reply_out->order_syn[x].item[y].brand_name = trim(mi2.value)
    				endcase
 
    				case(mi.med_identifier_type_cd)
    					of c_desc_cd: medorders_discovery_reply_out->order_syn[x].item[y].description = trim(mi.value)
    					of c_generic_cd: medorders_discovery_reply_out->order_syn[x].item[y].generic_name = trim(mi.value)
    				endcase
    	foot ocs.synonym_id
			medorders_discovery_reply_out->order_syn[x].item_cnt = y
	foot report
		medorders_discovery_reply_out->order_syn_cnt = x
	with nocounter
 
    /*
    ;getting the formulary
	select into "nl:"
	from (dummyt d1 with seq = medorders_discovery_reply_out->order_syn_cnt)
	     ,(dummyt d2 with seq = 1)
	     ,med_def_flex mdf
     	 ,med_flex_object_idx mfoi
     	 ,med_dispense mdisp
    plan d1
    	where maxrec(d2,medorders_discovery_reply_out->order_syn[d1.seq].item_cnt)
    join d2
    	where medorders_discovery_reply_out->order_syn[d1.seq].item[d2.seq].item_id > 0
    join mdf
    	where mdf.item_id = medorders_discovery_reply_out->order_syn[d1.seq].item[d2.seq].item_id
    join mfoi
		where mfoi.med_def_flex_id = mdf.med_def_flex_id
			and mfoi.flex_object_type_cd = c_dispense_object_cd
	join mdisp
		where mdisp.med_dispense_id = mfoi.parent_entity_id
	order by d1.seq, d2.seq
    head d1.seq
    	no_cnt = 0
    	head d2.seq
    		medorders_discovery_reply_out->order_syn[d1.seq].item[d2.seq].formulary_status.id = mdisp.formulary_status_cd
    		medorders_discovery_reply_out->order_syn[d1.seq].item[d2.seq].formulary_status.name =
    																		uar_get_code_display(mdisp.formulary_status_cd)
    with nocounter
   */
	if(iDebugFlag > 0)
		call echo(concat("GetMedsBySearchCd Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end;GetMedsBySearchCd(null)
 
 
end
go
