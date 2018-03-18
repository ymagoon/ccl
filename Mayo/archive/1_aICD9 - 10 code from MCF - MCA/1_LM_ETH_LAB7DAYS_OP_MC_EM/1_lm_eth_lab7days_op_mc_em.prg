 
/********************************************************************
Report Name:  EU Lab Downtime Report - Clinic					  			(Explorer Menu)
Report Path:  /mayo/mhspd/prg/1_LM_ETH_LAB7DAYS_OP_MC_EM
Report Description: This report is used for lab downtimes and
				displays patients that have future lab orders, dated
				14 days previous and 14 days future.
				This report is also ftp'ed to a PC in the lab
				through a separate ops job.
 
Created by:  	Eric Hendrickson
Created date:  	06/2005
 
Modified by:	Mary Wiersgalla
Modified date:	10/2006
Modifications:	Reports separated by facility (LH, BA, OS, BL)
				Include encounter types of Emergency Medicine, Observation
				Transitional Care, Transitional Care - OS
 
Modified by:	Lisa Sword
Modified date:	10/2008
Modifications:	Updated to include asyst non-hospital based encounter types
				And only pull orders that have EU as the primary assigned location
 
Modified by:
Modified date:
Modifications:
 
********************************************************************/
 
drop program 1_LM_ETH_LAB7DAYS_OP_MC_EM go
create program 1_LM_ETH_LAB7DAYS_OP_MC_EM
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	with OUTDEV
 
DECLARE MRN_VAR = F8
SET MRN_VAR = UAR_GET_CODE_BY("MEANING", 4, "MRN")
 
SET MaxSecs = 500
 
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
 
FROM
	ORDERS   O
	, PERSON   P
	, PERSON   P1
	, PERSON_ALIAS   PA
	, ENCOUNTER   E
	, NOMEN_ENTITY_RELTN   NE
	, NOMENCLATURE   N
	, ORDER_DETAIL   OD
	, PRSNL_ALIAS   PAL
	, PRSNL   PR
	, CODE_VALUE   CV1
 
PLAN O
WHERE  O.ORDER_STATUS_CD = 2546  				;get only future orders
	and O.CURRENT_START_DT_TM BETWEEN cnvtdatetime(curdate-14,0) and cnvtdatetime(curdate+14,0) ; +/- 14 days
JOIN P
WHERE  P.PERSON_ID = O.PERSON_ID
 
JOIN OD
WHERE O.ORDER_ID = OD.ORDER_ID
  AND OD.OE_FIELD_MEANING="COLLPRI" ;get colection priority, IE. routine, timed, etc.
 
JOIN E
WHERE E.ENCNTR_ID = O.ENCNTR_ID
 
AND E.ENCNTR_TYPE_CD NOT IN
	(309311,						;Day Surgery
	3990510,						;Emergency
	309309,							;Hospital Outpatient
	26160276,						;Hospital Recurring Outpatient
	309308,							;Inpatient
	309312,							;Observation
	3990508,						;Organ Donor
	309313,							;Preadmit
	309314, 						;Recurring
	3990511	,						;Respite Care
	24987150, 						;Swing Bed
	10947271)						;Transitional Care
 
JOIN NE
WHERE NE.PARENT_ENTITY_NAME = "ORDERS" 			;pull the diagnosis for a particular order
  AND NE.PARENT_ENTITY_ID = O.ORDER_ID
 
JOIN N
WHERE N.NOMENCLATURE_ID = NE.NOMENCLATURE_ID 	;pull the name of the diagnosis
 
JOIN PA
WHERE P.PERSON_ID = PA.PERSON_ID
  AND PA.PERSON_ALIAS_TYPE_CD = MRN_VAR
  AND PA.ACTIVE_IND = 1
 
JOIN P1
WHERE O.LAST_UPDATE_PROVIDER_ID = P1.PERSON_ID
 
JOIN PAL
WHERE P1.PERSON_ID = PAL.PERSON_ID
  AND PAL.ALIAS_POOL_CD = 4530509  				;pull the cycare provider number
  AND PAL.ACTIVE_IND = 1
 
JOIN PR
WHERE pr.person_id = PAL.person_id
 
JOIN CV1
WHERE PR.PRIM_ASSIGN_LOC_CD = CV1.CODE_VALUE
AND CV1.DESCRIPTION = "EU*"							;pull EU providers only,
										;future orders are not linked to an encounter, no location cd available
 
 
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
	CALL PRINT(CALCPOS(120,y_pos+11)) "{U}Future Lab Orders - LM Clinics, dated +/- 14 days  {ENDU}"
	ROW + 1
	ROW + 1, "{F/9}{CPI/9}"
	ROW + 1, CALL PRINT(CALCPOS(270,y_pos+40)) curdate
	ROW + 1
	y_pos = y_pos + 56
 
Head P.NAME_FULL_FORMATTED
	if (( y_pos + 146) >= 792 ) y_pos = 0,  break endif
	ROW + 1, "{F/1}{CPI/14}"
	CALL PRINT(CALCPOS(36,y_pos+11)) "Name"
	CALL PRINT(CALCPOS(216,y_pos+11)) "Birthdate"
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
	CALL PRINT(CALCPOS(414,y_pos+47)) "Provider #"
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
	CALL PRINT(CALCPOS(20,y_pos+14)) "Diagnosis:"
	CALL PRINT(CALCPOS(90,y_pos+14)) N.SOURCE_IDENTIFIER
 
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
 
WITH MAXCOL = 300, MAXROW = 500, DIO = 08, NOHEADING, FORMAT= VARIABLE, TIME= VALUE( MaxSecs )
 
 
END
	go
