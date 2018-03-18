/* 	***************************************************************************************
 
	Script Name:	pfi_oracle_clinical_v1_1.prg
	Description:	Outputs a report and extract for upload to oracle clinical.
 
	Date Written:	17-Jan-2011
	Written By:		Nicholas Boone
 
	Executed from:	Explorer Menu
 
	***************************************************************************************
								REVISION INFORMATION
	***************************************************************************************
	Rev	Date		By				Comment
	---	-----------	--------------	---------------------------------------------------
 	0.a 17-Jan-2011 Boone, Nicholas First draft.
 	0.b 10-Jun-2011	Boone, Nicholas	Final updates following requirements gathering.
 	0.c 05-Jan-2012	Boone, Nicholas Timepoint broken down into sub components and units of
 									measure translation introduced for RATIO.
 	1.0 11-Jan-2012	Boone, Nicholas Released for use.
 	1.1 21-Oct-2013	Boone, Nicholas	Introduce test filter in prompt and main query statement.
 	2.0 16-Apr-2015 Magoon, Yitzhak Modified alias pool to include the Pfizer ID
 									pool used for AWMS # (new MRN)
 	003 29-Aug-2016 Magoon, Yitzhak Added two new report formats for clincal
 	004 26-Oct-2016 magoon, Yitzhak Add new column to CAPs report + change timepoint
	**************************************************************************************** */
 
DROP PROGRAM pfi_oracle_clinical_v4_0:DBA GO
CREATE PROGRAM pfi_oracle_clinical_v4_0:DBA
 
prompt
	"Output to File/Printer/MINE" = "MINE"                              ;* Enter or select the printer or file name to send this r
	;<<hidden>>"Enter all or part of the study protocol name" = ""
	, "Select the protocol" = 0
	, "Select the parameter section(s) to report" = ""
	, "Clinical data report?" = "1"
	, "Report Type" = "OCR"
	, "Data Sensitivity" = ""                                           ;* Please enter a value if the PDS or CaPS extracts are be
	, "Exclude tests that report a percentage" = "0"
	, "Exclude dose group(s)?" = "0"
	, "Select dose group(s) to exclude" = 0
	, "Exclude timepoint(s)?" = "0"
	, "Select timepoint(s) to exclude" = ""
	, "Enter the table number" = ""
	, "Include tests with an NR comment" = "0"
	, "Apply a date range to the query" = "0"
	, "Enter the date range" = "CURDATE"
	, "No prompt" = "CURDATE"
	, "Select the test(s) to exclude from the report or extract:" = 0
 
with OUTDEV, PROTOCOL, PAR_SECTION, CLINICAL_REPORT, REPORT_TYPE, sensitivity,
	PERCENT, DG_FILTER, DOSE_GRP, TMPT_FILTER, TIMEPOINT, TABLE_TITLE, IGNORE_NR,
	DATE_RANGE, FROM_DT, TO_DT, TESTS_EXCLUDED
 
/**************************************************************
; DECLARED VARIABLES AND RECORDS
**************************************************************/
 
; These determine the number of horizontal results possible per printed page.
; Do not change unless layout is also changed.
SET nRAW_RESULTS = 5
SET nSTAT_RESULTS = 4
SET nRESULT_ROWS = 33
SET nSTAT_ROWS = 33
 
declare pfiID = f8 ;2.0
set pfID = uar_get_code_by("DISPLAY", 263, "PFIZERIDPOOL") ;2.0
 
SET cvMRN = UAR_GET_CODE_BY("MEANING",4,"MRN")
SET cvDISC_MRN = UAR_GET_CODE_BY("DISPLAY",263,"Discovery MRN Pool")
SET cvTATTOO = UAR_GET_CODE_BY("DISPLAY",263,"Volunteer/Tattoo Pool")
SET cvFIN_NBR = UAR_GET_CODE_BY("MEANING", 319, "FIN NBR")
SET cvCOMPLETED = UAR_GET_CODE_BY("MEANING",6004,"COMPLETED")
 
set vERR_FLAG = 0
SET vDUP_FLAG = 0
SET vERR_nCOUNT = 0
DECLARE vERR_MSG_1 = vc
DECLARE vERR_MSG_2 = vc
DECLARE vERR_UNIQUE_ID = f8
DECLARE vERR_COLLECT_DT = c11
DECLARE cUSER = c50
DECLARE cPROTOCOL = c100
DECLARE vPROTOCOL = f8
DECLARE cTableID = c40
DECLARE cHEADER = c100
DECLARE OC_COLLECT_TM_tmp = c6
DECLARE vmean_temp = f8
DECLARE vstd_temp = f8
DECLARE vsize_temp = i4
DECLARE vcntrl_mean = f8
DECLARE v_diff = f8
DECLARE vratio_temp = f8
DECLARE vbaseline_mean = f8
DECLARE vbaseline_val = f8
DECLARE nDECIMALS = i4
DECLARE vTMPT_CNT = i4
DECLARE vFROM_DATE = c20
DECLARE vTO_DATE = c20
DECLARE file_name = c55
DECLARE strngHldr = vc with noconstant("")
 
 
RECORD rDATA (
	1 REF_CNT					= i4
	1 REF_MAP[*]
		2 PARAMETER_TYPE		= c50
		2 MAX_TESTS				= i4
		2 VSF_TEST_NAME			= c50
		2 VSF_TEST_UNITS		= c50
		2 OC_TEST_NAME			= c20
		2 OC_TEST_UNITS			= c20
		2 OC_TEST_CODE			= c20
		2 GRID_POSITION			= i4
	1 DG_CNT					= i4
	1 DOSE_GROUP[*]
		2 DOSE_GROUP			= c50
		2 REFERRING_COMMENT		= c50
		2 DG_POS_VAL			= i4
		2 DG_CONTROL			= i4
	1 TMPT_CNT					= i4
	1 TMPT_LIST[*]
		2 TIMEPOINT				= c20
		2 TMPT_POS_VAL			= i4
		2 TMPT_BASELINE			= i4
	1 COUNT						= i4
	1 DATA[*]
		2 ENCNTR_ID				= f8
		2 ORDER_ID				= f8
		2 CATALOG_CD			= f8
		2 TASK_ASSAY_CD			= f8
		2 EVENT_ID				= f8
		2 ACCESSION				= c20 ; Column Name ACCESSION
		2 DOSE_GROUP			= c50
		2 DG_POS_VAL			= i4
		2 DG_CONTROL			= i4
		2 REFERRING_COMMENT		= c50
		2 SEX					= c6
		2 SPECIES				= c30
		2 UNIQUE_ID				= c20
		2 SUBJECT_ID			= c8 ; Column Name SSID
		2 SUBJECT_INDEX			= i4
		2 TIMEPOINT				= c16 ; Column Name VISIT
		2 VISIT					= c16 ; Column Name VISIT
		2 TPD_H					= c4 ; Column Name TPD_H
		2 TPD_M					= c4 ; Column Name TPD_M
		2 TMPT_POS_VAL			= i4
		2 TMPT_BASELINE			= i4
		2 COLLECT_DATE			= c11
		2 COLLECT_DT_TM			= c21
		2 COLLECT_DT_TM_2		= c21
		2 COLLECT_DT_TM_SORT	= dq8
		2 OC_COLLECT_DT			= c8 ; Column Name COLL_D (YYYYMMDD)
		2 OC_COLLECT_TM			= c6 ; Column Name COLL_T (HHMMSS)
		2 verified_dt_tm		= c11									;003
		2 PARAMETER_TYPE		= c50
		2 VSF_TEST_NAME			= c50 ; Column Name LB_TSTID
		2 VSF_TEST_UNITS		= c20 ; Column Name TSTRES_UNIT
		2 specimen_type			= c12									;003
		2 OC_TEST_NAME			= c20
		2 OC_TEST_CODE			= c20 ; Column Name PFE_TSTID
		2 OC_TEST_UNITS			= c20
		2 GRID_POSITION			= i4
		2 OC_LOWER_LIMIT		= c20 ; Column Name LIMIT_L
		2 OC_UPPER_LIMIT		= c20 ; Column Name LIMIT_U
		2 STATS					= i4
		2 RESULT				= c50 ; Column Name TSTRES
		2 NORMALCY				= c1
		2 NORMALCY_CD			= f8
		2 RESULT_FLAG			= c1
		2 NR					= i4
		2 XX					= i4
		2 COMMENT_CNT			= i4
		2 TWO_LETTERS			= c2
		2 COMMENT				= c500
		2 P_CHANGE				= f8
		2 P_CHANGE_SG			= c20
		2 P_CHANGE_SIGN			= c1
		2 CHANGE_RPT			= c20
		2 COMMENTS[*]
			3 ACTION_SEQUENCE	= i4
			3 TWO_LETTERS		= c2
			3 COMMENT			= c500
	1 COM_COUNT					= i4
	1 COMMENTS[*]
		3 TWO_LETTERS			= c2
		3 COMMENT				= c500
)
 
RECORD rTEMP (
	1 DATA[*]
		2 RESULT				= f8
	1 TESTS[*]
		2 VSF_TEST_NAME			= c50
		2 VSF_TEST_UNITS		= c50
)
 
RECORD rTEMP2 (
	1 COM_COUNT					= i4
	1 COMMENTS[*]
		2 TWO_LETTERS			= c2
		2 COMMENT				= c500
)
 
RECORD rREPORT (
	1 COUNT						= i4
	1 DATA[*]
		2 PARAMETER_TYPE		= c50
		2 SPECIES				= c30
		2 SEX					= c6
		2 DOSE_GROUP			= c50
		2 REFERRING_COMMENT		= c50
		2 UNIQUE_ID				= c20
		2 SUBJECT_ID			= c20
		2 SUBJECT_INDEX			= i4
		2 TIMEPOINT				= c16
		2 TMPT_POS_VAL			= i4
		2 TMPT_BASELINE			= i4
		2 COLLECT_DATE			= c11
		2 COLLECT_DT_TM_2		= c21
;		2 OC_COLLECT_DT			= c8 ; YYYYMMDD
;		2 OC_COLLECT_TM			= c6 ; HHMMSS
		2 RESULT_PAGE			= i4
		2 RESULT_CNT			= i4
		2 RESULTS[*]
			3 RESULT			= c30
			3 VSF_TEST_NAME		= c50
			3 STATS				= i4
			3 NORMALCY			= c1
			3 RESULT_FLAG		= c1
			3 COMMENTS			= c8
			3 P_CHANGE_SIGN		= c1
			3 CHANGE_RPT		= c20
	1 STAT_CNT					= i4
	1 STATS[*]
		2 PARAMETER_TYPE		= c50
		2 SPECIES				= c30
		2 SEX					= c6
		2 VSF_TEST_NAME			= c50
		2 VSF_TEST_UNITS		= c50
		2 GRID_POSITION			= i4
		2 TIMEPOINT				= c20
		2 TMPT_BASELINE			= i4
		2 TMPT_POS_VAL			= i4
		2 RESULT_PAGE			= i4
		2 RESULT_CNT			= i4
		2 RESULTS[*]
			3 DOSE_GROUP		= c50
			3 DG_CONTROL		= i4
			3 REFERRING_COMMENT	= c50
			3 ANIMALS			= i4
			3 PREFIX			= c1
			3 SD_SIGN			= c1
			3 MEAN				= f8
			3 MEAN_DEC_PL		= i4
			3 MEAN_SG			= c20
			3 STD_DEVIATION		= f8
			3 STD_SG			= c20
			3 P_CHANGE			= f8
			3 P_CHANGE_SG		= c20
			3 P_CHANGE_SIGN		= c1
			3 CHANGE_RPT		= c20
)
 
