/* 	*******************************************************************************
 
	Script Name:	pfi_audit_trail_report_v1_1.prg
	Description:	Outputs a report of result corrections per study.
 
	Date Written:	19-Jun-2012
	Written By:		Nicholas Boone
 
	Executed from:	Explorer Menu
 
	*******************************************************************************
								REVISION INFORMATION
	*******************************************************************************
	Rev	Date		By				Comment
	---	-----------	---------------	---------------------------------------------------
	0.a 28-Feb-2012 Boone, Nicholas	Frist draft.
	1.0	03-May-2012	Boone, Nicholas	Initial release.
	1.1 19-Jun-2012 Boone, Nicholas	Updated date values referenced for result values
									displayed.
	1.2 07-Oct-0212 Boone, Nicholas Updated main query to remove dose group dependency.
		25-Jan-2013 Boone, Nicholas	Updated filter to exclude VMRD protocols.
	1.3 20-Mar-2015 Magoon, Yitzhak Updated report so as to function with pfi_study_correction_summary.prg
		in the parent program pfi_study_audit_trail_parent.prg
	1.4 Modified alias pool to include the Pfizer ID pool used for AWMS # (new MRN)
	1.5 23-Jun-2016 Magoon, Yitzhak Updated space between unique_id & subject ID,
									exclude updates made by SYSTEM
	******************************************************************************* */
 
DROP PROGRAM pfi_audit_trail_report_v1_5 GO
CREATE PROGRAM pfi_audit_trail_report_v1_5
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	;<<hidden>>"Enter all or part of the study protocol name" = ""
	, "Protocol" = 0
	, "Report on all instruments (or when no instruments are listed below)" = "0"
	, "Select the instruments to report changes on" = 0
	, "Apply a date range to the query" = "0"
	, "Enter the date range" = "CURDATE"
	, "No prompt" = "CURDATE"
	, "Clinical data report?" = "0"
 
with OUTDEV, PROTOCOL, SERV_RES_ANY, SERV_RES, DATE_RANGE, FROM_DT, TO_DT,
	CLINICAL_REPORT
 
/**************************************************************
; DECLARED VARIABLES AND RECORDS
**************************************************************/
 
DECLARE cUSER = c50
DECLARE cPROTOCOL = c100
DECLARE vPROTOCOL = f8
DECLARE cPRINT_DATE = c25
DECLARE strngHldr = vc with protected,noconstant("")
DECLARE dbNme = vc with protected,noconstant("")
SET dbNme = currdbname
 
SET vERR_FLAG = 0
DECLARE vERR_MSG_1 = vc
DECLARE vERR_MSG_2 = vc
DECLARE vFROM_DATE = c20
DECLARE vTO_DATE = c20
DECLARE temp_CORRECT_DT_TM = c25
DECLARE temp_CORRECT_DT_TM_ST = c25
DECLARE temp_CORRECTED_BY = c50
declare pfiID = f8 ;1.4
SET cvFIN_NBR = UAR_GET_CODE_BY("MEANING", 319, "FIN NBR")
SET cvMRN = UAR_GET_CODE_BY("MEANING",4,"MRN")
SET cvCANCELED = UAR_GET_CODE_BY("MEANING",6004,"CANCELED")
SET cvCOMPLETED = UAR_GET_CODE_BY("MEANING",6004,"COMPLETED")
SET cvTATTOO = UAR_GET_CODE_BY("DISPLAY",263,"Volunteer/Tattoo Pool")
SET cvDISC_MRN = UAR_GET_CODE_BY("DISPLAY",263,"Discovery MRN Pool")
SET cvALPHA = UAR_GET_CODE_BY("DISPLAY",289,"Alpha")
SET cvNUMERIC = UAR_GET_CODE_BY("DISPLAY",289,"Numeric")
SET cvCALC = UAR_GET_CODE_BY("DISPLAY",289,"Calculation")
SET COR_CD = UAR_GET_CODE_BY("MEANING",1901,"CORRECTED")
SET OV_CD = UAR_GET_CODE_BY("MEANING",1901,"OLDVERIFIED")
SET OC_CD = UAR_GET_CODE_BY("MEANING",1901,"OLDCORRECTED")
set pfID = uar_get_code_by("DISPLAYKEY", 263, "PFIZERIDPOOL") ;1.4
 
