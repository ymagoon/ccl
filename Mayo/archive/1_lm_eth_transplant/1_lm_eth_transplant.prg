/*******************************************************************
 
Report Name:  Transplant Report
Report Path:  /mayo/mhspd/prg/1_lm_eth_transplant.prg
Report Description:  Displays all patients that display 'transplant' in the
						comment section of a lab order for the previous day.
 
Created by:  Eric Hendrickson
Created date:  11/2005
 
Modified by:
Modified date:
Modifications:
 
Modified by:
Modified date:
Modifications:
 
*******************************************************************/
 
DROP PROGRAM 1_lm_eth_transplant GO
CREATE PROGRAM 1_lm_eth_transplant
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
 
with OUTDEV
 
DECLARE FIN_VAR = F8
SET FIN_VAR = UAR_GET_CODE_BY("MEANING", 319, "FIN NBR")
 
SET MaxSecs = 3600
 
SELECT INTO $OUTDEV
	P.NAME_FULL_FORMATTED
	, L.LONG_TEXT
	, PA.ALIAS
 
FROM
	ORDERS   O
	, LONG_TEXT   L
	, ORDER_COMMENT   OC
	, PERSON   P
	, DUMMYT   D
	, PERSON_ALIAS   PA
	,ENCOUNTER E
 
PLAN O
; 692 = General Lab
WHERE   format( O.CURRENT_START_DT_TM, 'mm/dd/yy;;d' ) = format( CURDATE, 'mm/dd/yy;;d' )
 and O.ACTIVITY_TYPE_CD+0 in (692)
  ; 469 = PowerChart
  AND O.CONTRIBUTOR_SYSTEM_CD = 469
  ; 2542 = Canceled, 2544 = Deleted, 2545 = Discontinued,
  ; 614538 = Transfer/Canceled, 643467 = Voided With Results
  AND O.ORDER_STATUS_CD not in (2542,2544,2545,2552,614538,643467)
  AND O.ACTIVE_IND = 1
JOIN OC
WHERE O.ORDER_ID = OC.ORDER_ID
JOIN L
WHERE OC.LONG_TEXT_ID = L.LONG_TEXT_ID
JOIN D
WHERE cnvtlower(l.long_text) = "*transplant*"
JOIN P
WHERE O.PERSON_ID = P.PERSON_ID
JOIN PA
WHERE P.PERSON_ID = PA.PERSON_ID
  AND PA.ACTIVE_IND = 1
  ; 3844507 = Clinic MRN
  AND PA.ALIAS_POOL_CD = 3844507
JOIN E
WHERE O.encntr_id = E.encntr_id
; 633867 = EU Luther Hospital, 3186521 = EU Luther Hospital Behav Hlth,
; 3196530 = EU Chippewa Valley Clinic, 3196529 = EU Chippewa Valley Hospital,
; 3196528 = EU Northland Clinic, 3196527 = EU Northland Hospital,
; 3196532 = EU Oakridge Clinic, 3196531 = EU Oakridge Hospital,
; 3180507 = EU Midelfort Clinic, 3186522 = EU Midelfort Clinic Behav Hlth,
; 3196533 = EU Northwest Wisconsin HomeCare, 3196534 = EU Pain Clinic
AND E.loc_facility_cd IN (633867, 3186521, 3196530, 3196529,
3196528, 3196527, 3196532, 3196531, 3180507, 3186522, 3196533, 3196534)
 
Head Report
	m_NumLines = 0
%I cclsource:vccl_diortf.inc
	y_pos = 18
SUBROUTINE OFFSET( yVal )
	CALL PRINT( FORMAT( y_pos + yVal, "###" ))
END
	ROW + 1, "{F/1}{CPI/10}"
	CALL PRINT(CALCPOS(210,y_pos+11)) "LAB TRANSPLANT REPORT"
	ROW + 1
	ROW + 1, "{F/0}{CPI/14}"
	ROW + 1, CALL PRINT(CALCPOS(275,y_pos+29)) curdate
	ROW + 1
	y_pos = y_pos + 41
 
Head Page
	if (curpage > 1)  y_pos = 18 endif
	ROW + 1, "{F/1}{CPI/12}"
	CALL PRINT(CALCPOS(54,y_pos+11)) "{U}Patient Name:{ENDU}"
	CALL PRINT(CALCPOS(328,y_pos+11)) "{U}MRN:{ENDU}"
	ROW + 1
	y_pos = y_pos + 24
 
Detail
	if (( y_pos + 76) >= 792 ) y_pos = 0,  break endif
	NAME_FULL_FORMATTED1 = SUBSTRING( 1, 50, P.NAME_FULL_FORMATTED ),
	ALIAS1 = SUBSTRING( 1, 12, PA.ALIAS ),
	ROW + 1, "{F/0}{CPI/14}"
	CALL PRINT(CALCPOS(54,y_pos+11)) NAME_FULL_FORMATTED1
	CALL PRINT(CALCPOS(84,y_pos+20)) "Comment:"
	CALL cclrtf_print( 0, 126, 20, 50, L.LONG_TEXT, 100, 1 )
 
	CALL PRINT(CALCPOS(326,y_pos+11)) ALIAS1
	y_pos = y_pos + (m_NumLines * 12)
 
	y_pos = y_pos + 22
 
WITH MAXCOL = 300, MAXROW = 500, DIO= 08, NOHEADING, FORMAT= VARIABLE, TIME= VALUE( MaxSecs )
 
END
GO
 
