/* 	***************************************************************************************************************
 
	Script Name:	pfi_data_list_and_stats_v4.prg
	Description:	Outputs a report of raw data, statistics and/or changes based on study.
 
	Date Written:	24-May-2010
	Written By:		Nicholas Boone
 
	Executed from:	Explorer Menu
 
	***************************************************************************************************************
								REVISION INFORMATION
	***************************************************************************************************************
	Rev	Date		By				Comment
	---	-----------	--------------	---------------------------------------------------
 	0.a 06-Mar-2009 Simpson, John	Initial draft created by Precision Healthcare Solutions
 	0.b 21-Oct-2009 Boone, Nicholas	Updated to address numerous issues with content, format
 									and function.
 	1.0 15-Jan-2010	Boone, Nicholas	Released for use.
 	1.1 06-Apr-2010	Boone, Nicholas Introduce change from baseline statistics.  Updated duplicate
 									checking functionality to allow multiple timepoints in a single day.
 	2.0 16-Jun-2010 Boone, Nicholas Released for use.
 	2.1 26-Jun-2010 Boone, Nicholas Introduced a pretest extract option.
 	2.2 09-Aug-2010 Boone, Nicholas Expanded test name fields on individual listings report. Introduced
 									logic to account for pages of no results for a given test/timepoint.
 	2.3 11-Jan-2012 Boone, Nicholas Introduced header information option for Clinical reporting.
  	2.4 05-Mar-2012	Boone, Nicholas	Introduced additional data extract format for upload to Citrix SAS.
 	3.0 23-Aug-2011 Boone, Nicholas Introduced dose group filter by option.  Added sort field SUBJECT_ID for
 									individual percent change from baseline.
 	3.1 15-Dec-2011	Boone, Nicholas	Introduce test exclusion feature.
 	4.0 21-May-2014	Boone, Nicholas	Introduce new extract formats, streamline data reporting queries for individual
 									listing and statistics, new prompt options to select report types and filters,
									and calculated results units of measure option.
	5.0 16-Apr-2015 Magoon, Yitzhak Modified alias pool to include the Pfizer ID pool used for AWMS # (new MRN)
	5.1 05-Jan-2016 Magoon, Yitzhak Added additional filters to order reports
	6.0	04-Apr-2016 Magoon, Yitzhak Updated facesheet to properly pull in VSF values. Updated report to remove
									duplicates being caused by the introduction of the Pristima interface.
	007 18-May-2016 Magoon, Yitzhak Reverted change 5.0/6.0 so report filters sequentially by timepoint instead
									of collection date and time
	008 26-Jul-2016 Magoon, Yitzhak Updated directories for RHO prod
 
	***************************************************************************************************************/
 
DROP PROGRAM pfi_data_list_and_stats_v8_0:DBA GO
CREATE PROGRAM pfi_data_list_and_stats_v8_0:DBA
 
prompt
	"Output to File/Printer/MINE" = "MINE"                                                    ;* Enter or select the printer or fi
	;<<hidden>>"Enter all or part of the study protocol name" = ""
	, "Select the protocol" = 0
	, "Select the parameter section(s) to report" = ""
	, "Select the report type" = "D"
	, "Select the report" = ""
	, "Select how change from baseline or control data is reported (where applicable)" = ""
	, "Select the control group (where applicable)" = ""
	, "Select the baseline timepoint (where applicable)" = ""
	, 'Include result flags for "<" or ">"?' = '0'
	, "Exclude dose group(s)?" = "0"
	, "Select dose groups to exclude" = 0
	, "Exclude timepoints?" = "0"
	, "Select the timepoints to exclude" = ""
	, "Exclude tests that report a percentage?" = "0"
	, "Enter the table number" = ""
	, "Include tests with an NR comment" = "0"
	, "Sample integrity report?" = "0"
	, "Clinical data report?" = "0"
	, "Apply a date range to the query?" = "0"
	, "Enter the date range" = "CURDATE"
	, "No prompt" = "CURDATE"
	, "Select the test(s) to exclude from the report" = 0
 
with OUTDEV, PROTOCOL, PAR_SECTION, REPORT_SEL, REPORT_DESIGN, RATIO_PCNT,
	CONTROL_GRP, BASELINE, REF_FLAG, DG_FILTER, DOSE_GRP, TMPT_FILTER, TIMEPOINT, PERCENT,
	TABLE_TITLE, IGNORE_NR, SAMPLE_INT, CLINICAL_REPORT, DATE_RANGE, FROM_DT, TO_DT,
	TESTS_EXCLUDED
 
/**************************************************************
; DECLARED VARIABLES AND RECORDS
**************************************************************/
 
; These determine the number of horizontal results possible per printed page.
; Do not change unless layout is also changed.
IF ($REPORT_DESIGN = "ITVIBRR")
	SET nRAW_RESULTS = 2
ELSE
	SET nRAW_RESULTS = 5
ENDIF
SET nSTAT_RESULTS = 4
SET nRESULT_ROWS = 33
SET nSTAT_ROWS = 33
 
SET cvMRN = UAR_GET_CODE_BY("MEANING",4,"MRN")
SET cvDISC_MRN = UAR_GET_CODE_BY("DISPLAY",263,"Discovery MRN Pool")
SET cvTATTOO = UAR_GET_CODE_BY("DISPLAY",263,"Volunteer/Tattoo Pool")
SET cvFIN_NBR = UAR_GET_CODE_BY("MEANING", 319, "FIN NBR")
SET cvCOMPLETED = UAR_GET_CODE_BY("MEANING",6004,"COMPLETED")
 
SET vERR_FLAG = 0
SET vDUP_FLAG = 0
SET vERR_nCOUNT = 0
SET vMALE_ID = 0
SET vFEMALE_ID = 0
declare pfiID = f8 ;5.0
set pfID = uar_get_code_by("DISPLAY", 263, "PFIZERIDPOOL") ;5.0
DECLARE vERR_MSG_1 = vc
DECLARE vERR_MSG_2 = vc
DECLARE vERR_UNIQUE_ID = f8
DECLARE vERR_COLLECT_DT = c11
DECLARE cUSER = c50
DECLARE cPROTOCOL = c100
DECLARE vPROTOCOL = f8
DECLARE cTableID = c40
DECLARE cHEADER = c100
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
DECLARE strngHldr = vc with protected,noconstant("")
DECLARE dbNme = vc with protected,noconstant("")
SET dbNme = currdbname
 
RECORD rDATA (
	1 REF_CNT					= i4
	1 SUBJECT_CNT				= i4
	1 MALE_CNT					= i4
	1 FEMALE_CNT				= i4
	1 REF_MAP[*]
		2 PARAMETER_TYPE		= c50
		2 MAX_TESTS				= i4
		2 VSF_TEST_NAME			= c50
		2 VSF_TEST_UNITS		= c50
		2 GRID_POSITION			= i4
		2 PAGE_NO				= i4
		2 MAX_PAGE				= i4
	1 SUBJ_LIST_M[*]
		2 SUBJECT_ID			= c20
		2 SUBJECT_INDEX			= i4
		2 SUBJECT_POS_VAL		= i4
	1 SUBJ_LIST_F[*]
		2 SUBJECT_ID			= c20
		2 SUBJECT_INDEX			= i4
		2 SUBJECT_POS_VAL		= i4
	1 DOSE_GROUP_M[*]
		2 DOSE_GROUP			= c50
		2 REFERRING_COMMENT		= c50
		2 DG_SUBJ_CNT			= i4
	1 DOSE_GROUP_F[*]
		2 DOSE_GROUP			= c50
		2 REFERRING_COMMENT		= c50
		2 DG_SUBJ_CNT			= i4
	1 DG_CNT					= i4
	1 DG_MAX_PAGE				= i4
	1 DOSE_GROUP[*]
		2 DOSE_GROUP			= c50
		2 REFERRING_COMMENT		= c50
		2 DG_POS_VAL			= i4
		2 DG_CONTROL			= i4
		2 DG_PAGE_NO			= i4
		2 DG_PER_PAGE			= i4
		2 DG_SUBJ_CNT			= i4
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
		2 DOSE_GROUP			= c50
		2 DG_POS_VAL			= i4
		2 DG_CONTROL			= i4
		2 DG_PAGE_NO			= i4
		2 DG_PER_PAGE			= i4
		2 REFERRING_COMMENT		= c50
		2 SEX					= c7
		2 SPECIES				= c30
		2 UNIQUE_ID				= c20
		2 SUBJECT_ID			= c20
		2 SUBJECT_INDEX			= i4
		2 SUBJECT_POS_VAL		= i4
		2 TIMEPOINT				= c20
		2 TMPT_POS_VAL			= i4
		2 TMPT_BASELINE			= i4
		2 TMPT_CNT				= i4
		2 COLLECT_DATE			= c11			;6.0
		2 COLLECT_DT_TM			= c21			;6.0
		2 COLLECT_DT_TM_2		= c25			;6.0
		2 PARAMETER_TYPE		= c50
		2 VSF_TEST_NAME			= c50
		2 VSF_TEST_UNITS		= c50
		2 GRID_POSITION			= i4
		2 STATS					= i4
		2 RESULT				= c30
		2 NORMALCY				= c1
		2 NORMALCY_CD			= f8
		2 RESULT_FLAG			= c1
		2 NR					= i4
		2 XX					= i4
		2 COMMENT_CNT			= i4
		2 TWO_LETTERS			= c2
		2 COMMENT				= c500
		2 V_DIFF				= c30
		2 P_CHANGE				= f8
		2 P_CHANGE_SG			= c20
		2 P_CHANGE_SIGN			= c1
		2 P_FLAG				= c1
		2 BSLN_SIGN				= c1
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
		2 TIMEPOINT				= c20
		2 TMPT_POS_VAL			= i4
		2 TMPT_BASELINE			= i4
		2 COLLECT_DATE			= c11
		2 COLLECT_DT_TM			= c25
		2 COLLECT_DT_TM_2		= c25
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
			3 BSLN_SIGN			= c1
			3 P_FLAG			= c1
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
		2 COLLECT_DATE			= c11
		2 COLLECT_DT_TM			= c25
		2 COLLECT_DT_TM_2		= c25
		2 RESULT_PAGE			= i4
		2 DG_PER_PAGE			= i4
		2 RESULT_CNT			= i4
		2 RESULTS[*]
			3 DOSE_GROUP		= c50
			3 DG_POS_VAL		= i4
			3 DG_CONTROL		= i4
			3 DG_PER_PAGE		= i4
			3 REFERRING_COMMENT	= c50
			3 ANIMALS			= i4
			3 PREFIX			= c1
			3 PM_TXT			= c5
			3 SD_SIGN			= c1
			3 MEAN				= f8
			3 MEAN_V_DIFF		= f8
			3 MEAN_DEC_PL		= i4
			3 MEAN_SG			= c20
			3 STD_DEVIATION		= f8
			3 STD_SG			= c20
			3 P_CHANGE			= f8
			3 P_CHANGE_SG		= c20
			3 P_CHANGE_SIGN		= c1
			3 P_FLAG			= c1
			3 CHANGE_RPT		= c20
)
 
; Function to calculate square root
SUBROUTINE SQRT(nVALUE)
	SET nSQR_GUESS = 1.0
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
IF ($TABLE_TITLE != "")
	SET cTableID = TRIM($TABLE_TITLE)
ENDIF
 
/************************
; Check input parameteres
************************/
IF ($REPORT_DESIGN IN ("MTVMC", "MTVMC_2", "MTVMCR"))
	IF ($CONTROL_GRP = "")
		SET vERR_FLAG = 1
		SET vERR_MSG_1 = "Control Group not specified on the prompt screen.  Please close this window "
		SET vERR_MSG_2 = "and try generating the report again with a Control Group selected."
		GO TO ERROR_FOUND
	ENDIF
ELSEIF ($REPORT_DESIGN IN ("ITVIB", "ITVIB_2", "ITVIBR*", "MTVMB", "MTVMB_2", "MTVMBR", "MIR", "MIRR"))
	IF ($BASELINE = "")
		SET vERR_FLAG = 1
		SET vERR_MSG_1 = "Baseline timepoint not specified on the prompt screen.  Please close this window "
		SET vERR_MSG_2 = "and try generating the report again with a baseline timepoint selected."
		GO TO ERROR_FOUND
	ELSEIF ($TMPT_FILTER = "1")
		IF ($BASELINE = $TIMEPOINT)
			SET vERR_FLAG = 1
			SET vERR_MSG_1 = "Baseline timepoint cannot be excluded from the report.  Please close this window "
			SET vERR_MSG_2 = "and try generating the report again with the baseline timepoint not excluded."
			GO TO ERROR_FOUND
		ENDIF
	ENDIF