RECORD rDATA (
	1 DATA[*]
		2 COUNT					= i4
		2 UNIQUE_ID				= c20
		2 SUBJECT_ID			= c20
		2 PERSON_ID				= f8
		2 ENCNTR_ID				= f8
		2 RESULT_ID				= f8
		2 TEST					= c30
		2 SERVICE_RESOURCE_CD	= f8
		2 SERVICE_RESOURCE		= c30
		2 ORDER_ID				= f8
		2 TIMEPOINT				= c12
		2 COLLECTION_DT_TM		= c25
		2 COLLECTION_DT_TM_ST	= c25
		2 RESULTS[*]
			3 RESULT			= c20
			3 CORRECT_DT_TM		= c25
			3 CORRECT_DT_TM_ST	= c25
			3 CORRECTED_BY		= c50
		2 RESULT_CNT			= i4
		2 COMMENTS[*]
			3 COMMENT			= c250
			3 ACTION_SEQUENCE	= i4
			3 COMMENT_DT_TM		= c25
			3 COMMENT_DT_TM_ST	= c25
			3 TWO_LETTERS		= c2
			3 COMMENT_BY		= c50
		2 COMMENT_CNT			= i4
		2 SUMMARY[*]
			3 RESULT			= c20
			3 CORRECT_DT_TM		= c25
			3 CORRECT_DT_TM_ST	= c25
			3 CORRECTED_BY		= c50
			3 COMMENT			= c500
			3 ACTION_SEQUENCE	= i4
			3 TWO_LETTERS		= c2
		2 SUMMARY_CNT			= i4
	1 COUNT						= i4
)
 
; Call program to retrieve the study protocol (cPROTOCOL)
; and username (cUSER)
SET vPROTOCOL = CNVTREAL($PROTOCOL)
EXECUTE mod_pfiz_protocol_and_user
 
/**************************************************************
; Define the date range
**************************************************************/
IF ($DATE_RANGE = "1")
	SET vFROM_DT = $FROM_DT
	SET vTO_DT = $TO_DT
ELSE
	SET vFROM_DT = BUILD("01-JAN-2005")
	SET vTO_DT = BUILD("01-SEP-2099")
ENDIF
 
/**************************************************************
; Identify if searching through all protocols
**************************************************************/
IF ($PROTOCOL = 0); CHAR(42))
	SET nPRINT_ALL = 1
ELSE
	SET nPRINT_ALL = 0
ENDIF
 
 call echorecord(rdata)
/*****************************************
; Main select
*****************************************/
; Select all changes across all benches
IF (BUILD($SERV_RES_ANY) = "1")
SELECT INTO "NL:"
	PERSON_ID = E.PERSON_ID
	, ENCNTR_ID = E.ENCNTR_ID
	, ORDER_ID = O.ORDER_ID
	, RESULT_ID = R.RESULT_ID
	, CATALOG_CD = R.CATALOG_CD
	, TASK_ASSAY_CD = R.TASK_ASSAY_CD
	, TEST = UAR_GET_CODE_DISPLAY(R.TASK_ASSAY_CD)
	, COLLECTION_DT_TM = FORMAT(O.CURRENT_START_DT_TM, "DD-MMM-YYYY  HH:MM:SS;;D")
	, COLLECTION_DT_TM_ST = FORMAT(O.CURRENT_START_DT_TM, "DD-MMM-YYYY HH:MM:SS;;D")
	, UNIQUE_ID = PA.ALIAS
	, CORRECT_DT_TM = FORMAT(PR.UPDT_DT_TM, "DD-Mmm-YYYY  HH:MM:SS;;D")
	, CORRECT_DT_TM_ST = FORMAT(PR.UPDT_DT_TM, "YYYYMMDD HH:MM:SS;;D")
	, CORRECTED_BY = PS.NAME_FULL_FORMATTED
	, RESULT_STATUS = PR.RESULT_STATUS_CD
	, RESULT_TYPE = PR.RESULT_TYPE_CD
	, SERVICE_RESOURCE_CD = PR.SERVICE_RESOURCE_CD
	, SERVICE_RESOURCE = UAR_GET_CODE_DISPLAY(PR.SERVICE_RESOURCE_CD)
;	RESULT_ORDER			= IF (PR.RESULT_STATUS_CD= OC_CD) 1
;							ELSEIF (PR.RESULT_STATUS_CD= OV_CD) 2
;							ELSE 3
;							ENDIF
 
FROM
	ENCOUNTER   E
	, PERSON   P
	, PERSON_ALIAS   PA
	, ORDERS   O
	, RESULT   R
	, PERFORM_RESULT   PR
	, PRSNL   PS
 
PLAN E
	WHERE (nPRINT_ALL = 1 OR E.ORGANIZATION_ID = CNVTREAL($PROTOCOL))
;	AND   E.ENCNTR_TYPE_CD != 0
JOIN P
	WHERE P.PERSON_ID = E.PERSON_ID
JOIN PA
	WHERE PA.PERSON_ID = E.PERSON_ID
	AND   PA.PERSON_ALIAS_TYPE_CD = cvMRN
;	AND   PA.ALIAS_POOL_CD IN (cvTATTOO, cvDISC_MRN, pfiID) ;1.4
;	AND   PA.PERSON_ALIAS_TYPE_CD = 10
;	AND   PA.ALIAS_POOL_CD IN (4521457, 683996)
	AND   PA.ACTIVE_IND = 1
	AND   PA.END_EFFECTIVE_DT_TM > CNVTDATETIME(CURDATE, CURTIME3)
