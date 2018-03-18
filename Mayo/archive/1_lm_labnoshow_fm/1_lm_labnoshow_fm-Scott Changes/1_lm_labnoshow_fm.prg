/*******************************************************************
 
Report Name:  Family Med, Express Care, FM PLanned Visit Lab No Show Reports
Report Path:  /mayo/mhprd/prg/1_lm_labnoshow_fm.prg
Report Description:  Displays all lab orders that are still in future status
						15 days or older.
						The reason Family Med is not integrated into
						the original no show report is because it will not
						print to that dept (fluke).  However, if it is hard-
						coded into the program it works.
 
Created by:  Eric Hendrickson
Created date:  06/2007
 
Modified by:  	Lisa Sword
Modified date:  06/2009
Modifications:	Family Med, Family Med Planed Visit, and Express Care West and
				South are hard coded to print to "PH1301" in this report. This
				functions differently than the general no show report. The array is not used.
				Added Family Med -MCC and -MCLC.
				Moved Family Med for MCLC to 1_lm_labnoshow_other.
				Moved express care to 1_lm_eth_noshow.prg. Separate printer from Fam Med
Modified date:	11/2009
Modifications:	Added exclusion of Lab SBAR orders. They will print on a separate report to Lab.
Modified date:	05/21/2010
Modifications: 	Added subquery to only pull latest location from order_detail.
				08/02/2010, changed location subquery to look at latest updt_cnt instead of updt_dt_tm.
				03/03/2011, changed location subquery to look at latest updt_cnt AND latest updt_dt_tm
				04/15/2011, changed location qualification and subquery to use field_id.
				02/23/2012, increased time-out from 1800 to 3000 seconds. report was failing.
 
Modified by:	Akcia - SE
Modified date:	04/26/12
Modifications:  changes for efficiency
Modification Num:  003
 
 
*******************************************************************/
 
drop program 1_lm_labnoshow_fm go
create program 1_lm_labnoshow_fm
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
 
with OUTDEV
 
DECLARE MRN_VAR = F8
DECLARE PHONE_VAR = F8
SET MRN_VAR = UAR_GET_CODE_BY("MEANING", 4, "MRN")
SET PHONE_VAR = UAR_GET_CODE_BY("MEANING", 43, "HOME")
 
declare start_date = dq8 with constant(cnvtlookbehind("15 D")) 		;003
declare end_date = dq8 with constant(cnvtlookahead("420 D"))		;003
call echo(format(start_date,"mm/dd/yy hh:mm;;d"))
call echo(format(end_date,"mm/dd/yy hh:mm;;d"))
 
 
SET MaxSecs = 3000
 ;***** change printer back to hard coded
;003 SELECT DISTINCT INTO PH1301
SELECT INTO $outdev  ;PH1301
	O_CATALOG_CDF = UAR_GET_CODE_MEANING( O.CATALOG_CD )
	, O.CATALOG_CD
	, O_CATALOG_DISP = UAR_GET_CODE_DISPLAY( O.CATALOG_CD )
	, O.ORDER_ID
	, O.ORIG_ORDER_DT_TM
	,od1.*
/*	, P.NAME_FULL_FORMATTED
	, P1.NAME_FULL_FORMATTED
	, P.BIRTH_DT_TM
	, O.CURRENT_START_DT_TM "@SHORTDATE4YR"
	, PA_PERSON_ALIAS_TYPE_CDF = UAR_GET_CODE_MEANING( PA.PERSON_ALIAS_TYPE_CD )
	, PA.PERSON_ALIAS_TYPE_CD
	, PA_PERSON_ALIAS_TYPE_DISP = UAR_GET_CODE_DISPLAY( PA.PERSON_ALIAS_TYPE_CD )
	, PA.PERSON_ALIAS_ID
	, NE.NOMENCLATURE_ID
	, N.SOURCE_STRING
	, OD.OE_FIELD_DISPLAY_VALUE
	, OD1.OE_FIELD_DISPLAY_VALUE
	, od2.oe_field_display_value
	, PH.PHONE_NUM
	, PH.PARENT_ENTITY_ID
	;, L.LONG_TEXT
 */