ENDIF
 
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
; for all dose groups and timepoints
**************************************************************/
IF ($SAMPLE_INT = "0")
SELECT INTO "NL:"
	PERSON_ID				= E.PERSON_ID,
	ENCNTR_ID				= E.ENCNTR_ID,
	ORDER_ID				= O.ORDER_ID,
	CATALOG_CD				= CE.CATALOG_CD,
	TASK_ASSAY_CD			= CE.TASK_ASSAY_CD,
	EVENT_ID				= CE.EVENT_ID,
	COLLECTION_DATE			= FORMAT(C.DRAWN_DT_TM, "DD-Mmm-YYYY;;D"),
	COLLECTION_DT_TM		= FORMAT(C.DRAWN_DT_TM, "DD-Mmm-YYYY  HH:MM:SS;;D"),
	COLLECTION_DT_TM_2		= FORMAT(C.DRAWN_DT_TM, "YYYYMMDD HH:MM:SS;;D"),
	DOSE_GROUP				= UAR_GET_CODE_DISPLAY(E.ENCNTR_TYPE_CD),
	OE_FIELD_DISPLAY_VALUE	= OD.OE_FIELD_DISPLAY_VALUE,
	REFERRING_COMMENT		= E.REFERRING_COMMENT,
	SEX						= UAR_GET_CODE_DISPLAY(P.SEX_CD),
	SPECIES					= UAR_GET_CODE_DISPLAY(P.SPECIES_CD),
	UNIQUE_ID				= PA.ALIAS,
	CLASS_ORDER				= CVM.CLASS_ORDER,
	PARAM_ORDER				= CVM.PARAM_ORDER,
	PARAMETER_TYPE			= CVM.PARAMETER_TYPE,
	VSF_TEST_NAME			= CVM.VSF_TEST_NAME,
	VSF_TEST_UNITS			= CVM.VSF_TEST_UNITS,
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
	AND ((E.ENCNTR_TYPE_CD = 0 AND $REPORT_DESIGN IN ("PRETEST", "RAW"))
		OR ($DG_FILTER = "0" AND E.ENCNTR_TYPE_CD != 0)
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
JOIN CSC
	WHERE CE.EVENT_ID = CSC.EVENT_ID
	AND   CSC.VALID_UNTIL_DT_TM > CNVTDATETIME(CURDATE, CURTIME3)
JOIN C
	WHERE C.CONTAINER_ID = CSC.CONTAINER_ID
	AND C.DRAWN_DT_TM  BETWEEN CNVTDATETIME(vFROM_DT)
 	AND CNVTDATETIME(CONCAT(vTO_DT, CHAR(32), "235959"))
JOIN PA
	WHERE PA.PERSON_ID = E.PERSON_ID
	AND   PA.PERSON_ALIAS_TYPE_CD = cvMRN
	;AND   PA.ALIAS_POOL_CD IN (cvTATTOO, cvDISC_MRN, pfiID) ;5.0
	AND   PA.ACTIVE_IND = 1
	AND   PA.END_EFFECTIVE_DT_TM > CNVTDATETIME(CURDATE, CURTIME3)
JOIN CVM
	WHERE CVM.TASK_ASSAY_CD = CE.TASK_ASSAY_CD
	AND   CNVTUPPER(CVM.VSF_TEST_NAME) != "EXCLUDE"
	AND CVM.PARAMETER_TYPE = $PAR_SECTION
JOIN OD
	WHERE OD.ORDER_ID = O.ORDER_ID
	AND   OD.OE_FIELD_MEANING IN ("DCDISPLAYDAYS")
	AND (($TMPT_FILTER = "1" AND OD.OE_FIELD_DISPLAY_VALUE != $TIMEPOINT) OR
	($TMPT_FILTER = "0"))
	;6.0 - pull most recent action_sequence from order_detail to prevent multiple duplicate rows
	and od.action_sequence = (select max(od1.action_sequence)
							  from order_detail od1
							  where od1.oe_field_id = od.oe_field_id
							  and od1.order_id = od.order_id)
	;end 6.0
ORDER CLASS_ORDER, PARAMETER_TYPE, PARAM_ORDER, VSF_TEST_NAME, UNIQUE_ID, COLLECTION_DT_TM_2
HEAD REPORT
	nREF_CNT = 0
	nCOUNT = 0
	nPAGE_NO = 0
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
;	ELSEIF ($REPORT_DESIGN IN ("ITVIB", "ITVIB_2", "ITVIBR", "MIR", "MIRR") AND STATS = 0)
	ELSEIF ($REPORT_DESIGN IN ("MTVMB", "MTVMB_2", "MTVMBR", "MTVMC", "MTVMC_2", "MTVMCR",
		"ITVIB", "ITVIB_2", "ITVIBR", "ITVIBRR", "MIR", "MIRR") AND STATS = 0)
		vIGNORE_STAT = 1
 	ELSE
		; Collect the reference data
		nREF_CNT = nREF_CNT + 1
		nGRID_POSITION = nGRID_POSITION + 1
		IF (MOD(nREF_CNT, 10) = 1 AND nREF_CNT > 100)
			STAT = ALTERLIST(rDATA->REF_MAP, nREF_CNT + 10)
		ENDIF
 
		nFACTOR = 1
		WHILE (nGRID_POSITION - (nRAW_RESULTS * nFACTOR) > 0)
			nFACTOR = nFACTOR + 1
		ENDWHILE
		nPAGE_NO = nFACTOR
 
		rDATA->REF_MAP[nREF_CNT].PARAMETER_TYPE = PARAMETER_TYPE
		rDATA->REF_MAP[nREF_CNT].VSF_TEST_NAME = VSF_TEST_NAME
		rDATA->REF_MAP[nREF_CNT].VSF_TEST_UNITS = VSF_TEST_UNITS
		rDATA->REF_MAP[nREF_CNT].GRID_POSITION = nGRID_POSITION
		rDATA->REF_MAP[nREF_CNT].PAGE_NO = nPAGE_NO
	ENDIF
	nTMPT_CNT = 0
DETAIL
	IF (vIGNORE_PERCENT = 0 AND vIGNORE_STAT = 0)
 
	; Collect the result data
	vIGNORE = 0
	nCOUNT = nCOUNT + 1
	nTMPT_CNT = nTMPT_CNT + 1
	IF (MOD(nCOUNT, 500) = 1 AND nCOUNT > 500)
		STAT = ALTERLIST(rDATA->DATA, nCOUNT + 500)
	ENDIF
	; Check for duplicate results and set error flags if duplicates are found
	IF ((rDATA->DATA[nCOUNT-1].COLLECT_DT_TM = COLLECTION_DT_TM)
		AND (rDATA->DATA[nCOUNT-1].UNIQUE_ID = UNIQUE_ID)
		AND (rDATA->DATA[nCOUNT-1].VSF_TEST_NAME = VSF_TEST_NAME))
		IF (rDATA->DATA[nCOUNT-1].RESULT = "-")
			nCOUNT = nCOUNT - 1
			nTMPT_CNT = nTMPT_CNT - 1
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
	rDATA->DATA[nCOUNT].TIMEPOINT = OE_FIELD_DISPLAY_VALUE
	rDATA->DATA[nCOUNT].PARAMETER_TYPE = PARAMETER_TYPE
	rDATA->DATA[nCOUNT].VSF_TEST_NAME = VSF_TEST_NAME
	rDATA->DATA[nCOUNT].VSF_TEST_UNITS = VSF_TEST_UNITS
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
	; Ignore "-" values where duplicate results are involved
	IF (vIGNORE = 1)
		nCOUNT = nCOUNT - 1
		nTMPT_CNT = nTMPT_CNT - 1
	ENDIF
 
	ELSE
		X = 0
	ENDIF
FOOT VSF_TEST_NAME
	FOR (nLOOP = 1 TO nTMPT_CNT)
		rDATA->DATA[nCOUNT - nLOOP + 1].TMPT_CNT = nTMPT_CNT
	ENDFOR
FOOT PARAM_ORDER
	X = 0
FOOT PARAMETER_TYPE
	FOR (nLOOP = 1 TO nREF_CNT)
		IF (rDATA->REF_MAP[nLOOP].PARAMETER_TYPE = PARAMETER_TYPE)
			rDATA->REF_MAP[nLOOP].MAX_TESTS = nGRID_POSITION
			rDATA->REF_MAP[nLOOP].MAX_PAGE = nPAGE_NO
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
GO TO COLLECT_DETAILS
ENDIF
 
/***********************************************************************************
; Collect the report data and populate the record structure for pretest
; or other non-group specific data without a dose filter - SAMPLE INTEGRITY REPORT
***********************************************************************************/
IF ($SAMPLE_INT = "1")
SELECT INTO "NL:"
	PERSON_ID				= E.PERSON_ID,
	ENCNTR_ID				= E.ENCNTR_ID,
	ORDER_ID				= O.ORDER_ID,
	CATALOG_CD				= CE.CATALOG_CD,
	TASK_ASSAY_CD			= CE.TASK_ASSAY_CD,
	EVENT_ID				= CE.EVENT_ID,
	COLLECTION_DATE			= FORMAT(C.DRAWN_DT_TM, "DD-Mmm-YYYY;;D"),
	COLLECTION_DT_TM		= FORMAT(C.DRAWN_DT_TM, "DD-Mmm-YYYY  HH:MM:SS;;D"),
	COLLECTION_DT_TM_2		= FORMAT(C.DRAWN_DT_TM, "YYYYMMDD HH:MM:SS;;D"),
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
	AND ((E.ENCNTR_TYPE_CD = 0 AND $REPORT_DESIGN IN ("PRETEST", "RAW"))
		OR ($DG_FILTER = "0" AND E.ENCNTR_TYPE_CD != 0)
		OR ($DG_FILTER = "1" AND E.ENCNTR_TYPE_CD != $DOSE_GRP AND E.ENCNTR_TYPE_CD != 0))
JOIN P
	WHERE P.PERSON_ID = E.PERSON_ID
JOIN O
	WHERE O.ENCNTR_ID = E.ENCNTR_ID
	AND   O.ORDER_STATUS_CD + 0 = cvCOMPLETED
JOIN CE
	WHERE CE.ORDER_ID = O.ORDER_ID
	AND   CE.CATALOG_CD IN (4573429, 4573431, 4573433, 4573435, 4573443, 4601624,
			4573437, 4573439, 4573441, 4550309, 4568286, 4579510, 4579516, 4565822,
			4579512, 4517384, 4579508, 4579514, 4510127, 4502007, 4502009, 4564864)
	AND   CE.TASK_ASSAY_CD IN (4573451, 4573452, 4573450, 4601626, 4573449,
			4573448, 4573447, 4573446, 4573445, 317116, 4550507)
	AND   CE.VALID_UNTIL_DT_TM > CNVTDATETIME(CURDATE, CURTIME3)
JOIN CSC
	WHERE CE.EVENT_ID = CSC.EVENT_ID
	AND   CSC.VALID_UNTIL_DT_TM > CNVTDATETIME(CURDATE, CURTIME3)
JOIN C
	WHERE C.CONTAINER_ID = CSC.CONTAINER_ID
	AND C.DRAWN_DT_TM  BETWEEN CNVTDATETIME(vFROM_DT)
 	AND CNVTDATETIME(CONCAT(vTO_DT, CHAR(32), "235959"))
JOIN PA
	WHERE PA.PERSON_ID = E.PERSON_ID
	AND   PA.PERSON_ALIAS_TYPE_CD = cvMRN
	;AND   PA.ALIAS_POOL_CD IN (cvTATTOO, cvDISC_MRN, pfiID) ;5.0
	AND   PA.ACTIVE_IND = 1
	AND   PA.END_EFFECTIVE_DT_TM > CNVTDATETIME(CURDATE, CURTIME3)
JOIN CVM
	WHERE CVM.TASK_ASSAY_CD = CE.TASK_ASSAY_CD
	AND   CNVTUPPER(CVM.VSF_TEST_NAME) != "EXCLUDE"
	AND CVM.PARAMETER_TYPE = $PAR_SECTION
JOIN OD
	WHERE OD.ORDER_ID = O.ORDER_ID
	AND   OD.OE_FIELD_MEANING IN ("DCDISPLAYDAYS")
	AND (($TMPT_FILTER = "1" AND OD.OE_FIELD_DISPLAY_VALUE != $TIMEPOINT) OR
	($TMPT_FILTER = "0"))
	;6.0 - pull most recent action_sequence from order_detail to prevent multiple duplicate rows
	and od.action_sequence = (select max(od1.action_sequence)
							  from order_detail od1
							  where od1.oe_field_id = od.oe_field_id
							  and od1.order_id = od.order_id)
	;end 6.0
ORDER CLASS_ORDER, PARAMETER_TYPE, PARAM_ORDER, VSF_TEST_NAME, UNIQUE_ID, COLLECTION_DT_TM_2
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
	; and set ignore statistics for individual ratios based on CERNER_VSF_MAP STAT value
	IF ($PERCENT = "%" AND VSF_TEST_UNITS = "%")
		vIGNORE_PERCENT = 1
;	ELSEIF ($REPORT_DESIGN IN ("ITVIB", "ITVIB_2", "ITVIBR", "MIR", "MIRR") AND STATS = 0)
	ELSEIF ($REPORT_DESIGN IN ("MTVMB", "MTVMB_2", "MTVMBR", "MTVMC", "MTVMC_2", "MTVMCR",
		"ITVIB", "ITVIB_2", "ITVIBR", "ITVIBRR", "MIR", "MIRR") AND STATS = 0)
 		vIGNORE_STAT = 1
 	ELSE
		; Collect the reference data
		nREF_CNT = nREF_CNT + 1
		nGRID_POSITION = nGRID_POSITION + 1
		IF (MOD(nREF_CNT, 10) = 1 AND nREF_CNT > 100)
			STAT = ALTERLIST(rDATA->REF_MAP, nREF_CNT + 10)
		ENDIF
 
		nFACTOR = 1
		WHILE (nGRID_POSITION - (nRAW_RESULTS * nFACTOR) > 0)
			nFACTOR = nFACTOR + 1
		ENDWHILE
		nPAGE_NO = nFACTOR
 
		rDATA->REF_MAP[nREF_CNT].PARAMETER_TYPE = PARAMETER_TYPE
		rDATA->REF_MAP[nREF_CNT].VSF_TEST_NAME = VSF_TEST_NAME
		rDATA->REF_MAP[nREF_CNT].VSF_TEST_UNITS = VSF_TEST_UNITS
		rDATA->REF_MAP[nREF_CNT].GRID_POSITION = nGRID_POSITION
		rDATA->REF_MAP[nREF_CNT].PAGE_NO = nPAGE_NO
	ENDIF
	nTMPT_CNT = 0
DETAIL
	IF (vIGNORE_PERCENT = 0 AND vIGNORE_STAT = 0)
 
	; Collect the result data
	vIGNORE = 0
	nCOUNT = nCOUNT + 1
	nTMPT_CNT = nTMPT_CNT + 1
	IF (MOD(nCOUNT, 500) = 1 AND nCOUNT > 500)
		STAT = ALTERLIST(rDATA->DATA, nCOUNT + 500)
	ENDIF
	; Check for duplicate results and set error flags if duplicates are found
	IF ((rDATA->DATA[nCOUNT-1].COLLECT_DT_TM = COLLECTION_DT_TM)
		AND (rDATA->DATA[nCOUNT-1].UNIQUE_ID = UNIQUE_ID)
		AND (rDATA->DATA[nCOUNT-1].VSF_TEST_NAME = VSF_TEST_NAME))
		IF (rDATA->DATA[nCOUNT-1].RESULT = "-")
			nCOUNT = nCOUNT - 1
			nTMPT_CNT = nTMPT_CNT - 1
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
	rDATA->DATA[nCOUNT].TIMEPOINT = OE_FIELD_DISPLAY_VALUE
	rDATA->DATA[nCOUNT].PARAMETER_TYPE = PARAMETER_TYPE
	rDATA->DATA[nCOUNT].VSF_TEST_NAME = VSF_TEST_NAME
	rDATA->DATA[nCOUNT].VSF_TEST_UNITS = VSF_TEST_UNITS
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
	; Ignore "-" values where duplicate results are involved
	IF (vIGNORE = 1)
		nCOUNT = nCOUNT - 1
		nTMPT_CNT = nTMPT_CNT - 1
	ENDIF
 
	ELSE
		X = 0
	ENDIF
FOOT VSF_TEST_NAME
	FOR (nLOOP = 1 TO nTMPT_CNT)
		rDATA->DATA[nCOUNT - nLOOP + 1].TMPT_CNT = nTMPT_CNT
	ENDFOR
FOOT PARAM_ORDER
	X = 0
FOOT PARAMETER_TYPE
	FOR (nLOOP = 1 TO nREF_CNT)
		IF (rDATA->REF_MAP[nLOOP].PARAMETER_TYPE = PARAMETER_TYPE)
			rDATA->REF_MAP[nLOOP].MAX_TESTS = nGRID_POSITION
			rDATA->REF_MAP[nLOOP].MAX_PAGE = nPAGE_NO
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
ENDIF
 
/********************************************************************************
; Populate additional fields in the main record structure (comments, timepoints)
; and gather separate lists for timepoints, dose groups and comments.
*********************************************************************************/
 
#COLLECT_DETAILS
; Identify subject sex(es) to report
SELECT DISTINCT INTO "NL:"
	SEX			= rDATA->DATA[D1.SEQ].SEX
FROM	(DUMMYT		D1 WITH SEQ=VALUE(rDATA->COUNT))
HEAD REPORT
	vMALE_ID = 0
	vFEMALE_ID = 0
DETAIL
	IF (SEX = "Male")
		vMALE_ID = 1
	ELSEIF (SEX = "Female")
		vFEMALE_ID = 1
	ENDIF
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
	nFACTOR = 1
	WHILE (nCOUNT - (nSTAT_RESULTS * nFACTOR) > 0)
		nFACTOR = nFACTOR + 1
	ENDWHILE
	rDATA->DOSE_GROUP[nCOUNT].DOSE_GROUP = DOSE_GROUP
	rDATA->DOSE_GROUP[nCOUNT].REFERRING_COMMENT = REFERRING_COMMENT
	rDATA->DOSE_GROUP[nCOUNT].DG_POS_VAL = nCOUNT
	rDATA->DOSE_GROUP[nCOUNT].DG_PAGE_NO = nFACTOR
	; Identify and label the control group
	rDATA->DOSE_GROUP[nCOUNT].DG_CONTROL = 0
	IF ($REPORT_DESIGN IN ("MTVMC", "MTVMC_2", "MTVMCR"))
		IF (DOSE_GROUP = $CONTROL_GRP)
			rDATA->DOSE_GROUP[nCOUNT].DG_CONTROL = 1
		ENDIF
	ENDIF
FOOT REPORT
	rDATA->DG_CNT = nCOUNT
	rDATA->DG_MAX_PAGE = nFACTOR
	STAT = ALTERLIST(rDATA->DOSE_GROUP, nCOUNT)
	IF (nCOUNT > nSTAT_RESULTS)
		xPG_CNT = 0
		WHILE (nCOUNT > nSTAT_RESULTS)
			nCOUNT = nCOUNT - nSTAT_RESULTS
			xOFFSET = xPG_CNT * nSTAT_RESULTS
			FOR (nLOOP = 1 to nSTAT_RESULTS)
				rDATA->DOSE_GROUP[nLOOP + xOFFSET].DG_PER_PAGE = nSTAT_RESULTS
			ENDFOR
			xPG_CNT = xPG_CNT + 1
		ENDWHILE
		xOFFSET = xPG_CNT * nSTAT_RESULTS
		FOR (nLOOP = 1 to nCOUNT)
			rDATA->DOSE_GROUP[nLOOP + xOFFSET].DG_PER_PAGE = nCOUNT
		ENDFOR
	ENDIF
	FOR (nLOOP = 1 to nCOUNT)
		rDATA->DOSE_GROUP[nLOOP].DG_PER_PAGE = nCOUNT
	ENDFOR
WITH COUNTER
 
; Store dose group position in main record structure
SELECT INTO "NL:"
	DOSE_GROUP			= rDATA->DATA[D1.SEQ].DOSE_GROUP
FROM	(DUMMYT		D1 WITH SEQ=VALUE(rDATA->COUNT))
ORDER BY DOSE_GROUP
HEAD REPORT
	nCOUNTER = rDATA->DG_CNT
DETAIL
	FOR (nLOOP = 1 to nCOUNTER)
		IF(rDATA->DATA[D1.SEQ].DOSE_GROUP = rDATA->DOSE_GROUP[nLOOP].DOSE_GROUP)
			rDATA->DATA[D1.SEQ].DG_POS_VAL = rDATA->DOSE_GROUP[nLOOP].DG_POS_VAL
			rDATA->DATA[D1.SEQ].DG_CONTROL = rDATA->DOSE_GROUP[nLOOP].DG_CONTROL
			rDATA->DATA[D1.SEQ].DG_PAGE_NO = rDATA->DOSE_GROUP[nLOOP].DG_PAGE_NO
			rDATA->DATA[D1.SEQ].DG_PER_PAGE = rDATA->DOSE_GROUP[nLOOP].DG_PER_PAGE
		ENDIF
	ENDFOR
WITH COUNTER
 
; Count subjects and update counters for Male subjects
IF ($REPORT_DESIGN IN ("ITVIB_2") and vMALE_ID = 1)
SELECT DISTINCT INTO "NL:"
	UNIQUE_ID			= rDATA->DATA[D1.SEQ].UNIQUE_ID,
	DOSE_GROUP			= rDATA->DATA[D1.SEQ].DOSE_GROUP,
	SEX					= rDATA->DATA[D1.SEQ].SEX,
	SUBJECT_INDEX		= rDATA->DATA[D1.SEQ].SUBJECT_INDEX,
	SUBJECT_ID			= rDATA->DATA[D1.SEQ].SUBJECT_ID
FROM	(DUMMYT			D1 WITH SEQ=VALUE(rDATA->COUNT))
WHERE rDATA->DATA[D1.SEQ].SEX = "Male"
ORDER SEX DESC, DOSE_GROUP, SUBJECT_INDEX, SUBJECT_ID
HEAD REPORT
	nCOUNTER = rDATA->COUNT
HEAD SEX
	sCOUNT = 0
	dgCOUNT = 0
	sjCOUNT = 0
	STAT = ALTERLIST(rDATA->DOSE_GROUP_M, 10)
	STAT = ALTERLIST(rDATA->SUBJ_LIST_M, 10)
HEAD DOSE_GROUP
	dCOUNT = 0
	dgCOUNT = dgCOUNT + 1
	IF (MOD(dgCOUNT,10) = 1 AND dgCOUNT > 10)
		STAT = ALTERLIST(rDATA->DOSE_GROUP_M, dgCOUNT + 10)
	ENDIF
HEAD SUBJECT_INDEX
	X = 0
HEAD SUBJECT_ID
	X = 0
	sjCOUNT = sjCOUNT + 1
	IF (MOD(sjCOUNT,10) = 1 AND sjCOUNT > 10)
		STAT = ALTERLIST(rDATA->SUBJ_LIST_M, sjCOUNT + 10)
	ENDIF
DETAIL
	sCOUNT = sCOUNT + 1
	dCOUNT = dCOUNT + 1
	rDATA->SUBJ_LIST_M[sjCOUNT].SUBJECT_ID = SUBJECT_ID
	rDATA->SUBJ_LIST_M[sjCOUNT].SUBJECT_INDEX = SUBJECT_INDEX
	rDATA->SUBJ_LIST_M[sjCOUNT].SUBJECT_POS_VAL = sjCOUNT
	FOR (nLOOP = 1 to nCOUNTER)
		IF(rDATA->DATA[nLOOP].UNIQUE_ID = UNIQUE_ID)
			rDATA->DATA[nLOOP].SUBJECT_POS_VAL = sjCOUNT
		ENDIF
	ENDFOR
FOOT DOSE_GROUP
	rDATA->DOSE_GROUP_M[dgCOUNT].DOSE_GROUP = DOSE_GROUP
	rDATA->DOSE_GROUP_M[dgCOUNT].REFERRING_COMMENT = rDATA->DATA[D1.SEQ].REFERRING_COMMENT
	rDATA->DOSE_GROUP_M[dgCOUNT].DG_SUBJ_CNT = dCOUNT
FOOT SEX
	rDATA->MALE_CNT = sCOUNT
	STAT = ALTERLIST(rDATA->DOSE_GROUP_M, dgCOUNT)
	STAT = ALTERLIST(rDATA->SUBJ_LIST_M, sjCOUNT)
FOOT REPORT
	rDATA->SUBJECT_CNT = sjCOUNT
WITH COUNTER
ENDIF
 
; Count subjects and update counters for Female subjects
IF ($REPORT_DESIGN IN ("ITVIB_2") and vFEMALE_ID = 1)
SELECT DISTINCT INTO "NL:"
	UNIQUE_ID			= rDATA->DATA[D1.SEQ].UNIQUE_ID,
	DOSE_GROUP			= rDATA->DATA[D1.SEQ].DOSE_GROUP,
	SEX					= rDATA->DATA[D1.SEQ].SEX,
	SUBJECT_INDEX		= rDATA->DATA[D1.SEQ].SUBJECT_INDEX,
	SUBJECT_ID			= rDATA->DATA[D1.SEQ].SUBJECT_ID
FROM	(DUMMYT			D1 WITH SEQ=VALUE(rDATA->COUNT))
WHERE rDATA->DATA[D1.SEQ].SEX = "Female"
ORDER SEX DESC, DOSE_GROUP, SUBJECT_INDEX, SUBJECT_ID
HEAD REPORT
	nCOUNTER = rDATA->COUNT
HEAD SEX
	sCOUNT = 0
	dgCOUNT = 0
	sjCOUNT = 0
	STAT = ALTERLIST(rDATA->DOSE_GROUP_F, 10)
	STAT = ALTERLIST(rDATA->SUBJ_LIST_F, 10)
	IF (vMALE_ID = 1)
		sjADD = size(rDATA->SUBJ_LIST_M,5)
	ELSE
		sjADD = 0
	ENDIF
HEAD DOSE_GROUP
	dCOUNT = 0
	dgCOUNT = dgCOUNT + 1
	IF (MOD(dgCOUNT,10) = 1 AND dgCOUNT > 10)
		STAT = ALTERLIST(rDATA->DOSE_GROUP_F, dgCOUNT + 10)
	ENDIF
HEAD SUBJECT_INDEX
	X = 0
HEAD SUBJECT_ID
	X = 0
	sjCOUNT = sjCOUNT + 1
	IF (MOD(sjCOUNT,10) = 1 AND sjCOUNT > 10)
		STAT = ALTERLIST(rDATA->SUBJ_LIST_F, sjCOUNT + 10)
	ENDIF
DETAIL
	sCOUNT = sCOUNT + 1
	dCOUNT = dCOUNT + 1
	rDATA->SUBJ_LIST_F[sjCOUNT].SUBJECT_ID = SUBJECT_ID
	rDATA->SUBJ_LIST_F[sjCOUNT].SUBJECT_INDEX = SUBJECT_INDEX
	rDATA->SUBJ_LIST_F[sjCOUNT].SUBJECT_POS_VAL = sjCOUNT + sjADD
	FOR (nLOOP = 1 to nCOUNTER)
		IF(rDATA->DATA[nLOOP].UNIQUE_ID = UNIQUE_ID)
			rDATA->DATA[nLOOP].SUBJECT_POS_VAL = sjCOUNT + sjADD
		ENDIF
	ENDFOR
FOOT DOSE_GROUP
	rDATA->DOSE_GROUP_F[dgCOUNT].DOSE_GROUP = DOSE_GROUP
	rDATA->DOSE_GROUP_F[dgCOUNT].REFERRING_COMMENT = rDATA->DATA[D1.SEQ].REFERRING_COMMENT
	rDATA->DOSE_GROUP_F[dgCOUNT].DG_SUBJ_CNT = dCOUNT
FOOT SEX
	rDATA->FEMALE_CNT = sCOUNT
	STAT = ALTERLIST(rDATA->DOSE_GROUP_F, dgCOUNT)
	STAT = ALTERLIST(rDATA->SUBJ_LIST_F, sjCOUNT)
FOOT REPORT
	rDATA->SUBJECT_CNT = sjCOUNT + sjADD
WITH COUNTER
ENDIF
 
; CALL ECHORECORD(rDATA)
 
; Collect a unique list of timepoints
SELECT INTO "NL:"
	TIMEPOINT			= rDATA->DATA[D1.SEQ].TIMEPOINT
	, TMPT_SEQ			= if (substring(1,1,rDATA->DATA[D1.SEQ].TIMEPOINT) = "P") 					;begin 007
							2
						  elseif (substring(1,1,rDATA->DATA[D1.SEQ].TIMEPOINT) = "D")
						    3
						  elseif (substring(1,1,rDATA->DATA[D1.SEQ].TIMEPOINT) = "R")
						    4
						  else
						    1
						  endif
FROM	(DUMMYT			D1 WITH SEQ=VALUE(rDATA->COUNT))
;ORDER TIMEPOINT								;007
ORDER TMPT_SEQ, TIMEPOINT						;007
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
	IF ($REPORT_DESIGN IN ("MTVMB", "MTVMB_2", "MTVMBR", "ITVIB", "ITVIB_2", "ITVIBR", "ITVIBRR", "MIR", "MIRR"))
		FOR (nLOOP = 1 to nCOUNT)
			IF (rDATA->TMPT_LIST[nLOOP].TIMEPOINT = $BASELINE)
				rDATA->TMPT_LIST[nLOOP].TMPT_BASELINE = 1
			ENDIF
		ENDFOR
	ENDIF
	rDATA->TMPT_CNT = nCOUNT
	STAT = ALTERLIST(rDATA->TMPT_LIST, nCOUNT)
;	Check timepoints collected and values assigned
;	FOR (nLOOP=1 to nCOUNT)
;		vTEST_OUTPUT = rDATA->TMPT_LIST[nLOOP].TIMEPOINT
;		vTEST_POS = rDATA->TMPT_LIST[nLOOP].TMPT_POS_VAL
;		CALL ECHO(vTEST_OUTPUT)
;		CALL ECHO(vTEST_POS)
;	ENDFOR
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
; array for reporting on the facesheet
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
 
/************************************************************************************
; Perform the calculation individual treatment versus individual baseline values
*************************************************************************************/
IF ($REPORT_DESIGN IN ("ITVIB", "ITVIB_2", "ITVIBR", "ITVIBRR", "MIR", "MIRR"))
	IF ($RATIO_PCNT = "1")
		SET cHEADER = "% Change of Individual from Baseline"
	ELSE
		SET cHEADER = "Ratio of Individual from Baseline"
	ENDIF
	SELECT INTO "NL:"
		PARAMETER_TYPE		= rDATA->DATA[D1.SEQ].PARAMETER_TYPE,
		SPECIES				= rDATA->DATA[D1.SEQ].SPECIES,
		SEX					= rDATA->DATA[D1.SEQ].SEX,
		DOSE_GROUP			= rDATA->DATA[D1.SEQ].DOSE_GROUP,
		SUBJECT_INDEX		= rDATA->DATA[D1.SEQ].SUBJECT_INDEX,
		SUBJECT_ID			= rDATA->DATA[D1.SEQ].SUBJECT_ID,
		TIMEPOINT			= rDATA->DATA[D1.SEQ].TIMEPOINT,
		TMPT_POS_VAL		= rDATA->DATA[D1.SEQ].TMPT_POS_VAL,
		TMPT_BASELINE		= rDATA->DATA[D1.SEQ].TMPT_BASELINE,
		RESULT				= rDATA->DATA[D1.SEQ].RESULT,
		VSF_TEST_NAME		= rDATA->DATA[D1.SEQ].VSF_TEST_NAME,
		GRID_POSITION		= rDATA->DATA[D1.SEQ].GRID_POSITION
	FROM	(DUMMYT			D1 WITH SEQ=VALUE(rDATA->COUNT))
	PLAN D1 WHERE rDATA->DATA[D1.SEQ].STATS = 1
	ORDER PARAMETER_TYPE, SPECIES, SEX DESC,  DOSE_GROUP, SUBJECT_INDEX, SUBJECT_ID, GRID_POSITION,
		TMPT_BASELINE DESC, TMPT_POS_VAL
	HEAD PARAMETER_TYPE
		X = 0
	HEAD SPECIES
		X = 0
	HEAD SEX
		X = 0
	HEAD SUBJECT_INDEX
		X = 0
	HEAD SUBJECT_ID
		X = 0
	HEAD GRID_POSITION
		vbaseline_val = 0
		BL_IND = 0
	HEAD TMPT_BASELINE
		X = 0
	HEAD TMPT_POS_VAL
		BL_IND = BL_IND + 1
	DETAIL
		; Determine if a prefix exists in the original string and trim string accordingly
		IF (FINDSTRING("<",RESULT) > 0)
			cPREFIX = "<"
			cFLAG = "@"
			TMP_RESULT = SUBSTRING(2,SIZE(RESULT)-1,TRIM(RESULT))
		ELSEIF (FINDSTRING(">",RESULT) > 0)
			cPREFIX = ">"
			cFLAG = "@"
			TMP_RESULT = SUBSTRING(2,SIZE(RESULT)-1,TRIM(RESULT))
		ELSE
			TMP_RESULT = RESULT
			cPREFIX = " "
			cFLAG = " "
		ENDIF
 
		IF (BL_IND = 1)
			IF (TMPT_BASELINE != 1)
				BL_IND = 0
			ENDIF
			vbaseline_val = CNVTREAL(TMP_RESULT)
			rDATA->DATA[D1.SEQ].P_CHANGE = 0
			rDATA->DATA[D1.SEQ].P_CHANGE_SG = "-"
			rDATA->DATA[D1.SEQ].P_CHANGE_SIGN = " "
			rDATA->DATA[D1.SEQ].CHANGE_RPT = "-"
			rDATA->DATA[D1.SEQ].BSLN_SIGN = " "
		ELSE
			IF (CNVTREAL(TMP_RESULT) > vbaseline_val) ; Increase from baseline
				v_diff = (CNVTREAL(TMP_RESULT) - vbaseline_val)/vbaseline_val
				IF (v_diff > 1)
					rDATA->DATA[D1.SEQ].P_CHANGE = ROUND(v_diff, 3)*100
					rDATA->DATA[D1.SEQ].P_CHANGE_SIGN = " "
					IF ($RATIO_PCNT = "1" AND $REPORT_DESIGN NOT IN ("MIR", "MIRR", "ITVIBRR"))
						vratio_temp2 = ROUND(v_diff, 3)*100
						vsize_temp2 = FINDSTRING(".",TRIM(BUILD(vratio_temp2)))
						v_diff = CNVTREAL(TMP_RESULT)/vbaseline_val
						vratio_temp1 = ROUND(v_diff, 1)
						vsize_temp1 = FINDSTRING(".",TRIM(BUILD(vratio_temp1)))
						rDATA->DATA[D1.SEQ].P_CHANGE_SG = SUBSTRING(1,vsize_temp2+1,TRIM(BUILD(vratio_temp2)))
						rDATA->DATA[D1.SEQ].CHANGE_RPT = CONCAT(SUBSTRING(1,vsize_temp1+1,TRIM(BUILD(vratio_temp1))),"x")
					ELSE
						v_diff = CNVTREAL(TMP_RESULT)/vbaseline_val
						vratio_temp2 = ROUND(v_diff, 2)
						vsize_temp2 = FINDSTRING(".",TRIM(BUILD(vratio_temp2)))
						rDATA->DATA[D1.SEQ].P_CHANGE_SG = SUBSTRING(1,vsize_temp2+2,TRIM(BUILD(vratio_temp2)))
						rDATA->DATA[D1.SEQ].CHANGE_RPT = SUBSTRING(1,vsize_temp2+2,TRIM(BUILD(vratio_temp2)))
					ENDIF
					rDATA->DATA[D1.SEQ].BSLN_SIGN = cPREFIX
					rDATA->DATA[D1.SEQ].P_FLAG = cFLAG
				ELSE
					rDATA->DATA[D1.SEQ].P_CHANGE = ROUND(v_diff, 3)*100
					rDATA->DATA[D1.SEQ].P_CHANGE_SIGN = " "
					IF ($RATIO_PCNT = "1" AND $REPORT_DESIGN NOT IN ("MIR", "MIRR", "ITVIBRR"))
						vratio_temp = ROUND(v_diff, 3)*100
						vsize_temp = FINDSTRING(".",TRIM(BUILD(vratio_temp)))
						rDATA->DATA[D1.SEQ].P_CHANGE_SG = SUBSTRING(1,vsize_temp+1,TRIM(BUILD(vratio_temp)))
						rDATA->DATA[D1.SEQ].CHANGE_RPT = CONCAT(SUBSTRING(1,vsize_temp+1,TRIM(BUILD(vratio_temp))),"%")
					ELSE
						v_diff = CNVTREAL(TMP_RESULT)/vbaseline_val
						vratio_temp = ROUND(v_diff, 2)
						vsize_temp = FINDSTRING(".",TRIM(BUILD(vratio_temp)))
						rDATA->DATA[D1.SEQ].P_CHANGE_SG = SUBSTRING(1,vsize_temp+2,TRIM(BUILD(vratio_temp)))
						rDATA->DATA[D1.SEQ].CHANGE_RPT = SUBSTRING(1,vsize_temp+2,TRIM(BUILD(vratio_temp)))
					ENDIF
					rDATA->DATA[D1.SEQ].BSLN_SIGN = cPREFIX
					rDATA->DATA[D1.SEQ].P_FLAG = cFLAG
				ENDIF
			ELSEIF (CNVTREAL(TMP_RESULT) < vbaseline_val) ; Decrease from baseline
					v_diff = (vbaseline_val - CNVTREAL(TMP_RESULT))/vbaseline_val
					rDATA->DATA[D1.SEQ].P_CHANGE = ROUND(v_diff, 3)*100
					IF ($RATIO_PCNT = "1" AND $REPORT_DESIGN NOT IN ("MIR", "MIRR", "ITVIBRR"))
						rDATA->DATA[D1.SEQ].P_CHANGE_SIGN = "-"
						vratio_temp = ROUND(v_diff, 3)*100
						vsize_temp = FINDSTRING(".",TRIM(BUILD(vratio_temp)))
						rDATA->DATA[D1.SEQ].P_CHANGE_SG = SUBSTRING(1,vsize_temp+1,TRIM(BUILD(vratio_temp)))
						rDATA->DATA[D1.SEQ].CHANGE_RPT = CONCAT(SUBSTRING(1,vsize_temp+1,TRIM(BUILD(vratio_temp))),"%")
					ELSE
						rDATA->DATA[D1.SEQ].P_CHANGE_SIGN = " "
						v_diff = CNVTREAL(TMP_RESULT)/vbaseline_val
						vratio_temp = ROUND(v_diff, 2)
						vsize_temp = FINDSTRING(".",TRIM(BUILD(vratio_temp)))
						rDATA->DATA[D1.SEQ].P_CHANGE_SG = SUBSTRING(1,vsize_temp+2,TRIM(BUILD(vratio_temp)))
						rDATA->DATA[D1.SEQ].CHANGE_RPT = SUBSTRING(1,vsize_temp+2,TRIM(BUILD(vratio_temp)))
					ENDIF
					rDATA->DATA[D1.SEQ].BSLN_SIGN = cPREFIX
					rDATA->DATA[D1.SEQ].P_FLAG = cFLAG
			ELSE ; No change
				IF ($RATIO_PCNT = "1" AND $REPORT_DESIGN NOT IN ("MIR", "MIRR", "ITVIBRR"))
					rDATA->DATA[D1.SEQ].P_CHANGE = 0
					rDATA->DATA[D1.SEQ].P_CHANGE_SG = "0"
					rDATA->DATA[D1.SEQ].P_CHANGE_SIGN = " "
					rDATA->DATA[D1.SEQ].CHANGE_RPT = "0%"
					rDATA->DATA[D1.SEQ].BSLN_SIGN = cPREFIX
					rDATA->DATA[D1.SEQ].P_FLAG = cFLAG
				ELSE
					rDATA->DATA[D1.SEQ].P_CHANGE = 1
					rDATA->DATA[D1.SEQ].P_CHANGE_SG = "1.00"
					rDATA->DATA[D1.SEQ].P_CHANGE_SIGN = " "
					rDATA->DATA[D1.SEQ].CHANGE_RPT = "1.00"
					rDATA->DATA[D1.SEQ].BSLN_SIGN = cPREFIX
					rDATA->DATA[D1.SEQ].P_FLAG = cFLAG
				ENDIF
			ENDIF
		ENDIF
	FOOT REPORT
		X = 0
	WITH COUNTER
ENDIF
 
; ECHO source record rDATA to file
 ;CALL ECHORECORD(rDATA)
 
 ;fix
/*****************************************************************************
; Move the Raw Data into a format acceptable for printing the raw data report
******************************************************************************/
IF ($REPORT_DESIGN IN ("D", "B", "XB", "ITVIBR", "ITVIBRR", "PRETEST", "RAW"))
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
		COLLECT_DT_TM		= rDATA->DATA[D1.SEQ].COLLECT_DT_TM,
		COLLECT_DT_TM_2		= rDATA->DATA[D1.SEQ].COLLECT_DT_TM_2,
		VSF_TEST_NAME		= rDATA->DATA[D1.SEQ].VSF_TEST_NAME,
		VSF_TEST_UNITS		= rDATA->REF_MAP[D2.SEQ].VSF_TEST_UNITS,
		GRID_POSITION		= rDATA->REF_MAP[D2.SEQ].GRID_POSITION,
		PAGE_NO				= rDATA->REF_MAP[D2.SEQ].PAGE_NO,
		MAX_TESTS			= rDATA->REF_MAP[D2.SEQ].MAX_TESTS,
		MAX_PAGE			= rDATA->REF_MAP[D2.SEQ].MAX_PAGE,
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
	ORDER BY PARAMETER_TYPE, SPECIES, SEX DESC, DOSE_GROUP, SUBJECT_INDEX, SUBJECT_ID, COLLECT_DT_TM_2,
		TMPT_POS_VAL, PAGE_NO, GRID_POSITION
	HEAD REPORT
		nCOUNT = 0
		xCOUNT = 0
		STAT = ALTERLIST(rREPORT->DATA, 500)
	HEAD PARAMETER_TYPE
		X = 0
	HEAD SPECIES
		X = 0
	HEAD SEX
		X = 0
	HEAD DOSE_GROUP
		X = 0
;	HEAD SUBJECT_INDEX
;		X = 0
	HEAD SUBJECT_ID
		X = 0
	HEAD COLLECT_DT_TM_2
;	HEAD TMPT_POS_VAL
		FOR (oLOOP = 1 TO MAX_PAGE)
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
			rREPORT->DATA[nCOUNT].COLLECT_DT_TM = COLLECT_DT_TM
			rREPORT->DATA[nCOUNT].COLLECT_DT_TM_2 = COLLECT_DT_TM_2
			rREPORT->DATA[nCOUNT].RESULT_PAGE = oLOOP
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
		ENDFOR
 
		maxCOUNT = nCOUNT
		nCOUNT = nCOUNT - MAX_PAGE + 1
		minCOUNT = nCOUNT
	HEAD PAGE_NO
		nCOUNT = nCOUNT + PAGE_NO - 1
	HEAD GRID_POSITION
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
	FOOT PAGE_NO
		nCOUNT = minCOUNT
	FOOT COLLECT_DT_TM_2
;	FOOT TMPT_POS_VAL
		nCOUNT = maxCOUNT
	FOOT REPORT
		rREPORT->COUNT = nCOUNT
		STAT = ALTERLIST(rREPORT->DATA, nCOUNT)
	WITH COUNTER
ENDIF
 
 ;CALL ECHORECORD(rREPORT)
 
/*********************************************************************
; Move the data into the proper place to print the statistics report
**********************************************************************/
IF ($REPORT_DESIGN IN ("S", "XB", "B", "MTVMB", "MTVMB_2", "MTVMC", "MTVMC_2", "MTVMCR", "MTVMBR"))
 
	; Collect and store the statistics
	SELECT INTO "NL:"
		PARAMETER_TYPE		= rDATA->DATA[D1.SEQ].PARAMETER_TYPE,
		SPECIES				= rDATA->DATA[D1.SEQ].SPECIES,
		SEX					= rDATA->DATA[D1.SEQ].SEX,
		DOSE_GROUP			= rDATA->DATA[D1.SEQ].DOSE_GROUP,
		DG_POS_VAL			= rDATA->DATA[D1.SEQ].DG_POS_VAL,
		DG_CONTROL			= rDATA->DATA[D1.SEQ].DG_CONTROL,
		DG_PAGE_NO			= rDATA->DATA[D1.SEQ].DG_PAGE_NO,
		DG_PER_PAGE			= rDATA->DATA[D1.SEQ].DG_PER_PAGE,
		REFERRING_COMMENT	= rDATA->DATA[D1.SEQ].REFERRING_COMMENT,
		SUBJECT_ID			= rDATA->DATA[D1.SEQ].SUBJECT_ID,
		TIMEPOINT			= rDATA->DATA[D1.SEQ].TIMEPOINT,
		TMPT_BASELINE		= rDATA->DATA[D1.SEQ].TMPT_BASELINE,
		TMPT_POS_VAL		= rDATA->DATA[D1.SEQ].TMPT_POS_VAL,
		COLLECT_DT_TM_2		= rDATA->DATA[D1.SEQ].COLLECT_DT_TM_2,
		VSF_TEST_NAME		= rDATA->DATA[D1.SEQ].VSF_TEST_NAME,
		VSF_TEST_UNITS		= rDATA->REF_MAP[D2.SEQ].VSF_TEST_UNITS,
		GRID_POSITION		= rDATA->REF_MAP[D2.SEQ].GRID_POSITION,
		RESULT				= rDATA->DATA[D1.SEQ].RESULT
	FROM	(DUMMYT			D1 WITH SEQ=VALUE(rDATA->COUNT)),
			(DUMMYT			D2 WITH SEQ=VALUE(rDATA->REF_CNT))
	PLAN D1
		WHERE rDATA->DATA[D1.SEQ].NR = 0	; Do not show tests with NR Comment
		AND rDATA->DATA[D1.SEQ].XX = 0	; Do not show tests with XX or XF Comment
		AND rDATA->DATA[D1.SEQ].SUBJECT_ID > " "
		AND rDATA->DATA[D1.SEQ].STATS = 1
		AND (ISNUMERIC(rDATA->DATA[D1.SEQ].RESULT,"<") > 0 ; Include only numeric results
			OR ISNUMERIC(rDATA->DATA[D1.SEQ].RESULT,">") > 0
			OR ISNUMERIC(rDATA->DATA[D1.SEQ].RESULT,"-") > 0)
	JOIN D2
		WHERE rDATA->DATA[D1.SEQ].PARAMETER_TYPE = rDATA->REF_MAP[D2.SEQ].PARAMETER_TYPE
		AND   rDATA->DATA[D1.SEQ].VSF_TEST_NAME = rDATA->REF_MAP[D2.SEQ].VSF_TEST_NAME
	ORDER PARAMETER_TYPE, SPECIES, SEX DESC, GRID_POSITION, TMPT_POS_VAL, DG_PAGE_NO, DOSE_GROUP
;	ORDER PARAMETER_TYPE, SPECIES, SEX DESC, GRID_POSITION, COLLECT_DT_TM_2, TMPT_POS_VAL, DG_PAGE_NO, DOSE_GROUP
	HEAD REPORT
		nCOUNT = 0
		STAT = ALTERLIST(rREPORT->STATS, 100)
	HEAD PARAMETER_TYPE
		X = 0
	HEAD SPECIES
		X = 0
	HEAD SEX
		X = 0
	HEAD GRID_POSITION
		X = 0
	HEAD TMPT_POS_VAL
		; Allocate the results structure and store header information
		nDG_CNT = rDATA->DG_CNT
		FOR (nLOOP = 1 TO rDATA->DG_MAX_PAGE)
			nCOUNT = nCOUNT + 1
			IF (MOD(nCOUNT, 100) = 1 AND nCOUNT > 100)
				STAT = ALTERLIST(rREPORT->STATS, nCOUNT + 100)
			ENDIF
 
			; Allocate the results structure and store header information
			rREPORT->STATS[nCOUNT].PARAMETER_TYPE = PARAMETER_TYPE
			rREPORT->STATS[nCOUNT].SPECIES = SPECIES
			rREPORT->STATS[nCOUNT].SEX = SEX
			rREPORT->STATS[nCOUNT].VSF_TEST_NAME = VSF_TEST_NAME
			rREPORT->STATS[nCOUNT].VSF_TEST_UNITS = VSF_TEST_UNITS
			rREPORT->STATS[nCOUNT].GRID_POSITION = GRID_POSITION
			rREPORT->STATS[nCOUNT].TIMEPOINT = TIMEPOINT
;			rREPORT->STATS[nCOUNT].COLLECT_DT_TM_2 = COLLECT_DT_TM_2			;6.0
			rREPORT->STATS[nCOUNT].TMPT_POS_VAL = TMPT_POS_VAL
			rREPORT->STATS[nCOUNT].TMPT_BASELINE = TMPT_BASELINE
			rREPORT->STATS[nCOUNT].RESULT_PAGE = nLOOP
			rREPORT->STATS[nCOUNT].RESULT_CNT = rDATA->DG_CNT
			IF (nDG_CNT > nSTAT_RESULTS)
				STAT = ALTERLIST(rREPORT->STATS[nCOUNT].RESULTS, nSTAT_RESULTS)
				nDG_CNT = nDG_CNT - nSTAT_RESULTS
				rREPORT->STATS[nCOUNT].DG_PER_PAGE = nSTAT_RESULTS
				FOR (oLOOP = 1 TO nSTAT_RESULTS)
					xOFFSET = (nLOOP - 1) * nSTAT_RESULTS
					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].DOSE_GROUP = rDATA->DOSE_GROUP[oLOOP + xOFFSET].DOSE_GROUP
					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].DG_POS_VAL = rDATA->DOSE_GROUP[oLOOP + xOFFSET].DG_POS_VAL
					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].DG_CONTROL = rDATA->DOSE_GROUP[oLOOP + xOFFSET].DG_CONTROL
					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].REFERRING_COMMENT = rDATA->DOSE_GROUP[oLOOP + xOFFSET].REFERRING_COMMENT
					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].ANIMALS = 0
				ENDFOR
			ELSE
				STAT = ALTERLIST(rREPORT->STATS[nCOUNT].RESULTS, nDG_CNT)
				rREPORT->STATS[nCOUNT].DG_PER_PAGE = nDG_CNT
				FOR (oLOOP = 1 TO nDG_CNT)
					xOFFSET = (nLOOP - 1) * nSTAT_RESULTS
					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].DOSE_GROUP = rDATA->DOSE_GROUP[oLOOP + xOFFSET].DOSE_GROUP
					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].DG_POS_VAL = rDATA->DOSE_GROUP[oLOOP + xOFFSET].DG_POS_VAL
					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].DG_CONTROL = rDATA->DOSE_GROUP[oLOOP + xOFFSET].DG_CONTROL
					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].REFERRING_COMMENT = rDATA->DOSE_GROUP[oLOOP + xOFFSET].REFERRING_COMMENT
					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].ANIMALS = 0
				ENDFOR
			ENDIF
 		ENDFOR
		maxCOUNT = nCOUNT
		nCOUNT = nCOUNT - rDATA->DG_MAX_PAGE + 1
		minCOUNT = nCOUNT
	HEAD DG_PAGE_NO
		nCOUNT = nCOUNT + DG_PAGE_NO - 1
	HEAD DOSE_GROUP
		nSUM = 0.0
		nCNT = 0
		cPREFIX = " "
		cSD_SIGN = " "
	DETAIL
		; Determine if a prefix exists in the original string and trim string accordingly
		IF (FINDSTRING("<",RESULT) > 0)
			cPREFIX = "<"
			cSD_SIGN = ">"
			TMP_RESULT = SUBSTRING(2,SIZE(RESULT)-1,TRIM(RESULT))
			vSD_SIGN = 1
			cFLAG = "@"
		ELSEIF (FINDSTRING(">",RESULT) > 0)
			cPREFIX = ">"
			cSD_SIGN = ">"
			TMP_RESULT = SUBSTRING(2,SIZE(RESULT)-1,TRIM(RESULT))
			vSD_SIGN = 1
			cFLAG = "@"
		ELSE
			TMP_RESULT = RESULT
			cFLAG = " "
		ENDIF
 
		; Determine the number of decimals in the original string
		nDECIMALS = 0
		IF (FINDSTRING(".",RESULT) > 0)
			nDECIMALS = SIZE(TRIM(RESULT)) - FINDSTRING(".",RESULT)
		ENDIF
		nSUM = nSUM + CNVTREAL(TMP_RESULT)
		nCNT = nCNT + 1
		STAT = ALTERLIST(rTEMP->DATA, nCNT)
		rTEMP->DATA[nCNT].RESULT = CNVTREAL(TMP_RESULT)
	FOOT DOSE_GROUP
		nMEAN = nSUM / nCNT
 
		; Calculate the standard deviation
		nFRM = 0.0
		nVARIANCE = 0.0
		nSTD_DEV = 0.0
		IF (nCNT > 1)
			FOR (nLOOP = 1 TO nCNT)
				nFRM = nFRM + ((rTEMP->DATA[nLOOP].RESULT - nMEAN) * (rTEMP->DATA[nLOOP].RESULT - nMEAN))
			ENDFOR
			nVARIANCE = nFRM / (nCNT - 1)
			nSTD_DEV = SQRT(nVARIANCE)
 		ENDIF
 
		; Determine the position to store the results
		FOR (oLOOP = 1 TO DG_PER_PAGE)
			IF (rREPORT->STATS[nCOUNT].RESULTS[oLOOP].DOSE_GROUP = DOSE_GROUP)
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].ANIMALS = nCNT
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].DG_PER_PAGE = DG_PER_PAGE
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].DG_POS_VAL = DG_POS_VAL
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].DG_CONTROL = DG_CONTROL
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].REFERRING_COMMENT = REFERRING_COMMENT
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].MEAN_DEC_PL = nDECIMALS+1
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].MEAN = ROUND(nMEAN, nDECIMALS+1)
				; Convert the mean into a string to appropriately display number of decimal places on report
				vmean_temp = ROUND(nMEAN,nDECIMALS+1)
				vsize_temp = FINDSTRING(".",TRIM(BUILD(nMEAN)))
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].MEAN_SG = SUBSTRING(1,vsize_temp+nDECIMALS+1,TRIM(BUILD(vmean_temp)))
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].PREFIX = cPREFIX
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].P_FLAG = cFLAG
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].PM_TXT = " +/- "
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].SD_SIGN = cSD_SIGN
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].STD_DEVIATION = ROUND(nSTD_DEV, nDECIMALS+2)
				; Convert the standard deviation into a string to appropriately display number of decimal places on report
				vstd_temp = ROUND(nSTD_DEV,nDECIMALS+2)
				vsize_temp = FINDSTRING(".",TRIM(BUILD(nSTD_DEV)))
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].STD_SG = SUBSTRING(1,vsize_temp+nDECIMALS+2,TRIM(BUILD(vstd_temp)))
			ENDIF
		ENDFOR
	FOOT DG_PAGE_NO
		nCOUNT = minCOUNT
	FOOT TMPT_POS_VAL
		nCOUNT = maxCOUNT
	FOOT REPORT
		rREPORT->STAT_CNT = nCOUNT
		STAT = ALTERLIST(rREPORT->STATS, nCOUNT)
	WITH COUNTER