JOIN O
	WHERE O.ENCNTR_ID = E.ENCNTR_ID
	AND O.CURRENT_START_DT_TM BETWEEN CNVTDATETIME(vFROM_DT)
 	AND CNVTDATETIME(CONCAT(vTO_DT, CHAR(32), "235959"))
	AND   O.ORDER_STATUS_CD + 0 = cvCOMPLETED
JOIN R
	WHERE R.ORDER_ID = O.ORDER_ID
JOIN PR
	WHERE PR.RESULT_ID = R.RESULT_ID
	AND PR.RESULT_STATUS_CD IN (COR_CD,OV_CD ,OC_CD)
	and pr.updt_id > 1
;	AND PR.RESULT_STATUS_CD IN (1728, 1731, 1723)
;	AND PR.UPDT_DT_TM BETWEEN CNVTDATETIME(vFROM_DT)
; 	AND CNVTDATETIME(CONCAT(vTO_DT, CHAR(32), "235959"))
JOIN PS
	WHERE PR.UPDT_ID=PS.PERSON_ID
 
ORDER BY UNIQUE_ID, ORDER_ID, TASK_ASSAY_CD, CORRECT_DT_TM_ST, PR.PERFORM_RESULT_ID
 
HEAD REPORT
	nTEST_CNT = 0
	STAT = ALTERLIST(rDATA->DATA, 100)
HEAD UNIQUE_ID
	X = 0
HEAD ORDER_ID
	X = 0
HEAD TASK_ASSAY_CD
	nRES_CNT = 0
	nTEST_CNT = nTEST_CNT + 1
	IF (MOD(nTEST_CNT, 100) = 1 AND nTEST_CNT > 100)
		STAT = ALTERLIST(rDATA->DATA, nTEST_CNT + 100)
	ENDIF
	STAT = ALTERLIST(rDATA->DATA[nTEST_CNT]->RESULTS, 10)
 
	rDATA->DATA[nTEST_CNT].UNIQUE_ID 			= UNIQUE_ID
	rDATA->DATA[nTEST_CNT].PERSON_ID 			= PERSON_ID
	rDATA->DATA[nTEST_CNT].ENCNTR_ID 			= ENCNTR_ID
	rDATA->DATA[nTEST_CNT].ORDER_ID				= ORDER_ID
	rDATA->DATA[nTEST_CNT].RESULT_ID 			= RESULT_ID
	rDATA->DATA[nTEST_CNT].TEST					= TEST
	rDATA->DATA[nTEST_CNT].SERVICE_RESOURCE_CD	= SERVICE_RESOURCE_CD
	rDATA->DATA[nTEST_CNT].SERVICE_RESOURCE		= SERVICE_RESOURCE
	rDATA->DATA[nTEST_CNT].SUBJECT_ID			= ""
	rDATA->DATA[nTEST_CNT].TIMEPOINT			= ""
	rDATA->DATA[nTEST_CNT].COLLECTION_DT_TM		= COLLECTION_DT_TM
	rDATA->DATA[nTEST_CNT].COLLECTION_DT_TM_ST	= COLLECTION_DT_TM_ST
 
DETAIL
	nRES_CNT = nRES_CNT + 1
	IF (MOD(nRES_CNT, 10) = 1 AND nRES_CNT > 10)
		STAT = ALTERLIST(rDATA->DATA[nTEST_CNT]->RESULTS, nRES_CNT + 10)
	ENDIF
	rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT].CORRECT_DT_TM = CORRECT_DT_TM
	rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT].CORRECT_DT_TM_ST = CORRECT_DT_TM_ST
	rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT].CORRECTED_BY = CORRECTED_BY
	IF (RESULT_TYPE = cvALPHA)
		rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT].RESULT =PR.RESULT_VALUE_ALPHA
	ELSEIF ((RESULT_TYPE = cvNUMERIC) AND (PR.ASCII_TEXT = " "))
		rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT].RESULT =
			CNVTSTRING(PR.RESULT_VALUE_NUMERIC,11,2)
	ELSEIF ((RESULT_TYPE = cvCALC) AND (PR.ASCII_TEXT = " "))
		rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT].RESULT =
			CNVTSTRING(PR.RESULT_VALUE_NUMERIC,11,2)
	ELSE
		rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT].RESULT = PR.ASCII_TEXT
	ENDIF
 
FOOT TASK_ASSAY_CD
	rDATA->DATA[nTEST_CNT].RESULT_CNT = nRES_CNT
	STAT = ALTERLIST(rDATA->DATA[nTEST_CNT]->RESULTS, nRES_CNT)
 
;	Reorder correction date/time stamps and who corrected the test
	FOR (nPOS = 1 to (nRES_CNT))
		rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT - nPOS + 1].CORRECT_DT_TM =
			rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT - nPOS].CORRECT_DT_TM
		rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT - nPOS + 1].CORRECT_DT_TM_ST =
			rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT - nPOS].CORRECT_DT_TM_ST
		rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT - nPOS + 1].CORRECTED_BY =
			rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT - nPOS].CORRECTED_BY
	ENDFOR
