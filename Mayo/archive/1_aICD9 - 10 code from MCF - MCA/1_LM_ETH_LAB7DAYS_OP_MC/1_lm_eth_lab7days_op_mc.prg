/*******************************************************************
 
Report Name:  Clinics Downtime Lab
Report Path:  /mayo/mhspd/prg/1_lm_eth_lab7days_op_mc.prg
Report Description:  This report is used for lab downtimes and
						displays patients that have open lab orders
						for the previous and future 7 days.
						The file is FTP'd to a PC in Lab.
 
Created by:  Eric Hendrickson
Created date:  11/2005
 
Modified by:
Modified date:
Modifications:
 
Modified by:
Modified date:
Modifications:
 
*******************************************************************/
 
 
drop program 1_lm_eth_lab7days_op_mc go
create program 1_lm_eth_lab7days_op_mc
 
 
prompt
	"Output to File/Printer/MINE" = "MINE"
 
 
with OUTDEV
 
 
 
DECLARE MRN_VAR = F8
SET MRN_VAR = UAR_GET_CODE_BY("MEANING", 4, "MRN")
 
 
 
SELECT DISTINCT INTO $OUTDEV
	P.NAME_FULL_FORMATTED
	, P1.NAME_FULL_FORMATTED
	, O_CATALOG_CDF = UAR_GET_CODE_MEANING( O.CATALOG_CD )
	, O.CATALOG_CD
	, O_CATALOG_DISP = UAR_GET_CODE_DISPLAY( O.CATALOG_CD )
	, O.ORDER_ID
	, O.ORIG_ORDER_DT_TM
	, P.BIRTH_DT_TM
	, O.CURRENT_START_DT_TM
	, PA_PERSON_ALIAS_TYPE_CDF = UAR_GET_CODE_MEANING( PA.PERSON_ALIAS_TYPE_CD )
	, PA.PERSON_ALIAS_TYPE_CD
	, PA_PERSON_ALIAS_TYPE_DISP = UAR_GET_CODE_DISPLAY( PA.PERSON_ALIAS_TYPE_CD )
	, PA.PERSON_ALIAS_ID
	, NE.NOMENCLATURE_ID
	, N.SOURCE_STRING
	, N.SOURCE_IDENTIFIER
	, OD.OE_FIELD_DISPLAY_VALUE
	, PAL.ALIAS
	, PAL.ALIAS_POOL_CD
	, O.ORDER_MNEMONIC
	, O_ORDER_STATUS_DISP = UAR_GET_CODE_MEANING( o.order_status_cd )
	, od2.oe_field_display_value
 
FROM
	ORDERS   O
	, PERSON   P
	, PERSON   P1
	, PERSON_ALIAS   PA
	;, ENCOUNTER   E
	, DUMMYT D1
	, NOMEN_ENTITY_RELTN   NE
	, NOMENCLATURE   N
	, ORDER_DETAIL   OD
	, PRSNL_ALIAS   PAL
	, PRSNL   PR
	, DUMMYT D3
	, ORDER_DETAIL OD2
 
PLAN O
; 2546 = Future
WHERE  O.ORDER_STATUS_CD = 2546 and O.CURRENT_START_DT_TM
    BETWEEN cnvtdatetime(curdate-14,0) and cnvtdatetime(curdate+14,0)
 
JOIN P
WHERE  P.PERSON_ID = O.PERSON_ID
 
JOIN OD
WHERE O.ORDER_ID = OD.ORDER_ID
   ; collection priority
  AND OD.OE_FIELD_MEANING="COLLPRI"
 
JOIN PA
WHERE P.PERSON_ID = PA.PERSON_ID
  AND PA.PERSON_ALIAS_TYPE_CD = MRN_VAR
  AND PA.ACTIVE_IND = 1
 
JOIN P1
WHERE O.LAST_UPDATE_PROVIDER_ID = P1.PERSON_ID
 
JOIN PAL
WHERE P1.PERSON_ID = PAL.PERSON_ID
  ; 4530509 = Cycare #
  AND PAL.ALIAS_POOL_CD = 4530509
  AND PAL.ACTIVE_IND = 1
 
JOIN PR
WHERE pr.person_id = PAL.person_id
 
JOIN D3
JOIN OD2
WHERE O.order_id = OD2.order_id
AND OD2.oe_field_meaning = "ICD9"
 
 
;JOIN E
;WHERE E.ENCNTR_ID = O.ENCNTR_ID
 
/*AND E.ENCNTR_TYPE_CD IN
	(10579519,	;Clinic Outpatient
	26160275,	;Clinic Recurring Outpatient
	7136874)	;Lab/Rad Only
	)	; Clinic
*/
 
JOIN D1
JOIN NE
; diagnosis
WHERE NE.PARENT_ENTITY_NAME = "ORDERS"
  AND NE.PARENT_ENTITY_ID = O.ORDER_ID
 
