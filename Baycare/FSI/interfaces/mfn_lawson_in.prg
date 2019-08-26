/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  MFN_ITEM_MASTER
 *  Description:  ITEM MASTER INBOUND MODIFY OBJECT SCRIPT
 *  Type:  Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:
 *  Domain:
 *  Creation Date:
 *  ---------------------------------------------------------------------------------------------
 */

execute oencpm_msglog(build("*** Start of MOD_OBJ_ITEM_MASTER_IN script.",char(0)))
;Set to fail
set oenstatus->status = 0

;***** VARIABLE DECLARATIONS *****
;;Declare any and all variables here.

;***** VARIABLE INITIALIZATIONS *****
;;Initialize any and all variables here.

/*
;******* FIELD MANIPULATION FOR TDB DIFFERENCES *****
;** The TDB has the field 'Manufacturer_ID' for Lawson.
;** This moves all fields +1 for PMM.  This code must
;** remain for PMM, but can be removed for a Lawson
;** implementation.
;** DO NOT ALTER!
;*****************************************************
Set oen_reply->CD2 [1]->order_cost_1 =
  oen_reply->CD2[1]->vendor_catalog_1
Set oen_reply->CD2 [1]->vendor_catalog_1 = ""

Set oen_reply->CD2[1]->vendor_catalog_1 = 
  oen_reply->CD2[1]->vendor_id_1->vend_code
Set oen_reply->CD2[1]->vendor_id_1->vend_code = ""

set carot_pos = findstring("^", oen_reply->CD2[1]->manufacturers_catalog)
if (carot_pos)
  execute oencpm_msglog(build("CAROT_POS=", carot_pos, char(0)))
  Set oen_reply->CD2[1]->vendor_id_1->vend_code = 
    substring(1, carot_pos-1, trim(oen_reply->CD2[1]->manufacturers_catalog))
  Set oen_reply->CD2[1]->vendor_id_1->name =
    substring(carot_pos+1,
      size(trim(oen_reply->CD2[1]->manufacturers_catalog)) - carot_pos,
      oen_reply->CD2[1]->manufacturers_catalog)
else
  Set oen_reply->CD2[1]->vendor_id_1->vend_code = trim(oen_reply->CD2[1]->manufacturers_catalog)
endif

Set oen_reply->CD2[1]->manufacturers_catalog = 
  oen_reply->CD2[1]->manufacturer_id->lic_code
Set oen_reply->CD2[1]->manufacturer_id->lic_code = ""
; ***** END FIELD MANIPULATION FOR TDB DIFFERENCES *****
*/

/***9/18 Changing Sending app to LAWSON***/
Set oen_reply->MSH [1]->sending_application = "LAWSON"


if(oen_reply->MSH [1]->sending_application = "" )
  execute oencpm_msglog(build("ERROR: Sending Application field is blank.",char(0)))
  go to EXITSCRIPT
endif


execute oencpm_msglog(build("*** Starting XFI_ITEM script.", char(0)))
;*******************************************************
;***** Fill out request for MM_POP_XFI_ITEM script *****
;*******************************************************
execute mm_declare_900362

Set req900362->qual[1]->segment_identifier = "IMM"
Set req900362->qual[1]->segment_version = "1"
Set req900362->qual[1]->action_flag = 1
Set req900362->qual[1]->relation_action_flag = 1
Set req900362->qual[1]->price_type = "List"
Set req900362->qual[1]->process_flag = 1
Set req900362->qual[1]->contributor = oen_reply->MSH[1]->sending_application

/***
     9/8/2009 - modifying item description to pull short description instead of long description.  
     This will force the item description to match the short description.
***/
Set req900362->qual[1]->item_identifier = oen_reply->CD1[1]->hosp_item_code[1]->item_ref_no
Set req900362->qual[1]->item_nbr = oen_reply->CD1[1]->hosp_item_code[1]->item_ref_no
Set req900362->qual[1]->item_desc = build(oen_reply->CD1[1]->hosp_item_code[1]->item_descrip_1,"-",
    oen_reply->CD2 [1]->manufacturers_catalog) 
Set req900362->qual[1]->item_short_desc = build(oen_reply->CD1[1]->hosp_item_code[1]->item_descrip_1,"-",
    oen_reply->CD2 [1]->manufacturers_catalog) 
