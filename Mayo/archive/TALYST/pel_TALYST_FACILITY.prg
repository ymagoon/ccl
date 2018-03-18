/*****************************************************************************
        Program Name: TALYST_FACILITY.prg
*****************************************************************************/
 
 
 
;DROP PROGRAM   TALYST_TEST  GO
DROP PROGRAM   pel_TALYST_FACILITY GO
CREATE PROGRAM  pel_TALYST_FACILITY
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "facility display:" = ""
 
with OUTDEV, facility
 
DECLARE  P_CDM  =  VC
 
DECLARE  P_NDC  =  VC
 
DECLARE  P_QTY  =  VC
 
declare qty1 = vc
 
declare cr_qty = vc
 
declare tempstring = vc
 
DECLARE  P_FIN  =  VC
 
DECLARE  P_DESCRIPTION  =  VC
 
DECLARE  ADD_LOCATION  =  VC
 
DECLARE  ADD_FACILITY  =  VC
 
DECLARE  ADD_ENC_TYPE  =  VC
 
DECLARE  P_VOLUME  =  VC
 
DECLARE  P_VOLUME_UNIT  =  VC
 
DECLARE  P_DATE_TIME  =  VC
 
DECLARE  P_STRENGTH  =  VC
 
DECLARE  P_STRENGTH_UNIT  =  VC
 
;DECLARE  FACILITY  =  VC
 
DECLARE  FACILITY_CD  =  F8
 
record facility (
1 facility_cd = f8
1 facility_name = vc
)
 
 
 
 
 
 
 
SELECT  INTO  "nl:"
FROM ( CODE_VALUE  CV )
 
WHERE (CV.CODE_SET= 220 )
AND (CV.CDF_MEANING= "FACILITY" )
AND (CV.DISPLAY_KEY=  ( $FACILITY ))
 
DETAIL
facility-> FACILITY_CD =CV.CODE_VALUE,
facility-> facility_name = trim(cv.display)
 WITH  NOCOUNTER
 
call echo (build("fac:", facility-> facility_name))
 
SET  MAXSECS  =  0
 
IF ( ( VALIDATE ( ISODBC ,  0 )= 1 ) )
SET  MAXSECS  =  15
ENDIF
 
if (facility-> FACILITY_CD  = 24988864)
 
;pel IF ( ( CNVTUPPER ( $FACILITY )= "YYY" ) )
SET  ADD_LOCATION  =  CONCAT ( " ((E.LOC_NURSE_UNIT_CD+ 0 ) IN" ,
; " ( 55595694 ,93461619 , 55604185 , 55604484 ," ,
; " 55648009 , 55597321 , 55613265 , 55613473 , 55614317 , 55598061 , 55599764 , 55601384 ," ,
; " 55615271 , 55615098 , 55615743 , 55618089 , 55615870 , 55291950 , 55291992 ," ,
; " 55616912 , 55614607 , 55603426 , 55604581 , 55604759 , 55614917 , 55615938 ," ,
; " 55609283,55610560,55610426,55596662,55614192,55600638,55664363,", ;011
; " 55664244 , 55665075 , 55620049 ,  55602143 ))" )
 
 " (25049446, 24989265, 43350205, 24993165, 24993275, 24993378,",
 "  25049441, 24989259, 278713541, 24989252, 24989260, 25049444,",
 "  90720796, 187503710, 24989262, 24995061, 24993229, 222600887,",
 "  222601201, 24993132, 24993335, 24989266, 24989263, 24989254,",
 "  24989264, 24989255, 25049445, 26141606, 43350142, 429216854,",
 "  24989268, 24989256, 24989261, 24989271, 35356287 ))")
 
 
;SET  ADD_ENC_TYPE  =  CONCAT ( " ((E.ENCNTR_TYPE_CD+ 0 ) IN ( 309309 ," ,
; "309310 , 309311 , 309312 , 309313 , 309314 , 695122 , 22134731 , 18884493 ," ,
; " 21144552 , 36830015 , 36830016 , 37150773 , 46658716 , 52230296 , 85542475 )) " )
SET  ADD_ENC_TYPE  =  CONCAT ( " ((E.ENCNTR_TYPE_CD+ 0 ) IN ( " ,
       "309312, 26160276,309309, 3990510, 309311)) " )
 