; Function to calculate square root
SUBROUTINE SQRT(nVALUE)
	;SET nSQR_GUESS = 1.0
	FOR (nSQR_LOOP = 1 TO 20)
		SET nSQR_GUESS = ((nVALUE/nSQR_GUESS) + nSQR_GUESS)/2
	ENDFOR
 
	RETURN (nSQR_GUESS)
END
 
; Call program to retrieve the study protocol (cPROTOCOL)
; and username (cUSER)
SET vPROTOCOL = CNVTREAL($PROTOCOL)
EXECUTE mod_pfiz_protocol_and_user
 
; Capture the Table ID
SET cTableID = TRIM($TABLE_TITLE)
 
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
 
/****************************************************************************************
; Update parameters passed by the prompt to set value when timepoints are not filtered
*****************************************************************************************/
IF ($TMPT_FILTER = "0")
	SET $TIMEPOINT = "0"
ENDIF
 
IF ($DG_FILTER = "0")
	SET $DOSE_GRP = 0
ENDIF
; CALL ECHO ($DOSE_GRP)
 
/**************************************************************
; Collect the report data and populate the record structure
**************************************************************/
SELECT INTO "NL:"
	PERSON_ID				= E.PERSON_ID,
	ENCNTR_ID				= E.ENCNTR_ID,
	ORDER_ID				= O.ORDER_ID,
	CATALOG_CD				= CE.CATALOG_CD,
	TASK_ASSAY_CD			= CE.TASK_ASSAY_CD,
	EVENT_ID				= CE.EVENT_ID,
	ACCESSION				= CONCAT(SUBSTRING(8,2,CE.ACCESSION_NBR), SUBSTRING(10,3,CE.ACCESSION_NBR),
			SUBSTRING(15,4,CE.ACCESSION_NBR)),
	COLLECTION_DATE			= FORMAT(C.DRAWN_DT_TM, "DD-Mmm-YYYY;;D"),
	COLLECTION_DT_TM		= FORMAT(C.DRAWN_DT_TM, "DD-Mmm-YYYY  HH:MM:SS;;D"),
	COLLECTION_DT_TM_2		= FORMAT(C.DRAWN_DT_TM, "YYYYMMDD HHMMSS;;D"),
	COLLECT_DT_TM_SORT		= C.DRAWN_DT_TM,
	OC_COLLECT_DT			= FORMAT(C.DRAWN_DT_TM, "YYYYMMDD;;D"),
	OC_COLLECT_TM			= FORMAT(C.DRAWN_DT_TM, "HHMMSS;;M"),
	verified_dt_tm			= FORMAT(ce.verified_dt_tm, "YYYYMMDD;;D"),						;003
	DOSE_GROUP				= UAR_GET_CODE_DISPLAY(E.ENCNTR_TYPE_CD),
	REFERRING_COMMENT		= E.REFERRING_COMMENT,
	SEX						= UAR_GET_CODE_DISPLAY(P.SEX_CD),
	SPECIES					= UAR_GET_CODE_DISPLAY(P.SPECIES_CD),
	OE_FIELD_DISPLAY_VALUE	= OD.OE_FIELD_DISPLAY_VALUE,
	UNIQUE_ID				= PA.ALIAS,
	CLASS_ORDER				= CVM.CLASS_ORDER,
	PARAM_ORDER				= CVM.PARAM_ORDER,
	PARAMETER_TYPE			= CVM.PARAMETER_TYPE,
	VSF_TEST_NAME			= CVM.VSF_TEST_NAME,
	VSF_TEST_UNITS			= CVM.VSF_TEST_UNITS,
	;specimen_type			= uar_get_code_display(c.specimen_type_cd),						;003
	specimen_type			= uar_get_code_display(c.spec_cntnr_cd),						;004
	OC_TEST_NAME			= CVM.OC_TEST_NAME,
	OC_TEST_UNITS			= CVM.OC_TEST_UNITS,
	OC_TEST_CODE			= CVM.OC_TEST_CODE,
	OC_LOWER_LIMIT			= CE.NORMAL_LOW,
	OC_UPPER_LIMIT			= CE.NORMAL_HIGH,
	STATS					= CVM.STATS,
	RESULT					= CE.RESULT_VAL,
	NORMALCY				= SUBSTRING(1,1, UAR_GET_CODE_DISPLAY(CE.NORMALCY_CD)),
	NORMALCY_CD				= CE.NORMALCY_CD
FROM	ENCOUNTER			E,
		PERSON				P,
		ORDERS				O,
		CLINICAL_EVENT		CE,
		CE_SPECIMEN_COLL	CSC,
		CONTAINER			C,
		PERSON_ALIAS		PA,
		ORDER_DETAIL		OD,
		CERNER_VSF_MAP		CVM
PLAN E
	WHERE E.ORGANIZATION_ID = CNVTREAL($PROTOCOL)
	AND (($DG_FILTER = "0")
		OR ($DG_FILTER = "1" AND E.ENCNTR_TYPE_CD != $DOSE_GRP AND E.ENCNTR_TYPE_CD != 0))
JOIN P
	WHERE P.PERSON_ID = E.PERSON_ID
JOIN O
	WHERE O.ENCNTR_ID = E.ENCNTR_ID
	AND   O.ORDER_STATUS_CD + 0 = cvCOMPLETED
JOIN CE
	WHERE CE.ORDER_ID = O.ORDER_ID
	AND   (CE.TASK_ASSAY_CD != $TESTS_EXCLUDED AND CE.TASK_ASSAY_CD != 0)
	AND   CE.VALID_UNTIL_DT_TM > CNVTDATETIME(CURDATE, CURTIME3)
	AND   CE.UPDT_DT_TM  BETWEEN CNVTDATETIME(vFROM_DT)
 	AND   CNVTDATETIME(CONCAT(vTO_DT, CHAR(32), "235959"))
JOIN CSC
	WHERE CE.EVENT_ID = CSC.EVENT_ID
	  and csc.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)			;2.0
JOIN C
	WHERE C.CONTAINER_ID = CSC.CONTAINER_ID
	AND C.DRAWN_DT_TM  BETWEEN CNVTDATETIME(vFROM_DT)
 	AND CNVTDATETIME(CONCAT(vTO_DT, CHAR(32), "235959"))
JOIN PA
	WHERE PA.PERSON_ID = E.PERSON_ID
	AND   PA.PERSON_ALIAS_TYPE_CD = cvMRN
;	AND   PA.ALIAS_POOL_CD IN (cvTATTOO, cvDISC_MRN, pfiID) ;2.0
	AND   PA.ACTIVE_IND = 1
	AND   PA.END_EFFECTIVE_DT_TM > CNVTDATETIME(CURDATE, CURTIME3)
JOIN CVM
	WHERE CVM.TASK_ASSAY_CD = CE.TASK_ASSAY_CD
	AND   CNVTUPPER(CVM.VSF_TEST_NAME) != "EXCLUDE"
	AND   CNVTUPPER(CVM.OC_TEST_NAME) != "EXCLUDE"
	AND CVM.PARAMETER_TYPE = $PAR_SECTION
;	AND CVM.TEST_CODE != ""
JOIN OD
	WHERE OD.ORDER_ID = O.ORDER_ID
	AND   OD.OE_FIELD_MEANING IN ("DCDISPLAYDAYS")
	AND (($TMPT_FILTER = "1" AND OD.OE_FIELD_DISPLAY_VALUE != $TIMEPOINT) OR
	($TMPT_FILTER = "0"))
ORDER CLASS_ORDER, PARAMETER_TYPE, PARAM_ORDER, VSF_TEST_NAME, UNIQUE_ID, COLLECT_DT_TM_SORT
HEAD REPORT
	nREF_CNT = 0
	nCOUNT = 0
	STAT = ALTERLIST(rDATA->REF_MAP, 100)
	STAT = ALTERLIST(rDATA->DATA, 500)
HEAD CLASS_ORDER
	X = 0
HEAD PARAMETER_TYPE
	nGRID_POSITION = 0
HEAD PARAM_ORDER
	X = 0
	vIGNORE_PERCENT = 0
	vIGNORE_STAT = 0
HEAD VSF_TEST_NAME
	; Ignore results if the units of measure are % and prompt flag set
	IF ($PERCENT = "%" AND VSF_TEST_UNITS = "%")
		vIGNORE_PERCENT = 1
	ELSEIF ($REPORT_TYPE IN ("ITVIB", "ITVIBR") AND STATS = 0)
 		vIGNORE_STAT = 1
 	ELSE
		; Collect the reference data
		nREF_CNT = nREF_CNT + 1
		nGRID_POSITION = nGRID_POSITION + 1
		IF (MOD(nREF_CNT, 10) = 1 AND nREF_CNT > 100)
			STAT = ALTERLIST(rDATA->REF_MAP, nREF_CNT + 10)
		ENDIF
		rDATA->REF_MAP[nREF_CNT].PARAMETER_TYPE = PARAMETER_TYPE
		rDATA->REF_MAP[nREF_CNT].VSF_TEST_NAME = VSF_TEST_NAME
		rDATA->REF_MAP[nREF_CNT].VSF_TEST_UNITS = VSF_TEST_UNITS
		rDATA->REF_MAP[nREF_CNT].GRID_POSITION = nGRID_POSITION
	ENDIF
DETAIL
	IF (vIGNORE_PERCENT = 0 AND vIGNORE_STAT = 0)
 
	; Collect the result data
	vIGNORE = 0
	nCOUNT = nCOUNT + 1
	IF (MOD(nCOUNT, 500) = 1 AND nCOUNT > 500)
		STAT = ALTERLIST(rDATA->DATA, nCOUNT + 500)
	ENDIF
 
	IF ((rDATA->DATA[nCOUNT-1].COLLECT_DT_TM_SORT = COLLECT_DT_TM_SORT)
		AND (rDATA->DATA[nCOUNT-1].UNIQUE_ID = UNIQUE_ID)
		AND (rDATA->DATA[nCOUNT-1].VSF_TEST_NAME = VSF_TEST_NAME))
		IF (rDATA->DATA[nCOUNT-1].RESULT = "-")
			nCOUNT = nCOUNT - 1
		ELSEIF (RESULT = "-")
			vIGNORE = 1
		ELSE
			vDUP_FLAG = 1
			vERR_nCOUNT = nCOUNT
		ENDIF
	ENDIF
 
	rDATA->DATA[nCOUNT].ORDER_ID = ORDER_ID
	rDATA->DATA[nCOUNT].ENCNTR_ID = ENCNTR_ID
	rDATA->DATA[nCOUNT].CATALOG_CD = CATALOG_CD
	rDATA->DATA[nCOUNT].TASK_ASSAY_CD = TASK_ASSAY_CD
	rDATA->DATA[nCOUNT].EVENT_ID = EVENT_ID
	rDATA->DATA[nCOUNT].DOSE_GROUP = DOSE_GROUP
	rDATA->DATA[nCOUNT].DG_POS_VAL = 0
	rDATA->DATA[nCOUNT].REFERRING_COMMENT = REFERRING_COMMENT
	rDATA->DATA[nCOUNT].SEX = SEX
	rDATA->DATA[nCOUNT].SPECIES = SPECIES
	rDATA->DATA[nCOUNT].UNIQUE_ID = UNIQUE_ID
	rDATA->DATA[nCOUNT].SUBJECT_ID = ""
	rDATA->DATA[nCOUNT].COLLECT_DATE = COLLECTION_DATE
	rDATA->DATA[nCOUNT].COLLECT_DT_TM = COLLECTION_DT_TM
	rDATA->DATA[nCOUNT].COLLECT_DT_TM_2 = COLLECTION_DT_TM_2
	rDATA->DATA[nCOUNT].PARAMETER_TYPE = PARAMETER_TYPE
	rDATA->DATA[nCOUNT].VSF_TEST_NAME = VSF_TEST_NAME