Set req900362->qual[1]->base_pkg_uom  = trim(oen_reply->CD2[1]->unit_of_measure_4)
;Set req900362->qual[1]->base_pkg_uom  = trim(oen_reply->CD2 [1]->unit_of_measure_1) 
;Set req900362->qual[1]->base_pkg_conv = cnvtint(oen_reply->CD2[1]->conversion_factor_4)
Set req900362->qual[1]->base_pkg_conv = cnvtint(oen_reply->CD2 [1]->conversion_factor_1)


Set req900362->qual[1]->mfr_item_nbr = oen_reply->CD2[1]->manufacturers_catalog
;Set req900362->qual[1]->mfr = oen_reply->CD2 [1]->manufacturer_id->lic_code
Set req900362->qual[1]->mfr = oen_reply->CD2 [1]->manufacturer_id->description 
Set req900362->qual[1]->mfr_item_desc = oen_reply->CD1[1]->hosp_item_code[1]->item_descrip_1

execute mm_pop_xfi_item with replace( "REQUEST", "REQ900362"), replace( "REPLY", "REPLY900362" )
execute oencpm_msglog(build("*** REPLY900362 STATUS=", reply900362->status_data->status,char(0)))
execute oencpm_msglog(build("*** REPLY900362 TRANS ID=", reply900362->qual[1]->transaction_id,char(0)))

;***********************START PROCESSING LOCATION AND COST***********

execute mm_declare_900348
execute mm_declare_900320

set CD3_size=size(oen_reply->CD3,5)
execute oencpm_msglog(build("*** CD3_size =  ",CD3_size, char(0)))
set stat = alterlist(req900320->qual, CD3_size)
set stat = alterlist(req900348->qual, CD3_size)

;******Figure cost per lowest UOM*******

;Use conv factor (N3 field) to calculate cost at lowest UOM 
/***
   IF(size(oen_reply->CD2[1]->conversion_factor_2) > 0)     
        set N3_field = cnvtint(oen_reply->CD2[1]->conversion_factor_2)
   ELSEIF (size(oen_reply->CD2 [1]->conversion_factor_1) > 0) 
        set N3_field = cnvtint(oen_reply->CD2 [1]->conversion_factor_1)
   ELSE 
       execute oencpm_msglog(build("****ERROR IN QUANTITY- NO VALUE SENT***", char(0)))       
       go to EXITSCRIPT
   ENDIF
**/
/**1/7/2008 - Cost calculation base on lawson custom user fields.  Price at lowest UOM**/
/**3/3/2008 - changing from cnvtint to cnvtreal to accomidate decimal places***/
/**6/11/2009 - putting cost calculation back in place for Lawson redesign to run @ BISK**/
  ;Set N3_field = cnvtint(oen_reply->CD2 [1]->conversion_factor_4)
   Set N3_field = cnvtstring(oen_reply->CD2 [1]->conversion_factor_4,20,4,R)
   Set N4_field = cnvtreal(N3_field)

;;;;;;;;;;;;;;;;;;;;execute oencpm_msglog(build("*** N3_Field =",N3_field, char(0)))
/***7/7/2009 - logic to identify items with no price in surginet with 999999.99***/
If (oen_reply->CD3 [1]->patient_price>"")
;;;;Changing cost to use CD3;24 for consistency
set non_calculated_cost=cnvtreal(oen_reply->CD3 [1]->patient_price)
;set non_calculated_cost = cnvtreal(oen_reply->CD2[1]->order_cost_1)
set lowest_uom_cost = (non_calculated_cost/N4_field)
Else
set lowest_uom_cost = "999999.99"
Endif

;*****end of figure cost per lowest UOM******

execute oencpm_msglog(build("*** Starting XFI_COST script.", char(0)))
;*******************************************************
;***** Fill out request for MM_POP_XFI_COST script *****
;*******************************************************
execute mm_declare_900348