;	Clear out the original entry correction date/time and corrected by fields
	rDATA->DATA[nTEST_CNT].RESULTS[1].CORRECT_DT_TM = ""
	rDATA->DATA[nTEST_CNT].RESULTS[1].CORRECT_DT_TM_ST = ""
	rDATA->DATA[nTEST_CNT].RESULTS[1].CORRECTED_BY = ""
 
FOOT REPORT
	rDATA->COUNT = nTEST_CNT
	STAT = ALTERLIST(rDATA->DATA, nTEST_CNT)
 
WITH COUNTER
 
call echorecord(rdata)
 
; Exit program if no rows returned from main select statement
IF (CURQUAL = 0)
	SET vERR_FLAG = 1
	SET vERR_MSG_1 = "No results found."
	SET vERR_MSG_2 = " "
	GO TO ERROR_FOUND
ENDIF
 
; Filter based on Service Resource selected
ELSE
 
SELECT INTO "NL:"
	PERSON_ID = E.PERSON_ID
	, ENCNTR_ID = E.ENCNTR_ID
	, ORDER_ID = O.ORDER_ID
	, RESULT_ID = R.RESULT_ID
	, CATALOG_CD = R.CATALOG_CD
	, TASK_ASSAY_CD = R.TASK_ASSAY_CD
	, TEST = UAR_GET_CODE_DISPLAY(R.TASK_ASSAY_CD)
	, COLLECTION_DT_TM = FORMAT(O.CURRENT_START_DT_TM, "DD-Mmm-YYYY  HH:MM:SS;;D")
	, COLLECTION_DT_TM_ST = FORMAT(O.CURRENT_START_DT_TM, "YYYYMMDD HH:MM:SS;;D")
	, UNIQUE_ID = PA.ALIAS
	, CORRECT_DT_TM = FORMAT(PR.UPDT_DT_TM, "DD-Mmm-YYYY  HH:MM:SS;;D")
	, CORRECT_DT_TM_ST = FORMAT(PR.UPDT_DT_TM, "YYYYMMDD HH:MM:SS;;D")
	, CORRECTED_BY = PS.NAME_FULL_FORMATTED
	, RESULT_STATUS = PR.RESULT_STATUS_CD
	, RESULT_TYPE = PR.RESULT_TYPE_CD
	, SERVICE_RESOURCE_CD = PR.SERVICE_RESOURCE_CD
	, SERVICE_RESOURCE = UAR_GET_CODE_DISPLAY(PR.SERVICE_RESOURCE_CD)
;	RESULT_ORDER			= IF (PR.RESULT_STATUS_CD= OC_CD) 1
;							ELSEIF (PR.RESULT_STATUS_CD= OV_CD) 2
;							ELSE 3
;							ENDIF
 
FROM
	ENCOUNTER   E
	, PERSON   P
	, PERSON_ALIAS   PA
	, ORDERS   O
	, RESULT   R
	, PERFORM_RESULT   PR
	, PRSNL   PS
 
PLAN E
	WHERE (nPRINT_ALL = 1 OR E.ORGANIZATION_ID = CNVTREAL($PROTOCOL))
;	AND   E.ENCNTR_TYPE_CD != 0
JOIN P
	WHERE P.PERSON_ID = E.PERSON_ID
JOIN PA
	WHERE PA.PERSON_ID = E.PERSON_ID
	AND   PA.PERSON_ALIAS_TYPE_CD = cvMRN
;	AND   PA.ALIAS_POOL_CD IN (cvTATTOO, cvDISC_MRN, pfiID) ;1.4
;	AND   PA.PERSON_ALIAS_TYPE_CD = 10
;	AND   PA.ALIAS_POOL_CD IN (4521457, 683996)
	AND   PA.ACTIVE_IND = 1
	AND   PA.END_EFFECTIVE_DT_TM > CNVTDATETIME(CURDATE, CURTIME3)
JOIN O
	WHERE O.ENCNTR_ID = E.ENCNTR_ID
	AND O.CURRENT_START_DT_TM BETWEEN CNVTDATETIME(vFROM_DT)
 	AND CNVTDATETIME(CONCAT(vTO_DT, CHAR(32), "235959"))
	AND   O.ORDER_STATUS_CD + 0 = cvCOMPLETED
JOIN R
	WHERE R.ORDER_ID = O.ORDER_ID
JOIN PR
	WHERE PR.RESULT_ID = R.RESULT_ID
	AND PR.RESULT_STATUS_CD IN (COR_CD,OV_CD ,OC_CD)
	AND PR.SERVICE_RESOURCE_CD = $SERV_RES