;	rDATA->DATA[nCOUNT].VSF_TEST_UNITS = VSF_TEST_UNITS
	rDATA->DATA[nCOUNT].OC_TEST_NAME = OC_TEST_NAME
	rDATA->DATA[nCOUNT].OC_TEST_CODE = OC_TEST_CODE
	rDATA->DATA[nCOUNT].OC_COLLECT_DT = OC_COLLECT_DT
	rDATA->DATA[nCOUNT].OC_COLLECT_TM = OC_COLLECT_TM
	rDATA->DATA[nCOUNT].verified_dt_tm = verified_dt_tm				;003
	;rDATA->DATA[nCOUNT].specimen_type = specimen_type				;003
	;beg 004
	if (specimen_type = "Red-SST")
	  rDATA->DATA[nCOUNT].specimen_type = "Serum"
	elseif (specimen_type in ("Lavender", "Green Hep", "Li Heparin", "Blue"))
	  rDATA->DATA[nCOUNT].specimen_type = "Plasma"
	elseif (specimen_type = "Urine")
	  rDATA->DATA[nCOUNT].specimen_type = "Urine"
	else
	  rDATA->DATA[nCOUNT].specimen_type = specimen_type
	endif
;end 004
 
	rDATA->DATA[nCOUNT].OC_LOWER_LIMIT = OC_LOWER_LIMIT
	rDATA->DATA[nCOUNT].OC_UPPER_LIMIT = OC_UPPER_LIMIT
	rDATA->DATA[nCOUNT].ACCESSION = ACCESSION
	rDATA->DATA[nCOUNT].GRID_POSITION = nGRID_POSITION
	rDATA->DATA[nCOUNT].STATS = STATS
	rDATA->DATA[nCOUNT].RESULT = RESULT
	rDATA->DATA[nCOUNT].NORMALCY = NORMALCY
	rDATA->DATA[nCOUNT].NORMALCY_CD = NORMALCY_CD
	IF (NORMALCY_CD IN (201, 203, 207, 211)) ; Check for Abnormal, Crit, Hi, and Low flags
		rDATA->DATA[nCOUNT].RESULT_FLAG = "#"
	ELSE
		rDATA->DATA[nCOUNT].RESULT_FLAG = ""
	ENDIF
 
	rDATA->DATA[nCOUNT].TIMEPOINT = OE_FIELD_DISPLAY_VALUE
 
	; Convert timepoint to Oracle Clinical format
	temp_pos1 = FINDSTRING("_H", OE_FIELD_DISPLAY_VALUE, 1, 0)
	temp_pos2 = FINDSTRING("_M", OE_FIELD_DISPLAY_VALUE, 1, 0)
	IF (temp_pos1 > 0)
		rDATA->DATA[nCOUNT].VISIT = SUBSTRING(1, (temp_pos1 - 1),
			OE_FIELD_DISPLAY_VALUE)
		IF (temp_pos2 > 0)
			rDATA->DATA[nCOUNT].TPD_H = SUBSTRING((temp_pos1 + 2),(temp_pos2 - temp_pos1 - 2),
				OE_FIELD_DISPLAY_VALUE)
			rDATA->DATA[nCOUNT].TPD_M = SUBSTRING((temp_pos2 + 2),(TEXTLEN(OE_FIELD_DISPLAY_VALUE) - temp_pos2 - 2),
				OE_FIELD_DISPLAY_VALUE)
		ELSE
			rDATA->DATA[nCOUNT].TPD_H = SUBSTRING((temp_pos1 + 2),(TEXTLEN(OE_FIELD_DISPLAY_VALUE) - temp_pos1 - 2),
				OE_FIELD_DISPLAY_VALUE)
			rDATA->DATA[nCOUNT].TPD_M = ""
		ENDIF
	ELSEIF (temp_pos2 > 0 and temp_pos1 = 0)
		rDATA->DATA[nCOUNT].VISIT = SUBSTRING(1, (temp_pos2 - 1),
			OE_FIELD_DISPLAY_VALUE)
		rDATA->DATA[nCOUNT].TPD_H = ""
		rDATA->DATA[nCOUNT].TPD_M = SUBSTRING((temp_pos2 + 2),(TEXTLEN(OE_FIELD_DISPLAY_VALUE) - temp_pos2 - 2),
			OE_FIELD_DISPLAY_VALUE)
	ELSE
		rDATA->DATA[nCOUNT].VISIT = OE_FIELD_DISPLAY_VALUE
		rDATA->DATA[nCOUNT].TPD_H = ""
		rDATA->DATA[nCOUNT].TPD_M = ""
	ENDIF
 
	; Convert test units, where applicable
	IF (Findstring("10e", VSF_TEST_UNITS,1, 3) > 0)
		rDATA->DATA[nCOUNT].VSF_TEST_UNITS = CONCAT("10*", SUBSTRING(4,SIZE(VSF_TEST_UNITS,1),VSF_TEST_UNITS))
	ELSEIF (Findstring(":1", VSF_TEST_UNITS,1, 3) > 0)
		rDATA->DATA[nCOUNT].VSF_TEST_UNITS = "RATIO"
	ELSE
		rDATA->DATA[nCOUNT].VSF_TEST_UNITS = VSF_TEST_UNITS
	ENDIF
	; Ignore "-" values where duplicate results are involved
	IF (vIGNORE = 1)
		nCOUNT = nCOUNT - 1
	ENDIF
 
	ELSE
		X = 0
	ENDIF
FOOT VSF_TEST_NAME
	X = 0
FOOT PARAM_ORDER
	X = 0
FOOT PARAMETER_TYPE
	FOR (nLOOP = 1 TO nREF_CNT)
		IF (rDATA->REF_MAP[nLOOP].PARAMETER_TYPE = PARAMETER_TYPE)
			rDATA->REF_MAP[nLOOP].MAX_TESTS = nGRID_POSITION
		ENDIF
	ENDFOR
FOOT CLASS_ORDER
	X = 0
FOOT REPORT
	rDATA->REF_CNT = nREF_CNT
	STAT = ALTERLIST(rDATA->REF_MAP, nREF_CNT)
	rDATA->COUNT = nCOUNT
	STAT = ALTERLIST(rDATA->DATA, nCOUNT)
WITH COUNTER
 
; Exit program if no rows returned from main select statement
IF (CURQUAL = 0)
	SET vERR_FLAG = 1
	SET vERR_MSG_1 = "No results found."
	SET vERR_MSG_2 = " "
	GO TO ERROR_FOUND
ENDIF
 
 call echorecord(rdata)
; Collect any required ORDER_DETAIL records
;SELECT INTO "NL:"
;	OE_FIELD_DISPLAY_VALUE	= OD.OE_FIELD_DISPLAY_VALUE
;FROM	(DUMMYT				D WITH SEQ=VALUE(rDATA->COUNT)),
;		ORDER_DETAIL		OD
;PLAN D
;JOIN OD
;	WHERE OD.ORDER_ID = rDATA->DATA[D.SEQ].ORDER_ID
;	AND   OD.OE_FIELD_MEANING IN ("DCDISPLAYDAYS")
;DETAIL
;	rDATA->DATA[D.SEQ].TIMEPOINT = OE_FIELD_DISPLAY_VALUE
;
;	; Convert timepoint to Oracle Clinical format
;	temp_pos1 = FINDSTRING("_H", OE_FIELD_DISPLAY_VALUE, 1, 0)
;	temp_pos2 = FINDSTRING("_M", OE_FIELD_DISPLAY_VALUE, 1, 0)
;	IF (temp_pos1 > 0)
;		rDATA->DATA[D.SEQ].VISIT = SUBSTRING(1, (temp_pos1 - 1),
;			OE_FIELD_DISPLAY_VALUE)
;		IF (temp_pos2 > 0)
;			rDATA->DATA[D.SEQ].TPD_H = SUBSTRING((temp_pos1 + 2),(temp_pos2 - temp_pos1 - 2),
;				OE_FIELD_DISPLAY_VALUE)
;			rDATA->DATA[D.SEQ].TPD_M = SUBSTRING((temp_pos2 + 2),(TEXTLEN(OE_FIELD_DISPLAY_VALUE) - temp_pos2 - 2),
;				OE_FIELD_DISPLAY_VALUE)
;		ELSE
;			rDATA->DATA[D.SEQ].TPD_H = SUBSTRING((temp_pos1 + 2),(TEXTLEN(OE_FIELD_DISPLAY_VALUE) - temp_pos1 - 2),
;				OE_FIELD_DISPLAY_VALUE)
;			rDATA->DATA[D.SEQ].TPD_M = ""
;		ENDIF
;	ELSEIF (temp_pos2 > 0 and temp_pos1 = 0)
;		rDATA->DATA[D.SEQ].VISIT = SUBSTRING(1, (temp_pos2 - 1),
;			OE_FIELD_DISPLAY_VALUE)
;		rDATA->DATA[D.SEQ].TPD_H = ""
;		rDATA->DATA[D.SEQ].TPD_M = SUBSTRING((temp_pos2 + 2),(TEXTLEN(OE_FIELD_DISPLAY_VALUE) - temp_pos2 - 2),
;			OE_FIELD_DISPLAY_VALUE)
;	ELSE
;		rDATA->DATA[D.SEQ].VISIT = OE_FIELD_DISPLAY_VALUE
;		rDATA->DATA[D.SEQ].TPD_H = ""
;		rDATA->DATA[D.SEQ].TPD_M = ""
;	ENDIF
;
;WITH COUNTER
 
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
	IF (ISNUMERIC(SUBJECT_ID) > 0)
		rDATA->DATA[D.SEQ].SUBJECT_INDEX = CNVTINT(SUBJECT_ID)
	ELSE
		rDATA->DATA[D.SEQ].SUBJECT_INDEX = 0
	ENDIF
WITH COUNTER
 
; Collect a unique list of dose groups
SELECT INTO "NL:"
	DOSE_GROUP			= rDATA->DATA[D1.SEQ].DOSE_GROUP,
	REFERRING_COMMENT	= rDATA->DATA[D1.SEQ].REFERRING_COMMENT
FROM	(DUMMYT			D1 WITH SEQ=VALUE(rDATA->COUNT))
WHERE rDATA->DATA[D1.SEQ].DOSE_GROUP > " "
ORDER DOSE_GROUP
HEAD REPORT
	nCOUNT = 0
	STAT = ALTERLIST(rDATA->DOSE_GROUP, 10)