Set req900348->qual[1]->segment_identifier = "ILC"
Set req900348->qual[1]->segment_version = "1"
Set req900348->qual[1]->action_flag = 1
Set req900348->qual[1]->process_flag = 1
Set req900348->qual[1]->contributor = oen_reply->MSH[1]->sending_application
Set req900348->qual[1]->location = trim(oen_reply->CD3[1]->location_id_codes[1]->location_id_codes)
Set req900348->qual[1]->item_identifier = oen_reply->CD1[1]->hosp_item_code[1]->item_ref_no
;Set req900348->qual[1]->cost = CNVTREAL(oen_reply->CD2[1]->order_cost_1)
;Set req900348->qual[1]->cost = CNVTREAL(oen_reply->CD2 [1]->leadtime_days_1) 
set req900348->qual[1]->cost = CNVTREAL(lowest_uom_cost)
;;The COST will be associated with whatever UOM is put here.
;;SURGINET IMPLEMENTATIONS--
;;The UOM passed here *must* be the BASE UOM (usually "Each", but not necessarily).
;;The BASE UOM is what is picked up by SurgiNet reports.
Set req900348->qual[1]->pkg_type_uom = oen_reply->CD2[1]->unit_of_measure_4
;Set req900348->qual[1]->pkg_type_conv = cnvtint(oen_reply->CD2[1]->conversion_factor_4)
;Set req900348->qual[1]->pkg_type_uom = oen_reply->CD2 [1]->unit_of_measure_1 
Set req900348->qual[1]->pkg_type_conv = cnvtint(oen_reply->CD2 [1]->conversion_factor_1) 
execute mm_pop_xfi_cost with replace( "REQUEST", "REQ900348"), replace( "REPLY", "REPLY900348" )
execute oencpm_msglog(build("*** REPLY900348 STATUS=", reply900348->status_data->status,char(0)))
execute oencpm_msglog(build("*** REPLY900348 TRANS ID=", reply900348->qual[1]->transaction_id,char(0)))

execute oencpm_msglog(build("*** Starting XFI_LOCATOR script.", char(0)))
;*******************************************************
;***** Fill out request for MM_POP_XFI_LOCATOR script *****
;*******************************************************
execute mm_declare_900320

Set req900320->qual[1]->segment_identifier = "ILL"
Set req900320->qual[1]->segment_version = "1"
Set req900320->qual[1]->process_flag = 1
Set req900320->qual[1]->action_flag = 1
Set req900320->qual[1]->contributor = oen_reply->MSH[1]->sending_application
Set req900320->qual[1]->item_identifier = oen_reply->CD1[1]->hosp_item_code->item_ref_no
If (oen_reply->CD3 [1]->location_id_codes [1]->location_id_codes>"") 
Set req900320->qual[1]->location = oen_reply->CD3[1]->location_id_codes[1]->location_id_codes
Endif
/***
2/27/2008 - New logic to replace Lawson 7 character locator with 
Cerner's display value.  The match is based on the display.
***/
If (oen_reply->CD3 [1]->bin_locations [1]->bin_locations>"")
declare locator_var = vc
declare contrib_source_var = f8
declare locator_disp_var = vc
Set contrib_source_var = uar_get_code_by("DISPLAY", 73, "LAWSON")
Set locator_var = oen_reply->CD3 [1]->bin_locations [1]->bin_locations 

Select into "nl:"
 cva.code_value, cv.display
from code_value_alias cva, code_value cv
plan cva
 where cva.alias = locator_var
  and cva.contributor_source_cd = contrib_source_var
  and cva.code_set = 220
join cv
 where cv.code_value=cva.code_value
detail
 locator_disp_var = cv.display
with maxrec=1

Set oen_reply->CD3 [1]->bin_locations [1]->bin_locations = ""
Set oen_reply->CD3 [1]->bin_locations [1]->bin_locations = locator_disp_var
Set req900320->qual[1]->locator = oen_reply->CD3[1]->bin_locations[1]->bin_locations
Endif


execute mm_pop_xfi_locator with replace( "REQUEST", "REQ900320"), replace( "REPLY", "REPLY900320" )
execute oencpm_msglog(build("*** REPLY900320 STATUS=", reply900320->status_data->status,char(0)))
execute oencpm_msglog(build("*** REPLY900320 TRANS ID=", reply900320->qual[1]->transaction_id,char(0)))

;Script success
set oenstatus->status = 1

;These messages don't need to go to the OEN_ROUTER.  Ignore them.
;set oenstatus->ignore = 1

#EXITSCRIPT

execute oencpm_msglog(build("*** End of MOD_OBJ_ITEM_MASTER_IN script.",char(0)))