ENDIF
 
/*********************************************************************
; Perform the calculation mean of individual ratios to baseline
**********************************************************************/
IF ($REPORT_DESIGN IN ("MIR", "MIRR"))
 
	; Collect and store the statistics
	SELECT INTO "NL:"
		PARAMETER_TYPE		= rDATA->DATA[D1.SEQ].PARAMETER_TYPE,
		SPECIES				= rDATA->DATA[D1.SEQ].SPECIES,
		SEX					= rDATA->DATA[D1.SEQ].SEX,
		DOSE_GROUP			= rDATA->DATA[D1.SEQ].DOSE_GROUP,
		DG_POS_VAL			= rDATA->DATA[D1.SEQ].DG_POS_VAL,
		DG_CONTROL			= rDATA->DATA[D1.SEQ].DG_CONTROL,
		DG_PAGE_NO			= rDATA->DATA[D1.SEQ].DG_PAGE_NO,
		DG_PER_PAGE			= rDATA->DATA[D1.SEQ].DG_PER_PAGE,
		REFERRING_COMMENT	= rDATA->DATA[D1.SEQ].REFERRING_COMMENT,
		SUBJECT_ID			= rDATA->DATA[D1.SEQ].SUBJECT_ID,
		TIMEPOINT			= rDATA->DATA[D1.SEQ].TIMEPOINT,
		TMPT_BASELINE		= rDATA->DATA[D1.SEQ].TMPT_BASELINE,
		TMPT_POS_VAL		= rDATA->DATA[D1.SEQ].TMPT_POS_VAL,
		COLLECT_DT_TM_2		= rDATA->DATA[D1.SEQ].COLLECT_DT_TM_2,
		VSF_TEST_NAME		= rDATA->DATA[D1.SEQ].VSF_TEST_NAME,
		VSF_TEST_UNITS		= rDATA->REF_MAP[D2.SEQ].VSF_TEST_UNITS,
		GRID_POSITION		= rDATA->REF_MAP[D2.SEQ].GRID_POSITION,
		RESULT				= rDATA->DATA[D1.SEQ].RESULT,
		P_CHANGE_SG			= rDATA->DATA[D1.SEQ].P_CHANGE_SG,
		PREFIX				= rDATA->DATA[D1.SEQ].BSLN_SIGN
	FROM	(DUMMYT			D1 WITH SEQ=VALUE(rDATA->COUNT)),
			(DUMMYT			D2 WITH SEQ=VALUE(rDATA->REF_CNT))
	PLAN D1
		WHERE rDATA->DATA[D1.SEQ].NR = 0	; Do not show tests with NR Comment
		AND rDATA->DATA[D1.SEQ].XX = 0	; Do not show tests with XX or XF Comment
		AND rDATA->DATA[D1.SEQ].SUBJECT_ID > " "
		AND rDATA->DATA[D1.SEQ].STATS = 1
		AND (ISNUMERIC(rDATA->DATA[D1.SEQ].RESULT,"<") > 0 ; Include only numeric results
			OR ISNUMERIC(rDATA->DATA[D1.SEQ].RESULT,">") > 0
			OR ISNUMERIC(rDATA->DATA[D1.SEQ].RESULT,"-") > 0)
		AND rDATA->DATA[D1.SEQ].P_CHANGE_SG != "-"
	JOIN D2
		WHERE rDATA->DATA[D1.SEQ].PARAMETER_TYPE = rDATA->REF_MAP[D2.SEQ].PARAMETER_TYPE
		AND   rDATA->DATA[D1.SEQ].VSF_TEST_NAME = rDATA->REF_MAP[D2.SEQ].VSF_TEST_NAME
	ORDER PARAMETER_TYPE, SPECIES, SEX DESC, GRID_POSITION, COLLECT_DT_TM_2, TMPT_POS_VAL, DG_PAGE_NO, DOSE_GROUP
	HEAD REPORT
		nCOUNT = 0
		STAT = ALTERLIST(rREPORT->STATS, 100)
	HEAD PARAMETER_TYPE
		X = 0
	HEAD SPECIES
		X = 0
	HEAD SEX
		X = 0
	HEAD GRID_POSITION
		X = 0
	HEAD TMPT_POS_VAL
		; Allocate the results structure and store header information
		nDG_CNT = rDATA->DG_CNT
		FOR (nLOOP = 1 TO rDATA->DG_MAX_PAGE)
			nCOUNT = nCOUNT + 1
			IF (MOD(nCOUNT, 100) = 1 AND nCOUNT > 100)
				STAT = ALTERLIST(rREPORT->STATS, nCOUNT + 100)
			ENDIF
 
			; Allocate the results structure and store header information
			rREPORT->STATS[nCOUNT].PARAMETER_TYPE = PARAMETER_TYPE
			rREPORT->STATS[nCOUNT].SPECIES = SPECIES
			rREPORT->STATS[nCOUNT].SEX = SEX
			rREPORT->STATS[nCOUNT].VSF_TEST_NAME = VSF_TEST_NAME
			rREPORT->STATS[nCOUNT].VSF_TEST_UNITS = VSF_TEST_UNITS
			rREPORT->STATS[nCOUNT].GRID_POSITION = GRID_POSITION
			rREPORT->STATS[nCOUNT].TIMEPOINT = TIMEPOINT