HEAD DOSE_GROUP
	nCOUNT = nCOUNT + 1
	IF (MOD(nCOUNT,10) = 1 AND nCOUNT > 10)
		STAT = ALTERLIST(rDATA->DOSE_GROUP, nCOUNT + 10)
	ENDIF
	rDATA->DOSE_GROUP[nCOUNT].DOSE_GROUP = DOSE_GROUP
	rDATA->DOSE_GROUP[nCOUNT].REFERRING_COMMENT = REFERRING_COMMENT
	rDATA->DOSE_GROUP[nCOUNT].DG_POS_VAL = nCOUNT
	; Identify and label the control group
	rDATA->DOSE_GROUP[nCOUNT].DG_CONTROL = 0
FOOT REPORT
	rDATA->DG_CNT = nCOUNT
	STAT = ALTERLIST(rDATA->DOSE_GROUP, nCOUNT)
WITH COUNTER
 
; Store dose group position in main record structure
SELECT INTO "NL:"
	DOSE_GROUP			= rDATA->DATA[D1.SEQ].DOSE_GROUP
FROM	(DUMMYT		D1 WITH SEQ=VALUE(rDATA->COUNT))
PLAN D1
ORDER BY DOSE_GROUP
HEAD REPORT
	nCOUNTER = rDATA->DG_CNT
DETAIL
	FOR (nLOOP = 1 to nCOUNTER)
		IF(rDATA->DATA[D1.SEQ].DOSE_GROUP = rDATA->DOSE_GROUP[nLOOP].DOSE_GROUP)
			rDATA->DATA[D1.SEQ].DG_POS_VAL = rDATA->DOSE_GROUP[nLOOP].DG_POS_VAL
			rDATA->DATA[D1.SEQ].DG_CONTROL = rDATA->DOSE_GROUP[nLOOP].DG_CONTROL
		ENDIF
	ENDFOR
WITH COUNTER
 
; Collect a unique list of timepoints
SELECT INTO "NL:"
	TIMEPOINT			= rDATA->DATA[D1.SEQ].TIMEPOINT
FROM	(DUMMYT			D1 WITH SEQ=VALUE(rDATA->COUNT))
ORDER TIMEPOINT
HEAD REPORT
	nCOUNT = 0
	STAT = ALTERLIST(rDATA->TMPT_LIST, 10)
HEAD TIMEPOINT
	nCOUNT = nCOUNT + 1
	IF (MOD(nCOUNT,10) = 1 AND nCOUNT > 10)
		STAT = ALTERLIST(rDATA->TMPT_LIST, nCOUNT + 10)
	ENDIF
	IF (nCOUNT = 1)
		rDATA->TMPT_LIST[1].TIMEPOINT = TIMEPOINT
		rDATA->TMPT_LIST[1].TMPT_POS_VAL = 1
	ELSEIF ((FINDSTRING("-",TIMEPOINT,1) > 0) AND (nCOUNT > 1))
		FOR (nLOOP=1 to (nCOUNT - 1))
			rDATA->TMPT_LIST[nCOUNT - nLOOP + 1].TIMEPOINT = rDATA->TMPT_LIST[nCOUNT - nLOOP].TIMEPOINT
			rDATA->TMPT_LIST[nCOUNT - nLOOP + 1].TMPT_POS_VAL = nCOUNT - nLOOP + 1
		ENDFOR
		rDATA->TMPT_LIST[1].TIMEPOINT = TIMEPOINT
		rDATA->TMPT_LIST[1].TMPT_POS_VAL = 1
	ELSE
		rDATA->TMPT_LIST[nCOUNT].TIMEPOINT = TIMEPOINT
		rDATA->TMPT_LIST[nCOUNT].TMPT_POS_VAL = nCOUNT
	ENDIF
	rDATA->TMPT_LIST[nCOUNT].TMPT_BASELINE = 0
FOOT REPORT
	rDATA->TMPT_CNT = nCOUNT
	STAT = ALTERLIST(rDATA->TMPT_LIST, nCOUNT)
WITH COUNTER
 
; Store the timepoint position in main record structure
SELECT INTO "NL:"
	TIMEPOINT			= rDATA->DATA[D1.SEQ].TIMEPOINT
FROM	(DUMMYT		D1 WITH SEQ=VALUE(rDATA->COUNT))
HEAD REPORT
	nCOUNTER = rDATA->TMPT_CNT
DETAIL
	FOR (nLOOP = 1 to nCOUNTER)
		IF(rDATA->DATA[D1.SEQ].TIMEPOINT = rDATA->TMPT_LIST[nLOOP].TIMEPOINT)
			rDATA->DATA[D1.SEQ].TMPT_POS_VAL = rDATA->TMPT_LIST[nLOOP].TMPT_POS_VAL
			rDATA->DATA[D1.SEQ].TMPT_BASELINE = rDATA->TMPT_LIST[nLOOP].TMPT_BASELINE
		ENDIF
	ENDFOR
WITH COUNTER
 
; ECHO source record structure to file
; CALL ECHORECORD(rDATA)
; CALL ECHO(nOFFSET)
 
 
 
; Collect the result comments
SELECT INTO "NL:"
	RESULT_ID			= RC.RESULT_ID,
	ACTION_SEQUENCE		= RC.ACTION_SEQUENCE,
	COMMENT_DATE		= FORMAT(RC.COMMENT_DT_TM, "DD-Mmm-YYYY HH:MM;;Q"),
	TWO_LETTERS			= IF (SUBSTRING(3,1,LT.LONG_TEXT) = "-")
							SUBSTRING(1,2,LT.LONG_TEXT)
						  ELSE
						  	" "
						  ENDIF,
	COMMENT				= LT.LONG_TEXT
FROM	(DUMMYT				D WITH SEQ=VALUE(rDATA->COUNT)),
		RESULT				R,
		RESULT_COMMENT		RC,
		LONG_TEXT			LT
PLAN D
JOIN R
	WHERE R.ORDER_ID = rDATA->DATA[D.SEQ].ORDER_ID
	AND   R.CATALOG_CD = rDATA->DATA[D.SEQ].CATALOG_CD
	AND   R.TASK_ASSAY_CD = rDATA->DATA[D.SEQ].TASK_ASSAY_CD
JOIN RC
	WHERE RC.RESULT_ID = R.RESULT_ID
	AND RC.LONG_TEXT_ID = (SELECT MAX(RC2.LONG_TEXT_ID)
						   FROM RESULT_COMMENT RC2
						   WHERE RC2.RESULT_ID =RC.RESULT_ID)
JOIN LT
	WHERE LT.LONG_TEXT_ID = RC.LONG_TEXT_ID
ORDER BY RESULT_ID, ACTION_SEQUENCE
DETAIL
	nCOUNT = rDATA->DATA[D.SEQ].COMMENT_CNT + 1
	rDATA->DATA[D.SEQ].COMMENT_CNT = nCOUNT
	STAT = ALTERLIST(rDATA->DATA[D.SEQ].COMMENTS, nCOUNT)
	rDATA->DATA[D.SEQ].COMMENTS[nCOUNT].ACTION_SEQUENCE = ACTION_SEQUENCE
	rDATA->DATA[D.SEQ].COMMENTS[nCOUNT].TWO_LETTERS = TWO_LETTERS
	rDATA->DATA[D.SEQ].COMMENTS[nCOUNT].COMMENT = COMMENT
	rDATA->DATA[D.SEQ].TWO_LETTERS = TWO_LETTERS
	rDATA->DATA[D.SEQ].COMMENT = COMMENT
WITH COUNTER
 
; Parse through the result comments and store the most recent comments in the comments
; array for reporting
SELECT INTO "NL:"
	TWO_LETTERS		= rDATA->DATA[D1.SEQ].TWO_LETTERS,
	COMMENT			= rDATA->DATA[D1.SEQ].COMMENT
FROM (DUMMYT				D1 WITH SEQ=VALUE(rDATA->COUNT))
PLAN D1
HEAD REPORT
	nCOM_COUNT = 0
	STAT = ALTERLIST(rDATA->COMMENTS, 10)
DETAIL
	IF (TWO_LETTERS = "NR")
		IF ($IGNORE_NR = "0")
			rDATA->DATA[D1.SEQ].NR = 1
		ENDIF
	ELSEIF (TWO_LETTERS NOT IN ("NR","AT"))
		IF (TWO_LETTERS IN ("XX","XF"))
			rDATA->DATA[D1.SEQ].XX = 1
		ENDIF
		nCOM_COUNT = nCOM_COUNT + 1
		IF(MOD(nCOM_COUNT,10) = 1 AND nCOM_COUNT > 10)
			STAT = ALTERLIST(rDATA->COMMENTS, nCOM_COUNT + 10)
		ENDIF
		rDATA->COMMENTS[nCOM_COUNT].TWO_LETTERS = TWO_LETTERS
		rDATA->COMMENTS[nCOM_COUNT].COMMENT = COMMENT
	ENDIF
FOOT REPORT
	rDATA->COM_COUNT = nCOM_COUNT
	STAT = ALTERLIST(rDATA->COMMENTS, nCOM_COUNT)
WITH COUNTER
 
/*****************************************************************************
; Move the Raw Data into a format acceptable for printing the raw data report
******************************************************************************/
IF ($REPORT_TYPE IN ("OCR"))
	SELECT INTO "NL:"
		PARAMETER_TYPE		= rDATA->DATA[D1.SEQ].PARAMETER_TYPE,
		SPECIES				= rDATA->DATA[D1.SEQ].SPECIES,
		SEX					= rDATA->DATA[D1.SEQ].SEX,
		DOSE_GROUP			= rDATA->DATA[D1.SEQ].DOSE_GROUP,
		REFERRING_COMMENT	= rDATA->DATA[D1.SEQ].REFERRING_COMMENT,
		SUBJECT_ID			= rDATA->DATA[D1.SEQ].SUBJECT_ID,
		SUBJECT_INDEX		= rDATA->DATA[D1.SEQ].SUBJECT_INDEX,
		TIMEPOINT			= rDATA->DATA[D1.SEQ].TIMEPOINT,
		TMPT_POS_VAL		= rDATA->DATA[D1.SEQ].TMPT_POS_VAL,
		TMPT_BASELINE		= rDATA->DATA[D1.SEQ].TMPT_BASELINE,
		COLLECT_DATE		= rDATA->DATA[D1.SEQ].COLLECT_DATE,
		COLLECT_DT_TM_2		= rDATA->DATA[D1.SEQ].COLLECT_DT_TM_2,
		VSF_TEST_NAME		= rDATA->DATA[D1.SEQ].VSF_TEST_NAME,
;		OC_TEST_NAME		= rDATA->DATA[D1.SEQ].OC_TEST_NAME,
;		OC_TEST_CODE		= rDATA->DATA[D1.SEQ].OC_TEST_CODE,
		VSF_TEST_UNITS		= rDATA->REF_MAP[D2.SEQ].VSF_TEST_UNITS,