;	AND PR.RESULT_STATUS_CD IN (1728, 1731, 1723)
JOIN PS
	WHERE PR.UPDT_ID=PS.PERSON_ID
 
ORDER BY UNIQUE_ID, ORDER_ID, TASK_ASSAY_CD, CORRECT_DT_TM_ST, PR.PERFORM_RESULT_ID
 
HEAD REPORT
	nTEST_CNT = 0
	STAT = ALTERLIST(rDATA->DATA, 100)
HEAD UNIQUE_ID
	X = 0
HEAD ORDER_ID
	X = 0
HEAD TASK_ASSAY_CD
	nRES_CNT = 0
	nTEST_CNT = nTEST_CNT + 1
	IF (MOD(nTEST_CNT, 100) = 1 AND nTEST_CNT > 100)
		STAT = ALTERLIST(rDATA->DATA, nTEST_CNT + 100)
	ENDIF
	STAT = ALTERLIST(rDATA->DATA[nTEST_CNT]->RESULTS, 10)
 
	rDATA->DATA[nTEST_CNT].UNIQUE_ID 			= UNIQUE_ID
	rDATA->DATA[nTEST_CNT].PERSON_ID 			= PERSON_ID
	rDATA->DATA[nTEST_CNT].ENCNTR_ID 			= ENCNTR_ID
	rDATA->DATA[nTEST_CNT].ORDER_ID				= ORDER_ID
	rDATA->DATA[nTEST_CNT].RESULT_ID 			= RESULT_ID
	rDATA->DATA[nTEST_CNT].TEST					= TEST
	rDATA->DATA[nTEST_CNT].SERVICE_RESOURCE_CD	= SERVICE_RESOURCE_CD
	rDATA->DATA[nTEST_CNT].SERVICE_RESOURCE		= SERVICE_RESOURCE
	rDATA->DATA[nTEST_CNT].SUBJECT_ID			= ""
	rDATA->DATA[nTEST_CNT].TIMEPOINT			= ""
	rDATA->DATA[nTEST_CNT].COLLECTION_DT_TM		= COLLECTION_DT_TM
	rDATA->DATA[nTEST_CNT].COLLECTION_DT_TM_ST	= COLLECTION_DT_TM_ST
 
DETAIL
	nRES_CNT = nRES_CNT + 1
	IF (MOD(nRES_CNT, 10) = 1 AND nRES_CNT > 10)
		STAT = ALTERLIST(rDATA->DATA[nTEST_CNT]->RESULTS, nRES_CNT + 10)
	ENDIF
	rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT].CORRECT_DT_TM = CORRECT_DT_TM
	rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT].CORRECT_DT_TM_ST = CORRECT_DT_TM_ST
	rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT].CORRECTED_BY = CORRECTED_BY
	IF (RESULT_TYPE = cvALPHA)
		rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT].RESULT =PR.RESULT_VALUE_ALPHA
	ELSEIF ((RESULT_TYPE = cvNUMERIC) AND (PR.ASCII_TEXT = " "))
		rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT].RESULT =
			CNVTSTRING(PR.RESULT_VALUE_NUMERIC,11,2)
	ELSEIF ((RESULT_TYPE = cvCALC) AND (PR.ASCII_TEXT = " "))
		rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT].RESULT =
			CNVTSTRING(PR.RESULT_VALUE_NUMERIC,11,2)
	ELSE
		rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT].RESULT = PR.ASCII_TEXT
	ENDIF
 
FOOT TASK_ASSAY_CD
	rDATA->DATA[nTEST_CNT].RESULT_CNT = nRES_CNT
	STAT = ALTERLIST(rDATA->DATA[nTEST_CNT]->RESULTS, nRES_CNT)
;	Reorder correction date/time stamps and who corrected the test
	FOR (nPOS = 1 to (nRES_CNT))
		rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT - nPOS + 1].CORRECT_DT_TM =
			rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT - nPOS].CORRECT_DT_TM
		rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT - nPOS + 1].CORRECT_DT_TM_ST =
			rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT - nPOS].CORRECT_DT_TM_ST
		rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT - nPOS + 1].CORRECTED_BY =
			rDATA->DATA[nTEST_CNT].RESULTS[nRES_CNT - nPOS].CORRECTED_BY
	ENDFOR
;	Clear out the original entry correction date/time and corrected by fields
	rDATA->DATA[nTEST_CNT].RESULTS[1].CORRECT_DT_TM = ""
	rDATA->DATA[nTEST_CNT].RESULTS[1].CORRECT_DT_TM_ST = ""
	rDATA->DATA[nTEST_CNT].RESULTS[1].CORRECTED_BY = ""
FOOT REPORT
	rDATA->COUNT = nTEST_CNT
	STAT = ALTERLIST(rDATA->DATA, nTEST_CNT)
 
WITH COUNTER
 
; Exit program if no rows returned from main select statement
IF (CURQUAL = 0)
	SET vERR_FLAG = 1
	SET vERR_MSG_1 = "No results found."
	SET vERR_MSG_2 = " "
	GO TO ERROR_FOUND