;			rREPORT->STATS[nCOUNT].COLLECT_DT_TM_2 = COLLECT_DT_TM_2			;6.0
			rREPORT->STATS[nCOUNT].TMPT_POS_VAL = TMPT_POS_VAL
			rREPORT->STATS[nCOUNT].TMPT_BASELINE = TMPT_BASELINE
			rREPORT->STATS[nCOUNT].RESULT_PAGE = nLOOP
			rREPORT->STATS[nCOUNT].RESULT_CNT = rDATA->DG_CNT
			IF (nDG_CNT > nSTAT_RESULTS)
				STAT = ALTERLIST(rREPORT->STATS[nCOUNT].RESULTS, nSTAT_RESULTS)
				nDG_CNT = nDG_CNT - nSTAT_RESULTS
				rREPORT->STATS[nCOUNT].DG_PER_PAGE = nSTAT_RESULTS
				FOR (oLOOP = 1 TO nSTAT_RESULTS)
					xOFFSET = (nLOOP - 1) * nSTAT_RESULTS
					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].DOSE_GROUP = rDATA->DOSE_GROUP[oLOOP + xOFFSET].DOSE_GROUP
					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].DG_POS_VAL = rDATA->DOSE_GROUP[oLOOP + xOFFSET].DG_POS_VAL
					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].DG_CONTROL = rDATA->DOSE_GROUP[oLOOP + xOFFSET].DG_CONTROL
					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].REFERRING_COMMENT = rDATA->DOSE_GROUP[oLOOP + xOFFSET].REFERRING_COMMENT
					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].ANIMALS = 0
				ENDFOR
			ELSE
				STAT = ALTERLIST(rREPORT->STATS[nCOUNT].RESULTS, nDG_CNT)
				rREPORT->STATS[nCOUNT].DG_PER_PAGE = nDG_CNT
				FOR (oLOOP = 1 TO nDG_CNT)
					xOFFSET = (nLOOP - 1) * nSTAT_RESULTS
					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].DOSE_GROUP = rDATA->DOSE_GROUP[oLOOP + xOFFSET].DOSE_GROUP
					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].DG_POS_VAL = rDATA->DOSE_GROUP[oLOOP + xOFFSET].DG_POS_VAL
					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].DG_CONTROL = rDATA->DOSE_GROUP[oLOOP + xOFFSET].DG_CONTROL
					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].REFERRING_COMMENT = rDATA->DOSE_GROUP[oLOOP + xOFFSET].REFERRING_COMMENT
					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].ANIMALS = 0
				ENDFOR
			ENDIF
 		ENDFOR
		maxCOUNT = nCOUNT
		nCOUNT = nCOUNT - rDATA->DG_MAX_PAGE + 1
		minCOUNT = nCOUNT
	HEAD DG_PAGE_NO
		nCOUNT = nCOUNT + DG_PAGE_NO - 1
	HEAD DOSE_GROUP
		nSUM = 0.0
		nCNT = 0
		cPREFIX = " "
		cSD_SIGN = " "
	DETAIL
		; Determine if a prefix exists in the original string and trim string accordingly
		IF (TMPT_BASELINE = 1)
			IF (FINDSTRING("<",RESULT) > 0)
				cPREFIX = "<"
				cSD_SIGN = ">"
				TMP_RESULT = SUBSTRING(2,SIZE(RESULT)-1,TRIM(RESULT))
				vSD_SIGN = 1
				cFLAG = "@"
			ELSEIF (FINDSTRING(">",RESULT) > 0)
				cPREFIX = ">"
				cSD_SIGN = ">"
				TMP_RESULT = SUBSTRING(2,SIZE(RESULT)-1,TRIM(RESULT))
				vSD_SIGN = 1
				cFLAG = "@"
			ELSE
				TMP_RESULT = RESULT
				cPREFIX = " "
				cFLAG = " "
			ENDIF
 		ELSE
 			IF (PREFIX = "<")
 				cSD_SIGN = ">"
 				vSD_SIGN = 1
 				cPREFIX = "<"
 				cFLAG = "@"
 			ELSEIF (PREFIX = ">")
 				cSD_SIGN = ">"
 				vSD_SIGN = 1
  				cPREFIX = ">"
 				cFLAG = "@"
 			ENDIF
			TMP_RESULT = P_CHANGE_SG
		ENDIF
 
		; Determine the number of decimals in the original string
		nDECIMALS = 0
		IF (FINDSTRING(".",TMP_RESULT) > 0)
			nDECIMALS = SIZE(TRIM(TMP_RESULT)) - FINDSTRING(".",TMP_RESULT)
		ENDIF
		nSUM = nSUM + CNVTREAL(TMP_RESULT)
		nCNT = nCNT + 1
		STAT = ALTERLIST(rTEMP->DATA, nCNT)
		rTEMP->DATA[nCNT].RESULT = CNVTREAL(TMP_RESULT)
	FOOT DOSE_GROUP
		nMEAN = nSUM / nCNT
 
		; Calculate the standard deviation
		nFRM = 0.0
		nVARIANCE = 0.0
		nSTD_DEV = 0.0
		IF (nCNT > 1)
			FOR (nLOOP = 1 TO nCNT)
				nFRM = nFRM + ((rTEMP->DATA[nLOOP].RESULT - nMEAN) * (rTEMP->DATA[nLOOP].RESULT - nMEAN))
			ENDFOR
			nVARIANCE = nFRM / (nCNT - 1)
			nSTD_DEV = SQRT(nVARIANCE)
 		ENDIF
 
		; Determine the position to store the results
		FOR (oLOOP = 1 TO DG_PER_PAGE)
			IF (rREPORT->STATS[nCOUNT].RESULTS[oLOOP].DOSE_GROUP = DOSE_GROUP)
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].ANIMALS = nCNT
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].DG_PER_PAGE = DG_PER_PAGE
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].DG_POS_VAL = DG_POS_VAL
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].DG_CONTROL = DG_CONTROL
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].REFERRING_COMMENT = REFERRING_COMMENT
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].MEAN_DEC_PL = nDECIMALS+1
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].MEAN = ROUND(nMEAN, nDECIMALS+1)
				; Convert the mean into a string to appropriately display number of decimal places on report
				vmean_temp = ROUND(nMEAN,nDECIMALS+1)
				vsize_temp = FINDSTRING(".",TRIM(BUILD(nMEAN)))
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].MEAN_SG = SUBSTRING(1,vsize_temp+nDECIMALS+1,TRIM(BUILD(vmean_temp)))
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].PM_TXT = " +/- "
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].PREFIX = cPREFIX
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].P_FLAG = cFLAG
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].SD_SIGN = cSD_SIGN
				rREPORT->STATS[nCOUNT].RESULTS[oLOOP].STD_DEVIATION = ROUND(nSTD_DEV, nDECIMALS+2)
				; Convert the standard deviation into a string to appropriately display number of decimal places on report
;				IF (TMPT_BASELINE != 1)
					vstd_temp = ROUND(nSTD_DEV,nDECIMALS+2)
					vsize_temp = FINDSTRING(".",TRIM(BUILD(nSTD_DEV)))
					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].STD_SG = SUBSTRING(1,vsize_temp+nDECIMALS+2,TRIM(BUILD(vstd_temp)))
;				ELSE
;					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].STD_SG = " "
;					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].PM_TXT = " "
;					rREPORT->STATS[nCOUNT].RESULTS[oLOOP].MEAN_SG = "-"
;				ENDIF
			ENDIF
		ENDFOR
	FOOT DG_PAGE_NO
		nCOUNT = minCOUNT
	FOOT TMPT_POS_VAL
		nCOUNT = maxCOUNT
	FOOT REPORT
		rREPORT->STAT_CNT = nCOUNT
		STAT = ALTERLIST(rREPORT->STATS, nCOUNT)
	WITH COUNTER
ENDIF
 
; CALL ECHORECORD(rREPORT)
 
/************************************************************************************
; Perform the calculation mean treatment versus mean control values
*************************************************************************************/
IF ($REPORT_DESIGN IN ("MTVMC", "MTVMC_2", "MTVMCR"))
	IF ($RATIO_PCNT = "1")
		SET cHEADER = "% Change of Mean from Control"
	ELSE
		SET cHEADER = "Ratio of Mean from Control"
	ENDIF
	SELECT INTO "NL:"
		PARAMETER_TYPE		= rREPORT->STATS[D1.SEQ].PARAMETER_TYPE,
		SPECIES				= rREPORT->STATS[D1.SEQ].SPECIES,
		SEX					= rREPORT->STATS[D1.SEQ].SEX,
		RESULT_PAGE			= rREPORT->STATS[D1.SEQ].RESULT_PAGE,
		GRID_POSITION		= rREPORT->STATS[D1.SEQ].GRID_POSITION,
		DOSE_GROUP			= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].DOSE_GROUP,
		MEAN				= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].MEAN,
		ANIMALS				= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].ANIMALS,
		DG_CONTROL			= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].DG_CONTROL,
		TIMEPOINT			= rREPORT->STATS[D1.SEQ].TIMEPOINT,