;		OC_TEST_UNITS		= rDATA->REF_MAP[D2.SEQ].VSF_TEST_UNITS,
		GRID_POSITION		= rDATA->REF_MAP[D2.SEQ].GRID_POSITION,
		MAX_TESTS			= rDATA->REF_MAP[D2.SEQ].MAX_TESTS,
		RESULT				= rDATA->DATA[D1.SEQ].RESULT,
		CHANGE_RPT			= rDATA->DATA[D1.SEQ].CHANGE_RPT,
		P_CHANGE_SIGN		= rDATA->DATA[D1.SEQ].P_CHANGE_SIGN,
		NORMALCY			= rDATA->DATA[D1.SEQ].RESULT_FLAG	; Set result flag ("#") to report normalcy field
	FROM	(DUMMYT			D1 WITH SEQ=VALUE(rDATA->COUNT)),
			(DUMMYT			D2 WITH SEQ=VALUE(rDATA->REF_CNT))
	PLAN D1
		WHERE rDATA->DATA[D1.SEQ].NR = 0	; Do not show tests with NR Comment
		AND rDATA->DATA[D1.SEQ].SUBJECT_ID > " "
	JOIN D2
		WHERE rDATA->DATA[D1.SEQ].PARAMETER_TYPE = rDATA->REF_MAP[D2.SEQ].PARAMETER_TYPE
		AND   rDATA->DATA[D1.SEQ].VSF_TEST_NAME = rDATA->REF_MAP[D2.SEQ].VSF_TEST_NAME
	ORDER BY PARAMETER_TYPE, SPECIES, SEX DESC, DOSE_GROUP, SUBJECT_INDEX, SUBJECT_ID, COLLECT_DT_TM_2, TMPT_POS_VAL, GRID_POSITION
	HEAD REPORT
		nCOUNT = 0
		STAT = ALTERLIST(rREPORT->DATA, 500)
	HEAD PARAMETER_TYPE
		X = 0
	HEAD SPECIES
		X = 0
	HEAD SEX
		X = 0
	HEAD DOSE_GROUP
		X = 0
	HEAD SUBJECT_INDEX
		X = 0
	HEAD SUBJECT_ID
		X = 0
	HEAD COLLECT_DT_TM_2
		X = 0
	HEAD TMPT_POS_VAL
		nRESULT_PAGE = 0
		nRESULT_COUNT = 0
		nPOSITION = 0
	HEAD GRID_POSITION
		IF (nRESULT_PAGE = 0)
			; Check to see if the first GRID_POSITION begins on a different page
			nFACTOR = 0
			IF (GRID_POSITION > nRAW_RESULTS)
				nREMAINDER = GRID_POSITION
				nWHILE = 1
				WHILE (nWHILE > 0)
					nFACTOR = nFACTOR + 1
					nREMAINDER = nREMAINDER - nRAW_RESULTS
					IF (nREMAINDER <= 0)
						nWHILE = 0
						nFACTOR = nFACTOR - 1
					ENDIF
				ENDWHILE
				nRESULT_PAGE = nFACTOR
			ENDIF
			nPOSITION = GRID_POSITION
			nRESULT_COUNT = 1
		ELSE ; Check to page forward results
			; Check to see if the next GRID_POSITION begins on a different page
			IF (nRESULT_COUNT = 0)
				nFACTOR = 0
				IF (GRID_POSITION - nPOSITION > nRAW_RESULTS)
					nREMAINDER = GRID_POSITION
					nWHILE = 1
					WHILE (nWHILE > 0)
						nFACTOR = nFACTOR + 1
						nREMAINDER = nREMAINDER - nRAW_RESULTS
						IF (nREMAINDER <= 0)
							nWHILE = 0
							nFACTOR = nFACTOR - 1
						ENDIF
					ENDWHILE
					nRESULT_PAGE = nFACTOR
				ENDIF
				nPOSITION = GRID_POSITION
				nRESULT_COUNT = 1
			ELSE ; Check to see if the next GRID_POSITION begins on a different page
				nFACTOR = 0
				IF (GRID_POSITION - nPOSITION >= nRAW_RESULTS)
					nREMAINDER = GRID_POSITION
					nWHILE = 1
					WHILE (nWHILE > 0)
						nFACTOR = nFACTOR + 1
						nREMAINDER = nREMAINDER - nRAW_RESULTS
						IF (nREMAINDER <= 0)
							nWHILE = 0
							nFACTOR = nFACTOR - 1
						ENDIF
					ENDWHILE
					nRESULT_PAGE = nFACTOR
					nPOSITION = GRID_POSITION
					nRESULT_COUNT = 1
				ELSEIF ((MOD(GRID_POSITION,nRAW_RESULTS) <= MOD(nPOSITION,nRAW_RESULTS))
						AND (MOD(GRID_POSITION,nRAW_RESULTS) != 0))
					nPOSITION = GRID_POSITION
					nRESULT_COUNT = 1
				ELSE
					nRESULT_COUNT = MOD(GRID_POSITION,nRAW_RESULTS)
					nPOSITION = GRID_POSITION
				ENDIF
			ENDIF
		ENDIF
 
		IF (nRESULT_COUNT = 1)
			nRESULT_COUNT = MOD(GRID_POSITION,nRAW_RESULTS)
			nRESULT_PAGE = nRESULT_PAGE + 1
			nCOUNT = nCOUNT + 1
			IF(MOD(nCOUNT,500)=1 AND nCOUNT > 500)
				STAT = ALTERLIST(rREPORT->DATA, nCOUNT + 500)
			ENDIF
			rREPORT->DATA[nCOUNT].PARAMETER_TYPE = PARAMETER_TYPE
			rREPORT->DATA[nCOUNT].SPECIES = SPECIES
			rREPORT->DATA[nCOUNT].SEX = SEX
			rREPORT->DATA[nCOUNT].DOSE_GROUP = DOSE_GROUP
			rREPORT->DATA[nCOUNT].REFERRING_COMMENT = REFERRING_COMMENT
			rREPORT->DATA[nCOUNT].SUBJECT_ID = SUBJECT_ID
			rREPORT->DATA[nCOUNT].SUBJECT_INDEX = SUBJECT_INDEX
			rREPORT->DATA[nCOUNT].TIMEPOINT = TIMEPOINT
			rREPORT->DATA[nCOUNT].TMPT_POS_VAL = TMPT_POS_VAL
			rREPORT->DATA[nCOUNT].TMPT_BASELINE = TMPT_BASELINE
			rREPORT->DATA[nCOUNT].COLLECT_DATE = COLLECT_DATE
			rREPORT->DATA[nCOUNT].COLLECT_DT_TM_2 = COLLECT_DT_TM_2
			rREPORT->DATA[nCOUNT].RESULT_PAGE = nRESULT_PAGE
			rREPORT->DATA[nCOUNT].RESULT_CNT = MAX_TESTS
 
			; Allocate and clear the results structure
			STAT = ALTERLIST(rREPORT->DATA[nCOUNT].RESULTS, MAX_TESTS)
			FOR (nLOOP = 1 TO MAX_TESTS)
				rREPORT->DATA[nCOUNT].RESULTS[nLOOP].RESULT = "-"
				rREPORT->DATA[nCOUNT].RESULTS[nLOOP].NORMALCY = " "
				rREPORT->DATA[nCOUNT].RESULTS[nLOOP].VSF_TEST_NAME = " "
				rREPORT->DATA[nCOUNT].RESULTS[nLOOP].CHANGE_RPT = "-"
				rREPORT->DATA[nCOUNT].RESULTS[nLOOP].P_CHANGE_SIGN = " "
			ENDFOR
		ENDIF
 
		rREPORT->DATA[nCOUNT].RESULTS[GRID_POSITION].RESULT = RESULT
		rREPORT->DATA[nCOUNT].RESULTS[GRID_POSITION].VSF_TEST_NAME = VSF_TEST_NAME
		rREPORT->DATA[nCOUNT].RESULTS[GRID_POSITION].NORMALCY = NORMALCY
		rREPORT->DATA[nCOUNT].RESULTS[GRID_POSITION].COMMENTS = " "
		rREPORT->DATA[nCOUNT].RESULTS[GRID_POSITION].CHANGE_RPT = CHANGE_RPT
		rREPORT->DATA[nCOUNT].RESULTS[GRID_POSITION].P_CHANGE_SIGN = P_CHANGE_SIGN
 
		; Store 2 letter comments if present
		FOR (nLOOP = 1 TO rDATA->DATA[D1.SEQ].COMMENT_CNT)
			IF (rDATA->DATA[D1.SEQ].COMMENTS[nLOOP].TWO_LETTERS != "AT")
				rREPORT->DATA[nCOUNT].RESULTS[GRID_POSITION].COMMENTS =
					TRIM(rDATA->DATA[D1.SEQ].COMMENTS[nLOOP].TWO_LETTERS)
			ENDIF
		ENDFOR
	FOOT REPORT
		rREPORT->COUNT = nCOUNT
		STAT = ALTERLIST(rREPORT->DATA, nCOUNT)
	WITH COUNTER
ENDIF
 
; CALL ECHORECORD(rREPORT)
 
; ECHO source record rREPORT to file
;	CALL ECHORECORD(rREPORT)
 
 
 
/***************************************************************************************************
;
;									Output Section
;
****************************************************************************************************/
#ERROR_FOUND
EXECUTE ReportRTL
%i cust_script:pfi_oracle_clinical_v4_0.dvl
 
CALL InitializeReport(0)
SET _fEndDetail = RptReport->m_pageHeight - RptReport->m_marginBottom
SET	cPRINT_DATE = FORMAT(CNVTDATETIME(CURDATE, CURTIME3),"DD-Mmm-YYYY HH:MM;;Q")
 
; Check for error status
IF (vDUP_FLAG = 1 OR vERR_FLAG = 1)
	GO TO ERROR_SECTION
ENDIF
 
/*************************************************
; Output the DTA Facesheet
*************************************************/
IF ($REPORT_TYPE IN ("OCR"))
SELECT DISTINCT INTO "NL:"
	CLASS_ORDER			= CVM.CLASS_ORDER,
	VSF_TEST_NAME		= CVM.VSF_TEST_NAME,
	PARAM_ORDER			= CVM.PARAM_ORDER,
	TASK_ASSAY_CD		= CVM.TASK_ASSAY_CD,
	PARAMETER_TYPE		= CVM.PARAMETER_TYPE,
	VSF_TEST_DESCRIPTION= DTA.DESCRIPTION,
	VSF_TEST_UNITS		= CVM.VSF_TEST_UNITS
FROM	(DUMMYT				D WITH SEQ=VALUE(rDATA->COUNT)),
		CERNER_VSF_MAP		CVM,
		DISCRETE_TASK_ASSAY	DTA
PLAN D
		WHERE ($REPORT_TYPE = "S" ; Do not show tests with NR Comment and Hide Alpha Responses
		AND   rDATA->DATA[D.SEQ].NR = 0
		AND   ISNUMERIC(rDATA->DATA[D.SEQ].RESULT) > 0)
		OR    $REPORT_TYPE IN ("OCR")
JOIN CVM
	WHERE CVM.TASK_ASSAY_CD = rDATA->DATA[D.SEQ].TASK_ASSAY_CD
JOIN DTA
	WHERE DTA.TASK_ASSAY_CD = CVM.TASK_ASSAY_CD
ORDER VSF_TEST_NAME,0 ; PARAMETER_TYPE, PARAM_ORDER, VSF_TEST_NAME,0
HEAD REPORT
	X = DTATitle(0)
	nEND = 0