ENDIF
 
ENDIF
 
; Collect any required ORDER_DETAIL records
SELECT INTO "NL:"
	OE_FIELD_DISPLAY_VALUE	= OD.OE_FIELD_DISPLAY_VALUE
FROM	(DUMMYT				D WITH SEQ=VALUE(rDATA->COUNT)),
		ORDER_DETAIL		OD
PLAN D
JOIN OD
	WHERE OD.ORDER_ID = rDATA->DATA[D.SEQ].ORDER_ID
	AND   OD.OE_FIELD_MEANING IN ("DCDISPLAYDAYS")
DETAIL
	rDATA->DATA[D.SEQ].TIMEPOINT = OE_FIELD_DISPLAY_VALUE
WITH COUNTER
 
; Collect Subject ID if it exists - otherwise leave it set to " "
SELECT INTO "NL:"
	SUBJECT_ID				= EA.ALIAS
FROM	(DUMMYT				D WITH SEQ=VALUE(rDATA->COUNT)),
		ENCNTR_ALIAS		EA
PLAN D
JOIN EA
	WHERE EA.ENCNTR_ID = rDATA->DATA[D.SEQ].ENCNTR_ID
	AND EA.ENCNTR_ALIAS_TYPE_CD = cvFIN_NBR
	AND EA.ACTIVE_IND = 1
DETAIL
	rDATA->DATA[D.SEQ].SUBJECT_ID = SUBJECT_ID
WITH COUNTER
 
; Collect the result comments
SELECT INTO "NL:"
	RESULT_ID			= RC.RESULT_ID,
	ACTION_SEQUENCE		= RC.ACTION_SEQUENCE,
	COMMENT_DT_TM		= FORMAT(RC.COMMENT_DT_TM, "DD-Mmm-YYYY  HH:MM:SS;;D"),
	COMMENT_DT_TM_ST	= FORMAT(RC.COMMENT_DT_TM, "YYYYMMDD HH:MM:SS;;D"),
	TWO_LETTERS			= IF (SUBSTRING(3,1,LT.LONG_TEXT) = "-")
							SUBSTRING(1,2,LT.LONG_TEXT)
						  ELSE
						  	" "
						  ENDIF,
	COMMENT				= trim(LT.LONG_TEXT,3),
	COMMENT_BY			= PS.NAME_FULL_FORMATTED
FROM	(DUMMYT				D WITH SEQ=VALUE(rDATA->COUNT)),
;		RESULT				R,
		RESULT_COMMENT		RC,
		LONG_TEXT			LT,
		PRSNL				PS
PLAN D
JOIN RC
	WHERE RC.RESULT_ID = rDATA->DATA[D.SEQ].RESULT_ID
JOIN PS
	WHERE RC.COMMENT_PRSNL_ID = PS.PERSON_ID
JOIN LT
	WHERE LT.LONG_TEXT_ID = OUTERJOIN(RC.LONG_TEXT_ID)
ORDER BY RESULT_ID, ACTION_SEQUENCE
HEAD REPORT
	X = 0
HEAD RESULT_ID
	nCMT_CNT = 0
	STAT = ALTERLIST(rDATA->DATA[D.SEQ]->COMMENTS, 10)
DETAIL
	nCMT_CNT = nCMT_CNT + 1
	IF (MOD(nCMT_CNT, 10) = 1 AND nCMT_CNT > 10)
		STAT = ALTERLIST(rDATA->DATA[D.SEQ]->COMMENTS, nCMT_CNT + 10)
	ENDIF
	rDATA->DATA[D.SEQ].COMMENTS[nCMT_CNT].ACTION_SEQUENCE = ACTION_SEQUENCE
	rDATA->DATA[D.SEQ].COMMENTS[nCMT_CNT].TWO_LETTERS = TWO_LETTERS
	rDATA->DATA[D.SEQ].COMMENTS[nCMT_CNT].COMMENT = COMMENT
	rDATA->DATA[D.SEQ].COMMENTS[nCMT_CNT].COMMENT_DT_TM = COMMENT_DT_TM
	rDATA->DATA[D.SEQ].COMMENTS[nCMT_CNT].COMMENT_DT_TM_ST = COMMENT_DT_TM_ST
	rDATA->DATA[D.SEQ].COMMENTS[nCMT_CNT].COMMENT_BY = COMMENT_BY
 
FOOT RESULT_ID
	rDATA->DATA[D.SEQ].COMMENT_CNT = nCMT_CNT
	STAT = ALTERLIST(rDATA->DATA[D.SEQ]->COMMENTS, nCMT_CNT)
WITH COUNTER
 
; Move data into the summary array for reporting
 