;		COLLECT_DT_TM_2		= rREPORT->STATS[D1.seq].COLLECT_DT_TM_2,			;6.0
		TMPT_POS_VAL		= rREPORT->STATS[D1.SEQ].TMPT_POS_VAL
	FROM	(DUMMYT			D1 WITH SEQ=VALUE(rREPORT->STAT_CNT)),
		(DUMMYT			D2 WITH SEQ=1)
	PLAN D1 WHERE MAXREC(D2, SIZE(rREPORT->STATS[D1.SEQ].RESULTS, 5))
	JOIN D2
	ORDER PARAMETER_TYPE, SPECIES, SEX DESC, GRID_POSITION, TMPT_POS_VAL, DG_CONTROL DESC, DOSE_GROUP
	HEAD PARAMETER_TYPE
		X = 0
	HEAD SPECIES
		X = 0
	HEAD SEX
		X = 0
	HEAD GRID_POSITION
		X = 0
	HEAD TMPT_POS_VAL
		NO_CONTROL_DG = 0
		DG_IND = 0
	HEAD DG_CONTROL
		IF (DG_CONTROL = 1 AND ANIMALS = 0)
			NO_CONTROL_DG = 1
		ENDIF
	HEAD DOSE_GROUP
		DG_IND = DG_IND + 1
	DETAIL
		IF (DG_IND = 1 OR NO_CONTROL_DG = 1)
			vcntrl_mean = MEAN
			rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE = 0
			rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG = "-"
			rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SIGN = " "
			rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].CHANGE_RPT = "-"
		ELSE
			IF (MEAN > vcntrl_mean) ; Increase from control
				v_diff = (MEAN - vcntrl_mean)/vcntrl_mean
				IF (v_diff > 1)
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE = ROUND(v_diff, 3)*100
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SIGN = " "
					IF ($RATIO_PCNT = "1")
						vratio_temp2 = ROUND(v_diff, 3)*100
						vsize_temp2 = FINDSTRING(".",TRIM(BUILD(vratio_temp2)))
						v_diff = MEAN/vcntrl_mean
						vratio_temp1 = ROUND(v_diff, 1)
						vsize_temp1 = FINDSTRING(".",TRIM(BUILD(vratio_temp1)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG = SUBSTRING(1,vsize_temp2+1,TRIM(BUILD(vratio_temp2)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].CHANGE_RPT = CONCAT(SUBSTRING(1,vsize_temp1+1,TRIM(BUILD(vratio_temp1))),"x")
					ELSE
						v_diff = MEAN/vcntrl_mean
						vratio_temp2 = ROUND(v_diff, 2)
						vsize_temp2 = FINDSTRING(".",TRIM(BUILD(vratio_temp2)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG = SUBSTRING(1,vsize_temp2+2,TRIM(BUILD(vratio_temp2)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].CHANGE_RPT = SUBSTRING(1,vsize_temp2+2,TRIM(BUILD(vratio_temp2)))
					ENDIF
				ELSE
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE = ROUND(v_diff, 3)*100
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SIGN = " "
					IF ($RATIO_PCNT = "1")
						vratio_temp = ROUND(v_diff, 3)*100
						vsize_temp = FINDSTRING(".",TRIM(BUILD(vratio_temp)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG = SUBSTRING(1,vsize_temp+1,TRIM(BUILD(vratio_temp)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].CHANGE_RPT = CONCAT(SUBSTRING(1,vsize_temp+1,TRIM(BUILD(vratio_temp))),"%")
					ELSE
						v_diff = MEAN/vcntrl_mean
						vratio_temp = ROUND(v_diff, 2)
						vsize_temp = FINDSTRING(".",TRIM(BUILD(vratio_temp)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG = SUBSTRING(1,vsize_temp+2,TRIM(BUILD(vratio_temp)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].CHANGE_RPT = SUBSTRING(1,vsize_temp+2,TRIM(BUILD(vratio_temp)))
					ENDIF
				ENDIF
			ELSEIF (MEAN < vcntrl_mean) ; Decrease from baseline
				IF (ANIMALS = 0)
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE = 0
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG = "-"
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SIGN = " "
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].CHANGE_RPT = "-"
				ELSE
					v_diff = (vcntrl_mean - MEAN)/vcntrl_mean
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE = ROUND(v_diff, 3)*100
					IF ($RATIO_PCNT = "1")
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SIGN = "-"
						vratio_temp = ROUND(v_diff, 3)*100
						vsize_temp = FINDSTRING(".",TRIM(BUILD(vratio_temp)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG = SUBSTRING(1,vsize_temp+1,TRIM(BUILD(vratio_temp)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].CHANGE_RPT = CONCAT(SUBSTRING(1,vsize_temp+1,TRIM(BUILD(vratio_temp))),"%")
					ELSE
						v_diff = MEAN/vcntrl_mean
						vratio_temp = ROUND(v_diff, 2)
						vsize_temp = FINDSTRING(".",TRIM(BUILD(vratio_temp)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SIGN = " "
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG = SUBSTRING(1,vsize_temp+2,TRIM(BUILD(vratio_temp)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].CHANGE_RPT = SUBSTRING(1,vsize_temp+2,TRIM(BUILD(vratio_temp)))
					ENDIF
				ENDIF
			ELSE ; No change
				IF (ANIMALS = 0)
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE = 0
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG = "-"
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SIGN = " "
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].CHANGE_RPT = "-"
				ELSE
					IF ($RATIO_PCNT = "1")
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE = 0
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG = "0"
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SIGN = " "
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].CHANGE_RPT = "0%"
					ELSE
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE = 1
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG = "1.00"
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SIGN = " "
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].CHANGE_RPT = "1.00"
					ENDIF
				ENDIF
			ENDIF
		ENDIF
	FOOT REPORT
		X = 0
	WITH COUNTER
ENDIF
 
/************************************************************************************
; Perform the calculation mean treatment versus mean baseline values
************************************************************************************/
IF ($REPORT_DESIGN IN ("MTVMB", "MTVMB_2", "MTVMBR"))
	IF ($RATIO_PCNT = "1")
		SET cHEADER = "% Change of Mean from Baseline"
	ELSE
		SET cHEADER = "Ratio of Mean from Baseline"
	ENDIF
	SELECT INTO "NL:"
		PARAMETER_TYPE		= rREPORT->STATS[D1.SEQ].PARAMETER_TYPE,
		SPECIES				= rREPORT->STATS[D1.SEQ].SPECIES,
		SEX					= rREPORT->STATS[D1.SEQ].SEX,
		RESULT_PAGE			= rREPORT->STATS[D1.SEQ].RESULT_PAGE,
		GRID_POSITION		= rREPORT->STATS[D1.SEQ].GRID_POSITION,
		DOSE_GROUP			= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].DOSE_GROUP,
		MEAN				= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].MEAN,
		ANIMALS				= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].ANIMALS,
		DG_CONTROL			= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].DG_CONTROL,
		TIMEPOINT			= rREPORT->STATS[D1.SEQ].TIMEPOINT,
;		COLLECT_DT_TM_2		= rREPORT->STATS[D1.seq].COLLECT_DT_TM_2,						;6.0
		TMPT_BASELINE		= rREPORT->STATS[D1.SEQ].TMPT_BASELINE,
		TMPT_POS_VAL		= rREPORT->STATS[D1.SEQ].TMPT_POS_VAL
	FROM	(DUMMYT			D1 WITH SEQ=VALUE(rREPORT->STAT_CNT)),
		(DUMMYT			D2 WITH SEQ=1)
	PLAN D1 WHERE MAXREC(D2, SIZE(rREPORT->STATS[D1.SEQ].RESULTS, 5))
	JOIN D2
	ORDER PARAMETER_TYPE, SPECIES, SEX DESC, RESULT_PAGE, GRID_POSITION, DOSE_GROUP, TMPT_BASELINE DESC, TMPT_POS_VAL		;007
;	ORDER PARAMETER_TYPE, SPECIES, SEX DESC, RESULT_PAGE, GRID_POSITION, DOSE_GROUP, TMPT_BASELINE DESC, COLLECT_DT_TM_2	;007
	HEAD PARAMETER_TYPE
		X = 0
	HEAD SPECIES
		X = 0
	HEAD SEX
		X = 0
	HEAD GRID_POSITION
		X = 0
	HEAD DOSE_GROUP
		vbaseline_mean = 0
		BL_IND = 0
	HEAD TMPT_POS_VAL				;007
	;HEAD COLLECT_DT_TM_2			;007
		BL_IND = BL_IND + 1
	DETAIL
		IF (BL_IND = 1)
			IF (TMPT_BASELINE != 1 OR ANIMALS = 0)
				BL_IND = 0
			ENDIF
			vbaseline_mean = MEAN
			rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE = 0
			rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG = "-"
			rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SIGN = " "
			rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].CHANGE_RPT = "-"
		ELSE
			IF (MEAN > vbaseline_mean) ; Increase from baseline
				v_diff = (MEAN - vbaseline_mean)/vbaseline_mean
				IF (v_diff > 1)
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE = ROUND(v_diff, 3)*100
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SIGN = " "
					IF ($RATIO_PCNT = "1")
						vratio_temp2 = ROUND(v_diff, 3)*100
						vsize_temp2 = FINDSTRING(".",TRIM(BUILD(vratio_temp2)))
						v_diff = MEAN/vbaseline_mean
						vratio_temp1 = ROUND(v_diff, 1)
						vsize_temp1 = FINDSTRING(".",TRIM(BUILD(vratio_temp1)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG = SUBSTRING(1,vsize_temp2+1,TRIM(BUILD(vratio_temp2)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].CHANGE_RPT = CONCAT(SUBSTRING(1,vsize_temp1+1,TRIM(BUILD(vratio_temp1))),"x")
					ELSE
						v_diff = MEAN/vbaseline_mean
						vratio_temp2 = ROUND(v_diff, 2)
						vsize_temp2 = FINDSTRING(".",TRIM(BUILD(vratio_temp2)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG = SUBSTRING(1,vsize_temp2+2,TRIM(BUILD(vratio_temp2)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].CHANGE_RPT = SUBSTRING(1,vsize_temp2+2,TRIM(BUILD(vratio_temp2)))
					ENDIF
				ELSE
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE = ROUND(v_diff, 3)*100
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SIGN = " "
					IF ($RATIO_PCNT = "1")
						vratio_temp = ROUND(v_diff, 3)*100
						vsize_temp = FINDSTRING(".",TRIM(BUILD(vratio_temp)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG = SUBSTRING(1,vsize_temp+1,TRIM(BUILD(vratio_temp)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].CHANGE_RPT = CONCAT(SUBSTRING(1,vsize_temp+1,TRIM(BUILD(vratio_temp))),"%")
					ELSE
						v_diff = MEAN/vbaseline_mean
						vratio_temp = ROUND(v_diff, 2)
						vsize_temp = FINDSTRING(".",TRIM(BUILD(vratio_temp)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG = SUBSTRING(1,vsize_temp+2,TRIM(BUILD(vratio_temp)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].CHANGE_RPT = SUBSTRING(1,vsize_temp+2,TRIM(BUILD(vratio_temp)))
					ENDIF
				ENDIF
			ELSEIF (MEAN < vbaseline_mean) ; Decrease from baseline
				IF (ANIMALS = 0)
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE = 0
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG = "-"
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SIGN = " "
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].CHANGE_RPT = "-"
				ELSE
					v_diff = (vbaseline_mean - MEAN)/vbaseline_mean
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE = ROUND(v_diff, 3)*100
					IF ($RATIO_PCNT = "1")
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SIGN = "-"
						vratio_temp = ROUND(v_diff, 3)*100
						vsize_temp = FINDSTRING(".",TRIM(BUILD(vratio_temp)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG = SUBSTRING(1,vsize_temp+1,TRIM(BUILD(vratio_temp)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].CHANGE_RPT = CONCAT(SUBSTRING(1,vsize_temp+1,TRIM(BUILD(vratio_temp))),"%")
					ELSE
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SIGN = " "
						v_diff = MEAN/vbaseline_mean
						vratio_temp = ROUND(v_diff, 2)
						vsize_temp = FINDSTRING(".",TRIM(BUILD(vratio_temp)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG = SUBSTRING(1,vsize_temp+2,TRIM(BUILD(vratio_temp)))
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].CHANGE_RPT = SUBSTRING(1,vsize_temp+2,TRIM(BUILD(vratio_temp)))
					ENDIF
				ENDIF
			ELSE ; No change
				IF (ANIMALS = 0)
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE = 0
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG = "-"
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SIGN = " "
					rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].CHANGE_RPT = "-"
				ELSE
					IF ($RATIO_PCNT = "1")
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE = 0
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG = "0"
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SIGN = " "
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].CHANGE_RPT = "0%"
					ELSE
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE = 1
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG = "1.00"
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SIGN = " "
						rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].CHANGE_RPT = "1.00"
					ENDIF
				ENDIF
			ENDIF
		ENDIF
	FOOT REPORT
		X = 0
	WITH COUNTER
ENDIF
 
; ECHO source record rREPORT to file
;	CALL ECHORECORD(rREPORT)
 
 
 
/***************************************************************************************************
;
;									Output Section
;
****************************************************************************************************/
#ERROR_FOUND
EXECUTE ReportRTL
%i cust_script:pfi_data_list_and_stats_v8_0.dvl
 
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
IF ($REPORT_DESIGN IN ("S", "B", "D", "MIRR", "ITVIBR", "ITVIBRR", "MTVMCR", "MTVMBR", "PRETEST"))
SELECT DISTINCT INTO "NL:"
	CLASS_ORDER			 = CVM.CLASS_ORDER,
	VSF_TEST_NAME		 = CVM.VSF_TEST_NAME,
	PARAM_ORDER			 = CVM.PARAM_ORDER,
	TASK_ASSAY_CD		 = CVM.TASK_ASSAY_CD,
	PARAMETER_TYPE		 = CVM.PARAMETER_TYPE,
	;6.0
	VSF_TEST_DESCRIPTION = if (cvm.vsf_test_description > " ")
							   cvm.vsf_test_description
						   else
						       dta.description
						   endif,
    ;end 6.0
	VSF_TEST_UNITS		 = CVM.VSF_TEST_UNITS
FROM	(DUMMYT				D WITH SEQ=VALUE(rDATA->COUNT)),
		CERNER_VSF_MAP		CVM,
		DISCRETE_TASK_ASSAY	DTA
PLAN D
		WHERE ($REPORT_DESIGN = "S" ; Do not show tests with NR Comment and Hide Alpha Responses
		AND   rDATA->DATA[D.SEQ].NR = 0
		AND   ISNUMERIC(rDATA->DATA[D.SEQ].RESULT) > 0)
		OR    $REPORT_DESIGN IN ("D", "B", "ITVIBR", "ITVIBRR", "MIRR", "MTVMCR", "MTVMBR", "PRETEST")
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
IF ($REPORT_DESIGN IN ("D", "B", "ITVIBR", "ITVIBRR", "MIRR", "PRETEST"))
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
IF ($REPORT_DESIGN IN ("D", "B", "PRETEST"))
	SET vTMPT_CNT = rDATA->TMPT_CNT
	SELECT INTO "NL:"
		PARAMETER_TYPE		= rREPORT->DATA[D.SEQ].PARAMETER_TYPE,
		SPECIES				= rREPORT->DATA[D.SEQ].SPECIES,
		SEX					= rREPORT->DATA[D.SEQ].SEX,
		REFERRING_COMMENT	= rREPORT->DATA[D.SEQ].REFERRING_COMMENT,
		DOSE_GROUP			= rREPORT->DATA[D.SEQ].DOSE_GROUP,
		SUBJECT_ID			= rREPORT->DATA[D.SEQ].SUBJECT_ID,
		unique_id			= rREPORT->data[d.seq].unique_id,														;5.0
		SUBJECT_INDEX		= rREPORT->DATA[D.SEQ].SUBJECT_INDEX,
		COLLECT_DATE		= rREPORT->DATA[D.SEQ].COLLECT_DATE,
		COLLECT_DT_TM		= rREPORT->DATA[D.SEQ].COLLECT_DT_TM,
		COLLECT_DT_TM_2		= rREPORT->DATA[D.SEQ].COLLECT_DT_TM_2,
		TIMEPOINT			= rREPORT->DATA[D.SEQ].TIMEPOINT,
		TMPT_POS_VAL		= rREPORT->DATA[D.SEQ].TMPT_POS_VAL,
		RESULT_PAGE			= rREPORT->DATA[D.SEQ].RESULT_PAGE,
		RESULT_CNT			= rREPORT->DATA[D.SEQ].RESULT_CNT
	FROM	(DUMMYT				D WITH SEQ=VALUE(rREPORT->COUNT))
	ORDER PARAMETER_TYPE, SPECIES, SEX DESC, RESULT_PAGE, DOSE_GROUP, SUBJECT_INDEX, SUBJECT_ID, COLLECT_DT_TM_2	;5.0
	;ORDER PARAMETER_TYPE, SPECIES, SEX DESC, RESULT_PAGE, DOSE_GROUP, SUBJECT_INDEX, unique_id, COLLECT_DT_TM_2		;5.0
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
		IF ($REPORT_DESIGN != "PRETEST")
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
	HEAD COLLECT_DT_TM
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
		IF ($REPORT_DESIGN = "D")
			nEND = 1
		ENDIF
		X = Footer(0)
	WITH COUNTER, NULLREPORT
 
ENDIF
 
/*******************************************************************
; Output the Individual treatment versus baseline report
********************************************************************/
IF ($REPORT_DESIGN IN ("ITVIBR") AND ($SAMPLE_INT = "0"))
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
	PLAN D WHERE rDATA->DATA[D.SEQ].STATS = 1
	ORDER PARAMETER_TYPE, SPECIES, SEX DESC, RESULT_PAGE, DOSE_GROUP, SUBJECT_INDEX, SUBJECT_ID, TMPT_POS_VAL 	;007
;	ORDER PARAMETER_TYPE, SPECIES, SEX DESC, RESULT_PAGE, DOSE_GROUP, SUBJECT_INDEX, SUBJECT_ID, COLLECT_DT_TM_2 , TMPT_POS_VAL
	HEAD REPORT
		nBREAK = 0
		nEND = 0
		cTITLE = TRIM(cHeader)
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
		PRINT_DG = 1
		IF (nROW_POS + vTMPT_CNT > nRESULT_ROWS - 3)
			_Yoffset = 9.22
			X = Footer(0)
			Call PageBreak(0)
			X = Header(0)
			X = DetailHeader(0)
			nROW_POS = 0
		ENDIF
		X = DetailGroupHeader(0)
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
	HEAD TMPT_POS_VAL				;007
	;HEAD COLLECT_DT_TM_2			;007
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
 
		X = IndividualPercentDetail(0)
		PRINT_DG = 0
	;FOOT TMPT_POS_VAL				;007
	;FOOT COLLECT_DT_TM_2			;007
		X = 0
	FOOT SUBJECT_ID
		X = BlankSection(0)
		nROW_POS = nROW_POS + 1
	FOOT REPORT
		IF (rREPORT->COUNT < 1 )
			X = NoData(0)
		ENDIF
 
		_Yoffset = 9.22
		nEND = 1
		X = Footer(0)
	WITH COUNTER, NULLREPORT
 
ENDIF
 
/****************************************
; Output the Stats Report
****************************************/
IF ($REPORT_DESIGN IN ("S", "B", "MIRR") AND ($SAMPLE_INT = "0"))
	SELECT INTO "NL:"
		PARAMETER_TYPE		= rREPORT->STATS[D.SEQ].PARAMETER_TYPE,
		SPECIES				= rREPORT->STATS[D.SEQ].SPECIES,
		SEX					= rREPORT->STATS[D.SEQ].SEX,
		VSF_TEST_NAME		= rREPORT->STATS[D.SEQ].VSF_TEST_NAME,
		VSF_TEST_UNITS		= rREPORT->STATS[D.SEQ].VSF_TEST_UNITS,
		GRID_POSITION		= rREPORT->STATS[D.SEQ].GRID_POSITION,
		TIMEPOINT			= rREPORT->STATS[D.SEQ].TIMEPOINT,
;		COLLECT_DT_TM_2		= rREPORT->STATS[D.seq].COLLECT_DT_TM_2,			;007
		TMPT_POS_VAL		= rREPORT->STATS[D.SEQ].TMPT_POS_VAL,
		RESULT_PAGE			= rREPORT->STATS[D.SEQ].RESULT_PAGE,
		DG_PER_PAGE			= rREPORT->STATS[D.SEQ].DG_PER_PAGE,
		RESULT_CNT			= rREPORT->STATS[D.SEQ].RESULT_CNT
	FROM	(DUMMYT				D WITH SEQ=VALUE(rREPORT->STAT_CNT))
	ORDER PARAMETER_TYPE, SPECIES, SEX DESC, RESULT_PAGE, GRID_POSITION, TMPT_POS_VAL							;007
	;ORDER PARAMETER_TYPE, SPECIES, SEX DESC, RESULT_PAGE, GRID_POSITION, COLLECT_DT_TM_2			 			;007
	HEAD REPORT
		IF ($REPORT_DESIGN IN ("B"))
			CALL PageBreak(0)
		ENDIF
		nBREAK = 0
		nEND = 0
		cTEST = FILLSTRING(80," ")
		IF ($REPORT_DESIGN IN ("MIRR"))
			cTITLE = "Mean of Individual Ratios from Baseline"
		ELSE
			cTITLE = "Summary Report"
		ENDIF
	HEAD PARAMETER_TYPE
		X = 0
	HEAD SPECIES
		X = 0
	HEAD SEX
		X = 0
	HEAD RESULT_PAGE
		IF (nBREAK = 1)
			_Yoffset = 9.22
			X = Footer(0)
			Call PageBreak(0)
		ENDIF
		nRESULT_CNT = RESULT_CNT
		nPOS = D.SEQ
		nOFFSET = 0
 		nROW_CNT = 0
 		nTMPT_CNT = 0
 
		X = Header(0)
		X = StatHeader(0)
	HEAD GRID_POSITION
		IF ((nROW_CNT + nTMPT_CNT + 1) > nSTAT_ROWS)
			_Yoffset = 9.22
			X = Footer(0)
			Call PageBreak(0)
			X = Header(0)
			X = StatHeader(0)
			nROW_CNT = 0
		ENDIF
 
 		IF (TRIM(VSF_TEST_UNITS) != "")
			cTEST = CONCAT(TRIM(VSF_TEST_NAME)," (", TRIM(VSF_TEST_UNITS), ")")
		ELSE
			cTEST = VSF_TEST_NAME
		ENDIF
		nROW_CNT = nROW_CNT + 1
		nTMPT_CNT = 0
 
		X = StatTestGroup(0)
 
;CALL ECHO(nRESULT_CNT)
;CALL ECHO(nOFFSET)
 
	HEAD TMPT_POS_VAL			;007
	;HEAD COLLECT_DT_TM_2		;007
		X = 0
	DETAIL
		nBREAK = 1
 		nROW_CNT = nROW_CNT + 1
 		nTMPT_CNT = nTMPT_CNT + 1
 
		nPOS = D.SEQ
		IF (rDATA->COUNT > 0)
			X = StatDetail(0)
		ENDIF
	FOOT REPORT
		IF (rDATA->COUNT < 1 )
			X = NoData(0)
		ENDIF
 
		_Yoffset = 9.22
		IF ($REPORT_DESIGN IN ("S", "B", "MIRR"))
			nEND = 1
		ENDIF
		X = Footer(0)
	WITH COUNTER, NULLREPORT
ENDIF
 
 
 ;call echorecord(rREPORT)
/***************************************************************************************
; Output the Change of Mean from Baseline/Control Report and Mean Ratios from Baseline
****************************************************************************************/
IF ($REPORT_DESIGN IN ("MTVMCR", "MTVMBR") and (vERR_FLAG = 0) AND ($SAMPLE_INT = "0"))
	SELECT INTO "NL:"
		PARAMETER_TYPE		= rREPORT->STATS[D.SEQ].PARAMETER_TYPE,
		SPECIES				= rREPORT->STATS[D.SEQ].SPECIES,
		SEX					= rREPORT->STATS[D.SEQ].SEX,
		VSF_TEST_NAME		= rREPORT->STATS[D.SEQ].VSF_TEST_NAME,
		VSF_TEST_UNITS		= rREPORT->STATS[D.SEQ].VSF_TEST_UNITS,
		GRID_POSITION		= rREPORT->STATS[D.SEQ].GRID_POSITION,
		TIMEPOINT			= rREPORT->STATS[D.SEQ].TIMEPOINT,
		TMPT_POS_VAL		= rREPORT->STATS[D.SEQ].TMPT_POS_VAL,
;		COLLECT_DT_TM_2		= rREPORT->STATS[d.seq].COLLECT_DT_TM_2,			;007
		RESULT_PAGE			= rREPORT->STATS[D.SEQ].RESULT_PAGE,
		DG_PER_PAGE			= rREPORT->STATS[D.SEQ].DG_PER_PAGE,
		RESULT_CNT			= rREPORT->STATS[D.SEQ].RESULT_CNT
	FROM	(DUMMYT				D WITH SEQ=VALUE(rREPORT->STAT_CNT))
	ORDER PARAMETER_TYPE, SPECIES, SEX DESC, RESULT_PAGE, GRID_POSITION, TMPT_POS_VAL						;007
	;ORDER PARAMETER_TYPE, SPECIES, SEX DESC, RESULT_PAGE, GRID_POSITION, COLLECT_DT_TM_2			 		;007
	HEAD REPORT
		IF ($REPORT_DESIGN NOT IN ("MTVMCR", "MTVMBR"))
			CALL PageBreak(0)
		ENDIF
		nBREAK = 0
		nEND = 0
		cTEST = FILLSTRING(80," ")
		cTITLE = TRIM(cHEADER)
	HEAD PARAMETER_TYPE
		X = 0
	HEAD SPECIES
		X = 0
	HEAD SEX
		X = 0
	HEAD RESULT_PAGE
		IF (nBREAK = 1)
			_Yoffset = 9.22
			X = Footer(0)
			Call PageBreak(0)
		ENDIF
		nRESULT_CNT = RESULT_CNT
		nPOS = D.SEQ
		nOFFSET = 0
 		nROW_CNT = 0
 		nTMPT_CNT = 0
 
		X = Header(0)
		X = StatHeader(0)
	HEAD GRID_POSITION
		IF ((nROW_CNT + nTMPT_CNT + 1) > nSTAT_ROWS)
			_Yoffset = 9.22
			X = Footer(0)
			Call PageBreak(0)
			X = Header(0)
			X = StatHeader(0)
			nROW_CNT = 0
		ENDIF
 
 		IF (TRIM(VSF_TEST_UNITS) != "")
			cTEST = CONCAT(TRIM(VSF_TEST_NAME)," (", TRIM(VSF_TEST_UNITS), ")")
		ELSE
			cTEST = VSF_TEST_NAME
		ENDIF
		nROW_CNT = nROW_CNT + 1
		nTMPT_CNT = 0
 
		X = StatTestGroup(0)
 
;CALL ECHO(nRESULT_CNT)
;CALL ECHO(nOFFSET)
 
	HEAD TMPT_POS_VAL			;007
	;HEAD COLLECT_DT_TM_2		;007
		X = 0
	DETAIL
		nBREAK = 1
 		nROW_CNT = nROW_CNT + 1
 		nTMPT_CNT = nTMPT_CNT + 1
 
		nPOS = D.SEQ
		IF (rDATA->COUNT > 0)
			X = MeanPercentDetail(0)
		ENDIF
	FOOT REPORT
		IF (rDATA->COUNT < 1 )
			X = NoData(0)
		ENDIF
 
		_Yoffset = 9.22
		nEND = 1
		X = Footer(0)
	WITH COUNTER, NULLREPORT
ENDIF
 
/***************************************
; Output the Raw and Ratio Report
***************************************/
IF ($REPORT_DESIGN IN ("ITVIBRR"))
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
		COLLECT_DT_TM		= rREPORT->DATA[D.SEQ].COLLECT_DT_TM,
		COLLECT_DT_TM_2		= rREPORT->DATA[D.SEQ].COLLECT_DT_TM_2,
		TIMEPOINT			= rREPORT->DATA[D.SEQ].TIMEPOINT,
		TMPT_POS_VAL		= rREPORT->DATA[D.SEQ].TMPT_POS_VAL,
		RESULT_PAGE			= rREPORT->DATA[D.SEQ].RESULT_PAGE,
		RESULT_CNT			= rREPORT->DATA[D.SEQ].RESULT_CNT
	FROM	(DUMMYT				D WITH SEQ=VALUE(rREPORT->COUNT))
	ORDER PARAMETER_TYPE, SPECIES, SEX DESC, RESULT_PAGE, DOSE_GROUP, SUBJECT_INDEX, SUBJECT_ID, COLLECT_DT_TM_2
	HEAD REPORT
		nBREAK = 0
		nEND = 0
		cTITLE = "Raw and Ratio Report"
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
		X = RatioRawHeader(0)
	HEAD DOSE_GROUP
		IF (nROW_POS + vTMPT_CNT > nRESULT_ROWS - 3)
			_Yoffset = 9.22
			X = Footer(0)
			Call PageBreak(0)
			X = Header(0)
			X = RatioRawHeader(0)
			nROW_POS = 0
		ENDIF
		X = DetailGroupHeader(0)
		nROW_POS = nROW_POS + 1
	HEAD SUBJECT_ID
		IF (nROW_POS + nROWS_PER_SUBJ + 1 > nRESULT_ROWS)
			_Yoffset = 9.22
			X = Footer(0)
			Call PageBreak(0)
			X = Header(0)
			X = RatioRawHeader(0)
			nROW_POS = 0
		ENDIF
		nROWS_PER_SUBJ = 0
	HEAD COLLECT_DT_TM
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
			X = RatioRawHeader(0)
			nROW_POS = 0
		ENDIF
 
		X = RatioRawDetail(0)
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
		X = Footer(0)
	WITH COUNTER, NULLREPORT
 
ENDIF
 
/******************************************************************************************
; Output the mean treatment versus mean control data extract (assay over dose group format)
*******************************************************************************************/
IF (($REPORT_DESIGN IN ("MTVMC")) AND (vERR_FLAG = 0) AND ($SAMPLE_INT = "0"))
 
	/***********************************************************************
	; Generate output file delimited by a comma character (",")
	************************************************************************/
	SET vTEST_CNT = rDATA->REF_CNT
	SET mesgdttm = cnvtstring(cnvtdatetime(curdate, curtime3))
;	SET OUTPUT = concat("ccluserdir:mvc1_", cnvtlower($OUTDEV),".csv")		;008
	SET OUTPUT = concat("cust_reports:mvc1_", cnvtlower($OUTDEV),".csv")	;008
 
	SELECT INTO VALUE(OUTPUT)
		PARAMETER_TYPE		= rREPORT->STATS[D1.SEQ].PARAMETER_TYPE,
		SPECIES				= rREPORT->STATS[D1.SEQ].SPECIES,
		SEX					= rREPORT->STATS[D1.SEQ].SEX,
		VSF_TEST_NAME		= rREPORT->STATS[D1.SEQ].VSF_TEST_NAME,
		VSF_TEST_UNITS		= rREPORT->STATS[D1.SEQ].VSF_TEST_UNITS,
		GRID_POSITION		= rREPORT->STATS[D1.SEQ].GRID_POSITION,
		TIMEPOINT			= rREPORT->STATS[D1.SEQ].TIMEPOINT,
		TMPT_POS_VAL		= rREPORT->STATS[D1.SEQ].TMPT_POS_VAL,
;		COLLECT_DT_TM_2		= rREPORT->STATS[d1.seq].COLLECT_DT_TM_2,			;007
		RESULT_CNT			= rREPORT->STATS[D1.SEQ].RESULT_CNT,
		DG_CONTROL			= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].DG_CONTROL,
		DOSE_GROUP			= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].DOSE_GROUP,
		REFERRING_COMMENT	= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].REFERRING_COMMENT,
		MEAN_SG				= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].MEAN_SG,
		P_CHANGE_SIGN		= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SIGN,
		P_CHANGE_SG			= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG,
		P_FLAG				= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_FLAG,
		ANIMALS				= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].ANIMALS
	FROM	(DUMMYT				D1 WITH SEQ=VALUE(rREPORT->STAT_CNT)),
			(DUMMYT				D2 WITH SEQ=1)
	PLAN D1 WHERE MAXREC(D2,SIZE(rREPORT->STATS[D1.SEQ].RESULTS,5))
	JOIN D2 WHERE rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].ANIMALS != 0
	ORDER PARAMETER_TYPE, SPECIES, SEX DESC, TMPT_POS_VAL, DG_CONTROL DESC, DOSE_GROUP, GRID_POSITION		;007
	;ORDER PARAMETER_TYPE, SPECIES, SEX DESC, COLLECT_DT_TM_2, DG_CONTROL DESC, DOSE_GROUP, GRID_POSITION	;007
	HEAD REPORT
		strngHldr = concat(trim(cPROTOCOL),",",trim(cHEADER))
		col 0 strngHldr
		row + 1
	HEAD PARAMETER_TYPE
		strngHldr = trim(PARAMETER_TYPE)
		col 0 strngHldr
		row + 1
 
		strngHldr = trim("Dose Group,Sex,Day,")
		FOR (nLOOP = 1 to vTEST_CNT)
			IF (rDATA->REF_MAP[nLOOP].PARAMETER_TYPE = PARAMETER_TYPE)
				strngHldr = concat(strngHldr,trim(rDATA->REF_MAP[nLOOP].VSF_TEST_NAME,3),",")
				strngHldr = concat(strngHldr,trim(rDATA->REF_MAP[nLOOP].VSF_TEST_NAME,3),",")
			ENDIF
		ENDFOR
		col 0 strngHldr
		row + 1
 
		strngHldr = trim(",,,")
		FOR (nLOOP = 1 to vTEST_CNT)
			IF (rDATA->REF_MAP[nLOOP].PARAMETER_TYPE = PARAMETER_TYPE)
				IF ($RATIO_PCNT = "1")
					strngHldr = concat(strngHldr,trim(rDATA->REF_MAP[nLOOP].VSF_TEST_UNITS),",% Change,")
				ELSE
					strngHldr = concat(strngHldr,trim(rDATA->REF_MAP[nLOOP].VSF_TEST_UNITS),",Ratio,")
				ENDIF
			ENDIF
		ENDFOR
		col 0 strngHldr
		row + 1
 
	HEAD SPECIES
		X = 0
	HEAD SEX
		X = 0
	HEAD TMPT_POS_VAL			;007
	;HEAD COLLECT_DT_TM_2		;007
		X = 0
	HEAD DOSE_GROUP
		IF (FINDSTRING("G",REFERRING_COMMENT,1)=1)
			strngHldr = concat(trim(REFERRING_COMMENT))
		ELSEIF (REFERRING_COMMENT != "")
			strngHldr = concat(trim(DOSE_GROUP),"_",trim(REFERRING_COMMENT))
		ELSE
			strngHldr = concat(trim(DOSE_GROUP))
		ENDIF
		strngHldr = concat(strngHldr,",",trim(SEX),",",trim(TIMEPOINT),",")
		GRID_PTR = 1
	DETAIL
; CALL ECHO(TIMEPOINT)
; CALL ECHO(GRID_POSITION)
		WHILE(GRID_POSITION != GRID_PTR)
			strngHldr = concat(strngHldr,",,")
			GRID_PTR = GRID_PTR + 1
		ENDWHILE
		IF ($REF_FLAG = "1")
			strngHldr = concat(strngHldr,trim(MEAN_SG)," ",trim(P_FLAG),",")
			strngHldr = concat(strngHldr,trim(P_CHANGE_SIGN),trim(P_CHANGE_SG)," ",trim(P_FLAG),",")
		ELSE
			strngHldr = concat(strngHldr,trim(MEAN_SG),",",trim(P_CHANGE_SIGN),trim(P_CHANGE_SG),",")
		ENDIF
		GRID_PTR = GRID_PTR + 1
 
	FOOT DOSE_GROUP
		col 0 strngHldr
		row + 1
	FOOT TMPT_POS_VAL			;007
	;FOOT COLLECT_DT_TM_2		;007
		row + 1
	FOOT PARAMETER_TYPE
		row + 2
 
	WITH format = variable, noheading, formfeed=none, maxrow=1, maxcol=32000, nullreport
;008 comment out ftp
/* FTP the extract file to a front end fileshare
 
if(dbNme = "BUILD")
 set batch_filename_loc = value(trim(concat("/cerner/d_build/ccluserdir/mvc1_",CNVTLOWER($OUTDEV),".csv")))
elseif(dbNme = "CERT")
 set batch_filename_loc = value(trim(concat("/cerner/d_cert/ccluserdir/mvc1_",CNVTLOWER($OUTDEV),".csv")))
elseif(dbNme = "PROD")
 set batch_filename_loc = value(trim(concat("/cerner/d_prod/ccluserdir/mvc1_",CNVTLOWER($OUTDEV),".csv")))
endif
 
set new_full_name = value(trim(concat("mvc1_",cnvtlower($OUTDEV),".csv")))
 
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
 
/******************************************************************************************
; Output the mean treatment versus mean control data extract (dose group over assay format)
*******************************************************************************************/
IF (($REPORT_DESIGN IN ("MTVMC_2")) AND (vERR_FLAG = 0) AND ($SAMPLE_INT = "0"))
	/***********************************************************************
	; Generate output file delimited by a comma character (",")
	************************************************************************/
	SET vTEST_CNT = rDATA->REF_CNT
	SET mesgdttm = cnvtstring(cnvtdatetime(curdate, curtime3))
;	SET OUTPUT = concat("ccluserdir:mvc2_", cnvtlower($OUTDEV),".csv")		;008
	SET OUTPUT = concat("cust_reports:mvc2_", cnvtlower($OUTDEV),".csv")	;008
 
	SELECT INTO VALUE(OUTPUT)
		PARAMETER_TYPE		= rREPORT->STATS[D1.SEQ].PARAMETER_TYPE,
		SPECIES				= rREPORT->STATS[D1.SEQ].SPECIES,
		SEX					= rREPORT->STATS[D1.SEQ].SEX,
		VSF_TEST_NAME		= rREPORT->STATS[D1.SEQ].VSF_TEST_NAME,
		VSF_TEST_UNITS		= rREPORT->STATS[D1.SEQ].VSF_TEST_UNITS,
		GRID_POSITION		= rREPORT->STATS[D1.SEQ].GRID_POSITION,
		TIMEPOINT			= rREPORT->STATS[D1.SEQ].TIMEPOINT,
		TMPT_POS_VAL		= rREPORT->STATS[D1.SEQ].TMPT_POS_VAL,
;		COLLECT_DT_TM_2		= rREPORT->STATS[d1.seq].COLLECT_DT_TM_2,					;007
		RESULT_CNT			= rREPORT->STATS[D1.SEQ].RESULT_CNT,
		DG_CONTROL			= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].DG_CONTROL,
		DG_POS_VAL			= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].DG_POS_VAL,
		DOSE_GROUP			= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].DOSE_GROUP,
		REFERRING_COMMENT	= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].REFERRING_COMMENT,
		MEAN_SG				= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].MEAN_SG,
		P_CHANGE_SIGN		= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SIGN,
		P_CHANGE_SG			= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG,
		P_FLAG				= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_FLAG,
		ANIMALS				= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].ANIMALS
	FROM	(DUMMYT				D1 WITH SEQ=VALUE(rREPORT->STAT_CNT)),
			(DUMMYT				D2 WITH SEQ=1)
	PLAN D1 WHERE MAXREC(D2,SIZE(rREPORT->STATS[D1.SEQ].RESULTS,5))
	JOIN D2 WHERE rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].ANIMALS != 0
;	ORDER PARAMETER_TYPE, SPECIES, SEX DESC, TMPT_POS_VAL, DG_CONTROL DESC, DOSE_GROUP, GRID_POSITION
	ORDER SPECIES, PARAMETER_TYPE, GRID_POSITION, TMPT_POS_VAL, SEX DESC, DOSE_GROUP					;007
;	ORDER SPECIES, PARAMETER_TYPE, GRID_POSITION, COLLECT_DT_TM_2, SEX DESC, DOSE_GROUP					;007
	HEAD REPORT
		strngHldr = concat(trim(cPROTOCOL),",",trim(cHEADER))
		col 0 strngHldr
		row + 1
	HEAD SPECIES
		X = 0
	HEAD PARAMETER_TYPE
		strngHldr = trim(PARAMETER_TYPE)
		col 0 strngHldr
		row + 1
 		strngHldr = trim(",Dose levels in <Enter Units of Measure>")
		col 0 strngHldr
		row + 1
		IF (vMALE_ID = 1 AND vFEMALE_ID = 1)
			strngHldr = trim("Parameter,Male,")
			FOR (nLOOP = 2 to RESULT_CNT)
				strngHldr = concat(strngHldr,",")
			ENDFOR
			strngHldr = concat(strngHldr,"Female")
			col 0 strngHldr
			row + 1
			IDX = 2
			strngHldr = trim("")
			WHILE (IDX > 0)
				FOR (nLOOP = 1 to RESULT_CNT)
					IF (FINDSTRING("G",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,1)=1)
						cDOSE = rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT
						strngHldr = concat(strngHldr,",",SUBSTRING(5,SIZE(cDOSE),TRIM(cDOSE)))
					ELSE
						strngHldr = concat(strngHldr,",",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT)
					ENDIF
;					IF (FINDSTRING("G",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,1)=1)
;						strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,3))
;					ELSEIF (rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT != "")
;						strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].DOSE_GROUP,3),
;							"_",trim(rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,3))
;					ELSE
;						strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].DOSE_GROUP,3))
;					ENDIF
				ENDFOR
				IDX = IDX - 1
			ENDWHILE
			col 0 strngHldr
			row + 2
		ELSEIF (vMALE_ID = 1)
			strngHldr = trim("Parameter,Male")
			col 0 strngHldr
			row + 1
			strngHldr = trim("")
			FOR (nLOOP = 1 to RESULT_CNT)
				IF (FINDSTRING("G",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,1)=1)
					cDOSE = rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT
					strngHldr = concat(strngHldr,",",SUBSTRING(5,SIZE(cDOSE),TRIM(cDOSE)))
				ELSE
					strngHldr = concat(strngHldr,",",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT)
				ENDIF
;				IF (FINDSTRING("G",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,1)=1)
;					strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,3))
;				ELSEIF (rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT != "")
;					strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].DOSE_GROUP,3),
;						"_",trim(rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,3))
;				ELSE
;					strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].DOSE_GROUP,3))
;				ENDIF
			ENDFOR
			col 0 strngHldr
			row + 2
		ELSEIF (vFEMALE_ID = 1)
			strngHldr = trim("Parameter,Female")
			col 0 strngHldr
			row + 1
			strngHldr = trim("")
			FOR (nLOOP = 1 to RESULT_CNT)
				IF (FINDSTRING("G",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,1)=1)
					cDOSE = rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT
					strngHldr = concat(strngHldr,",",SUBSTRING(5,SIZE(cDOSE),TRIM(cDOSE)))
				ELSE
					strngHldr = concat(strngHldr,",",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT)
				ENDIF
;				IF (FINDSTRING("G",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,1)=1)
;					strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,3))
;				ELSEIF (rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT != "")
;					strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].DOSE_GROUP,3),
;						"_",trim(rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,3))
;				ELSE
;					strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].DOSE_GROUP,3))
;				ENDIF
			ENDFOR
			col 0 strngHldr
			row + 2
		ELSE
			strngHldr = trim("Parameter,Unknown")
			col 0 strngHldr
			row + 1
			strngHldr = trim("")
			FOR (nLOOP = 1 to RESULT_CNT)
				IF (FINDSTRING("G",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,1)=1)
					cDOSE = rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT
					strngHldr = concat(strngHldr,",",SUBSTRING(5,SIZE(cDOSE),TRIM(cDOSE)))
				ELSE
					strngHldr = concat(strngHldr,",",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT)
				ENDIF