DETAIL
	IF (_Yoffset + DTADetail(1) + Footer(1) > _fEndDetail)
		_Yoffset = 9.22
		X = Footer(0)
		Call PageBreak(0)
		X = DTATitle(0)
	ENDIF
 
	X = DTADetail(0)
FOOT REPORT
	_Yoffset = 9.22
	X = Footer(0)
	Call PageBreak(0)
WITH COUNTER
ENDIF
 
/***************************************
; Output the Comments
****************************************/
IF ($REPORT_TYPE IN ("OCR"))
SET vCOM_COUNT = rDATA->COM_COUNT
SELECT DISTINCT INTO "NL:"
	TWO_LETTERS 	= rDATA->COMMENTS[D.SEQ].TWO_LETTERS,
	COMMENT			= TRIM(rDATA->COMMENTS[D.SEQ].COMMENT,3)
FROM	(DUMMYT				D WITH SEQ=VALUE(rDATA->COM_COUNT))
PLAN D ;WHERE rDATA->COMMENTS[D.SEQ].COMMENT != ""
ORDER TWO_LETTERS, COMMENT,0
HEAD REPORT
	X = CommentTitle(0)
	nEND = 0
	nCOUNT = 0
DETAIL
	nCOUNT = nCOUNT + 1
	IF (_Yoffset + CommentDetail(1) + Footer(1) > _fEndDetail)
		_Yoffset = 9.22
		X = Footer(0)
		Call PageBreak(0)
		X = CommentTitle(0)
	ENDIF
 
	X = CommentDetail(0)
FOOT REPORT
	IF (nCOUNT = 1 and TRIM(COMMENT) = "")
		nCOUNT = 0
		X = CommentDetail(0)
	ENDIF
	_Yoffset = 9.22
	X = Footer(0)
	Call PageBreak(0)
;	CALL ECHO (concat("Comments: ", BUILD(nCOUNT)))
WITH COUNTER
ENDIF
 
/***************************************
; Output the Raw Data Report
***************************************/
IF ($REPORT_TYPE IN ("OCR"))
	SET vTMPT_CNT = rDATA->TMPT_CNT
	SELECT INTO "NL:"
		PARAMETER_TYPE		= rREPORT->DATA[D.SEQ].PARAMETER_TYPE,
		SPECIES				= rREPORT->DATA[D.SEQ].SPECIES,
		SEX					= rREPORT->DATA[D.SEQ].SEX,
		REFERRING_COMMENT	= rREPORT->DATA[D.SEQ].REFERRING_COMMENT,
		DOSE_GROUP			= rREPORT->DATA[D.SEQ].DOSE_GROUP,
		SUBJECT_ID			= rREPORT->DATA[D.SEQ].SUBJECT_ID,
		SUBJECT_INDEX		= rREPORT->DATA[D.SEQ].SUBJECT_INDEX,
		COLLECT_DATE		= rREPORT->DATA[D.SEQ].COLLECT_DATE,
		COLLECT_DT_TM_2		= rREPORT->DATA[D.SEQ].COLLECT_DT_TM_2,
		TIMEPOINT			= rREPORT->DATA[D.SEQ].TIMEPOINT,
		TMPT_POS_VAL		= rREPORT->DATA[D.SEQ].TMPT_POS_VAL,
		RESULT_PAGE			= rREPORT->DATA[D.SEQ].RESULT_PAGE,
		RESULT_CNT			= rREPORT->DATA[D.SEQ].RESULT_CNT
	FROM	(DUMMYT				D WITH SEQ=VALUE(rREPORT->COUNT))
	ORDER PARAMETER_TYPE, SPECIES, SEX DESC, RESULT_PAGE, DOSE_GROUP, SUBJECT_INDEX, SUBJECT_ID, COLLECT_DT_TM_2, TMPT_POS_VAL
	HEAD REPORT
		nBREAK = 0
		nEND = 0
		cTITLE = "Individual Data Listing"
	HEAD PARAMETER_TYPE
		X = 0
	HEAD SPECIES
		X = 0
	HEAD SEX
		X = 0
	HEAD RESULT_PAGE
		; Determine the test names on the header
		nREF = 0
		nROW_POS = 0
		nROWS_PER_SUBJ = 0
		FOR (nLOOP = 1 TO rDATA->REF_CNT)
			IF (rDATA->REF_MAP[nLOOP].PARAMETER_TYPE = PARAMETER_TYPE)
				nREF = nREF + 1
				STAT = ALTERLIST(rTEMP->TESTS, nREF)
				rTEMP->TESTS[nREF].VSF_TEST_NAME = rDATA->REF_MAP[nLOOP].VSF_TEST_NAME
				rTEMP->TESTS[nREF].VSF_TEST_UNITS = rDATA->REF_MAP[nLOOP].VSF_TEST_UNITS
			ENDIF
		ENDFOR
 
		IF (nBREAK = 1)
			_Yoffset = 9.22
			X = Footer(0)
			Call PageBreak(0)
		ENDIF
		nRESULT_CNT = RESULT_CNT
		nPOS = D.SEQ
		nOFFSET = (RESULT_PAGE * nRAW_RESULTS) - nRAW_RESULTS
		X = Header(0)
		X = DetailHeader(0)
	HEAD DOSE_GROUP
		IF (nROW_POS + vTMPT_CNT > nRESULT_ROWS - 3)
			_Yoffset = 9.22
			X = Footer(0)
			Call PageBreak(0)
			X = Header(0)
			X = DetailHeader(0)
			nROW_POS = 0
		ENDIF
		IF ($REPORT_TYPE != "PRETEST")
			X = DetailGroupHeader(0)
		ENDIF
		nROW_POS = nROW_POS + 1
	HEAD SUBJECT_ID
		IF (nROW_POS + nROWS_PER_SUBJ + 1 > nRESULT_ROWS)
			_Yoffset = 9.22
			X = Footer(0)
			Call PageBreak(0)
			X = Header(0)
			X = DetailHeader(0)
			nROW_POS = 0
		ENDIF
		nROWS_PER_SUBJ = 0
	HEAD TMPT_POS_VAL
		nROW_POS = nROW_POS + 1
		nROWS_PER_SUBJ = nROWS_PER_SUBJ + 1
	DETAIL
		nBREAK = 1
 
		nPOS = D.SEQ
		nOFFSET = (RESULT_PAGE * nRAW_RESULTS) - nRAW_RESULTS
 
		IF (_Yoffset + RawDetail(1) + Footer(1) > _fEndDetail)
			X = Footer(0)
			Call PageBreak(0)
			X = Header(0)
			X = DetailHeader(0)
			nROW_POS = 0
		ENDIF
 
		X = RawDetail(0)
	FOOT TMPT_POS_VAL
		X = 0
	FOOT SUBJECT_ID
		X = BlankSection(0)
		nROW_POS = nROW_POS + 1
	FOOT REPORT
		IF (rREPORT->COUNT < 1 )
			X = NoData(0)
		ENDIF
 
		_Yoffset = 9.22
		IF ($REPORT_TYPE = "D")
			nEND = 1
		ENDIF
		X = Footer(0)
	WITH COUNTER, NULLREPORT
 
ENDIF
 
/********************************************
; Output the Individual Listing data extract
*********************************************/
IF ($REPORT_TYPE IN ("OCX"))
	/***********************************************************************
	; Generate output file delimited by a pipe character ("|")
	************************************************************************/
	SET vTEST_CNT = rDATA->REF_CNT
	SET mesgdttm = cnvtstring(cnvtdatetime(curdate, curtime3))
	SET mesgdt_clin = format(curdate, "YYYYMMDD;;D")
	SET file_name = build(cnvtlower(cPROTOCOL), "_lab071_pfepg_", mesgdt_clin, ".csv")
 	SET OUTPUT = concat("cust_reports:", trim(file_name))
 
	SELECT INTO VALUE(OUTPUT)
		PARAMETER_TYPE		= rDATA->DATA[D1.SEQ].PARAMETER_TYPE,
		SPECIES				= rDATA->DATA[D1.SEQ].SPECIES,
		SEX					= rDATA->DATA[D1.SEQ].SEX,
		DOSE_GROUP			= rDATA->DATA[D1.SEQ].DOSE_GROUP,
		REFERRING_COMMENT	= rDATA->DATA[D1.SEQ].REFERRING_COMMENT,
		ACCESSION			= rDATA->DATA[D1.SEQ].ACCESSION,
		SUBJECT_ID			= rDATA->DATA[D1.SEQ].SUBJECT_ID,
		SUBJECT_INDEX		= rDATA->DATA[D1.SEQ].SUBJECT_INDEX,
		TIMEPOINT			= rDATA->DATA[D1.SEQ].TIMEPOINT,
		VISIT				= rDATA->DATA[D1.SEQ].VISIT,
		TPD_H				= rDATA->DATA[D1.SEQ].TPD_H,
		TPD_M				= rDATA->DATA[D1.SEQ].TPD_M,
		TMPT_POS_VAL		= rDATA->DATA[D1.SEQ].TMPT_POS_VAL,
		OC_COLLECT_DT		= rDATA->DATA[D1.SEQ].OC_COLLECT_DT,
		OC_COLLECT_TM		= rDATA->DATA[D1.SEQ].OC_COLLECT_TM,
		COLLECT_DT_TM_SORT	= rDATA->DATA[D1.SEQ].COLLECT_DT_TM_SORT,
		OC_LOWER_LIMIT		= rDATA->DATA[D1.SEQ].OC_LOWER_LIMIT,
		OC_UPPER_LIMIT		= rDATA->DATA[D1.SEQ].OC_UPPER_LIMIT,
		VSF_TEST_NAME		= rDATA->DATA[D1.SEQ].VSF_TEST_NAME,
		VSF_TEST_UNITS		= rDATA->REF_MAP[D2.SEQ].VSF_TEST_UNITS,
		OC_TEST_CODE		= rDATA->DATA[D1.SEQ].OC_TEST_CODE,
		OC_TEST_NAME		= rDATA->DATA[D1.SEQ].OC_TEST_NAME,
		OC_TEST_UNITS		= rDATA->DATA[D1.SEQ].VSF_TEST_UNITS,
		GRID_POSITION		= rDATA->REF_MAP[D2.SEQ].GRID_POSITION,
		MAX_TESTS			= rDATA->REF_MAP[D2.SEQ].MAX_TESTS,
		RESULT				= rDATA->DATA[D1.SEQ].RESULT,
		NORMALCY			= rDATA->DATA[D1.SEQ].RESULT_FLAG	; Set result flag ("#") to report normalcy field
	FROM	(DUMMYT			D1 WITH SEQ=VALUE(rDATA->COUNT)),
			(DUMMYT			D2 WITH SEQ=VALUE(rDATA->REF_CNT))
	PLAN D1
		WHERE rDATA->DATA[D1.SEQ].NR = 0	; Do not show tests with NR Comment
		AND rDATA->DATA[D1.SEQ].SUBJECT_ID > " "
	JOIN D2
		WHERE rDATA->DATA[D1.SEQ].PARAMETER_TYPE = rDATA->REF_MAP[D2.SEQ].PARAMETER_TYPE
		AND   rDATA->DATA[D1.SEQ].VSF_TEST_NAME = rDATA->REF_MAP[D2.SEQ].VSF_TEST_NAME
	ORDER BY PARAMETER_TYPE, SPECIES, SEX DESC, DOSE_GROUP, SUBJECT_INDEX, SUBJECT_ID, COLLECT_DT_TM_SORT, GRID_POSITION
	HEAD REPORT
		strngHldr = trim("STUDY,LABID,ACCESSION,SSID,VISIT,COLL_D,COLL_T,TPD_H,TPD_M,TPP_H,TPP_M,LB_TSTID,")
		strngHldr = concat(strngHldr,trim("PFE_TSTID,CHALLENGED,TSTRES,TSTRES_UNT,LIMIT_U,LIMIT_L,START_D,STOP_D,START_T,STOP_T,LLQ"))
		col 0 strngHldr
 
	HEAD PARAMETER_TYPE
		X = 0
	HEAD SPECIES
		X = 0
	HEAD SEX
		X = 0
	HEAD DOSE_GROUP
		X = 0
	HEAD SUBJECT_INDEX
		X = 0
	HEAD SUBJECT_ID
		X = 0
	HEAD COLLECT_DT_TM_SORT
		X = 0
	DETAIL