;SET  ADD_FACILITY  =  build(" ((E.LOC_FACILITY_CD+ 0 )= ", facility-> FACILITY_CD," )" )
 
else
   set ADD_ENC_TYPE = "1=1"
   SET  ADD_LOCATION  = "1=1"
;   SET  ADD_FACILITY  = "1=1"
 
 
endif
SET  ADD_FACILITY  =  build(" ((E.LOC_FACILITY_CD+ 0 )= ", facility-> FACILITY_CD," )" )
declare dt_tm = dq8
 
set dt_tm = cnvtdatetime(curdate, curtime)
 
declare printfile = vc
 
if ((cnvtupper($outdev) = "MINE"))
set printfile = build (trim(facility->facility_name,4),"_talyst_",trim(format(dt_tm, "YYYYMMDD;;d")),".txt")
;set printfile = build (facility->facility_name,"_talyst_hx_",trim(format(dt_tm, "YYYYMMDD;;d")),".txt") ;hx pre-load
else
set printfile = $outdev
endif
 
call echo (build("printfile:", printfile))
 
;SELECT  DISTINCT  INTO  $OUTDEV
SELECT  DISTINCT  INTO  value(printfile)
 
 
 CDM = SUBSTRING ( 1 ,  7 , M1.VALUE),
 NDC = SUBSTRING ( 1 ,  20 , M2.VALUE),
 QTY1 = ph.charge_qty,
 CR_QTY = build("-",cnvtstring(ph.credit_qty)), ;010
 FIN = SUBSTRING ( 1 ,  8 , EA.ALIAS),
 DESCRIPTION =O.HNA_ORDER_MNEMONIC,
 VOLUME =OI.VOLUME,
 VOLUME_UNIT = UAR_GET_CODE_DISPLAY (OI.VOLUME_UNIT),
 DATE_TIME = FORMAT (DH.DISPENSE_DT_TM,  "mm/dd/yyyy HH:MM" ),
 STRENGTH =OI.STRENGTH,
 STRENGTH_UNIT = UAR_GET_CODE_DISPLAY (OI.STRENGTH_UNIT),
 ;UNIQUE_ID = build(cnvtstring(dh.dispense_hx_id),"-",cnvtstring(oi.catalog_cd)) ;audit trail
 UNIQUE_ID= concat(trim(cnvtstring(ph.dispense_hx_id)),"-",
 					trim(cnvtstring(ph.ingred_sequence)),"-",
 					trim(cnvtstring(ph.item_id)),"-",
 					trim(cnvtstring(ph.tnf_id)))