;				IF (FINDSTRING("G",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,1)=1)
;					strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,3))
;				ELSEIF (rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT != "")
;					strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].DOSE_GROUP,3),
;						"_",trim(rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,3))
;				ELSE
;					strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].DOSE_GROUP,3))
;				ENDIF
			ENDFOR
			col 0 strngHldr
			row + 2
		ENDIF
 
	HEAD GRID_POSITION
		IF (VSF_TEST_UNITS != "" AND VSF_TEST_UNITS != " ")
			strngHldr = concat(trim(VSF_TEST_NAME), " (", trim(VSF_TEST_UNITS),")")
		ELSE
			strngHldr = trim(VSF_TEST_NAME)
		ENDIF
		col 0 strngHldr
		row + 1
		nTMPT_CNT = 0
	HEAD TMPT_POS_VAL				;007
	;HEAD COLLECT_DT_TM_2			;007
		nTMPT_CNT = nTMPT_CNT + 1
		strngHldr = trim(TIMEPOINT)
		SEX_PTR = 0
	HEAD SEX
		DG_PTR = 1
	HEAD DOSE_GROUP
		X = 0
	DETAIL
		IF (DG_PTR = 1 AND vMALE_ID = 1 AND SEX = "Female" AND SEX_PTR = 0)
			FOR (nLOOP = 1 to RESULT_CNT)
				strngHldr = concat(strngHldr,",")
			ENDFOR
		ENDIF
		WHILE(DG_POS_VAL != DG_PTR)
			strngHldr = concat(strngHldr,",")
			DG_PTR = DG_PTR + 1
		ENDWHILE
		IF (DG_CONTROL = 1)
			IF ($REF_FLAG = "1")
				strngHldr = concat(strngHldr,",",trim(MEAN_SG)," ",trim(P_FLAG))
			ELSE
				strngHldr = concat(strngHldr,",",trim(MEAN_SG))
			ENDIF
		ELSE
			IF ($REF_FLAG = "1")
				strngHldr = concat(strngHldr,",",trim(P_CHANGE_SIGN),trim(P_CHANGE_SG)," ",trim(P_FLAG))
			ELSE
				strngHldr = concat(strngHldr,",",trim(P_CHANGE_SIGN),trim(P_CHANGE_SG))
			ENDIF
		ENDIF
		DG_PTR = DG_PTR + 1
 
; CALL ECHO(TIMEPOINT)
; CALL ECHO(GRID_POSITION)
	FOOT SEX
		SEX_PTR = SEX_PTR + 1
	FOOT TMPT_POS_VAL			;007
	;FOOT COLLECT_DT_TM_2		;007
		col 0 strngHldr
		row + 1
	FOOT PARAMETER_TYPE
		row + 2
	WITH format = variable, noheading, formfeed=none, maxrow=1, maxcol=32000, nullreport
 
;008 comment FTP
/* FTP the extract file to a front end fileshare
 
if(dbNme = "BUILD")
 set batch_filename_loc = value(trim(concat("/cerner/d_build/ccluserdir/mvc2_",CNVTLOWER($OUTDEV),".csv")))
elseif(dbNme = "CERT")
 set batch_filename_loc = value(trim(concat("/cerner/d_cert/ccluserdir/mvc2_",CNVTLOWER($OUTDEV),".csv")))
elseif(dbNme = "PROD")
 set batch_filename_loc = value(trim(concat("/cerner/d_prod/ccluserdir/mvc2_",CNVTLOWER($OUTDEV),".csv")))
endif
 
set new_full_name = value(trim(concat("mvc2_",cnvtlower($OUTDEV),".csv")))
 
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
 
/***************************************************************************************
; Output mean treatment versus mean baseline data extract (assay over dose group format)
****************************************************************************************/
IF (($REPORT_DESIGN IN ("MTVMB")) and (vERR_FLAG = 0) AND ($SAMPLE_INT = "0"))
	/***********************************************************************
	; Generate output file delimited by a comma character (",")
	************************************************************************/
	SET vTEST_CNT = rDATA->REF_CNT
	SET mesgdttm = cnvtstring(cnvtdatetime(curdate, curtime3))
;	SET OUTPUT = concat("ccluserdir:mvb1_", cnvtlower($OUTDEV),".csv")		;008
	SET OUTPUT = concat("cust_reports:mvb1_", cnvtlower($OUTDEV),".csv")	;008
 
	SELECT INTO VALUE(OUTPUT)
		PARAMETER_TYPE		= rREPORT->STATS[D1.SEQ].PARAMETER_TYPE,
		SPECIES				= rREPORT->STATS[D1.SEQ].SPECIES,
		SEX					= rREPORT->STATS[D1.SEQ].SEX,
		VSF_TEST_NAME		= rREPORT->STATS[D1.SEQ].VSF_TEST_NAME,
		VSF_TEST_UNITS		= rREPORT->STATS[D1.SEQ].VSF_TEST_UNITS,
		GRID_POSITION		= rREPORT->STATS[D1.SEQ].GRID_POSITION,
		TIMEPOINT			= rREPORT->STATS[D1.SEQ].TIMEPOINT,
		TMPT_POS_VAL		= rREPORT->STATS[D1.SEQ].TMPT_POS_VAL,
;		COLLECT_DT_TM_2	 	= rREPORT->STATS[d1.seq].COLLECT_DT_TM_2,				;007
		RESULT_CNT			= rREPORT->STATS[D1.SEQ].RESULT_CNT,
		DG_CONTROL			= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].DG_CONTROL,
		DOSE_GROUP			= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].DOSE_GROUP,
		REFERRING_COMMENT	= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].REFERRING_COMMENT,
		MEAN_SG				= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].MEAN_SG,
		P_CHANGE_SIGN		= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SIGN,
		P_CHANGE_SG			= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG,
		P_FLAG				= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_FLAG,
		ANIMALS				= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].ANIMALS
	FROM	(DUMMYT				D1 WITH SEQ=VALUE(rREPORT->STAT_CNT)),
			(DUMMYT				D2 WITH SEQ=1)
	PLAN D1 WHERE MAXREC(D2,SIZE(rREPORT->STATS[D1.SEQ].RESULTS,5))
	JOIN D2 WHERE rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].ANIMALS != 0
	ORDER PARAMETER_TYPE, SPECIES, SEX DESC, DOSE_GROUP, TMPT_POS_VAL, GRID_POSITION					;007
	;ORDER PARAMETER_TYPE, SPECIES, SEX DESC, DOSE_GROUP, COLLECT_DT_TM_2, GRID_POSITION				;007
	HEAD REPORT
		strngHldr = concat(trim(cPROTOCOL),",",trim(cHEADER))
		col 0 strngHldr
		row + 1
	HEAD PARAMETER_TYPE
		strngHldr = trim(PARAMETER_TYPE)
		col 0 strngHldr
		row + 1
 
		strngHldr = trim("Dose Group,Sex,Day,")
		FOR (nLOOP = 1 to vTEST_CNT)
			IF (rDATA->REF_MAP[nLOOP].PARAMETER_TYPE = PARAMETER_TYPE)
				strngHldr = concat(strngHldr,trim(rDATA->REF_MAP[nLOOP].VSF_TEST_NAME,3),",")
				strngHldr = concat(strngHldr,trim(rDATA->REF_MAP[nLOOP].VSF_TEST_NAME,3),",")
			ENDIF
		ENDFOR
		col 0 strngHldr
		row + 1
 
		strngHldr = trim(",,,")
		FOR (nLOOP = 1 to vTEST_CNT)
			IF (rDATA->REF_MAP[nLOOP].PARAMETER_TYPE = PARAMETER_TYPE)
				IF ($RATIO_PCNT = "1")
					strngHldr = concat(strngHldr,trim(rDATA->REF_MAP[nLOOP].VSF_TEST_UNITS),",% Change,")
				ELSE
					strngHldr = concat(strngHldr,trim(rDATA->REF_MAP[nLOOP].VSF_TEST_UNITS),",Ratio,")
				ENDIF
			ENDIF
		ENDFOR
		col 0 strngHldr
		row + 1
 
	HEAD SPECIES
		X = 0
	HEAD SEX
		X = 0
	HEAD DOSE_GROUP
		X = 0
	HEAD TMPT_POS_VAL
		IF (FINDSTRING("G",REFERRING_COMMENT,1)=1)
			strngHldr = concat(trim(REFERRING_COMMENT))
		ELSEIF (REFERRING_COMMENT != "")
			strngHldr = concat(trim(DOSE_GROUP),"_",trim(REFERRING_COMMENT))
		ELSE
			strngHldr = concat(trim(DOSE_GROUP))
		ENDIF
		strngHldr = concat(strngHldr,",",trim(SEX),",",trim(TIMEPOINT),",")
		GRID_PTR = 1
	DETAIL
; CALL ECHO(TIMEPOINT)
; CALL ECHO(GRID_POSITION)
		WHILE(GRID_POSITION != GRID_PTR)
			strngHldr = concat(strngHldr,",,")
			GRID_PTR = GRID_PTR + 1
		ENDWHILE
		IF ($REF_FLAG = "1")
			strngHldr = concat(strngHldr,trim(MEAN_SG)," ",trim(P_FLAG),",")
			strngHldr = concat(strngHldr,trim(P_CHANGE_SIGN),trim(P_CHANGE_SG)," ",trim(P_FLAG),",")
		ELSE
			strngHldr = concat(strngHldr,trim(MEAN_SG),",",trim(P_CHANGE_SIGN),trim(P_CHANGE_SG),",")
		ENDIF
		GRID_PTR = GRID_PTR + 1
 
	FOOT TMPT_POS_VAL				;007
	;FOOT COLLECT_DT_TM_2			;007
		col 0 strngHldr
		row + 1
	FOOT DOSE_GROUP
		row + 1
	FOOT PARAMETER_TYPE
		row + 2
 
	WITH format = variable, noheading, formfeed=none, maxrow=1, maxcol=32000, nullreport
 
;008 comment FTP
/* FTP the extract file to a front end fileshare
 
if(dbNme = "BUILD")
 set batch_filename_loc = value(trim(concat("/cerner/d_build/ccluserdir/mvb1_",CNVTLOWER($OUTDEV),".csv")))
elseif(dbNme = "CERT")
 set batch_filename_loc = value(trim(concat("/cerner/d_cert/ccluserdir/mvb1_",CNVTLOWER($OUTDEV),".csv")))
elseif(dbNme = "PROD")
 set batch_filename_loc = value(trim(concat("/cerner/d_prod/ccluserdir/mvb1_",CNVTLOWER($OUTDEV),".csv")))
endif
 
set new_full_name = value(trim(concat("mvb1_",cnvtlower($OUTDEV),".csv")))
 
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
 
/****************************************************************************************
; Output mean treatment versus mean baseline data extract (dose group over assay format)
*****************************************************************************************/
IF (($REPORT_DESIGN IN ("MTVMB_2")) and (vERR_FLAG = 0) AND ($SAMPLE_INT = "0"))
	/***********************************************************************
	; Generate output file delimited by a comma character (",")
	************************************************************************/
	SET vTEST_CNT = rDATA->REF_CNT
	SET mesgdttm = cnvtstring(cnvtdatetime(curdate, curtime3))
;	SET OUTPUT = concat("ccluserdir:mvb2_", cnvtlower($OUTDEV),".csv")		;008
	SET OUTPUT = concat("cust_reports:mvb2_", cnvtlower($OUTDEV),".csv")	;008
 
	SELECT INTO VALUE(OUTPUT)
		PARAMETER_TYPE		= rREPORT->STATS[D1.SEQ].PARAMETER_TYPE,
		SPECIES				= rREPORT->STATS[D1.SEQ].SPECIES,
		SEX					= rREPORT->STATS[D1.SEQ].SEX,
		VSF_TEST_NAME		= rREPORT->STATS[D1.SEQ].VSF_TEST_NAME,
		VSF_TEST_UNITS		= rREPORT->STATS[D1.SEQ].VSF_TEST_UNITS,
		GRID_POSITION		= rREPORT->STATS[D1.SEQ].GRID_POSITION,
		TIMEPOINT			= rREPORT->STATS[D1.SEQ].TIMEPOINT,
		TMPT_BASELINE		= rREPORT->STATS[D1.SEQ].TMPT_BASELINE,
		TMPT_POS_VAL		= rREPORT->STATS[D1.SEQ].TMPT_POS_VAL,
;		COLLECT_DT_TM_2		= rREPORT->STATS[d1.seq].COLLECT_DT_TM_2,			;007
		RESULT_CNT			= rREPORT->STATS[D1.SEQ].RESULT_CNT,
		DG_CONTROL			= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].DG_CONTROL,
		DG_POS_VAL			= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].DG_POS_VAL,
		DOSE_GROUP			= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].DOSE_GROUP,
		REFERRING_COMMENT	= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].REFERRING_COMMENT,
		MEAN				= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].MEAN,
		MEAN_SG				= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].MEAN_SG,
		P_CHANGE_SIGN		= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SIGN,
		P_CHANGE_SG			= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG,
		P_FLAG				= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_FLAG,
		ANIMALS				= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].ANIMALS
	FROM	(DUMMYT				D1 WITH SEQ=VALUE(rREPORT->STAT_CNT)),
			(DUMMYT				D2 WITH SEQ=1)
	PLAN D1 WHERE MAXREC(D2,SIZE(rREPORT->STATS[D1.SEQ].RESULTS,5))
	JOIN D2 WHERE rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].ANIMALS != 0
;	ORDER PARAMETER_TYPE, SPECIES, SEX DESC, DOSE_GROUP, TMPT_POS_VAL, GRID_POSITION
	ORDER SPECIES, PARAMETER_TYPE, GRID_POSITION, TMPT_POS_VAL, SEX DESC, DOSE_GROUP					;007
;	ORDER SPECIES, PARAMETER_TYPE, GRID_POSITION, COLLECT_DT_TM_2, TMPT_POS_VAL, SEX DESC, DOSE_GROUP	;007
	HEAD REPORT
		strngHldr = concat(trim(cPROTOCOL),",",trim(cHEADER))
		col 0 strngHldr
		row + 1
	HEAD SPECIES
		X = 0
	HEAD PARAMETER_TYPE
		strngHldr = trim(PARAMETER_TYPE)
		col 0 strngHldr
		row + 1
 		strngHldr = trim(",Dose levels in <Enter Units of Measure>")
		col 0 strngHldr
		row + 1
		IF (vMALE_ID = 1 AND vFEMALE_ID = 1)
			strngHldr = trim("Parameter,Male,")
			FOR (nLOOP = 2 to RESULT_CNT)
				strngHldr = concat(strngHldr,",")
			ENDFOR
			strngHldr = concat(strngHldr,"Female")
			col 0 strngHldr
			row + 1
			IDX = 2
			strngHldr = trim("")
			WHILE (IDX > 0)
				FOR (nLOOP = 1 to RESULT_CNT)
					IF (FINDSTRING("G",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,1)=1)
						cDOSE = rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT
						strngHldr = concat(strngHldr,",",SUBSTRING(5,SIZE(cDOSE),TRIM(cDOSE)))
					ELSE
						strngHldr = concat(strngHldr,",",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT)
					ENDIF
				ENDFOR
				IDX = IDX - 1
			ENDWHILE
			col 0 strngHldr
			row + 2
		ELSEIF (vMALE_ID = 1)
			strngHldr = trim("Parameter,Male")
			col 0 strngHldr
			row + 1
			strngHldr = trim("")
			FOR (nLOOP = 1 to RESULT_CNT)
				IF (FINDSTRING("G",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,1)=1)
					cDOSE = rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT
					strngHldr = concat(strngHldr,",",SUBSTRING(5,SIZE(cDOSE),TRIM(cDOSE)))
				ELSE
					strngHldr = concat(strngHldr,",",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT)
				ENDIF
			ENDFOR
			col 0 strngHldr
			row + 2
		ELSEIF (vFEMALE_ID = 1)
			strngHldr = trim("Parameter,Female")
			col 0 strngHldr
			row + 1
			strngHldr = trim("")
			FOR (nLOOP = 1 to RESULT_CNT)
				IF (FINDSTRING("G",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,1)=1)
					cDOSE = rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT
					strngHldr = concat(strngHldr,",",SUBSTRING(5,SIZE(cDOSE),TRIM(cDOSE)))
				ELSE
					strngHldr = concat(strngHldr,",",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT)
				ENDIF
			ENDFOR
			col 0 strngHldr
			row + 2
		ELSE
			strngHldr = trim("Parameter,Unknown")
			col 0 strngHldr
			row + 1
			strngHldr = trim("")
			FOR (nLOOP = 1 to RESULT_CNT)
				IF (FINDSTRING("G",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,1)=1)
					cDOSE = rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT
					strngHldr = concat(strngHldr,",",SUBSTRING(5,SIZE(cDOSE),TRIM(cDOSE)))
				ELSE
					strngHldr = concat(strngHldr,",",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT)
				ENDIF
			ENDFOR
			col 0 strngHldr
			row + 2
		ENDIF
	HEAD GRID_POSITION
		IF (VSF_TEST_UNITS != "" AND VSF_TEST_UNITS != " ")
			strngHldr = concat(trim(VSF_TEST_NAME), " (", trim(VSF_TEST_UNITS),")")
		ELSE
			strngHldr = trim(VSF_TEST_NAME)
		ENDIF
		col 0 strngHldr
		row + 1
		nTMPT_CNT = 0
	HEAD TMPT_POS_VAL
		nTMPT_CNT = nTMPT_CNT + 1
		strngHldr = trim(TIMEPOINT)
		SEX_PTR = 0
	HEAD SEX
		DG_PTR = 1
	HEAD DOSE_GROUP
		X = 0
	DETAIL
		IF (DG_PTR = 1 AND vMALE_ID = 1 AND SEX = "Female" AND SEX_PTR = 0)
			FOR (nLOOP = 1 to RESULT_CNT)
				strngHldr = concat(strngHldr,",")
			ENDFOR
		ENDIF
		WHILE(DG_POS_VAL != DG_PTR)
			strngHldr = concat(strngHldr,",")
			DG_PTR = DG_PTR + 1
		ENDWHILE
		IF (TMPT_BASELINE = 1)
			IF ($REF_FLAG = "1")
				strngHldr = concat(strngHldr,",",trim(MEAN_SG)," ",trim(P_FLAG))
			ELSE
				strngHldr = concat(strngHldr,",",trim(MEAN_SG))
			ENDIF
		ELSE
			IF ($REF_FLAG = "1")
				strngHldr = concat(strngHldr,",",trim(P_CHANGE_SIGN),trim(P_CHANGE_SG)," ",trim(P_FLAG))
			ELSE
				strngHldr = concat(strngHldr,",",trim(P_CHANGE_SIGN),trim(P_CHANGE_SG))
			ENDIF
		ENDIF
		DG_PTR = DG_PTR + 1
 
; CALL ECHO(TIMEPOINT)
; CALL ECHO(GRID_POSITION)
	FOOT SEX
		SEX_PTR = SEX_PTR + 1
	FOOT TMPT_POS_VAL
		col 0 strngHldr
		row + 1
	FOOT PARAMETER_TYPE
		row + 2
 
	WITH format = variable, noheading, formfeed=none, maxrow=1, maxcol=32000, nullreport
 
;008 comment FTP
/* FTP the extract file to a front end fileshare
 
if(dbNme = "BUILD")
 set batch_filename_loc = value(trim(concat("/cerner/d_build/ccluserdir/mvb2_",CNVTLOWER($OUTDEV),".csv")))
elseif(dbNme = "CERT")
 set batch_filename_loc = value(trim(concat("/cerner/d_cert/ccluserdir/mvb2_",CNVTLOWER($OUTDEV),".csv")))
elseif(dbNme = "PROD")
 set batch_filename_loc = value(trim(concat("/cerner/d_prod/ccluserdir/mvb2_",CNVTLOWER($OUTDEV),".csv")))
endif
 
set new_full_name = value(trim(concat("mvb2_",cnvtlower($OUTDEV),".csv")))
 
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
 
/****************************************************************************************
; Output mean treatment versus mean baseline data extract (dose group over assay format)
*****************************************************************************************/
IF (($REPORT_DESIGN IN ("MIR")) and (vERR_FLAG = 0) AND ($SAMPLE_INT = "0"))
	/***********************************************************************
	; Generate output file delimited by a comma character (",")
	************************************************************************/
	SET vTEST_CNT = rDATA->REF_CNT
	SET mesgdttm = cnvtstring(cnvtdatetime(curdate, curtime3))
	SET cHEADER = "Mean of Individual Ratios to Baseline"
;	SET OUTPUT = concat("ccluserdir:ctlmir_", cnvtlower($OUTDEV),".csv")		;008
 	SET OUTPUT = concat("cust_reports:ctlmir_", cnvtlower($OUTDEV),".csv")		;008
 
	SELECT INTO VALUE(OUTPUT)
		PARAMETER_TYPE		= rREPORT->STATS[D1.SEQ].PARAMETER_TYPE,
		SPECIES				= rREPORT->STATS[D1.SEQ].SPECIES,
		SEX					= rREPORT->STATS[D1.SEQ].SEX,
		VSF_TEST_NAME		= rREPORT->STATS[D1.SEQ].VSF_TEST_NAME,
		VSF_TEST_UNITS		= rREPORT->STATS[D1.SEQ].VSF_TEST_UNITS,
		GRID_POSITION		= rREPORT->STATS[D1.SEQ].GRID_POSITION,
		TIMEPOINT			= rREPORT->STATS[D1.SEQ].TIMEPOINT,
		TMPT_BASELINE		= rREPORT->STATS[D1.SEQ].TMPT_BASELINE,
		TMPT_POS_VAL		= rREPORT->STATS[D1.SEQ].TMPT_POS_VAL,
;		COLLECT_DT_TM_2		= rREPORT->STATS[d1.seq].COLLECT_DT_TM_2,				;007
		RESULT_CNT			= rREPORT->STATS[D1.SEQ].RESULT_CNT,
		DG_CONTROL			= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].DG_CONTROL,
		DOSE_GROUP			= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].DOSE_GROUP,
		REFERRING_COMMENT	= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].REFERRING_COMMENT,
		DG_POS_VAL			= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].DG_POS_VAL,
		MEAN				= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].MEAN,
		MEAN_SG				= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].MEAN_SG,
		PREFIX				= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].PREFIX,
		P_CHANGE_SIGN		= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SIGN,
		P_CHANGE_SG			= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_CHANGE_SG,
		P_FLAG				= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].P_FLAG,
		ANIMALS				= rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].ANIMALS
	FROM	(DUMMYT				D1 WITH SEQ=VALUE(rREPORT->STAT_CNT)),
			(DUMMYT				D2 WITH SEQ=1)
	PLAN D1 WHERE MAXREC(D2,SIZE(rREPORT->STATS[D1.SEQ].RESULTS,5))
	JOIN D2 WHERE rREPORT->STATS[D1.SEQ].RESULTS[D2.SEQ].ANIMALS != 0