; CALL ECHO(SUBJECT_ID)
; CALL ECHO(TIMEPOINT)
; CALL ECHO(GRID_POSITION)
 
		IF (TEXTLEN(OC_COLLECT_TM) = 5)
			OC_COLLECT_TM_tmp = concat("0",trim(OC_COLLECT_TM))
		ELSE
			OC_COLLECT_TM_tmp = OC_COLLECT_TM
		ENDIF
		row + 1
		strngHldr = concat(trim(cPROTOCOL),",","6702",",",trim(ACCESSION),",",trim(SUBJECT_ID),",")
		strngHldr = concat(strngHldr,trim(VISIT),",",trim(OC_COLLECT_DT),",",trim(OC_COLLECT_TM_tmp),",")
		strngHldr = concat(strngHldr,trim(TPD_H),",",trim(TPD_M),",")
		strngHldr = concat(strngHldr,",,",trim(VSF_TEST_NAME),",",trim(OC_TEST_CODE),",,")
		strngHldr = concat(strngHldr,trim(RESULT),",",trim(CNVTUPPER(OC_TEST_UNITS)),",",trim(OC_UPPER_LIMIT),",")
		strngHldr = concat(strngHldr,trim(OC_LOWER_LIMIT),",,,,,")
		col 0 strngHldr
 
	WITH format = variable, noheading, formfeed=none, maxrow=1, maxcol=32000, nullreport
 
 /*
; FTP the extract file to a front end fileshare
 
if(dbNme = "BUILD")
set batch_filename_loc = value(trim(concat("/cerner/d_build/ccluserdir/",trim(file_name))))
 
; set batch_filename_loc = value(trim(concat("/cerner/d_build/ccluserdir/", cnvtlower($OUTDEV),"_octest.csv")))
elseif(dbNme = "CERT")
set batch_filename_loc = value(trim(concat("/cerner/d_cert/ccluserdir/",trim(file_name))))
 
; set batch_filename_loc = value(trim(concat("/cerner/d_cert/ccluserdir/", cnvtlower($OUTDEV),"_octest.csv")))
elseif(dbNme = "PROD")
set batch_filename_loc = value(trim(concat("/cerner/d_prod/ccluserdir/",trim(file_name))))
 
; set batch_filename_loc = value(trim(concat("/cerner/d_prod/ccluserdir/", cnvtlower($OUTDEV),"_octest.csv")))
endif
 
set new_full_name = value(trim(file_name))
; set new_full_name = value(trim(concat(cnvtlower($OUTDEV),"_octest.csv")))
 
set remote_domain = "170.116.246.217" ; (AMRNDHW1437)
set remote_username = "cerner_reports"
set remote_password = "!QAZ2wsx"
 
set ftp_command = concat('print "', 'open ', remote_domain, '\n',
                                    'user ', remote_username, ' ', remote_password, '\n',
                                    'binary \n',
                                    'put ', batch_filename_loc, ' ', new_full_name,
                                '"','| ftp -i -n')
 
free set command
set command = ftp_command
set status = 0
call dcl(command,size(trim(command)),status)
 */
elseif ($REPORT_TYPE IN ("PDS"))
 
	/***********************************************************************
	; Generate output file delimited by a pipe character ("|")
	************************************************************************/
	SET vTEST_CNT = rDATA->REF_CNT
	SET mesgdttm = cnvtstring(cnvtdatetime(curdate, curtime3))
	SET mesgdt_clin = format(curdate, "YYYYMMDD;;D")
	SET file_name = build(cnvtlower(cPROTOCOL), "_labdpds_pfepg_", value($sensitivity), "_",mesgdt_clin, ".csv")
 	SET OUTPUT = concat("cust_reports:", trim(file_name))
 
	SELECT INTO VALUE(OUTPUT)
		PARAMETER_TYPE		= rDATA->DATA[D1.SEQ].PARAMETER_TYPE,
		SPECIES				= rDATA->DATA[D1.SEQ].SPECIES,
		SEX					= rDATA->DATA[D1.SEQ].SEX,
		DOSE_GROUP			= rDATA->DATA[D1.SEQ].DOSE_GROUP,
		REFERRING_COMMENT	= rDATA->DATA[D1.SEQ].REFERRING_COMMENT,
		ACCESSION			= rDATA->DATA[D1.SEQ].ACCESSION,
		SUBJECT_ID			= rDATA->DATA[D1.SEQ].SUBJECT_ID,
		SUBJECT_INDEX		= rDATA->DATA[D1.SEQ].SUBJECT_INDEX,
		TIMEPOINT			= rDATA->DATA[D1.SEQ].TIMEPOINT,
		VISIT				= rDATA->DATA[D1.SEQ].VISIT,
		TPD_H				= rDATA->DATA[D1.SEQ].TPD_H,
		TPD_M				= rDATA->DATA[D1.SEQ].TPD_M,
		TMPT_POS_VAL		= rDATA->DATA[D1.SEQ].TMPT_POS_VAL,
		OC_COLLECT_DT		= rDATA->DATA[D1.SEQ].OC_COLLECT_DT,
		OC_COLLECT_TM		= rDATA->DATA[D1.SEQ].OC_COLLECT_TM,
		verified_dt_tm		= rDATA->DATA[d1.seq].verified_dt_tm,							;003
		COLLECT_DT_TM_SORT	= rDATA->DATA[D1.SEQ].COLLECT_DT_TM_SORT,
		OC_LOWER_LIMIT		= rDATA->DATA[D1.SEQ].OC_LOWER_LIMIT,
		OC_UPPER_LIMIT		= rDATA->DATA[D1.SEQ].OC_UPPER_LIMIT,
		VSF_TEST_NAME		= rDATA->DATA[D1.SEQ].VSF_TEST_NAME,
		VSF_TEST_UNITS		= rDATA->REF_MAP[D2.SEQ].VSF_TEST_UNITS,
		OC_TEST_CODE		= rDATA->DATA[D1.SEQ].OC_TEST_CODE,
		OC_TEST_NAME		= rDATA->DATA[D1.SEQ].OC_TEST_NAME,
		OC_TEST_UNITS		= rDATA->DATA[D1.SEQ].VSF_TEST_UNITS,
		GRID_POSITION		= rDATA->REF_MAP[D2.SEQ].GRID_POSITION,
		MAX_TESTS			= rDATA->REF_MAP[D2.SEQ].MAX_TESTS,
		RESULT				= rDATA->DATA[D1.SEQ].RESULT,
		NORMALCY			= rDATA->DATA[D1.SEQ].RESULT_FLAG	; Set result flag ("#") to report normalcy field
	FROM	(DUMMYT			D1 WITH SEQ=VALUE(rDATA->COUNT)),
			(DUMMYT			D2 WITH SEQ=VALUE(rDATA->REF_CNT))
	PLAN D1
		WHERE rDATA->DATA[D1.SEQ].NR = 0	; Do not show tests with NR Comment
		AND rDATA->DATA[D1.SEQ].SUBJECT_ID > " "
	JOIN D2
		WHERE rDATA->DATA[D1.SEQ].PARAMETER_TYPE = rDATA->REF_MAP[D2.SEQ].PARAMETER_TYPE
		AND   rDATA->DATA[D1.SEQ].VSF_TEST_NAME = rDATA->REF_MAP[D2.SEQ].VSF_TEST_NAME
	ORDER BY PARAMETER_TYPE, SPECIES, SEX DESC, DOSE_GROUP, SUBJECT_INDEX, SUBJECT_ID, COLLECT_DT_TM_SORT, GRID_POSITION
	HEAD REPORT
		strngHldr = trim("STUDY,LABID,ACCESSION,SSID,VISIT,COLL_D,COLL_T,TPD_H,TPD_M,TPP_H,TPP_M,LAB_ANALYZED_DATE,LB_TSTID,")
		strngHldr = concat(strngHldr,trim("PFE_TSTID,CHALLENGED,TSTRES,TSTRES_UNT,LIMIT_U,LIMIT_L,START_D,STOP_D,START_T,STOP_T,LLQ"))
		col 0 strngHldr
 
	HEAD PARAMETER_TYPE
		X = 0
	HEAD SPECIES
		X = 0
	HEAD SEX
		X = 0
	HEAD DOSE_GROUP
		X = 0
	HEAD SUBJECT_INDEX
		X = 0
	HEAD SUBJECT_ID
		X = 0
	HEAD COLLECT_DT_TM_SORT
		X = 0
	DETAIL
; CALL ECHO(SUBJECT_ID)
; CALL ECHO(TIMEPOINT)
; CALL ECHO(GRID_POSITION)
 
		IF (TEXTLEN(OC_COLLECT_TM) = 5)
			OC_COLLECT_TM_tmp = concat("0",trim(OC_COLLECT_TM))
		ELSE
			OC_COLLECT_TM_tmp = OC_COLLECT_TM
		ENDIF
		row + 1
		strngHldr = concat(trim(cPROTOCOL),",","6702",",",trim(ACCESSION),",",trim(SUBJECT_ID),",")
		strngHldr = concat(strngHldr,trim(VISIT),",",trim(OC_COLLECT_DT),",",trim(OC_COLLECT_TM_tmp),",")
		strngHldr = concat(strngHldr,trim(TPD_H),",",trim(TPD_M),",")
		strngHldr = concat(strngHldr,",,",trim(verified_dt_tm),",",trim(VSF_TEST_NAME),",",trim(OC_TEST_CODE),",,")
		strngHldr = concat(strngHldr,trim(RESULT),",",trim(CNVTUPPER(OC_TEST_UNITS)),",",trim(OC_UPPER_LIMIT),",")
		strngHldr = concat(strngHldr,trim(OC_LOWER_LIMIT),",,,,,")
		col 0 strngHldr
 
	WITH format = variable, noheading, formfeed=none, maxrow=1, maxcol=32000, nullreport
 
 /*
; FTP the extract file to a front end fileshare
 
if(dbNme = "BUILD")
set batch_filename_loc = value(trim(concat("/cerner/d_build/ccluserdir/",trim(file_name))))
 
; set batch_filename_loc = value(trim(concat("/cerner/d_build/ccluserdir/", cnvtlower($OUTDEV),"_octest.csv")))
elseif(dbNme = "CERT")
set batch_filename_loc = value(trim(concat("/cerner/d_cert/ccluserdir/",trim(file_name))))
 
; set batch_filename_loc = value(trim(concat("/cerner/d_cert/ccluserdir/", cnvtlower($OUTDEV),"_octest.csv")))
elseif(dbNme = "PROD")
set batch_filename_loc = value(trim(concat("/cerner/d_prod/ccluserdir/",trim(file_name))))
 
; set batch_filename_loc = value(trim(concat("/cerner/d_prod/ccluserdir/", cnvtlower($OUTDEV),"_octest.csv")))
endif
 
set new_full_name = value(trim(file_name))
; set new_full_name = value(trim(concat(cnvtlower($OUTDEV),"_octest.csv")))
 
set remote_domain = "170.116.246.217" ; (AMRNDHW1437)
set remote_username = "cerner_reports"
set remote_password = "!QAZ2wsx"
 
set ftp_command = concat('print "', 'open ', remote_domain, '\n',
                                    'user ', remote_username, ' ', remote_password, '\n',
                                    'binary \n',
                                    'put ', batch_filename_loc, ' ', new_full_name,
                                '"','| ftp -i -n')
 
free set command
set command = ftp_command
set status = 0
call dcl(command,size(trim(command)),status)
 */