JOIN N
; name of diagnosis
WHERE N.NOMENCLATURE_ID = NE.NOMENCLATURE_ID
 
 
ORDER BY
	P.NAME_FULL_FORMATTED
	, O.ORIG_ORDER_DT_TM
 
 
 
Head Report
	m_NumLines = 0
%I cclsource:vccl_diortf.inc
	y_pos = 18
SUBROUTINE OFFSET( yVal )
	CALL PRINT( FORMAT( y_pos + yVal, "###" ))
END
	count = 0
 
Head Page
	if (curpage > 1)  y_pos = 10 endif
	"{F/0}{CPI/14}"
	count = count + 1
	ROW + 1, "{F/9}{CPI/7}"
	CALL PRINT(CALCPOS(176,y_pos+11)) "{U}Future Orders for +/- 14 days{ENDU}"
	ROW + 1
	ROW + 1, "{F/9}{CPI/9}"
	CALL PRINT(CALCPOS(260,y_pos+25)) "{U}Outpatient{ENDU}"
	ROW + 1
	ROW + 1, "{F/0}{CPI/14}"
	ROW + 1, CALL PRINT(CALCPOS(270,y_pos+37)) curdate
	ROW + 1
	y_pos = y_pos + 51
 
Head P.NAME_FULL_FORMATTED
	if (( y_pos + 146) >= 792 ) y_pos = 0,  break endif
	ROW + 1, "{F/1}{CPI/14}"
	CALL PRINT(CALCPOS(36,y_pos+11)) "Name"
	CALL PRINT(CALCPOS(216,y_pos+11)) "Birth Date"
	CALL PRINT(CALCPOS(360,y_pos+11)) "Clinic MRN"
	ROW + 1
	NAME_FULL_FORMATTED1 = SUBSTRING( 1, 30, P.NAME_FULL_FORMATTED ),
	ALIAS1 = SUBSTRING( 1, 10, PA.ALIAS ),
	ROW + 1, "{F/0}"
	CALL PRINT(CALCPOS(36,y_pos+29)) NAME_FULL_FORMATTED1
	CALL PRINT(CALCPOS(216,y_pos+29)) P.BIRTH_DT_TM
	CALL PRINT(CALCPOS(360,y_pos+29)) ALIAS1
	ROW + 1
	ROW + 1, "{F/1}"
	CALL PRINT(CALCPOS(54,y_pos+47)) "F.O. Date"
	CALL PRINT(CALCPOS(108,y_pos+47)) "Order ID"
	CALL PRINT(CALCPOS(198,y_pos+47)) "Order Mnemonic"
	CALL PRINT(CALCPOS(414,y_pos+47)) "Provider"
	ROW + 1
	y_pos = y_pos + 59
 
Detail
	if (( y_pos + 133) >= 792 ) y_pos = 0,  break endif
	OE_FIELD_DISPLAY_VALUE1 = SUBSTRING( 1, 5, OD.OE_FIELD_DISPLAY_VALUE ),
	ALIAS2 = SUBSTRING( 1, 20, PAL.ALIAS ),
	ROW + 1, "{F/0}{CPI/14}"
	CALL PRINT(CALCPOS(20,y_pos+5)) OE_FIELD_DISPLAY_VALUE1
	CALL PRINT(CALCPOS(54,y_pos+5)) O.CURRENT_START_DT_TM
	CALL PRINT(CALCPOS(90,y_pos+5)) O.ORDER_ID
	CALL PRINT(CALCPOS(198,y_pos+5)) O_CATALOG_DISP
	CALL PRINT(CALCPOS(414,y_pos+5)) ALIAS2
	ROW + 1
	CALL PRINT(CALCPOS(72,y_pos+14)) "Diagnosis:"
	;CALL PRINT(CALCPOS(150,y_pos+14)) N.SOURCE_STRING
	;ROW + 1,
	CALL PRINT(CALCPOS(150,y_pos+14)) OD2.oe_field_display_value
	ROW + 1, "{F/0}{CPI/20}"
	CALL PRINT(CALCPOS(72,y_pos+23)) "Order Status:"
	CALL PRINT(CALCPOS(150,y_pos+23)) O_ORDER_STATUS_DISP
	y_pos = y_pos + 32
 
Foot P.NAME_FULL_FORMATTED
	if (( y_pos + 66) >= 792 ) y_pos = 0,  break endif
 
	ROW + 1	y_val= 792-y_pos-21
	^{PS/newpath 1 setlinewidth   20 ^, y_val, ^ moveto  590 ^, y_val, ^ lineto stroke 20 ^, y_val, ^ moveto/}^
	y_pos = y_pos + 12
 
Foot Page
	y_pos = 726
	ROW + 1, "{F/0}{CPI/14}"
	ROW + 1, CALL PRINT(CALCPOS(270,y_pos+11)) count
 
 
 
WITH MAXCOL = 300, MAXROW = 10000 , DIO = 08, NOHEADING, FORMAT= VARIABLE, OUTERJOIND = D1, OUTERJOIND = D3
 
 
END
GO
