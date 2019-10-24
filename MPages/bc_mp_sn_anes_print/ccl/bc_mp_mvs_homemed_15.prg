drop program bc_mp_mvs_homemed_15:dba go
create program bc_mp_mvs_homemed_15:dba
/**************************************************************************************************
              Purpose: Displays Active Home Medications Orders in the ED MPage
     Source File Name: bc_mp_mvs_homemed_15.PRG
              Analyst: MediView Solutions
          Application: FirstNet
  Execution Locations: FirstNet
            Request #: 
      Translated From: 
        Special Notes:
**************************************************************************************************/
/**************************************************************************************************
  Mod  Date            Engineer                Description
   ---  --------------- ----------------------- ------------------------------------------------
    1   06/09/2011      MediView Solutions 	    Initial Release
    2   mm/dd/yyyy      Engineer Name           Initial Release
	3 	mm/dd/yyyy      FirstName LastName      Comments for first modification

**************************************************************************************************/

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "USERID" = 0
	, "PERSONID" = 0
	, "ENCNTRID" = 0
	, "OPTIONS" = "" 

with OUTDEV, USERID, PERSONID, ENCNTRID, OPTIONS

DECLARE rx_6000_cv			= f8 WITH public, constant(uar_get_code_by("DISPLAYKEY",6000,"PHARMACY"))
DECLARE ordSTAT_6004_cv		= f8 WITH public, constant(uar_get_code_by("DISPLAYKEY",6004,"ORDERED"))
 
DECLARE active_48_cv		= f8 WITH public, CONSTANT(uar_get_code_by("DISPLAYKEY",48,"ACTIVE"))

RECORD HOMEMED (
     1  o_cnt				= i4
	 1  hxmeds [*]
	    2  order_id 		= f8
	    2  type_flag		= i2
		2  ord_mnem			= vc
		2  order_as_mnem	= vc
		2  orig_dt_tm		= vc
		2  cdl				= vc
	   ;2  sig				= vc ; not used in prg 
		2  strngth_dose		= vc
		2  volume_dose		= vc
		2  route 			= vc
		2  freq	 			= vc
		2  ord_status		= f8
		2  ord_cmt 			= c500
		2  disp_qty			= vc
		2  req_strt_dt_tm	= vc
		2  prn				= i2
		2  prn_instruc		= vc
		2  ln_cnt 			= i4
		2  lns[*]
		   3 line 			= vc
)

SELECT INTO "NL:"
FROM
  orders o
  ,order_detail od
 
PLAN o
 
WHERE o.person_id = $PERSONID
  AND o.order_status_cd = ordSTAT_6004_cv
  AND o.catalog_type_cd = rx_6000_cv
  AND o.template_order_id = 0
  AND o.orig_ord_as_flag IN (
   1.00		;Prescription/Discharge Order
   ,2.00	;Recorded / Home Meds
  )
 
JOIN od WHERE od.order_id = o.order_id
 
ORDER BY o.orig_ord_as_flag desc,o.order_id,od.detail_sequence,od.action_sequence desc
 
HEAD REPORT
ocnt = 0
STAT = ALTERLIST(HOMEMED->hxmeds,10)
 
HEAD o.orig_ord_as_flag
 
ROW + 0
 
HEAD o.order_id
 
  ;increment count of orders
  ocnt = ocnt + 1
 
  ;check for available memory in the orders list
  IF(MOD(ocnt,10) = 1 AND ocnt > 10)
    STAT = ALTERLIST(HOMEMED->hxmeds, ocnt+9)
  ENDIF
 
  HOMEMED->hxmeds[ocnt].ORDER_ID 		= o.order_id
  HOMEMED->hxmeds[ocnt].type_flag		= o.orig_ord_as_flag
  HOMEMED->hxmeds[ocnt].ord_mnem		= o.order_mnemonic
  HOMEMED->hxmeds[ocnt].order_as_mnem	= o.ordered_as_mnemonic
  HOMEMED->hxmeds[ocnt].orig_dt_tm	= FORMAT(o.orig_order_dt_tm, "MM/DD/YYYY HH:MM;;D")
  HOMEMED->hxmeds[ocnt].ord_status	= o.order_status_cd
  HOMEMED->hxmeds[ocnt].cdl			= SUBSTRING(1,100,o.clinical_display_line)
 
HEAD od.detail_sequence
 
ROW + 0
 
HEAD od.action_sequence
 
ROW + 0
 
DETAIL
 
  IF (TRIM(OD.oe_field_meaning,3) = "STRENGTHDOSE")
	HOMEMED->hxmeds[ocnt].strngth_dose = od.oe_field_display_value
  ELSEIF (TRIM(OD.oe_field_meaning,3) = "STRENGTHDOSEUNIT")
	HOMEMED->hxmeds[ocnt].strngth_dose = CONCAT(TRIM(HOMEMED->hxmeds[ocnt].strngth_dose,3)," ", TRIM(od.oe_field_display_value,3))
  ELSEIF (TRIM(od.oe_field_meaning,3) = "VOLUMEDOSE")
   HOMEMED->hxmeds[ocnt].volume_dose = od.oe_field_display_value
  ELSEIF (TRIM(od.oe_field_meaning,3) = "VOLUMEDOSEUNIT")
   HOMEMED->hxmeds[ocnt].volume_dose = CONCAT(TRIM(HOMEMED->hxmeds[ocnt].volume_dose,3)," ", TRIM(od.oe_field_display_value,3))
  ELSEIF (TRIM(OD.oe_field_meaning,3) = "RXROUTE")
	HOMEMED->hxmeds[ocnt].route = SUBSTRING(1,20,od.oe_field_display_value)
  ELSEIF (TRIM(OD.oe_field_meaning,3) = "FREQ")
	HOMEMED->hxmeds[ocnt].freq = SUBSTRING(1,20,od.oe_field_display_value)
  ELSEIF (TRIM(OD.oe_field_meaning,3) = "DISPENSEQTY")
    HOMEMED->hxmeds[ocnt].disp_qty = od.oe_field_display_value
  ELSEIF (TRIM(OD.oe_field_meaning,3) = "DISPENSEQTYUNIT")
    HOMEMED->hxmeds[ocnt].disp_qty = CONCAT(TRIM(HOMEMED->hxmeds[ocnt].disp_qty,3)," ", TRIM(od.oe_field_display_value,3))
  ELSEIF (TRIM(OD.oe_field_meaning,3) = "REQSTARTDTTM")
    HOMEMED->hxmeds[ocnt].req_strt_dt_tm = FORMAT(od.oe_field_dt_tm_value,"MM/DD/YYYY HH:MM;;D") ; "mm/dd/yy;;d")
  ELSEIF (TRIM(OD.oe_field_meaning,3) = "SCH/PRN")
    IF(CNVTUPPER(od.oe_field_display_value) = "YES")
      HOMEMED->hxmeds[ocnt].prn = 1
    ELSE
      HOMEMED->hxmeds[ocnt].prn = 0
    ENDIF
  ELSEIF (TRIM(OD.oe_field_meaning,3) = "PRNINSTRUCTIONS")
    HOMEMED->hxmeds[ocnt].prn_instruc = TRIM(od.oe_field_display_value,3)
  ENDIF
 
FOOT REPORT
HOMEMED->o_cnt = ocnt
STAT = ALTERLIST(HOMEMED->hxmeds, ocnt)
 
WITH NOCOUNTER
  
call echojson(homemed, $OUTDEV)
end
go