SELECT INTO "NL:"
	SUBJECT_ID				= rDATA->DATA[D.SEQ].SUBJECT_ID,
	TIMEPOINT				= rDATA->DATA[D.SEQ].TIMEPOINT,
	TEST					= rDATA->DATA[D.SEQ].TEST,
	RES_CNT					= rDATA->DATA[D.SEQ].RESULT_CNT,
	CMT_CNT					= rDATA->DATA[D.SEQ].COMMENT_CNT
FROM	(DUMMYT				D WITH SEQ=VALUE(rDATA->COUNT))
PLAN D
HEAD REPORT
	X = 0
DETAIL
	nSUM_CNT = RES_CNT + CMT_CNT
	STAT = ALTERLIST(rDATA->DATA[D.SEQ]->SUMMARY, nSUM_CNT)
 
	FOR (nPOS=1 to RES_CNT by 1)
		rDATA->DATA[D.SEQ].SUMMARY[nPOS].RESULT = rDATA->DATA[D.SEQ].RESULTS[nPOS].RESULT
		rDATA->DATA[D.SEQ].SUMMARY[nPOS].CORRECT_DT_TM = rDATA->DATA[D.SEQ].RESULTS[nPOS].CORRECT_DT_TM
		rDATA->DATA[D.SEQ].SUMMARY[nPOS].CORRECT_DT_TM_ST =rDATA->DATA[D.SEQ].RESULTS[nPOS].CORRECT_DT_TM_ST
		rDATA->DATA[D.SEQ].SUMMARY[nPOS].CORRECTED_BY =rDATA->DATA[D.SEQ].RESULTS[nPOS].CORRECTED_BY
		rDATA->DATA[D.SEQ].SUMMARY[nPOS].COMMENT = ""
		rDATA->DATA[D.SEQ].SUMMARY[nPOS].ACTION_SEQUENCE = 0
		rDATA->DATA[D.SEQ].SUMMARY[nPOS].TWO_LETTERS = ""
  	ENDFOR
  	FOR (nPOS=1 to CMT_CNT by 1)
		rDATA->DATA[D.SEQ].SUMMARY[RES_CNT+nPOS].RESULT = ""
		rDATA->DATA[D.SEQ].SUMMARY[RES_CNT+nPOS].CORRECT_DT_TM = rDATA->DATA[D.SEQ].COMMENTS[nPOS].COMMENT_DT_TM
		rDATA->DATA[D.SEQ].SUMMARY[RES_CNT+nPOS].CORRECT_DT_TM_ST =rDATA->DATA[D.SEQ].COMMENTS[nPOS].COMMENT_DT_TM_ST
		rDATA->DATA[D.SEQ].SUMMARY[RES_CNT+nPOS].CORRECTED_BY =rDATA->DATA[D.SEQ].COMMENTS[nPOS].COMMENT_BY
		rDATA->DATA[D.SEQ].SUMMARY[RES_CNT+nPOS].COMMENT = rDATA->DATA[D.SEQ].COMMENTS[nPOS].COMMENT
		rDATA->DATA[D.SEQ].SUMMARY[RES_CNT+nPOS].ACTION_SEQUENCE = rDATA->DATA[D.SEQ].COMMENTS[nPOS].ACTION_SEQUENCE
		rDATA->DATA[D.SEQ].SUMMARY[RES_CNT+nPOS].TWO_LETTERS = rDATA->DATA[D.SEQ].COMMENTS[nPOS].TWO_LETTERS
  	ENDFOR
  	rDATA->DATA[D.SEQ].SUMMARY_CNT = nSUM_CNT
WITH COUNTER
 
 
 
; ECHO source record structure to file
CALL ECHORECORD(rDATA)
 
 
 
 
 
/***************************************************************************************************
;
;									Output Section
;
****************************************************************************************************/
#ERROR_FOUND
EXECUTE ReportRTL
%i cust_script:pfi_audit_trail_report_v1_5.dvl
CALL InitializeReport(0)
SET	cPRINT_DATE = FORMAT(CNVTDATETIME(CURDATE, CURTIME3),"DD-Mmm-YYYY HH:MM;;Q")
 
; Check for error status
IF (vERR_FLAG = 1)
	GO TO ERROR_SECTION
ENDIF
 
/***********************************************************************
; Generate output to screen
************************************************************************/
 
