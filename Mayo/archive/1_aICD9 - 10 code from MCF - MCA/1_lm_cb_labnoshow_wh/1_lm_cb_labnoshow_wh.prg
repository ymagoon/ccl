/*******************************************************************
 
Report Name:  Womens Health Lab No Show Report
Report Path:  /mayo/mhspd/prg/1_lm_cb_labnoshow_wh.prg
Report Description:  Displays all lab orders that are still in future status
						15 days or older.
						The reason Womens Health is not integrated into
						the original no show report is because it will not
						print to that dept (fluke).  However, if it is hard-
						coded into the program it works.
 
Created by:  Eric Hendrickson
Created date:  06/2007
 
Modified by:	Lisa Sword
Modified date:	11/2009
Modifications:	Added exclusion of Lab SBAR orders.They will print on a separate report to Lab.
Modified date:	05/21/2010
Modifications: 	Added subquery to only pull latest location from order_detail.
				08/02/2010, changed location subquery to look at latest updt_cnt instead of updt_dt_tm.
				03/03/2011, changed location subquery to look at latest updt_cnt AND latest updt_dt_tm
				04/15/2011, changed location qualification and subquery to use field_id.
				03/01/2013, changed max sec from 900 to 1800. due to a partial report printing, heat#194845.
Modified by:
Modified date:
Modifications:
 
*******************************************************************/
 
drop program 1_lm_cb_labnoshow_wh go
create program 1_lm_cb_labnoshow_wh
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
 
with OUTDEV
 
DECLARE MRN_VAR = F8
DECLARE PHONE_VAR = F8
SET MRN_VAR = UAR_GET_CODE_BY("MEANING", 4, "MRN")
SET PHONE_VAR = UAR_GET_CODE_BY("MEANING", 43, "HOME")
 
/*
Womens Health and HERS are hard coded to print to PH1507 in this report. This
functions differently than the general no show report. The array is not used.
 
Leave "FOR (x=1 to 1)" as 1, so only one copy prints. Add the department in the
WHERE clause.
*/
 
free record dept_printers
record dept_printers (
1 dept_printers_list[2]
	2 dept = C24
	2 printer_name = C6 )
set dept_printers -> dept_printers_list[1] -> dept = "Womens Health/Fam Practice"
set dept_printers -> dept_printers_list[1] -> printer_name = "PH1507"
set dept_printers -> dept_printers_list[2] -> dept = "HERS/Wellness"
set dept_printers -> dept_printers_list[2] -> printer_name =  "PH1507"
 
 
SET MaxSecs = 1800
 
 
FOR (x=1 to 1)
SELECT DISTINCT INTO PH1507 ;dept_printers -> dept_printers_list[x] -> printer_name ;PH1507
	P.NAME_FULL_FORMATTED
	, P1.NAME_FULL_FORMATTED
	, O_CATALOG_CDF = UAR_GET_CODE_MEANING( O.CATALOG_CD )
	, O.CATALOG_CD
	, O_CATALOG_DISP = UAR_GET_CODE_DISPLAY( O.CATALOG_CD )
	, O.ORDER_ID
	, O.ORIG_ORDER_DT_TM
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
	, L.LONG_TEXT
 
FROM
	ORDERS   O
	, PERSON   P
	, PERSON   P1
	, PERSON_ALIAS   PA
	, DUMMYT   D1
	, NOMEN_ENTITY_RELTN   NE
	, NOMENCLATURE   N
	, ORDER_DETAIL   OD
	, ORDER_DETAIL   OD1
	, LONG_TEXT   L
	, ORDER_COMMENT   OC
	, DUMMYT   D
	, PHONE   PH
	, DUMMYT   D3
	, ORDER_DETAIL   OD2
 
PLAN O
WHERE  (O.ORDER_STATUS_CD = 2546   ; 2546 = Future
  AND O.dept_status_cd !=    9312.00)
  AND (O.CURRENT_START_DT_TM < cnvtlookbehind("15 D") or O.CURRENT_START_DT_TM > cnvtlookahead("420 D"))
    	; orders 15 days or older, or in the future more than 420 days
  AND (O.CATALOG_CD NOT IN (93232878,93232886,93232892,93232897,93232904,93232909,
  						   93232915,93232920,93232925,93232930,93232936,93232941))  ;Lab SBAR Orders
 
JOIN P
WHERE  P.PERSON_ID = O.PERSON_ID
JOIN OD
WHERE O.ORDER_ID = OD.ORDER_ID
  ; collection priority
  AND OD.OE_FIELD_MEANING="COLLPRI"
JOIN OD1
; location field from OEF
WHERE O.ORDER_ID = OD1.ORDER_ID
  AND OD1.OE_FIELD_ID = 7441493		; changed from field meaning, to field_id. 4/15/2011
  AND OD1.UPDT_DT_TM				; changed max to look at field_id. 4/15/2011
     IN (SELECT MAX(UPDT_DT_TM) FROM ORDER_DETAIL ODMAX2
          WHERE OD1.ORDER_ID = ODMAX2.ORDER_ID and ODMAX2.OE_FIELD_ID = 7441493)
 
 
   ; for printing
   AND (OD1.OE_FIELD_DISPLAY_VALUE = "Womens Health/Fam Practice"
   OR   OD1.OE_FIELD_DISPLAY_VALUE = "HERS/Wellness")
   ; AND OD1.OE_FIELD_DISPLAY_VALUE = dept_printers -> dept_printers_list[x] -> dept
 
JOIN PA
WHERE P.PERSON_ID = PA.PERSON_ID
  ; MRN
  AND PA.PERSON_ALIAS_TYPE_CD = MRN_VAR
  AND PA.ACTIVE_IND = 1
JOIN P1
WHERE O.LAST_UPDATE_PROVIDER_ID = P1.PERSON_ID
 
JOIN PH
WHERE PH.PARENT_ENTITY_ID = P.PERSON_ID
  ; home phone number only
  AND PH.PHONE_TYPE_CD = PHONE_VAR
  AND PH.ACTIVE_IND = 1
JOIN OC
WHERE OUTERJOIN(O.ORDER_ID) = OC.ORDER_ID
JOIN L
WHERE OUTERJOIN(OC.LONG_TEXT_ID) = L.LONG_TEXT_ID
JOIN D
WHERE OC.LONG_TEXT_ID = L.LONG_TEXT_ID
 
JOIN D3
JOIN OD2
WHERE O.order_id = OD2.order_id
AND OD2.oe_field_meaning = "ICD9"
 
JOIN D1
JOIN NE
; diagnosis
WHERE NE.PARENT_ENTITY_NAME = "ORDERS"
  AND NE.PARENT_ENTITY_ID = O.ORDER_ID
JOIN N
; name of diagnosis
WHERE N.NOMENCLATURE_ID = NE.NOMENCLATURE_ID
 
ORDER BY
	OD1.OE_FIELD_DISPLAY_VALUE   DESC
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
 
WITH MAXCOL = 300, MAXROW = 500, DIO= 08, NOHEADING, FORMAT= VARIABLE, TIME= VALUE( MaxSecs ), OUTERJOIN = D,
 OUTERJOIN = D1, OUTERJOIN = D3, DONTCARE=PH
 ENDFOR
 
 
END
GO