FROM
	ORDERS   O
	, PERSON   P
	, ORDER_DETAIL   OD
	, ORDER_DETAIL   OD1
/*	, PERSON   P1
	, PERSON_ALIAS   PA
	;, DUMMYT   D1
	, NOMEN_ENTITY_RELTN   NE
	, NOMENCLATURE   N
	, LONG_TEXT   L
	, ORDER_COMMENT   OC
	;, DUMMYT   D
	, PHONE   PH
	;, DUMMYT   D3
	, ORDER_DETAIL   OD2  */
 
PLAN O
WHERE  O.ORDER_STATUS_CD = 2546   								  ;2546 = Future
  AND O.dept_status_cd+0 !=    9312.00
  ;AND (O.CURRENT_START_DT_TM < cnvtlookbehind("15 D") or O.CURRENT_START_DT_TM > cnvtlookahead("420 D"))
  and O.CURRENT_START_DT_TM between cnvtdatetime(start_date) and cnvtdatetime(end_date)			;003
    								; orders 15 days or older, or in the future more than 420 days
  AND O.CATALOG_CD+0 NOT IN (93232878,93232886,93232892,93232897,93232904,93232909,
  						   93232915,93232920,93232925,93232930,93232936,93232941)  ;Lab SBAR Orders
 
JOIN P
WHERE  P.PERSON_ID = O.PERSON_ID
 
JOIN OD
WHERE O.ORDER_ID = OD.ORDER_ID
  ; collection priority
  AND OD.OE_FIELD_MEANING="COLLPRI"
 
JOIN OD1
; location field from OEF
WHERE O.ORDER_ID = OD1.ORDER_ID
  ;AND OD1.OE_FIELD_ID = 7441493		; changed from field meaning, to field_id. 4/15/2011
  ;AND OD1.UPDT_DT_TM				; changed max to look at field_id. 4/15/2011
  ;   IN (SELECT MAX(UPDT_DT_TM) FROM ORDER_DETAIL ODMAX2
  ;        WHERE OD1.ORDER_ID = ODMAX2.ORDER_ID and ODMAX2.OE_FIELD_ID = 7441493)
 
  ; for printing