elseif ($REPORT_TYPE IN ("CAPS"))
 call echo(cProtocol)
	/***********************************************************************
	; Generate output file delimited by a pipe character ("|")
	************************************************************************/
	SET vTEST_CNT = rDATA->REF_CNT
	SET mesgdttm = cnvtstring(cnvtdatetime(curdate, curtime3))
	SET mesgdt_clin = format(curdate, "YYYYMMDD;;D")
	SET file_name = build(cnvtlower(cPROTOCOL), "_lbcaps_dsrdlab_", $sensitivity, "_", mesgdt_clin, ".csv") ;
 	SET OUTPUT = concat("cust_reports:", trim(file_name))
 	call echorecord (rdata)
 
	SELECT INTO VALUE(OUTPUT)
		PARAMETER_TYPE		= rDATA->DATA[D1.SEQ].PARAMETER_TYPE,
		SPECIES				= rDATA->DATA[D1.SEQ].SPECIES,
		SEX					= rDATA->DATA[D1.SEQ].SEX,
		DOSE_GROUP			= rDATA->DATA[D1.SEQ].DOSE_GROUP,
		REFERRING_COMMENT	= rDATA->DATA[D1.SEQ].REFERRING_COMMENT,
		ACCESSION			= rDATA->DATA[D1.SEQ].ACCESSION,
		SUBJECT_ID			= rDATA->DATA[D1.SEQ].SUBJECT_ID,
		SUBJECT_INDEX		= rDATA->DATA[D1.SEQ].SUBJECT_INDEX,
		;TIMEPOINT			= rDATA->DATA[D1.SEQ].TIMEPOINT,						;004
		TIMEPOINT 			= substring(1,findstring("_",rDATA->DATA[D1.SEQ].TIMEPOINT)-1,rDATA->DATA[D1.SEQ].TIMEPOINT), ;004
		TIMEPOINT_H			= substring(findstring("_",rDATA->DATA[D1.SEQ].TIMEPOINT)+1,
													   textlen(trim(rDATA->DATA[D1.SEQ].TIMEPOINT,3))
													   ,rDATA->DATA[D1.SEQ].TIMEPOINT),
		VISIT				= rDATA->DATA[D1.SEQ].VISIT,
		TPD_H				= rDATA->DATA[D1.SEQ].TPD_H,
		TPD_M				= rDATA->DATA[D1.SEQ].TPD_M,
		verified_dt_tm		= rDATA->DATA[d1.seq].verified_dt_tm,					;003
		specimen_type		= rDATA->DATA[d1.seq].specimen_type,					;003
		TMPT_POS_VAL		= rDATA->DATA[D1.SEQ].TMPT_POS_VAL,
		OC_COLLECT_DT		= rDATA->DATA[D1.SEQ].OC_COLLECT_DT,
		OC_COLLECT_TM		= rDATA->DATA[D1.SEQ].OC_COLLECT_TM,
		COLLECT_DT_TM_SORT	= rDATA->DATA[D1.SEQ].COLLECT_DT_TM_SORT,
		OC_LOWER_LIMIT		= rDATA->DATA[D1.SEQ].OC_LOWER_LIMIT,
		OC_UPPER_LIMIT		= rDATA->DATA[D1.SEQ].OC_UPPER_LIMIT,
		VSF_TEST_NAME		= rDATA->DATA[D1.SEQ].VSF_TEST_NAME,
		VSF_TEST_UNITS		= rDATA->REF_MAP[D2.SEQ].VSF_TEST_UNITS,
		OC_TEST_CODE		= rDATA->DATA[D1.SEQ].OC_TEST_CODE,
		OC_TEST_NAME		= rDATA->DATA[D1.SEQ].OC_TEST_NAME,
		OC_TEST_UNITS		= rDATA->DATA[D1.SEQ].VSF_TEST_UNITS,
		GRID_POSITION		= rDATA->REF_MAP[D2.SEQ].GRID_POSITION,
		MAX_TESTS			= rDATA->REF_MAP[D2.SEQ].MAX_TESTS,
		RESULT				= rDATA->DATA[D1.SEQ].RESULT,
		NORMALCY			= rDATA->DATA[D1.SEQ].RESULT_FLAG	; Set result flag ("#") to report normalcy field
	FROM	(DUMMYT			D1 WITH SEQ=VALUE(rDATA->COUNT)),
			(DUMMYT			D2 WITH SEQ=VALUE(rDATA->REF_CNT))
	PLAN D1
		WHERE rDATA->DATA[D1.SEQ].NR = 0	; Do not show tests with NR Comment
		AND rDATA->DATA[D1.SEQ].SUBJECT_ID > " "
	JOIN D2
		WHERE rDATA->DATA[D1.SEQ].PARAMETER_TYPE = rDATA->REF_MAP[D2.SEQ].PARAMETER_TYPE
		AND   rDATA->DATA[D1.SEQ].VSF_TEST_NAME = rDATA->REF_MAP[D2.SEQ].VSF_TEST_NAME
	ORDER BY PARAMETER_TYPE, SPECIES, SEX DESC, DOSE_GROUP, SUBJECT_INDEX, SUBJECT_ID, COLLECT_DT_TM_SORT, GRID_POSITION
	HEAD REPORT
		strngHldr = trim("STUDY,SSID,VISIT,LBLABID,LBNAM,LBREFID,LBDAT,LBTPT,LBTIM,LBTSTID,LBSPID,LBORRES,LBORRESU,LBORNRHI,LBORNRLO,")
		strngHldr = concat(strngHldr,trim("LBSTAT,LBSPEC,LBSPCCND"))
 
		col 0 strngHldr
 
	HEAD PARAMETER_TYPE
		X = 0
	HEAD SPECIES
		X = 0
	HEAD SEX
		X = 0
	HEAD DOSE_GROUP
		X = 0
	HEAD SUBJECT_INDEX
		X = 0
	HEAD SUBJECT_ID
		X = 0
	HEAD COLLECT_DT_TM_SORT
		X = 0
	DETAIL
; CALL ECHO(SUBJECT_ID)
; CALL ECHO(TIMEPOINT)
; CALL ECHO(GRID_POSITION)
 
		IF (TEXTLEN(OC_COLLECT_TM) = 5)
			OC_COLLECT_TM_tmp = concat("0",trim(OC_COLLECT_TM))
		ELSE
			OC_COLLECT_TM_tmp = OC_COLLECT_TM
		ENDIF
 
		row + 1
		strngHldr = concat(trim(cPROTOCOL),",",trim(SUBJECT_ID),",",trim(VISIT),",","6702",",","Pfizer DSRD",",")
		strngHldr = concat(strngHldr,trim(ACCESSION),",",trim(TIMEPOINT_H),",",trim(OC_COLLECT_DT),",",trim(OC_COLLECT_TM_tmp),",")
		strngHldr = concat(strngHldr,trim(VSF_TEST_NAME),",",trim(OC_TEST_CODE),",",trim(RESULT),",")
		strngHldr = concat(strngHldr,trim(CNVTUPPER(OC_TEST_UNITS)),",",trim(OC_UPPER_LIMIT,3),",")
		strngHldr = concat(strngHldr,trim(OC_LOWER_LIMIT),",,",trim(specimen_type),",,")
		col 0 strngHldr
 
	WITH format = variable, noheading, formfeed=none, maxrow=1, maxcol=32000, nullreport
 
/*
; FTP the extract file to a front end fileshare
 
if(dbNme = "BUILD")
set batch_filename_loc = value(trim(concat("/cerner/d_build/ccluserdir/",trim(file_name))))
 
; set batch_filename_loc = value(trim(concat("/cerner/d_build/ccluserdir/", cnvtlower($OUTDEV),"_octest.csv")))
elseif(dbNme = "CERT")
set batch_filename_loc = value(trim(concat("/cerner/d_cert/ccluserdir/",trim(file_name))))
 
; set batch_filename_loc = value(trim(concat("/cerner/d_cert/ccluserdir/", cnvtlower($OUTDEV),"_octest.csv")))
elseif(dbNme = "PROD")
set batch_filename_loc = value(trim(concat("/cerner/d_prod/ccluserdir/",trim(file_name))))
 
; set batch_filename_loc = value(trim(concat("/cerner/d_prod/ccluserdir/", cnvtlower($OUTDEV),"_octest.csv")))
endif
 
set new_full_name = value(trim(file_name))
; set new_full_name = value(trim(concat(cnvtlower($OUTDEV),"_octest.csv")))
 
set remote_domain = "170.116.246.217" ; (AMRNDHW1437)
set remote_username = "cerner_reports"
set remote_password = "!QAZ2wsx"
 
set ftp_command = concat('print "', 'open ', remote_domain, '\n',
                                    'user ', remote_username, ' ', remote_password, '\n',
                                    'binary \n',
                                    'put ', batch_filename_loc, ' ', new_full_name,
                                '"','| ftp -i -n')
 
free set command
set command = ftp_command
set status = 0
call dcl(command,size(trim(command)),status)
 */
ENDIF
 
/**************************************************************
; Print information regarding duplicate tests to the screen
**************************************************************/
#ERROR_SECTION
IF (vDUP_FLAG = 1)
	SET ERR_UNIQUE_ID = rDATA->DATA[vERR_nCOUNT].UNIQUE_ID
	SET ERR_COLLECT_DT =  rDATA->DATA[vERR_nCOUNT].COLLECT_DATE
	SET ERR_VSF_TEST_NAME = rDATA->DATA[vERR_nCOUNT].VSF_TEST_NAME
	SET X = ErrDupResultSection(Rpt_Render)
	SET X = FinalizeReport($OUTDEV)
	GO TO END_PROGRAM
ENDIF
 
IF (vERR_FLAG = 1)
	SET X = ErrSection(Rpt_Render)
	SET X = FinalizeReport($OUTDEV)
	GO TO END_PROGRAM
ENDIF
 
IF ($REPORT_TYPE != "X")
	CALL FinalizeReport($OUTDEV)
ENDIF
 
#END_PROGRAM
 
END GO