;	ORDER PARAMETER_TYPE, SPECIES, SEX DESC, DOSE_GROUP, TMPT_POS_VAL, GRID_POSITION
;	ORDER SPECIES, PARAMETER_TYPE, GRID_POSITION, TMPT_POS_VAL, SEX DESC, DOSE_GROUP
	ORDER SPECIES, PARAMETER_TYPE, GRID_POSITION, TMPT_POS_VAL, SEX DESC, DOSE_GROUP				;007
	;ORDER SPECIES, PARAMETER_TYPE, GRID_POSITION, COLLECT_DT_TM_2, SEX DESC, DOSE_GROUP			;007
	HEAD REPORT
		strngHldr = concat(trim(cPROTOCOL),",",trim(cHEADER))
		col 0 strngHldr
		row + 1
	HEAD SPECIES
		X = 0
	HEAD PARAMETER_TYPE
		strngHldr = trim(PARAMETER_TYPE)
		col 0 strngHldr
		row + 1
 		strngHldr = trim(",Dose levels in <Enter Units of Measure>")
		col 0 strngHldr
		row + 1
		IF (vMALE_ID = 1 AND vFEMALE_ID = 1)
			strngHldr = trim("Parameter,Male,")
			FOR (nLOOP = 2 to RESULT_CNT)
				strngHldr = concat(strngHldr,",")
			ENDFOR
			strngHldr = concat(strngHldr,"Female")
			col 0 strngHldr
			row + 1
			IDX = 2
			strngHldr = trim("")
			WHILE (IDX > 0)
				FOR (nLOOP = 1 to RESULT_CNT)
					IF (FINDSTRING("G",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,1)=1)
						strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,3))
					ELSEIF (rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT != "")
						strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].DOSE_GROUP,3),
							"_",trim(rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,3))
					ELSE
						strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].DOSE_GROUP,3))
					ENDIF
				ENDFOR
				IDX = IDX - 1
			ENDWHILE
			col 0 strngHldr
			row + 2
		ELSEIF (vMALE_ID = 1)
			strngHldr = trim("Parameter,Male")
			col 0 strngHldr
			row + 1
			strngHldr = trim("")
			FOR (nLOOP = 1 to RESULT_CNT)
				IF (FINDSTRING("G",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,1)=1)
					strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,3))
				ELSEIF (rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT != "")
					strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].DOSE_GROUP,3),
						"_",trim(rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,3))
				ELSE
					strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].DOSE_GROUP,3))
				ENDIF
			ENDFOR
			col 0 strngHldr
			row + 2
		ELSEIF (vFEMALE_ID = 1)
			strngHldr = trim("Parameter,Female")
			col 0 strngHldr
			row + 1
			strngHldr = trim("")
			FOR (nLOOP = 1 to RESULT_CNT)
				IF (FINDSTRING("G",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,1)=1)
					strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,3))
				ELSEIF (rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT != "")
					strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].DOSE_GROUP,3),
						"_",trim(rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,3))
				ELSE
					strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].DOSE_GROUP,3))
				ENDIF
			ENDFOR
			col 0 strngHldr
			row + 2
		ELSE
			strngHldr = trim("Parameter,Unknown")
			col 0 strngHldr
			row + 1
			strngHldr = trim("")
			FOR (nLOOP = 1 to RESULT_CNT)
				IF (FINDSTRING("G",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,1)=1)
					strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,3))
				ELSEIF (rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT != "")
					strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].DOSE_GROUP,3),
						"_",trim(rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,3))
				ELSE
					strngHldr = concat(strngHldr,",",trim(rDATA->DOSE_GROUP[nLOOP].DOSE_GROUP,3))
				ENDIF
			ENDFOR
			col 0 strngHldr
			row + 2
		ENDIF
	HEAD GRID_POSITION
		;strngHldr = trim(VSF_TEST_NAME)					;6.0
		IF (VSF_TEST_UNITS != "" AND VSF_TEST_UNITS != " ")	;6.0
			strngHldr = concat(trim(VSF_TEST_NAME), " (", trim(VSF_TEST_UNITS),")")
		ELSE
			strngHldr = trim(VSF_TEST_NAME)
		ENDIF
		col 0 strngHldr
		row + 1
		;strngHldr = trim(VSF_TEST_UNITS)					;6.0
		;col 0 strngHldr									;6.0
		;row + 1											;6.0
		nTMPT_CNT = 0
	HEAD TMPT_POS_VAL										;007
	;HEAD COLLECT_DT_TM_2									;007
		nTMPT_CNT = nTMPT_CNT + 1
		strngHldr = trim(TIMEPOINT)
		SEX_PTR = 0
	HEAD SEX
		DG_PTR = 1
	HEAD DOSE_GROUP
		X = 0
	DETAIL
		IF (DG_PTR = 1 AND vMALE_ID = 1 AND SEX = "Female" AND SEX_PTR = 0)
			FOR (nLOOP = 1 to RESULT_CNT)
				strngHldr = concat(strngHldr,",")
			ENDFOR
		ENDIF
		WHILE(DG_POS_VAL != DG_PTR)
			strngHldr = concat(strngHldr,",")
			DG_PTR = DG_PTR + 1
		ENDWHILE
		IF ($REF_FLAG = "1")
			strngHldr = concat(strngHldr,",",trim(MEAN_SG)," ",trim(P_FLAG))
		ELSE
			strngHldr = concat(strngHldr,",",trim(MEAN_SG))
		ENDIF
		DG_PTR = DG_PTR + 1
 
;		IF (TMPT_BASELINE = 1)
;			IF ($REF_FLAG = "1")
;				strngHldr = concat(strngHldr,",",trim(MEAN_SG)," ",trim(P_FLAG))
;			ELSE
;				strngHldr = concat(strngHldr,",",trim(MEAN_SG))
;			ENDIF
;		ELSE
;			IF ($REF_FLAG = "1")
;				strngHldr = concat(strngHldr,",",trim(P_CHANGE_SIGN),trim(P_CHANGE_SG)," ",trim(P_FLAG))
;			ELSE
;				strngHldr = concat(strngHldr,",",trim(P_CHANGE_SIGN),trim(P_CHANGE_SG))
;			ENDIF
;
;			strngHldr = concat(strngHldr,",",trim(PREFIX),trim(P_CHANGE_SIGN),trim(P_CHANGE_SG))
;		ENDIF
;		DG_PTR = DG_PTR + 1
 
; 		IF (DG_PTR = DG_POS_VAL)
;			IF (TMPT_BASELINE = 1)
;				IF ($REF_FLAG = "1")
;					strngHldr = concat(strngHldr,",",trim(MEAN_SG)," ",trim(P_FLAG))
;				ELSE
;					strngHldr = concat(strngHldr,",",trim(MEAN_SG))
;				ENDIF
;			ELSE
;				IF ($REF_FLAG = "1")
;					strngHldr = concat(strngHldr,",",trim(P_CHANGE_SIGN),trim(P_CHANGE_SG)," ",trim(P_FLAG))
;				ELSE
;					strngHldr = concat(strngHldr,",",trim(P_CHANGE_SIGN),trim(P_CHANGE_SG))
;				ENDIF
;			ENDIF
;			DG_PTR = DG_PTR + 1
;		ELSE
;			WHILE(DG_POS_VAL != DG_PTR)
;				strngHldr = concat(strngHldr,",")
;				DG_PTR = DG_PTR + 1
;			ENDWHILE
;			IF ($REF_FLAG = "1")
;				strngHldr = concat(strngHldr,",",trim(P_CHANGE_SIGN),trim(P_CHANGE_SG)," ",trim(P_FLAG))
;			ELSE
;				strngHldr = concat(strngHldr,",",trim(P_CHANGE_SIGN),trim(P_CHANGE_SG))
;			ENDIF
;			DG_PTR = DG_PTR + 1
;		ENDIF
 
 
 
; CALL ECHO(TIMEPOINT)
; CALL ECHO(GRID_POSITION)
 	FOOT SEX
 		SEX_PTR = SEX_PTR + 1
	FOOT TMPT_POS_VAL				;007
	;FOOT COLLECT_DT_TM_2			;007
		col 0 strngHldr
		row + 1
	FOOT PARAMETER_TYPE
		row + 2
 
	WITH format = variable, noheading, formfeed=none, maxrow=1, maxcol=32000, nullreport
 
;008 comment FTP
/* FTP the extract file to a front end fileshare
 
if(dbNme = "BUILD")
 set batch_filename_loc = value(trim(concat("/cerner/d_build/ccluserdir/ctlmir_",CNVTLOWER($OUTDEV),".csv")))
elseif(dbNme = "CERT")
 set batch_filename_loc = value(trim(concat("/cerner/d_cert/ccluserdir/ctlmir_",CNVTLOWER($OUTDEV),".csv")))
elseif(dbNme = "PROD")
 set batch_filename_loc = value(trim(concat("/cerner/d_prod/ccluserdir/ctlmir_",CNVTLOWER($OUTDEV),".csv")))
endif
 
set new_full_name = value(trim(concat("ctlmir_",cnvtlower($OUTDEV),".csv")))
 
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
 
/*************************************************************************
; Output the individual treatment versus individual baseline data extract
**************************************************************************/
IF (($REPORT_DESIGN IN ("ITVIB")) and (vERR_FLAG = 0) AND ($SAMPLE_INT = "0"))
	/***********************************************************************
	; Generate output file delimited by a comma character (",")
	************************************************************************/
	SET vTEST_CNT = rDATA->REF_CNT
	SET mesgdttm = cnvtstring(cnvtdatetime(curdate, curtime3))
;	SET OUTPUT = concat("ccluserdir:ivb1_", cnvtlower($OUTDEV),".csv")		;008
	SET OUTPUT = concat("cust_reports:ivb1_", cnvtlower($OUTDEV),".csv")	;008
 
	SELECT INTO VALUE(OUTPUT)
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
		VSF_TEST_NAME		= rDATA->DATA[D1.SEQ].VSF_TEST_NAME,
		GRID_POSITION		= rDATA->DATA[D1.SEQ].GRID_POSITION,
		RESULT				= rDATA->DATA[D1.SEQ].RESULT,
		P_CHANGE_SG			= rDATA->DATA[D1.SEQ].P_CHANGE_SG,
		P_CHANGE_SIGN		= rDATA->DATA[D1.SEQ].P_CHANGE_SIGN,
		P_FLAG				= rDATA->DATA[D1.SEQ].P_FLAG,
		BSLN_SIGN			= rDATA->DATA[D1.SEQ].BSLN_SIGN
;		COLL_DT_TM		 	= rDATA->DATA[d1.seq].COLLECT_DT_TM_2			;007
	FROM	(DUMMYT			D1 WITH SEQ=VALUE(rDATA->COUNT))
	PLAN D1 WHERE rDATA->DATA[D1.SEQ].NR = 0	; Do not show tests with NR Comment
		AND rDATA->DATA[D1.SEQ].SUBJECT_ID > " "
		AND rDATA->DATA[D1.SEQ].STATS = 1
	ORDER BY PARAMETER_TYPE, SPECIES, SEX DESC, DOSE_GROUP, SUBJECT_INDEX, SUBJECT_ID, TMPT_POS_VAL, GRID_POSITION 				  ;007
	;ORDER BY PARAMETER_TYPE, SPECIES, SEX DESC, DOSE_GROUP, SUBJECT_INDEX, SUBJECT_ID, COLL_DT_TM, TMPT_POS_VAL, GRID_POSITION	  ;007
	HEAD REPORT
		strngHldr = concat(trim(cPROTOCOL),",",trim(cHEADER))
		col 0 strngHldr
		row + 1
	HEAD PARAMETER_TYPE
		strngHldr = trim(PARAMETER_TYPE)
		col 0 strngHldr
		row + 1
 
		strngHldr = trim("Dose Group,Subject ID,Sex,Day,")
		FOR (nLOOP = 1 to vTEST_CNT)
			IF (rDATA->REF_MAP[nLOOP].PARAMETER_TYPE = PARAMETER_TYPE)
				strngHldr = concat(strngHldr,trim(rDATA->REF_MAP[nLOOP].VSF_TEST_NAME,3),",")
				strngHldr = concat(strngHldr,trim(rDATA->REF_MAP[nLOOP].VSF_TEST_NAME,3),",")
			ENDIF
		ENDFOR
		col 0 strngHldr
		row + 1
 
		strngHldr = trim(",,,,")
		FOR (nLOOP = 1 to vTEST_CNT)
			IF (rDATA->REF_MAP[nLOOP].PARAMETER_TYPE = PARAMETER_TYPE)
				IF ($RATIO_PCNT = "1")
					strngHldr = concat(strngHldr,trim(rDATA->REF_MAP[nLOOP].VSF_TEST_UNITS),",% Change,")
				ELSE
					strngHldr = concat(strngHldr,trim(rDATA->REF_MAP[nLOOP].VSF_TEST_UNITS),",Ratio,")
				ENDIF
			ENDIF
		ENDFOR
		col 0 strngHldr
		row + 1
 
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
	HEAD TMPT_POS_VAL
		IF (FINDSTRING("G",REFERRING_COMMENT,1)=1)
			strngHldr = concat(trim(REFERRING_COMMENT))
		ELSEIF (REFERRING_COMMENT != "")
			strngHldr = concat(trim(DOSE_GROUP),"_",trim(REFERRING_COMMENT))
		ELSE
			strngHldr = concat(trim(DOSE_GROUP))
		ENDIF
		strngHldr = concat(strngHldr,",",trim(SUBJECT_ID),",",trim(SEX),",",trim(TIMEPOINT),",")
		GRID_PTR = 1
	HEAD GRID_POSITION
		WHILE(GRID_POSITION != GRID_PTR)
			strngHldr = concat(strngHldr,",,")
			GRID_PTR = GRID_PTR + 1
		ENDWHILE
		strngHldr = concat(strngHldr,trim(RESULT),",",trim(BSLN_SIGN)," ",trim(P_CHANGE_SIGN)," ",trim(P_CHANGE_SG),",")
		GRID_PTR = GRID_PTR + 1
 
	FOOT TMPT_POS_VAL
		col 0 strngHldr
		row + 1
	FOOT SUBJECT_INDEX
		row + 1
	FOOT PARAMETER_TYPE
		row + 2
 
	WITH format = variable, noheading, formfeed=none, maxrow=1, maxcol=32000, nullreport
 
;008 comment FTP
/* FTP the extract file to a front end fileshare
 
if(dbNme = "BUILD")
 set batch_filename_loc = value(trim(concat("/cerner/d_build/ccluserdir/ivb1_",CNVTLOWER($OUTDEV),".csv")))
elseif(dbNme = "CERT")
 set batch_filename_loc = value(trim(concat("/cerner/d_cert/ccluserdir/ivb1_",CNVTLOWER($OUTDEV),".csv")))
elseif(dbNme = "PROD")
 set batch_filename_loc = value(trim(concat("/cerner/d_prod/ccluserdir/ivb1_",CNVTLOWER($OUTDEV),".csv")))
endif
 
set new_full_name = value(trim(concat("ivb1_",cnvtlower($OUTDEV),".csv")))
 
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
 
/*************************************************************************
; Output the individual treatment versus individual baseline data extract
**************************************************************************/
IF (($REPORT_DESIGN = "ITVIB_2") and (vERR_FLAG = 0) AND ($SAMPLE_INT = "0"))
	/***********************************************************************
	; Generate output file delimited by a comma character (",")
	************************************************************************/
	SET vTEST_CNT = rDATA->REF_CNT
	SET mesgdttm = cnvtstring(cnvtdatetime(curdate, curtime3))
;	SET OUTPUT = concat("ccluserdir:ivb2_", cnvtlower($OUTDEV),".csv")			;008
	SET OUTPUT = concat("cust_reports:ivb2_", cnvtlower($OUTDEV),".csv")		;008
 
	SELECT INTO VALUE(OUTPUT)
		PARAMETER_TYPE		= rDATA->DATA[D1.SEQ].PARAMETER_TYPE,
		SPECIES				= rDATA->DATA[D1.SEQ].SPECIES,
		SEX					= rDATA->DATA[D1.SEQ].SEX,
		DOSE_GROUP			= rDATA->DATA[D1.SEQ].DOSE_GROUP,
		REFERRING_COMMENT	= rDATA->DATA[D1.SEQ].REFERRING_COMMENT,
		SUBJECT_ID			= rDATA->DATA[D1.SEQ].SUBJECT_ID,
		SUBJECT_INDEX		= rDATA->DATA[D1.SEQ].SUBJECT_INDEX,
		SUBJECT_POS_VAL		= rDATA->DATA[D1.SEQ].SUBJECT_POS_VAL,
		TIMEPOINT			= rDATA->DATA[D1.SEQ].TIMEPOINT,
		TMPT_POS_VAL		= rDATA->DATA[D1.SEQ].TMPT_POS_VAL,
		TMPT_BASELINE		= rDATA->DATA[D1.SEQ].TMPT_BASELINE,
		COLLECT_DATE		= rDATA->DATA[D1.SEQ].COLLECT_DATE,
		VSF_TEST_NAME		= rDATA->DATA[D1.SEQ].VSF_TEST_NAME,
		VSF_TEST_UNITS		= rDATA->DATA[D1.SEQ].VSF_TEST_UNITS,
		GRID_POSITION		= rDATA->DATA[D1.SEQ].GRID_POSITION,
		RESULT				= rDATA->DATA[D1.SEQ].RESULT,
		P_CHANGE_SG			= rDATA->DATA[D1.SEQ].P_CHANGE_SG,
		P_CHANGE_SIGN		= rDATA->DATA[D1.SEQ].P_CHANGE_SIGN,
		P_FLAG				= rDATA->DATA[D1.SEQ].P_FLAG,
		BSLN_SIGN			= rDATA->DATA[D1.SEQ].BSLN_SIGN
;		COLL_DT_TM		 	= rDATA->DATA[d1.seq].COLLECT_DT_TM_2			;007
	FROM	(DUMMYT			D1 WITH SEQ=VALUE(rDATA->COUNT))
	PLAN D1 WHERE rDATA->DATA[D1.SEQ].NR = 0	; Do not show tests with NR Comment
		AND rDATA->DATA[D1.SEQ].SUBJECT_ID > " "
		AND rDATA->DATA[D1.SEQ].STATS = 1
;	ORDER PARAMETER_TYPE, SPECIES, SEX DESC, DOSE_GROUP, TMPT_POS_VAL, GRID_POSITION
	ORDER SPECIES, PARAMETER_TYPE, GRID_POSITION, TMPT_POS_VAL, SEX DESC, DOSE_GROUP, SUBJECT_INDEX, SUBJECT_ID	;007
;	ORDER SPECIES, PARAMETER_TYPE, GRID_POSITION, COLL_DT_TM, SEX DESC, DOSE_GROUP, SUBJECT_INDEX, SUBJECT_ID   ;007
	HEAD REPORT
		SUBJ_COUNT = rDATA->SUBJECT_CNT
		strngHldr = concat(trim(cPROTOCOL),",",trim(cHEADER))
		col 0 strngHldr
		row + 1
	HEAD SPECIES
		X = 0
	HEAD PARAMETER_TYPE
		strngHldr = trim(PARAMETER_TYPE)
		col 0 strngHldr
		row + 1
 		strngHldr = trim(",Dose levels in <Enter Units of Measure>")
		col 0 strngHldr
		row + 1
		IF (vMALE_ID = 1 AND vFEMALE_ID = 1)
			strngHldr = trim("Parameter,Male,")
			FOR (nLOOP = 2 to rDATA->MALE_CNT)
				strngHldr = concat(strngHldr,",")
			ENDFOR
			strngHldr = concat(strngHldr,"Female")
			col 0 strngHldr
			row + 1
			strngHldr = trim("")
			nDG_SZ = SIZE(rDATA->DOSE_GROUP_M,5)
			FOR (nLOOP = 1 to nDG_SZ)
				IF (FINDSTRING("G",rDATA->DOSE_GROUP_M[nLOOP].REFERRING_COMMENT,1)=1)
					cDOSE = rDATA->DOSE_GROUP_M[nLOOP].REFERRING_COMMENT
					strngHldr = concat(strngHldr,",",SUBSTRING(5,SIZE(cDOSE),TRIM(cDOSE)))
				ELSE
					strngHldr = concat(strngHldr,",",rDATA->DOSE_GROUP_M[nLOOP].REFERRING_COMMENT)
				ENDIF
				sCOUNTER = rDATA->DOSE_GROUP_M[nLOOP].DG_SUBJ_CNT
				FOR (mLOOP = 2 to sCOUNTER)
					strngHldr = concat(strngHldr,",")
				ENDFOR
			ENDFOR
			nDG_SZ = SIZE(rDATA->DOSE_GROUP_F,5)
			FOR (nLOOP = 1 to nDG_SZ)
				IF (FINDSTRING("G",rDATA->DOSE_GROUP_F[nLOOP].REFERRING_COMMENT,1)=1)
					cDOSE = rDATA->DOSE_GROUP_F[nLOOP].REFERRING_COMMENT
					strngHldr = concat(strngHldr,",",SUBSTRING(5,SIZE(cDOSE),TRIM(cDOSE)))
				ELSE
					strngHldr = concat(strngHldr,",",rDATA->DOSE_GROUP_F[nLOOP].REFERRING_COMMENT)
				ENDIF
				sCOUNTER = rDATA->DOSE_GROUP_F[nLOOP].DG_SUBJ_CNT
				FOR (mLOOP = 2 to sCOUNTER)
					strngHldr = concat(strngHldr,",")
				ENDFOR
			ENDFOR
			col 0 strngHldr
			row + 1
			strngHldr = trim("")
			nSJ_SZ = SIZE(rDATA->SUBJ_LIST_M,5)
			FOR (nLOOP = 1 to nSJ_SZ)
				strngHldr = concat(strngHldr,",",rDATA->SUBJ_LIST_M[nLOOP].SUBJECT_ID)
			ENDFOR
			nSJ_SZ = SIZE(rDATA->SUBJ_LIST_F,5)
			FOR (nLOOP = 1 to nSJ_SZ)
				strngHldr = concat(strngHldr,",",rDATA->SUBJ_LIST_F[nLOOP].SUBJECT_ID)
			ENDFOR
			col 0 strngHldr
			row + 1
		ELSEIF (vMALE_ID = 1)
			strngHldr = trim("Parameter,Male")
			col 0 strngHldr
			row + 1
			strngHldr = trim("")
			nDG_SZ = SIZE(rDATA->DOSE_GROUP_M,5)
			FOR (nLOOP = 1 to nDG_SZ)
				IF (FINDSTRING("G",rDATA->DOSE_GROUP_M[nLOOP].REFERRING_COMMENT,1)=1)
					cDOSE = rDATA->DOSE_GROUP_M[nLOOP].REFERRING_COMMENT
					strngHldr = concat(strngHldr,",",SUBSTRING(5,SIZE(cDOSE),TRIM(cDOSE)))
				ELSE
					strngHldr = concat(strngHldr,",",rDATA->DOSE_GROUP_M[nLOOP].REFERRING_COMMENT)
				ENDIF
				sCOUNTER = rDATA->DOSE_GROUP_M[nLOOP].DG_SUBJ_CNT
				FOR (mLOOP = 2 to sCOUNTER)
					strngHldr = concat(strngHldr,",")
				ENDFOR
			ENDFOR
			col 0 strngHldr
			row + 1
			strngHldr = trim("")
			nSJ_SZ = SIZE(rDATA->SUBJ_LIST_M,5)
			FOR (nLOOP = 1 to nSJ_SZ)
				strngHldr = concat(strngHldr,",",rDATA->SUBJ_LIST_M[nLOOP].SUBJECT_ID)
			ENDFOR
			col 0 strngHldr
			row + 1
		ELSEIF (vFEMALE_ID = 1)
			strngHldr = trim("Parameter,Female")
			col 0 strngHldr
			row + 1
			strngHldr = trim("")
			nDG_SZ = SIZE(rDATA->DOSE_GROUP_F,5)
			FOR (nLOOP = 1 to nDG_SZ)
				IF (FINDSTRING("G",rDATA->DOSE_GROUP_F[nLOOP].REFERRING_COMMENT,1)=1)
					cDOSE = rDATA->DOSE_GROUP_F[nLOOP].REFERRING_COMMENT
					strngHldr = concat(strngHldr,",",SUBSTRING(5,SIZE(cDOSE),TRIM(cDOSE)))
				ELSE
					strngHldr = concat(strngHldr,",",rDATA->DOSE_GROUP_F[nLOOP].REFERRING_COMMENT)
				ENDIF
				sCOUNTER = rDATA->DOSE_GROUP_F[nLOOP].DG_SUBJ_CNT
				FOR (mLOOP = 2 to sCOUNTER)
					strngHldr = concat(strngHldr,",")
				ENDFOR
			ENDFOR
			col 0 strngHldr
			row + 1
			strngHldr = trim("")
			nSJ_SZ = SIZE(rDATA->SUBJ_LIST_F,5)
			FOR (nLOOP = 1 to nSJ_SZ)
				strngHldr = concat(strngHldr,",",rDATA->SUBJ_LIST_F[nLOOP].SUBJECT_ID)
			ENDFOR
			col 0 strngHldr
			row + 1
;		ELSE
;			strngHldr = trim("Parameter,Unknown")
;			col 0 strngHldr
;			row + 1
;			strngHldr = trim("")
;			nDG_SZ = rDATA->DG_CNT
;			FOR (nLOOP = 1 to nDG_SZ)
;				IF (FINDSTRING("G",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT,1)=1)
;					cDOSE = rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT
;					strngHldr = concat(strngHldr,",",SUBSTRING(5,SIZE(cDOSE),TRIM(cDOSE)))
;				ELSE
;					strngHldr = concat(strngHldr,",",rDATA->DOSE_GROUP[nLOOP].REFERRING_COMMENT)
;				ENDIF
;				sCOUNTER = rDATA->DOSE_GROUP[nLOOP].DG_SUBJ_CNT
;				FOR (nLOOP = 2 to sCOUNTER)
;					strngHldr = concat(strngHldr,",")
;				ENDFOR
;			ENDFOR
;			col 0 strngHldr
;			row + 2
		ENDIF
	HEAD GRID_POSITION
		IF (VSF_TEST_UNITS != "" AND VSF_TEST_UNITS != " ")
			strngHldr = concat(trim(VSF_TEST_NAME), " (", trim(VSF_TEST_UNITS),")")
		ELSE
			strngHldr = trim(VSF_TEST_NAME)
		ENDIF
		col 0 strngHldr
		row + 1
		nTMPT_CNT = 0
	HEAD TMPT_POS_VAL					;007
	;HEAD COLL_DT_TM					;007
		SUBJ_PTR = 1
		nTMPT_CNT = nTMPT_CNT + 1
		strngHldr = trim(TIMEPOINT)
	HEAD SEX
		X = 0
	HEAD DOSE_GROUP
		X = 0
	HEAD SUBJECT_ID
		WHILE(SUBJECT_POS_VAL != SUBJ_PTR)
			strngHldr = concat(strngHldr,",")
			SUBJ_PTR = SUBJ_PTR + 1
		ENDWHILE
		IF (TMPT_BASELINE = 1)
			IF ($REF_FLAG = "1")
				strngHldr = concat(strngHldr,",",trim(RESULT)," ",trim(P_FLAG))
			ELSE
				strngHldr = concat(strngHldr,",",trim(RESULT))
			ENDIF
		ELSE
			IF ($REF_FLAG = "1")
				strngHldr = concat(strngHldr,",",trim(BSLN_SIGN)," ",trim(P_CHANGE_SIGN)," ",trim(P_CHANGE_SG)," ",trim(P_FLAG))
			ELSE
				strngHldr = concat(strngHldr,",",trim(BSLN_SIGN)," ",trim(P_CHANGE_SIGN)," ",trim(P_CHANGE_SG))
			ENDIF
		ENDIF
		SUBJ_PTR = SUBJ_PTR + 1
 