;   AND (OD1.OE_FIELD_DISPLAY_VALUE = "Family Medicine"
;   OR   OD1.OE_FIELD_DISPLAY_VALUE = "Family Medicine - MCC"
;   OR   OD1.OE_FIELD_DISPLAY_VALUE = "Family Medicine Planned Visit Physical"
;   OR   OD1.OE_FIELD_DISPLAY_VALUE = "Family Medicine Planned Visit Phy - MCC"
;   OR   OD1.OE_FIELD_DISPLAY_VALUE = "Family Practice")
 with format,separator = " "/*
JOIN PA
WHERE P.PERSON_ID = PA.PERSON_ID
  AND PA.PERSON_ALIAS_TYPE_CD = MRN_VAR			; MRN
  and pa.end_effective_dt_tm > sysdate  		;003
  AND PA.ACTIVE_IND = 1
 
JOIN P1
WHERE O.LAST_UPDATE_PROVIDER_ID = P1.PERSON_ID
 
JOIN PH
WHERE PH.PARENT_ENTITY_ID = outerjoin(P.PERSON_ID)
  and ph.parent_entity_name = outerjoin("PERSON")			;003
  AND PH.PHONE_TYPE_CD = outerjoin(PHONE_VAR)				; home phone number only
  AND PH.ACTIVE_IND = outerjoin(1)
JOIN OC
WHERE OC.ORDER_ID = OUTERJOIN(O.ORDER_ID)
JOIN L
WHERE L.LONG_TEXT_ID = OUTERJOIN(OC.LONG_TEXT_ID)
 
;003 start
; JOIN D
; WHERE OC.LONG_TEXT_ID = L.LONG_TEXT_ID
 
 
JOIN OD2
WHERE OD2.order_id = outerjoin(O.order_id)
AND OD2.oe_field_meaning = outerjoin("ICD9")
 
 
JOIN NE											; diagnosis
WHERE NE.PARENT_ENTITY_NAME = outerjoin("ORDERS")
  AND NE.PARENT_ENTITY_ID = outerjoin(O.ORDER_ID)
JOIN N											; name of diagnosis
WHERE N.NOMENCLATURE_ID = outerjoin(NE.NOMENCLATURE_ID)
 
; JOIN D3
;JOIN OD2
;WHERE O.order_id = OD2.order_id
;AND OD2.oe_field_meaning = "ICD9"
;
; JOIN D1
;JOIN NE											; diagnosis
;WHERE NE.PARENT_ENTITY_NAME = "ORDERS"
;  AND NE.PARENT_ENTITY_ID = O.ORDER_ID
;JOIN N											; name of diagnosis
;WHERE N.NOMENCLATURE_ID = NE.NOMENCLATURE_ID
; 003 end
 
ORDER BY
	OD1.OE_FIELD_DISPLAY_VALUE
	, P1.NAME_FULL_FORMATTED
	, P.NAME_FULL_FORMATTED
	, O.ORDER_ID
	, N.NOMENCLATURE_ID
	, L.LONG_TEXT_ID
	, O.ORIG_ORDER_DT_TM
 
Head Report
	m_NumLines = 0
%I cclsource:vccl_diortf.inc
	y_pos = 18
SUBROUTINE OFFSET( yVal )
	CALL PRINT( FORMAT( y_pos + yVal, "###" ))
END
	count = 0
  call echo("1")
 
Head Page
	if (curpage > 1)  y_pos = 18 endif
	"{F/0}{CPI/14}"
	count = count + 1
	ROW + 1, "{F/9}{CPI/7}"
	CALL PRINT(CALCPOS(159,y_pos+11)) "{U}No-Show Report (15+ days old){ENDU}"
	ROW + 1, "{F/0}{CPI/14}"
	CALL PRINT(CALCPOS(504,y_pos+11)) "Page #:"
	ROW + 1, CALL PRINT(CALCPOS(522,y_pos+11)) count
	ROW + 1
	ROW + 1, CALL PRINT(CALCPOS(252,y_pos+29)) curdate
	ROW + 1
	y_pos = y_pos + 41
 
Head OD1.OE_FIELD_DISPLAY_VALUE
	y_pos = y_pos + 24
 
 
Head P1.NAME_FULL_FORMATTED
	OE_FIELD_DISPLAY_VALUE1 = SUBSTRING( 1, 60, OD1.OE_FIELD_DISPLAY_VALUE ),
	NAME_FULL_FORMATTED1 = SUBSTRING( 1, 60, P1.NAME_FULL_FORMATTED ),
	ROW + 1, "{F/5}{CPI/9}"
	CALL PRINT(CALCPOS(20,y_pos+0)) OE_FIELD_DISPLAY_VALUE1
	ROW + 1, "{CPI/11}"
	CALL PRINT(CALCPOS(36,y_pos+13))  "{U}" NAME_FULL_FORMATTED1, ROW + 1
	ROW + 1
	y_pos = y_pos + 42
 
Head P.NAME_FULL_FORMATTED
	if (( y_pos + 116) >= 792 ) y_pos = 0,  break endif
	ROW + 1, "{F/1}{CPI/14}"
	CALL PRINT(CALCPOS(36,y_pos+11)) "Name"
	CALL PRINT(CALCPOS(216,y_pos+11)) "Birth Date"
	CALL PRINT(CALCPOS(306,y_pos+11)) "Clinic MRN"
	CALL PRINT(CALCPOS(396,y_pos+11)) "Phone Number"
	ROW + 1
	NAME_FULL_FORMATTED2 = SUBSTRING( 1, 30, P.NAME_FULL_FORMATTED ),
	ALIAS1 = SUBSTRING( 1, 10, PA.ALIAS ),
	PHONE_NUM1 = SUBSTRING( 1, 15, PH.PHONE_NUM ),
	ROW + 1, "{F/0}"
	CALL PRINT(CALCPOS(36,y_pos+29)) NAME_FULL_FORMATTED2
	CALL PRINT(CALCPOS(216,y_pos+29)) P.BIRTH_DT_TM
	CALL PRINT(CALCPOS(306,y_pos+29)) ALIAS1
	CALL PRINT(CALCPOS(396,y_pos+29)) PHONE_NUM1
	ROW + 1
	ROW + 1, "{F/1}"
	CALL PRINT(CALCPOS(54,y_pos+47)) "F.O. Date"
	CALL PRINT(CALCPOS(120,y_pos+47)) "Order ID"
	CALL PRINT(CALCPOS(198,y_pos+47)) "Order Mnemonic"
	CALL PRINT(CALCPOS(414,y_pos+47)) "Provider"
	ROW + 1
	y_pos = y_pos + 59
 
 
Head O.ORDER_ID
	if (( y_pos + 103) >= 792 ) y_pos = 0,  break endif
	OE_FIELD_DISPLAY_VALUE2 = SUBSTRING( 1, 5, OD.OE_FIELD_DISPLAY_VALUE ),
	NAME_FULL_FORMATTED3 = SUBSTRING( 1, 30, P1.NAME_FULL_FORMATTED ),
	ROW + 1, "{F/0}{CPI/14}"
	CALL PRINT(CALCPOS(20,y_pos+1)) OE_FIELD_DISPLAY_VALUE2
	CALL PRINT(CALCPOS(54,y_pos+1)) O.CURRENT_START_DT_TM
	CALL PRINT(CALCPOS(108,y_pos+1)) O.ORDER_ID
	CALL PRINT(CALCPOS(198,y_pos+1)) O_CATALOG_DISP
	CALL PRINT(CALCPOS(414,y_pos+1)) NAME_FULL_FORMATTED3
	ROW + 1
	CALL PRINT(CALCPOS(72,y_pos+19)) "Diagnosis:"
	ROW + 1
	y_pos = y_pos + (m_NumLines * 12)
	y_pos = y_pos + 31
 
 
Head N.NOMENCLATURE_ID
	SOURCE_IDENTIFIER1 = SUBSTRING( 1, 15, N.SOURCE_IDENTIFIER ),
	ROW + 1, "{F/0}{CPI/14}"
	CALL PRINT(CALCPOS(78,y_pos+0)) SOURCE_IDENTIFIER1
	CALL cclrtf_print( 0, 115, 0, 80, N.SOURCE_STRING, 150, 1 )
    CALL cclrtf_print( 0, 115, 0, 90, od2.oe_field_display_value, 160, 1 )
	y_pos = y_pos + (m_NumLines * 12)
 
	ROW + 1
	y_pos = y_pos + 5
 
Head L.LONG_TEXT_ID
	ORDERCOMMENT = Trim(L.LONG_TEXT)
	ROW + 1, "{F/0}{CPI/14}"
	CALL PRINT(CALCPOS(72,y_pos)) "Comments:"
	y_pos = y_pos + 8
	CALL cclrtf_print( 0, 78, 0, 80, ORDERCOMMENT, 150, 1 )
 
	y_pos = y_pos + (m_NumLines * 12)
 
	ROW + 1
	y_pos = y_pos + 20
 
Foot L.LONG_TEXT_ID
	y_pos = y_pos + 0
 
Foot N.NOMENCLATURE_ID
	y_pos = y_pos + 0
 
Foot O.ORDER_ID
	y_pos = y_pos + 0
 
Foot P.NAME_FULL_FORMATTED
 
	ROW + 1	y_val= 792-y_pos-21
	^{PS/newpath 1 setlinewidth   20 ^, y_val, ^ moveto  590 ^, y_val, ^ lineto stroke 20 ^, y_val, ^ moveto/}^
	y_pos = y_pos + 12
 
Foot P1.NAME_FULL_FORMATTED
	BREAK
 
Foot OD1.OE_FIELD_DISPLAY_VALUE
	y_pos = y_pos + 0
 
WITH MAXCOL = 300, MAXROW = 500, DIO= 08, NOHEADING, FORMAT= VARIABLE, TIME= VALUE( MaxSecs )
;003   , OUTERJOIN = D, OUTERJOIN = D1, OUTERJOIN = D3, DONTCARE=PH
 */
END
GO