SELECT INTO "NL:"
	UNIQUE_ID				= rDATA->DATA[D.SEQ].UNIQUE_ID,
	SUBJECT_ID				= rDATA->DATA[D.SEQ].SUBJECT_ID,
	TEST					= rDATA->DATA[D.SEQ].TEST,
	TIMEPOINT				= rDATA->DATA[D.SEQ].TIMEPOINT,
	ORDER_ID				= rDATA->DATA[D.SEQ].ORDER_ID,
	PG_SPACE				= rDATA->DATA[D.SEQ].COUNT,
	RES_CNT					= rDATA->DATA[D.SEQ].RESULT_CNT,
	CMT_CNT					= rDATA->DATA[D.SEQ].COMMENT_CNT,
	SUM_CNT					= rDATA->DATA[D.SEQ].SUMMARY_CNT,
	CORRECT_DT_TM_ST		= rDATA->DATA[D.SEQ].SUMMARY[D2.SEQ].CORRECT_DT_TM_ST,
	RESULT					= rDATA->DATA[D.SEQ].SUMMARY[D2.SEQ].RESULT,
	CORRECT_DT_TM			= rDATA->DATA[D.SEQ].SUMMARY[D2.SEQ].CORRECT_DT_TM,
	CORRECTED_BY			= rDATA->DATA[D.SEQ].SUMMARY[D2.SEQ].CORRECTED_BY,
	COMMENT					= rDATA->DATA[D.SEQ].SUMMARY[D2.SEQ].COMMENT
FROM	(DUMMYT				D WITH SEQ=VALUE(rDATA->COUNT)),
		(DUMMYT				D2 WITH SEQ=1)
PLAN D WHERE MAXREC(D2,SIZE(rDATA->DATA[D.SEQ].SUMMARY,5))
JOIN D2
ORDER SUBJECT_ID, TIMEPOINT, TEST, ORDER_ID, CORRECT_DT_TM_ST
HEAD REPORT
	X = HeadReportSection(Rpt_Render)
	X = HeadPageSection(Rpt_Render)
	PG_CNT = 1
HEAD PAGE
	IF(curpage > 1)
		_YOffset = 7.5
   		X = FootPageSection(Rpt_Render)
   		X = PageBreak(0)
   		X = HeadReportSection(Rpt_Render)
   		X = HeadPageSection(Rpt_Render)
	ENDIF
HEAD SUBJECT_ID
	X = 0
HEAD TIMEPOINT
	X = 0
HEAD TEST
	X = 0
HEAD ORDER_ID
;  		IF(_YOffset + DetailSection(Rpt_CalcHeight) + FootPageSection(Rpt_CalcHeight) > 8)
;    		Break
;  		ENDIF
	IF(_YOffset + (RES_CNT * ResultSection(RPT_CALCHEIGHT,_fEndDetail-_YOffset,_bHoldContinue))+ 0.5 +
		FootPageSection(Rpt_CalcHeight) > 8)
		_YOffset = 7.5
   		X = FootPageSection(Rpt_Render)
   		X = PageBreak(0)
   		X = HeadReportSection(Rpt_Render)
   		X = HeadPageSection(Rpt_Render)
	ENDIF
	rpos = 0
HEAD CORRECT_DT_TM_ST
	X = 0
;	FOR (nPOS=1 to SUM_CNT by 1)
;  		X = ResultSection(Rpt_Render)
;  	ENDFOR
DETAIL
	rpos = rpos + 1
 
	_fEndDetail=RptReport->m_pageHeight-RptReport->m_marginBottom
	; begin grow loop
	bFirstTime = 1
	while (_bContResultSection=1 OR bFirstTime=1)
		; calculate section height
		_bHoldContinue = _bContResultSection
		_fDrawHeight = ResultSection(RPT_CALCHEIGHT,_fEndDetail-_YOffset,_bHoldContinue)
 
		; break if bottom of page exceeded
		if (_YOffset+_fDrawHeight>_fEndDetail)
			_YOffset = 7.5
   			X = FootPageSection(Rpt_Render)
   			X = PageBreak(0)
   			X = HeadReportSection(Rpt_Render)
   			X = HeadPageSection(Rpt_Render)
		; keep section if doesn't fit (one time only)
		elseif (_bHoldContinue=1 AND _bContResultSection = 0)
			_YOffset = 7.5
   			X = FootPageSection(Rpt_Render)
   			X = PageBreak(0)
   			X = HeadReportSection(Rpt_Render)
   			X = HeadPageSection(Rpt_Render)
		endif
 
		X = ResultSection(RPT_RENDER,_fEndDetail-_YOffset,_bContResultSection)
		; end grow loop
		bFirstTime = 0
	endwhile
 
FOOT ORDER_ID
  	X = SpaceSection(Rpt_Render)
FOOT PAGE
	_YOffset = 7.5
	X = FootPageSection(Rpt_Render)
	PG_CNT = PG_CNT + 1
FOOT REPORT
	X = 0
WITH format = variable, noheading, formfeed=none, maxrow=1, maxcol=32000, nullreport
 
SET X = FinalizeReport($OUTDEV)
 
 CALL ECHORECORD (RDATA)
#ERROR_SECTION
IF (vERR_FLAG = 1)
	SET X = HeadReportSection(Rpt_Render)
	SET X = HeadPageSection(Rpt_Render)
	SET X = NoData(Rpt_Render)
	SET _YOffset = 7.2
	SET X = FootPageSection(Rpt_Render)
	SET X = FinalizeReport($OUTDEV)
	GO TO END_PROGRAM
ENDIF
 
#END_PROGRAM
END
GO
 