; CALL ECHO(TIMEPOINT)
; CALL ECHO(GRID_POSITION)
 
	FOOT TMPT_POS_VAL						;007
	;FOOT COLL_DT_TM						;007
		col 0 strngHldr
		row + 1
	FOOT PARAMETER_TYPE
		row + 2
 
	WITH format = variable, noheading, formfeed=none, maxrow=1, maxcol=32000, nullreport
 
;008 comment FTP
/* FTP the extract file to a front end fileshare
 
if(dbNme = "BUILD")
 set batch_filename_loc = value(trim(concat("/cerner/d_build/ccluserdir/ivb2_",CNVTLOWER($OUTDEV),".csv")))
elseif(dbNme = "CERT")
 set batch_filename_loc = value(trim(concat("/cerner/d_cert/ccluserdir/ivb2_",CNVTLOWER($OUTDEV),".csv")))
elseif(dbNme = "PROD")
 set batch_filename_loc = value(trim(concat("/cerner/d_prod/ccluserdir/ivb2_",CNVTLOWER($OUTDEV),".csv")))
endif
 
set new_full_name = value(trim(concat("ivb2_",cnvtlower($OUTDEV),".csv")))
 
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
 
/********************************************
; Output the Individual Listing data extract
*********************************************/
IF ($REPORT_DESIGN IN ("X") AND ($SAMPLE_INT = "0"))
	/***********************************************************************
	; Generate output file delimited by a comma character (",")
	************************************************************************/
	SET vTEST_CNT = rDATA->REF_CNT
	SET mesgdttm = cnvtstring(cnvtdatetime(curdate, curtime3))
;	SET OUTPUT = concat("ccluserdir:ctl_", cnvtlower($OUTDEV),".csv")		;008
	SET OUTPUT = concat("cust_reports:ctl_", cnvtlower($OUTDEV),".csv")		;008
 
	SELECT INTO VALUE(OUTPUT)
		PARAMETER_TYPE		= rDATA->DATA[D1.SEQ].PARAMETER_TYPE,
		SPECIES				= rDATA->DATA[D1.SEQ].SPECIES,
		SEX					= rDATA->DATA[D1.SEQ].SEX,
		DOSE_GROUP			= rDATA->DATA[D1.SEQ].DOSE_GROUP,
		REFERRING_COMMENT	= rDATA->DATA[D1.SEQ].REFERRING_COMMENT,
		SUBJECT_ID			= rDATA->DATA[D1.SEQ].SUBJECT_ID,
		SUBJECT_INDEX		= rDATA->DATA[D1.SEQ].SUBJECT_INDEX,
		TIMEPOINT			= rDATA->DATA[D1.SEQ].TIMEPOINT,
		TMPT_POS_VAL		= rDATA->DATA[D1.SEQ].TMPT_POS_VAL,
		COLLECT_DATE		= rDATA->DATA[D1.SEQ].COLLECT_DATE,
;		COLLECT_DT_TM_2		= rDATA->DATA[D1.SEQ].COLLECT_DT_TM_2,			;008
		VSF_TEST_NAME		= rDATA->DATA[D1.SEQ].VSF_TEST_NAME,
		VSF_TEST_UNITS		= rDATA->REF_MAP[D2.SEQ].VSF_TEST_UNITS,
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
;	ORDER BY PARAMETER_TYPE, SPECIES, SEX DESC, DOSE_GROUP, SUBJECT_INDEX, SUBJECT_ID, COLLECT_DT_TM_2, TMPT_POS_VAL, GRID_POSITION
	ORDER BY PARAMETER_TYPE, SPECIES, SEX DESC, DOSE_GROUP, SUBJECT_INDEX, SUBJECT_ID, TMPT_POS_VAL, GRID_POSITION		;007
	HEAD REPORT
		rowCNT = 0
		strngHldr = trim(cPROTOCOL)
		col 0 strngHldr
		row + 1
	HEAD PARAMETER_TYPE
		strngHldr = trim(PARAMETER_TYPE)
		col 0 strngHldr
		row + 1
 
		strngHldr = trim("Subject ID,Sex,Dose Group,Collection DT/TM,Day,")
		FOR (nLOOP = 1 to vTEST_CNT)
			IF (rDATA->REF_MAP[nLOOP].PARAMETER_TYPE = PARAMETER_TYPE)
				strngHldr = concat(strngHldr,trim(rDATA->REF_MAP[nLOOP].VSF_TEST_NAME,3),",")
			ENDIF
		ENDFOR
		col 0 strngHldr
		row + 1
 
		strngHldr = trim(",,,,,")
		FOR (nLOOP = 1 to rDATA->REF_CNT)
			IF (rDATA->REF_MAP[nLOOP].PARAMETER_TYPE = PARAMETER_TYPE)
				strngHldr = concat(strngHldr,trim(rDATA->REF_MAP[nLOOP].VSF_TEST_UNITS),",")
			ENDIF
		ENDFOR
		col 0 strngHldr
		row + 1
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
	HEAD TIMEPOINT
		strngHldr = concat(trim(SUBJECT_ID),",",trim(SEX),",")
		IF (FINDSTRING("G",REFERRING_COMMENT,1)=1)
			strngHldr = concat(strngHldr,trim(REFERRING_COMMENT))
		ELSEIF (REFERRING_COMMENT != "")
			strngHldr = concat(strngHldr,trim(DOSE_GROUP),"_",trim(REFERRING_COMMENT))
		ELSE
			strngHldr = concat(strngHldr,trim(DOSE_GROUP))
		ENDIF
		strngHldr = concat(strngHldr,",",trim(COLLECT_DATE),",")
		strngHldr = concat(strngHldr,trim(TIMEPOINT),",")
		GRID_PTR = 1
	DETAIL
; CALL ECHO(SUBJECT_ID)
; CALL ECHO(TIMEPOINT)
; CALL ECHO(GRID_POSITION)
		IF (GRID_POSITION = GRID_PTR)
			strngHldr = concat(strngHldr,trim(RESULT),",")
			GRID_PTR = GRID_PTR + 1
		ELSE
			WHILE(GRID_POSITION != GRID_PTR)
				strngHldr = concat(strngHldr,",")
				GRID_PTR = GRID_PTR + 1
			ENDWHILE
			strngHldr = concat(strngHldr,trim(RESULT),",")
			GRID_PTR = GRID_PTR + 1
		ENDIF
	FOOT TIMEPOINT
		col 0 strngHldr
		row + 1
	FOOT PARAMETER_TYPE
		row + 2
		rowCNT = row
 
	WITH format = variable, noheading, formfeed=none, maxrow=1, maxcol=32000, nullreport
 
;008 comment FTP
/* FTP the extract file to a front end fileshare
if(dbNme = "BUILD")
 set batch_filename_loc = value(trim(concat("/cerner/d_build/ccluserdir/ctl_",CNVTLOWER($OUTDEV),".csv")))
elseif(dbNme = "CERT")
 set batch_filename_loc = value(trim(concat("/cerner/d_cert/ccluserdir/ctl_",CNVTLOWER($OUTDEV),".csv")))
elseif(dbNme = "PROD")
 set batch_filename_loc = value(trim(concat("/cerner/d_prod/ccluserdir/ctl_",CNVTLOWER($OUTDEV),".csv")))
endif
 
set new_full_name = value(trim(concat("ctl_",cnvtlower($OUTDEV),".csv")))
 
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
 
/********************************************
; Output the Raw Listing data extract
*********************************************/
IF ($REPORT_DESIGN IN ("RAW") AND ($SAMPLE_INT = "0"))
	/***********************************************************************
	; Generate output file delimited by a comma character (",")
	************************************************************************/
	SET vTEST_CNT = rDATA->REF_CNT
	SET mesgdttm = cnvtstring(cnvtdatetime(curdate, curtime3))
;	SET OUTPUT = concat("ccluserdir:ctlrw_", cnvtlower($OUTDEV),".csv")
 	SET OUTPUT = concat("cust_reports:ctlrw_", cnvtlower($OUTDEV),".csv")
 
	SELECT INTO VALUE(OUTPUT)
		PARAMETER_TYPE		= rDATA->DATA[D1.SEQ].PARAMETER_TYPE,
		SPECIES				= rDATA->DATA[D1.SEQ].SPECIES,
		SEX					= rDATA->DATA[D1.SEQ].SEX,
		REFERRING_COMMENT	= rDATA->DATA[D1.SEQ].REFERRING_COMMENT,
		SUBJECT_ID			= rDATA->DATA[D1.SEQ].SUBJECT_ID,
		SUBJECT_INDEX		= rDATA->DATA[D1.SEQ].SUBJECT_INDEX,
		TIMEPOINT			= rDATA->DATA[D1.SEQ].TIMEPOINT,
		TMPT_POS_VAL		= rDATA->DATA[D1.SEQ].TMPT_POS_VAL,
		COLLECT_DATE		= rDATA->DATA[D1.SEQ].COLLECT_DATE,
		COLLECT_DT_TM		= rDATA->DATA[D1.SEQ].COLLECT_DT_TM,
		COLLECT_DT_TM_2		= rDATA->DATA[D1.SEQ].COLLECT_DT_TM_2,
		VSF_TEST_NAME		= rDATA->DATA[D1.SEQ].VSF_TEST_NAME,
		VSF_TEST_UNITS		= rDATA->REF_MAP[D2.SEQ].VSF_TEST_UNITS,
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
	ORDER BY PARAMETER_TYPE, SPECIES, SEX DESC, SUBJECT_INDEX, SUBJECT_ID, COLLECT_DT_TM_2, GRID_POSITION
	HEAD REPORT
		strngHldr = trim(cPROTOCOL)
		col 0 strngHldr
		row + 1
	HEAD PARAMETER_TYPE
		strngHldr = trim(PARAMETER_TYPE)
		col 0 strngHldr
		row + 1
 
		strngHldr = trim("Subject ID,Sex,Collection DT/TM,Day,")
		FOR (nLOOP = 1 to vTEST_CNT)
			IF (rDATA->REF_MAP[nLOOP].PARAMETER_TYPE = PARAMETER_TYPE)
				strngHldr = concat(strngHldr,trim(rDATA->REF_MAP[nLOOP].VSF_TEST_NAME,3),",")
			ENDIF
		ENDFOR
		col 0 strngHldr
		row + 1
 
		strngHldr = trim(",,,,")
		FOR (nLOOP = 1 to rDATA->REF_CNT)
			IF (rDATA->REF_MAP[nLOOP].PARAMETER_TYPE = PARAMETER_TYPE)
				strngHldr = concat(strngHldr,trim(rDATA->REF_MAP[nLOOP].VSF_TEST_UNITS),",")
			ENDIF
		ENDFOR
		col 0 strngHldr
		row + 1
	HEAD SPECIES
		X = 0
	HEAD SEX
		X = 0
	HEAD SUBJECT_INDEX
		X = 0
	HEAD SUBJECT_ID
		X = 0
	HEAD COLLECT_DT_TM
		strngHldr = concat(trim(SUBJECT_ID),",",trim(SEX),",",trim(COLLECT_DATE),",")
		strngHldr = concat(strngHldr,trim(TIMEPOINT),",")
		GRID_PTR = 1
	DETAIL
 
		IF (GRID_POSITION = GRID_PTR)
			strngHldr = concat(strngHldr,trim(RESULT),",")
			GRID_PTR = GRID_PTR + 1
		ELSE
			WHILE(GRID_POSITION != GRID_PTR)
				strngHldr = concat(strngHldr,",")
				GRID_PTR = GRID_PTR + 1
			ENDWHILE
			strngHldr = concat(strngHldr,trim(RESULT),",")
			GRID_PTR = GRID_PTR + 1
		ENDIF
	FOOT TIMEPOINT
		col 0 strngHldr
		row + 1
	FOOT PARAMETER_TYPE
		row + 2
 
	WITH format = variable, noheading, formfeed=none, maxrow=1, maxcol=32000, nullreport
 
;comment FTP
/* FTP the extract file to a front end fileshare
 
if(dbNme = "BUILD")
 set batch_filename_loc = value(trim(concat("/cerner/d_build/ccluserdir/ctlrw_",CNVTLOWER($OUTDEV),".csv")))
elseif(dbNme = "CERT")
 set batch_filename_loc = value(trim(concat("/cerner/d_cert/ccluserdir/ctlrw_",CNVTLOWER($OUTDEV),".csv")))
elseif(dbNme = "PROD")
 set batch_filename_loc = value(trim(concat("/cerner/d_prod/ccluserdir/ctlrw_",CNVTLOWER($OUTDEV),".csv")))
endif
 
set new_full_name = value(trim(concat("ctlrw_",cnvtlower($OUTDEV),".csv")))
 
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
 
/******************************************************
; Output the MN Bone Marrow data extract for GeneTox
*******************************************************/
IF ($REPORT_DESIGN IN ("MNBM"))
	/***********************************************************************
	; Generate output file delimited by a comma character (",")
	************************************************************************/
	SET vTEST_CNT = rDATA->REF_CNT
	SET mesgdttm = cnvtstring(cnvtdatetime(curdate, curtime3))
;	SET OUTPUT = concat("ccluserdir:ctlmnbm_", cnvtlower($OUTDEV),".csv")		;008
	SET OUTPUT = concat("cust_reports:ctlmnbm_", cnvtlower($OUTDEV),".csv")		;008
 
	SELECT INTO VALUE(OUTPUT)
		PARAMETER_TYPE		= rDATA->DATA[D1.SEQ].PARAMETER_TYPE,
		SPECIES				= rDATA->DATA[D1.SEQ].SPECIES,
		SEX					= rDATA->DATA[D1.SEQ].SEX,
		DOSE_GROUP			= rDATA->DATA[D1.SEQ].DOSE_GROUP,
		DOSE				= rDATA->DATA[D1.SEQ].REFERRING_COMMENT,
		SUBJECT_ID			= rDATA->DATA[D1.SEQ].SUBJECT_ID,
		SUBJECT_INDEX		= rDATA->DATA[D1.SEQ].SUBJECT_INDEX,
		TIMEPOINT			= rDATA->DATA[D1.SEQ].TIMEPOINT,
		TMPT_POS_VAL		= rDATA->DATA[D1.SEQ].TMPT_POS_VAL,
		COLLECT_DATE		= rDATA->DATA[D1.SEQ].COLLECT_DATE,
		COLLECT_DT_TM_2		= rDATA->DATA[D1.SEQ].COLLECT_DT_TM_2,
		VSF_TEST_NAME		= rDATA->DATA[D1.SEQ].VSF_TEST_NAME,
		VSF_TEST_UNITS		= rDATA->REF_MAP[D2.SEQ].VSF_TEST_UNITS,
		GRID_POSITION		= rDATA->REF_MAP[D2.SEQ].GRID_POSITION,
		MAX_TESTS			= rDATA->REF_MAP[D2.SEQ].MAX_TESTS,
		RESULT				= rDATA->DATA[D1.SEQ].RESULT,
		NORMALCY			= rDATA->DATA[D1.SEQ].RESULT_FLAG	; Set result flag ("#") to report normalcy field
	FROM	(DUMMYT			D1 WITH SEQ=VALUE(rDATA->COUNT)),
			(DUMMYT			D2 WITH SEQ=VALUE(rDATA->REF_CNT))
	PLAN D1
		WHERE rDATA->DATA[D1.SEQ].NR = 0	; Do not show tests with NR Comment
		AND rDATA->DATA[D1.SEQ].SUBJECT_ID > " "
		AND rDATA->DATA[D1.SEQ].VSF_TEST_NAME IN ("PCE BM", "MNPCE BM", "NCE BM", "MNNCE BM", "PCE L", "MNPCE L")
;			"MNNCE L")
;		AND rDATA->DATA[D1.SEQ].VSF_TEST_NAME IN ("PCE BM", "MNPCE BM", "NCE BM", "MNNCE BM", "MNPCE L", "PCE L",
;			"PCE BL", "MNPCE BL", "NCE BL", "MNNCE BL", "MNPCE BL L", "PCE BL L", "RET BL")
	JOIN D2
		WHERE rDATA->DATA[D1.SEQ].PARAMETER_TYPE = rDATA->REF_MAP[D2.SEQ].PARAMETER_TYPE
		AND   rDATA->DATA[D1.SEQ].VSF_TEST_NAME = rDATA->REF_MAP[D2.SEQ].VSF_TEST_NAME
	ORDER BY PARAMETER_TYPE, SPECIES, SEX DESC, DOSE_GROUP, SUBJECT_INDEX, SUBJECT_ID, COLLECT_DT_TM_2, TMPT_POS_VAL, GRID_POSITION
	HEAD REPORT
		strngHldr = trim(cPROTOCOL)
		col 0 strngHldr
		row + 1
	HEAD PARAMETER_TYPE
		strngHldr = trim("Animal No.,No. PCE,No. MN-PCE,No. NCE, No. MN-NCE,Dose,Animal No.,%MN-PCE,%PCE")
		col 0 strngHldr
		row + 1
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
	HEAD TIMEPOINT
		strngHldr = concat(trim(SUBJECT_ID),",")
		GRID_PTR = 1
	DETAIL
		IF (GRID_PTR = 5)
			IF (FINDSTRING("G",DOSE,1)=1)
				DOSE_TMP = SUBSTRING(5,SIZE(DOSE,1)-4,DOSE)
			ELSE
				DOSE_TMP = DOSE
			ENDIF
			strngHldr = concat(strngHldr,trim(DOSE_TMP),",",trim(SUBJECT_ID),",",trim(RESULT),",")
		ELSE
			strngHldr = concat(strngHldr,trim(RESULT),",")
		ENDIF
		GRID_PTR = GRID_PTR + 1
 
	FOOT TIMEPOINT
		col 0 strngHldr
		row + 1
	FOOT PARAMETER_TYPE
		row + 2
 
	WITH format = variable, noheading, formfeed=none, maxrow=1, maxcol=32000, nullreport
 
;008 comment FTP
/* FTP the extract file to a front end fileshare
 
if(dbNme = "BUILD")
 set batch_filename_loc = value(trim(concat("/cerner/d_build/ccluserdir/ctlmnbm_",CNVTLOWER($OUTDEV),".csv")))
elseif(dbNme = "CERT")
 set batch_filename_loc = value(trim(concat("/cerner/d_cert/ccluserdir/ctlmnbm_",CNVTLOWER($OUTDEV),".csv")))
elseif(dbNme = "PROD")
 set batch_filename_loc = value(trim(concat("/cerner/d_prod/ccluserdir/ctlmnbm_",CNVTLOWER($OUTDEV),".csv")))
endif
 
set new_full_name = value(trim(concat("ctlmnbm_",cnvtlower($OUTDEV),".csv")))
 
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
 
/********************************************
; Output the MN Blood data extract for GeneTox
*********************************************/
IF ($REPORT_DESIGN IN ("MNBL"))
	/***********************************************************************
	; Generate output file delimited by a comma character (",")
	************************************************************************/
	SET vTEST_CNT = rDATA->REF_CNT
	SET mesgdttm = cnvtstring(cnvtdatetime(curdate, curtime3))
;	SET OUTPUT = concat("ccluserdir:ctlmnbl_", cnvtlower($OUTDEV),".csv")		;008
	SET OUTPUT = concat("cust_reports:ctlmnbl_", cnvtlower($OUTDEV),".csv") 	;008
	SELECT INTO VALUE(OUTPUT)
		PARAMETER_TYPE		= rDATA->DATA[D1.SEQ].PARAMETER_TYPE,
		SPECIES				= rDATA->DATA[D1.SEQ].SPECIES,
		SEX					= rDATA->DATA[D1.SEQ].SEX,
		DOSE_GROUP			= rDATA->DATA[D1.SEQ].DOSE_GROUP,
		DOSE				= rDATA->DATA[D1.SEQ].REFERRING_COMMENT,
		SUBJECT_ID			= rDATA->DATA[D1.SEQ].SUBJECT_ID,
		SUBJECT_INDEX		= rDATA->DATA[D1.SEQ].SUBJECT_INDEX,
		TIMEPOINT			= rDATA->DATA[D1.SEQ].TIMEPOINT,
		TMPT_POS_VAL		= rDATA->DATA[D1.SEQ].TMPT_POS_VAL,
		COLLECT_DATE		= rDATA->DATA[D1.SEQ].COLLECT_DATE,
		COLLECT_DT_TM_2		= rDATA->DATA[D1.SEQ].COLLECT_DT_TM_2,
		VSF_TEST_NAME		= rDATA->DATA[D1.SEQ].VSF_TEST_NAME,
		VSF_TEST_UNITS		= rDATA->REF_MAP[D2.SEQ].VSF_TEST_UNITS,
		GRID_POSITION		= rDATA->REF_MAP[D2.SEQ].GRID_POSITION,
		MAX_TESTS			= rDATA->REF_MAP[D2.SEQ].MAX_TESTS,
		RESULT				= rDATA->DATA[D1.SEQ].RESULT,
		NORMALCY			= rDATA->DATA[D1.SEQ].RESULT_FLAG	; Set result flag ("#") to report normalcy field
	FROM	(DUMMYT			D1 WITH SEQ=VALUE(rDATA->COUNT)),
			(DUMMYT			D2 WITH SEQ=VALUE(rDATA->REF_CNT))
	PLAN D1
		WHERE rDATA->DATA[D1.SEQ].NR = 0	; Do not show tests with NR Comment
		AND rDATA->DATA[D1.SEQ].SUBJECT_ID > " "
		AND rDATA->DATA[D1.SEQ].VSF_TEST_NAME IN ("MNNCE BL", "MNRET BL", "MNRET BL L", "NCE BL",
			"RET BL", "RET BL L")
	JOIN D2
		WHERE rDATA->DATA[D1.SEQ].PARAMETER_TYPE = rDATA->REF_MAP[D2.SEQ].PARAMETER_TYPE
		AND   rDATA->DATA[D1.SEQ].VSF_TEST_NAME = rDATA->REF_MAP[D2.SEQ].VSF_TEST_NAME
	ORDER BY PARAMETER_TYPE, SPECIES, SEX DESC, DOSE_GROUP, SUBJECT_INDEX, SUBJECT_ID, COLLECT_DT_TM_2, TMPT_POS_VAL, GRID_POSITION
	HEAD REPORT
		strngHldr = trim(cPROTOCOL)
		col 0 strngHldr
		row + 1
	HEAD PARAMETER_TYPE
;		strngHldr = trim("Animal No.,No. PCE,No. MN-PCE,No. NCE, No. MN-NCE,Dose,Animal No.,%MN-PCE,%PCE")
		strngHldr = trim("Animal No.,No. RET,No. MN-RET,No. NCE,No. MN-NCE,Dose,Animal No.,%MN-RET,%RET")
		col 0 strngHldr
		row + 1
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
	HEAD TIMEPOINT
		strngHldr = concat(trim(SUBJECT_ID),",")
		GRID_PTR = 1
	DETAIL
		IF (GRID_PTR = 5)
			IF (FINDSTRING("G",DOSE,1)=1)
				DOSE_TMP = SUBSTRING(5,SIZE(DOSE,1)-4,DOSE)
			ELSE
				DOSE_TMP = DOSE
			ENDIF
			strngHldr = concat(strngHldr,trim(DOSE_TMP),",",trim(SUBJECT_ID),",",trim(RESULT),",")
		ELSE
			strngHldr = concat(strngHldr,trim(RESULT),",")
		ENDIF
		GRID_PTR = GRID_PTR + 1
 
	FOOT TIMEPOINT
		col 0 strngHldr
		row + 1
	FOOT PARAMETER_TYPE
		row + 2
 
	WITH format = variable, noheading, formfeed=none, maxrow=1, maxcol=32000, nullreport
 
;008 comment FTP
/* FTP the extract file to a front end fileshare
 
if(dbNme = "BUILD")
 set batch_filename_loc = value(trim(concat("/cerner/d_build/ccluserdir/ctlmnbl_",CNVTLOWER($OUTDEV),".csv")))
elseif(dbNme = "CERT")
 set batch_filename_loc = value(trim(concat("/cerner/d_cert/ccluserdir/ctlmnbl_",CNVTLOWER($OUTDEV),".csv")))
elseif(dbNme = "PROD")
 set batch_filename_loc = value(trim(concat("/cerner/d_prod/ccluserdir/ctlmnbl_",CNVTLOWER($OUTDEV),".csv")))
endif
 
set new_full_name = value(trim(concat("ctlmnbl_",cnvtlower($OUTDEV),".csv")))
 
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
 
IF ($REPORT_DESIGN != "X")
	CALL FinalizeReport($OUTDEV)
ENDIF
 
#END_PROGRAM
 
 ;call echorecord(rDATA)
 call echorecord(rREPORT)
 
END GO