FROM ( ENCOUNTER  E ),
( ORDERS  O ),
( ORDER_INGREDIENT  OI ),
( DISPENSE_HX  DH ),
( PROD_DISPENSE_HX  PH ),
( MED_IDENTIFIER  M1 ),
( MED_IDENTIFIER  M2 ),
( ENCNTR_ALIAS  EA )
 PLAN ( DH
;;WHERE (DH.DISPENSE_DT_TM BETWEEN  CNVTDATETIME (curdate-1, 0 ) AND  CNVTDATETIME (
WHERE (DH.UPDT_DT_TM BETWEEN
;;CNVTDATETIME (cnvtdate(01012012),0) ;(curdate-1, 0 )
;;AND  CNVTDATETIME ( curdate-1, 235959 )))
CNVTDATETIME (cnvtdate(03122012),0) ;(curdate-1, 0 )
AND  CNVTDATETIME (cnvtdate(03122012), 235959 )))
;CNVTDATETIME ("01-JAN-2010 0000" ) AND  CNVTDATETIME ( "26-JAN-2010 0000" )))
 AND ( O
WHERE (DH.ORDER_ID=O.ORDER_ID) AND ((O.CATALOG_TYPE_CD+ 0 )= 2516 ))
 AND ( OI
WHERE (OI.ORDER_ID=O.ORDER_ID))
 AND ( E
WHERE (O.ENCNTR_ID=E.ENCNTR_ID) AND
 PARSER ( ADD_ENC_TYPE ) ;enter encounter types to include inpat, outpat
AND  PARSER ( ADD_FACILITY )
AND  PARSER ( ADD_LOCATION )) ; filter any specific locations
 AND ( EA
WHERE (EA.ENCNTR_ID=E.ENCNTR_ID) AND (EA.ENCNTR_ALIAS_TYPE_CD= 1077 ) ;fin#
AND (EA.ACTIVE_IND= 1 ))
 AND ( PH
WHERE (PH.DISPENSE_HX_ID=DH.DISPENSE_HX_ID)
AND (( ph.charge_qty > 0 ) or ( ph.credit_qty > 0 ))) ;007
 AND ( M1
WHERE (M1.ITEM_ID=PH.ITEM_ID) AND (M1.MED_IDENTIFIER_TYPE_CD= 3096 ) AND (M1.ACTIVE_IND= 1 ) AND (
M1.PRIMARY_IND= 1 ))
 AND ( M2
WHERE (M2.ITEM_ID=PH.ITEM_ID) AND (M2.MED_IDENTIFIER_TYPE_CD= 3104 ) AND (M2.ACTIVE_IND= 1 )
 and  m2.med_product_id =  pH.med_product_id ; pel
AND (M2.PRIMARY_IND= 1 ))
 
ORDER BY  FIN  DESC ,
 CDM
 
HEAD REPORT
 COL  0 ,
 "CDM     |" ,
 COL + 1 ,
 "NDC                   |" ,
 COL + 1 ,
 "QTY           |" ,
 COL + 1 ,
 "FIN      |" ,
 COL + 1 ,
 "DESCRIPTION      |" ,
 COL + 1 ,
 "VOLUME       |" ,
 COL + 1 ,
 "VOLUME_UNIT|" ,
 COL + 1 ,
 "DATE_TIME    |" ,
 COL + 1 ,
 "STRENGTH       |" ,
 COL + 1 ,
 "STRENGTH_UNIT       |"
  , COL + 1 ,
 "UNIQUE_ID       |"  ;002
HEAD  FIN
 ROW + 0
DETAIL
;call echo (build("unique_id:", ph.prod_dispense_hx_id))
;call echo (build("ph.charge_qty:", ph.charge_qty))
;call echo (build("ph.credit_qty:", ph.credit_qty))
 
tempstring="",
if ((ph.charge_qty > 0 )) ;010
tempstring = cnvtstring(ph.charge_qty,12,2)
elseif ((ph.credit_qty > 0 ))
tempstring = build("-",cnvtstring(ph.credit_qty,12,2))
endif,
 
qty = tempstring
 
;call echo (build("qty:", qty))
 
 ROW + 1 ,
 COL  0 ,
 CDM ,
 COL + 1 ,
 "|" ,
 COL + 1 ,
 NDC ,
 COL + 1 ,
 "|" ,
 COL + 1 ,
 TEMPSTRING ,
 COL + 1 ,
 "|" ,
 COL + 1 ,
 FIN ,
 COL + 1 ,
 "|" ,
 COL + 1 ,
 DESCRIPTION ,
 COL + 1 ,
 "|" ,
 COL + 1 ,
 VOLUME ,
 COL + 1 ,
 "|" ,
 COL + 1 ,
 VOLUME_UNIT ,
 COL + 1 ,
 "|" ,
 COL + 1 ,
 DATE_TIME ,
 COL + 1 ,
 "|" ,
 COL + 1 ,
 STRENGTH ,
 COL + 1 ,
 "|" ,
 COL + 1 ,
 STRENGTH_UNIT ,
 COL + 1 ,
 "|"
 , COL + 1 ,
 UNIQUE_ID , ;002
 COL + 1 ,
 "|"
 WITH  MAXCOL = 2000 , maxrow = 5000, NOCOUNTER , SEPARATOR = " " , COMPRESS
 
 
SET  LAST_MOD  =  "012 - 01/18/10"
 END GO
 
 
