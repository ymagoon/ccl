drop program 1_lm_eth_tdm_lh_bl_os go
create program 1_lm_eth_tdm_lh_bl_os
 
 
 
/*******************************************************************
 
Report Name:  Luther, Chippewa Valley, Oakridge TDM
Report Path:  /mayo/mhspd/prg/1_lm_eth_barron_tdm.prg
Report Description:  Prints to Luther, Chippewa Valley, Oakridge pharmacy.
Displays patients with TDM/WARF/etc.
 
Created by:  Eric Hendrickson
Created date:  11/2005
 
Modified by:	Mary Wiersgalla
Modified date:	09/30/2010
Modifications:	CAB 21126: Add new nursing units in the new hospital (Luther).
 
Modified by:
Modified date:
Modifications:
 
*******************************************************************/
 
 prompt
	"Output to File/Printer/MINE" = "MINE"
 
with OUTDEV
 
 
;SET MaxSecs = 1800
 
SELECT INTO $OUTDEV
	E_LOC_NURSE_UNIT_DISP = UAR_GET_CODE_DISPLAY( E.LOC_NURSE_UNIT_CD )
	, P.NAME_FULL_FORMATTED
	, E_LOC_ROOM_DISP = UAR_GET_CODE_DISPLAY( E.LOC_ROOM_CD )
	, O.ORDER_ID
	, O_ORDER_STATUS_DISP = UAR_GET_CODE_DISPLAY( O.ORDER_STATUS_CD )
	, O_CATALOG_DISP = UAR_GET_CODE_DISPLAY( O.CATALOG_CD )
	, EA.ALIAS
	, OD.OE_FIELD_MEANING
	, OD.OE_FIELD_DISPLAY_VALUE
	, OD.ACTION_SEQUENCE
 
FROM
	ORDERS   O
	, PERSON   P
	, ENCOUNTER   E
	, ENCNTR_ALIAS   EA
	, ORDER_DETAIL   OD
 
PLAN O
; 7264768 = TDM, 7264775 = WARF, 7264790 = WARF, 2921326 = Amikacin, 2921532 = Gentamicin,
; 2921796 = Tobramycin, 2921843 = Vancomycin, 2748946 = Amikacin, 2758928 = Gentamicin,
; 2770186 = Tobramycin, 2770944 = Vancomycin, 2771189 = WARF, 281181565 = Dabigatran
WHERE O.CATALOG_CD in ( 7264768, 7264775, 7264790, 2921326, 2921532,
2921796, 2921843, 2748946, 2758928, 2770186, 2770944, 2771189, 281181565)
  ; 2550 = Ordered
  AND O.ORDER_STATUS_CD = 2550
  AND O.ACTIVE_IND = 1
JOIN P
WHERE O.PERSON_ID = P.PERSON_ID
JOIN E
WHERE O.ENCNTR_ID = E.ENCNTR_ID
;  AND E.loc_facility_cd = 3196527
  AND E.loc_nurse_unit_cd  in (683731, 28026680, 28026679, 2867129, 3186602, 3186600, 3186603, 3186634,
  3186681, 7284841, 10697808, 3186645, 3186674, 43199228, 11004055, 11003800, 11906847,
  172225126, 172223946, 172222695, 172221055, 177886319, 177893453, 177890657, 179653105, 177894544, 177892486,
  3186524)
 
  AND E.DISCH_DT_TM = null
JOIN EA
WHERE O.ENCNTR_ID = EA.ENCNTR_ID
   ; 683992 = FIN
  AND EA.ALIAS_POOL_CD = 683992
  AND EA.ACTIVE_IND = 1
JOIN OD
WHERE OUTERJOIN(O.ORDER_ID) = OD.ORDER_ID
  AND OD.OE_FIELD_MEANING = outerjoin("FREETXTDOSE")
  AND OD.ACTION_SEQUENCE = OUTERJOIN(o.last_action_sequence)
 
ORDER BY
	E_LOC_NURSE_UNIT_DISP
	, O.CATALOG_CD
	, P.NAME_FULL_FORMATTED
 
Head Report
	m_NumLines = 0
%I cclsource:vccl_diortf.inc
	y_pos = 18
SUBROUTINE OFFSET( yVal )
	CALL PRINT( FORMAT( y_pos + yVal, "###" ))
END
 
Head Page
	y_pos = 36
	ROW + 1, "{F/5}{CPI/11}"
	CALL PRINT(CALCPOS(125,y_pos+0)) "TDM / WARF / Amikacin / Gentamicin / Tobramycin / Vancomycin / Dabigatran - Pharmacist"
	ROW + 1, "{F/1}{CPI/14}"
	CALL PRINT(CALCPOS(270,y_pos+12)) curdate
	y_pos = y_pos + 25
 
Head E_LOC_NURSE_UNIT_DISP
	ROW + 1, "{F/1}{CPI/14}"
	CALL PRINT(CALCPOS(20,y_pos+0)) E_LOC_NURSE_UNIT_DISP
	ROW + 1
	CALL PRINT(CALCPOS(36,y_pos+24)) "Name"
	CALL PRINT(CALCPOS(216,y_pos+23)) "FIN Number"
	CALL PRINT(CALCPOS(288,y_pos+23)) "Person Room"
	CALL PRINT(CALCPOS(360,y_pos+23)) "Catalog Desc"
	ROW + 1
	y_pos = y_pos + 47
 
Head P.NAME_FULL_FORMATTED
	ROW + 1, "{F/0}{CPI/14}"
	CALL cclrtf_print( 0, 36, 0, 30, P.NAME_FULL_FORMATTED, 100, 1 )
 
	y_pos = y_pos + (m_NumLines * 12)
 
	ROW + 1
 
Detail
	if (( y_pos + 67) >= 792 ) y_pos = 0,  break endif
	ALIAS1 = SUBSTRING( 1, 10, EA.ALIAS ),
	E_LOC_ROOM_DISP1 = SUBSTRING( 1, 6, E_LOC_ROOM_DISP ),
	ROW + 1, "{F/0}{CPI/14}"
	CALL PRINT(CALCPOS(72,y_pos+0)) O.ORDER_ID
	CALL PRINT(CALCPOS(216,y_pos+0)) ALIAS1
	CALL PRINT(CALCPOS(288,y_pos+0)) E_LOC_ROOM_DISP1
	CALL PRINT(CALCPOS(361,y_pos+0)) O_CATALOG_DISP
	ROW + 1
	CALL PRINT(CALCPOS(88,y_pos+8))	OD.OE_FIELD_DISPLAY_VALUE
	y_pos = y_pos + 25
 
Foot P.NAME_FULL_FORMATTED
	y_pos = y_pos + 0
 
Foot E_LOC_NURSE_UNIT_DISP
	BREAK
 
Foot Report
	if (( y_pos + 64) >= 792 ) y_pos = 0 break
	else y_pos = y_pos + 36 endif
	ROW + 1, "{F/5}{CPI/11}"
	CALL PRINT(CALCPOS(130,y_pos+0)) "End TDM / WARF / Amikacin / Gentamicin / Tobramycin / Vancomycin / Dabigatran - Pharmacist"
 
WITH MAXCOL = 300, MAXROW = 500, DIO= 08, NOHEADING, FORMAT= VARIABLE ;, TIME= VALUE( MaxSecs )
 
END
GO
 
 
 
