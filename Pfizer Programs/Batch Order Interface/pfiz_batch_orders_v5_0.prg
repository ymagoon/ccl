e/* 	*******************************************************************************
 
	Script Name:	pfiz_batch_orders_v4.prg
	Description:	Program will generate a pipe ("|") delimited flat file used
					to process multiple orders on multiple subjects.  Output is
					processed by ORM formatting services created in Open Engine.
 
	Date Written:	06-Mar-2012
	Written By:		Nicholas Boone
 
	Executed from:	Explorer Menu
 
	*******************************************************************************
								REVISION INFORMATION
	*******************************************************************************
	Rev	Date		By				Comment
	---	-----------	-----------		-----------------------------------------------
 	0.a	03-Jul-2009	Boone,Nicholas	First Draft
 	1.0 04-Nov-2009	Boone,Nicholas	Released for use.
 	2.0 13-Jan-2010	Boone,Nicholas	Updated to address multiple encounter issues,
 									introduce time offset, and preview mode.
 	3.0	15-Jul-2011	Boone,Nicholas	Include ability to select multiple dose groups.
 	4.0 06-Mar-2012	Boone,Nicholas	Introduce functionality to pull Attending
 									Physician from the database.
 		25-Jan-2013 Boone, Nicholas	Updated filter to exclude VMRD protocols.
 	5.0 16-Apr-2015 Magoon, Yitzhak Modified alias pool for AWMS # (new MRN)
	******************************************************************************* */
 
drop program pfiz_batch_orders_v5_0 go
create program pfiz_batch_orders_v5_0
 
prompt
	"Select the appropriate order by method" = ""
	, "Select action" = ""
	;<<hidden>>"Enter all or part of the study protocol name" = ""
	, "Study Protocol" = 0
	, "Timepoint (e.g.:  D-01, D001 or D001_H06)" = ""
	, "Collection Date/Time" = "SYSDATE"
	, "Enter a time offset based on EST" = ""
	, "Printed Y/N? (Do you want labels printed?)" = "0"
	, "Label Printer" = ""
	, "Dose Group (ignore if ordering based on protocol)" = 0
	, "Subjects (ignore if ordering based on protocol or group)" = 0
	, "Test(s)" = 0
	, "Output to File/Printer/MINE" = "MINE"                           ;* Enter or select the printer or file name to send this re
 
with ORDER_BY, CONDITION, PROTOCOL, TIMEPOINT, COLLECTION, OFFSET, PRINT_OPTION,
	PRINTER, DOSE_GROUP, SUBJECT, ORDERED_TEST, OUTDEV
 
/**************************************************************
; DECLARED VARIABLES AND RECORDS
**************************************************************/
DECLARE strngHldr = vc
DECLARE mesgdttm = vc
DECLARE vprotocol = vc
DECLARE vnodata = i4
DECLARE temp1 = i4
DECLARE temp2 = vc
DECLARE vERROR_MSG = vc
FREE RECORD rORDERS
FREE RECORD rSUBJECT
 
RECORD rORDERS (
	1 COUNT							= i4
	1 DATA[*]
		2 ORDER_ID					= f8
		2 ORDER_NM					= c100
		2 SPECIMEN_TYPE				= c20
)
 
RECORD rSUBJECT (
	1 COUNT							= i4
	1 PROTOCOL_NM					= c30
	1 PRINTER_NM					= c20
	1 COLLECT_DT_TM					= c30
;	1 COLLECT_YN					= i4
	1 OFFSET						= i4
;	1 LOGIN_LOC						= c30
	1 TMPT							= c20
	1 DATA[*]
		2 PERSON_ID					= f8
		2 ENCNTR_ID					= f8
		2 ENCNTR_TYPE_CD			= c20
		2 UNIQUE_ID					= c25
		2 SUBJECT_ID				= c20
		2 VISIT_ID					= c50
		2 INDEX						= i4
		2 NAME_LAST					= c20
		2 FACILITY					= c20
		2 AMBULATORY				= c20
		2 SEX						= c10
		2 SPECIES					= c20
		2 ATTEND_DOC				= c50
)
 
SET cvFIN_NBR = UAR_GET_CODE_BY("MEANING", 319, "FIN NBR")
SET cvVISIT_ID = UAR_GET_CODE_BY("MEANING", 319, "VISITID")
SET cvMRN = UAR_GET_CODE_BY("MEANING",4,"MRN")
SET cvTATTOO = UAR_GET_CODE_BY("DISPLAY",263,"Volunteer/Tattoo Pool")
SET cvENC_MATCH = UAR_GET_CODE_BY("DISPLAY",263,"Encounter Match Pool")
SET cvSUBJ_ID = UAR_GET_CODE_BY("DISPLAY",263,"Subject ID Pool")
 
;
; Identify the individual test(s) that will be ordered
; First load the careset(s) if they exist
;
Set rORDERS->COUNT = 0
Set vnodata = 0
Set vERROR_MSG = " "
 
Select into "NL:"
	ORDER_ID = OC.CATALOG_CD,
	ORDER_NM = UAR_GET_CODE_DISPLAY(OC.CATALOG_CD)
From ORDER_CATALOG OC, CS_COMPONENT CS, ORDER_CATALOG_SYNONYM OCS
Where CS.CATALOG_CD = $ORDERED_TEST and CS.COMP_ID=OCS.SYNONYM_ID
	AND OCS.CATALOG_CD = OC.CATALOG_CD
HEAD REPORT
	nCOUNT = 0
HEAD ORDER_ID
	nCOUNT = nCOUNT + 1
	STAT = ALTERLIST(rORDERS->DATA, nCOUNT)
	rORDERS->DATA[nCOUNT].ORDER_ID = ORDER_ID
	rORDERS->DATA[nCOUNT].ORDER_NM = ORDER_NM
FOOT REPORT
	rORDERS->COUNT = nCOUNT
WITH COUNTER
 
; Load individual tests into the Temp order record
 
Select into "NL:"
	ORDER_ID = OC.CATALOG_CD,
	ORDER_NM = UAR_GET_CODE_DISPLAY(OC.CATALOG_CD)
From ORDER_CATALOG OC
Where OC.CATALOG_CD = $ORDERED_TEST
	and not exists (select "x" from cs_component cs
	where cs.catalog_cd = oc.catalog_cd)
HEAD REPORT
	nCOUNT = rORDERS->COUNT
HEAD ORDER_ID
	nCOUNT = nCOUNT + 1
	STAT = ALTERLIST(rORDERS->DATA, nCOUNT)
	rORDERS->DATA[nCOUNT].ORDER_ID = ORDER_ID
	rORDERS->DATA[nCOUNT].ORDER_NM = ORDER_NM
FOOT REPORT
	rORDERS->COUNT = nCOUNT
WITH COUNTER
 
;
; Populate the orders record structure with the appropriate
; specimen type for the order.
;
Select distinct into "NL:"
	SPECIMEN_TYPE = UAR_GET_CODE_DISPLAY(CIQ.SPECIMEN_TYPE_CD)
From (DUMMYT D with SEQ=VALUE(rORDERS->COUNT)),
	COLLECTION_INFO_QUALIFIERS CIQ
Plan D
Join CIQ where CIQ.CATALOG_CD = rORDERS->DATA[D.SEQ].ORDER_ID
DETAIL
	rORDERS->DATA[D.SEQ].SPECIMEN_TYPE = SPECIMEN_TYPE
WITH COUNTER
 
 
;
; Populate subject record structure with subjects that will have
; tests ordered on based on ORDER BY condition (protocol, group, ind.).
;
 
IF (CNVTINT($ORDER_BY) = 1) ; Based on protocol
	Select into "NL:"
		PERSON_ID = E.PERSON_ID,
		ENCNTR_ID = E.ENCNTR_ID,
		ENCNTR_TYPE_CD = UAR_GET_CODE_DISPLAY(E.ENCNTR_TYPE_CD),
		UNIQUE_ID = PA.ALIAS,
		SUBJECT_ID = EA.ALIAS,
		VISIT_ID = EA2.ALIAS,
		INDEX = CNVTINT(EA.ALIAS),
		NAME_LAST = P.NAME_LAST,
		FACILITY = UAR_GET_CODE_DISPLAY(E.LOC_FACILITY_CD),
		AMBULATORY = UAR_GET_CODE_DISPLAY(E.LOC_NURSE_UNIT_CD),
		SEX = UAR_GET_CODE_DISPLAY(P.SEX_CD),
		SPECIES = UAR_GET_CODE_DISPLAY(P.SPECIES_CD),
		ATTEND_DOC = P2.NAME_FULL_FORMATTED
	From ENCOUNTER E, PERSON_ALIAS PA, ENCNTR_ALIAS EA, PERSON P, ENCNTR_ALIAS EA2, ENCNTR_PRSNL_RELTN EP, PERSON P2
	Plan E where E.ORGANIZATION_ID = CNVTREAL($PROTOCOL)
	Join EA where E.ENCNTR_ID = EA.ENCNTR_ID
		AND EA.ENCNTR_ALIAS_TYPE_CD = cvFIN_NBR
		AND EA.ALIAS_POOL_CD = cvSUBJ_ID
		AND EA.ALIAS != " "
		AND EA.ACTIVE_IND = 1
	Join EA2 where E.ENCNTR_ID = EA2.ENCNTR_ID
		AND EA2.ENCNTR_ALIAS_TYPE_CD = cvVISIT_ID
		AND EA2.ALIAS_POOL_CD = cvENC_MATCH
		AND EA2.ALIAS != " "
		AND EA2.ACTIVE_IND = 1
	Join P where E.PERSON_ID = P.PERSON_ID
	Join PA where E.PERSON_ID = PA.PERSON_ID
		AND   PA.PERSON_ALIAS_TYPE_CD = cvMRN
		;AND   PA.ALIAS_POOL_CD = cvTATTOO							;5.0
		AND   PA.ACTIVE_IND = 1
		AND   PA.END_EFFECTIVE_DT_TM > CNVTDATETIME(CURDATE, CURTIME3)
	Join EP where E.ENCNTR_ID = EP.ENCNTR_ID
		AND EP.ENCNTR_PRSNL_R_CD = 1119
		AND EP.ACTIVE_IND = 1
	Join P2 where EP.PRSNL_PERSON_ID = P2.PERSON_ID
		AND P2.ACTIVE_IND = 1
	Order by INDEX, EA.ALIAS, PA.ALIAS
	HEAD REPORT
		nCOUNT = 0
	HEAD PA.ALIAS
		nCOUNT = nCOUNT + 1
		IF (nCOUNT > 1)
;				Remove duplicate person_id's due to person combines
			IF (rSUBJECT->DATA[nCOUNT-1].PERSON_ID = PERSON_ID)
				X=0
			ELSE
				STAT = ALTERLIST(rSUBJECT->DATA, nCOUNT)
				rSUBJECT->DATA[nCOUNT].PERSON_ID = PERSON_ID
				rSUBJECT->DATA[nCOUNT].ENCNTR_ID = ENCNTR_ID
				rSUBJECT->DATA[nCOUNT].ENCNTR_TYPE_CD = ENCNTR_TYPE_CD
				rSUBJECT->DATA[nCOUNT].UNIQUE_ID = UNIQUE_ID
				rSUBJECT->DATA[nCOUNT].SUBJECT_ID = SUBJECT_ID
				rSUBJECT->DATA[nCOUNT].VISIT_ID = VISIT_ID
				rSUBJECT->DATA[nCOUNT].INDEX = INDEX
				rSUBJECT->DATA[nCOUNT].NAME_LAST = NAME_LAST
				rSUBJECT->DATA[nCOUNT].FACILITY = FACILITY
				rSUBJECT->DATA[nCOUNT].AMBULATORY = AMBULATORY
				rSUBJECT->DATA[nCOUNT].SEX = SEX
				rSUBJECT->DATA[nCOUNT].SPECIES = SPECIES
				rSUBJECT->DATA[nCOUNT].ATTEND_DOC = ATTEND_DOC
			ENDIF
		ELSE
			STAT = ALTERLIST(rSUBJECT->DATA, nCOUNT)
			rSUBJECT->DATA[nCOUNT].PERSON_ID = PERSON_ID
			rSUBJECT->DATA[nCOUNT].ENCNTR_ID = ENCNTR_ID
			rSUBJECT->DATA[nCOUNT].ENCNTR_TYPE_CD = ENCNTR_TYPE_CD
			rSUBJECT->DATA[nCOUNT].UNIQUE_ID = UNIQUE_ID
			rSUBJECT->DATA[nCOUNT].SUBJECT_ID = SUBJECT_ID
			rSUBJECT->DATA[nCOUNT].VISIT_ID = VISIT_ID
			rSUBJECT->DATA[nCOUNT].INDEX = INDEX
			rSUBJECT->DATA[nCOUNT].NAME_LAST = NAME_LAST
			rSUBJECT->DATA[nCOUNT].FACILITY = FACILITY
			rSUBJECT->DATA[nCOUNT].AMBULATORY = AMBULATORY
			rSUBJECT->DATA[nCOUNT].SEX = SEX
			rSUBJECT->DATA[nCOUNT].SPECIES = SPECIES
			rSUBJECT->DATA[nCOUNT].ATTEND_DOC = ATTEND_DOC
		ENDIF
	DETAIL
		X=0
	FOOT REPORT
		rSUBJECT->COUNT = nCOUNT
	WITH COUNTER
 
	IF (CURQUAL = 0)
		Set vnodata = 1
		Set vERROR_MSG = "No subjects qualified based on the criteria entered."
		GO TO PRINT_OUTPUT
	ENDIF
 
ELSEIF (CNVTINT($ORDER_BY) = 2) ; Based on dose group
	Select into "NL:"
		PERSON_ID = E.PERSON_ID,
		ENCNTR_ID = E.ENCNTR_ID,
		ENCNTR_TYPE_CD = UAR_GET_CODE_DISPLAY(E.ENCNTR_TYPE_CD),
		UNIQUE_ID = PA.ALIAS,
		SUBJECT_ID = EA.ALIAS,
		VISIT_ID = EA2.ALIAS,
		INDEX = CNVTINT(EA.ALIAS),
		NAME_LAST = P.NAME_LAST,
		FACILITY = UAR_GET_CODE_DISPLAY(E.LOC_FACILITY_CD),
		AMBULATORY = UAR_GET_CODE_DISPLAY(E.LOC_NURSE_UNIT_CD),
		SEX = UAR_GET_CODE_DISPLAY(P.SEX_CD),
		SPECIES = UAR_GET_CODE_DISPLAY(P.SPECIES_CD),
		ATTEND_DOC = P2.NAME_FULL_FORMATTED
	From ENCOUNTER E, PERSON_ALIAS PA, ENCNTR_ALIAS EA, PERSON P, ENCNTR_ALIAS EA2, ENCNTR_PRSNL_RELTN EP, PERSON P2
	Plan E where E.ORGANIZATION_ID = CNVTREAL($PROTOCOL)
		AND E.ENCNTR_TYPE_CD = $DOSE_GROUP
	Join EA where E.ENCNTR_ID = EA.ENCNTR_ID
		AND EA.ENCNTR_ALIAS_TYPE_CD = cvFIN_NBR
		AND EA.ALIAS_POOL_CD = cvSUBJ_ID
		AND EA.ALIAS != " "
		AND EA.ACTIVE_IND = 1
	Join EA2 where E.ENCNTR_ID = EA2.ENCNTR_ID
		AND EA2.ENCNTR_ALIAS_TYPE_CD = cvVISIT_ID
		AND EA2.ALIAS_POOL_CD = cvENC_MATCH
		AND EA2.ALIAS != " "
		AND EA2.ACTIVE_IND = 1
	Join P where E.PERSON_ID = P.PERSON_ID
	Join PA where E.PERSON_ID = PA.PERSON_ID
		AND   PA.PERSON_ALIAS_TYPE_CD = cvMRN
		;AND   PA.ALIAS_POOL_CD = cvTATTOO											;5.0
		AND   PA.ACTIVE_IND = 1
		AND   PA.END_EFFECTIVE_DT_TM > CNVTDATETIME(CURDATE, CURTIME3)
	Join EP where E.ENCNTR_ID = EP.ENCNTR_ID
		AND EP.ENCNTR_PRSNL_R_CD = 1119
		AND EP.ACTIVE_IND = 1
	Join P2 where EP.PRSNL_PERSON_ID = P2.PERSON_ID
		AND P2.ACTIVE_IND = 1
	Order by INDEX, EA.ALIAS, PA.ALIAS
	HEAD REPORT
		nCOUNT = 0
	HEAD PA.ALIAS
		nCOUNT = nCOUNT + 1
		IF (nCOUNT > 1)
;				Remove duplicate person_id's due to person combines
			IF (rSUBJECT->DATA[nCOUNT-1].PERSON_ID = PERSON_ID)
				X=0
			ELSE
				STAT = ALTERLIST(rSUBJECT->DATA, nCOUNT)
				rSUBJECT->DATA[nCOUNT].PERSON_ID = PERSON_ID
				rSUBJECT->DATA[nCOUNT].ENCNTR_ID = ENCNTR_ID
				rSUBJECT->DATA[nCOUNT].ENCNTR_TYPE_CD = ENCNTR_TYPE_CD
				rSUBJECT->DATA[nCOUNT].UNIQUE_ID = UNIQUE_ID
				rSUBJECT->DATA[nCOUNT].SUBJECT_ID = SUBJECT_ID
				rSUBJECT->DATA[nCOUNT].VISIT_ID = VISIT_ID
				rSUBJECT->DATA[nCOUNT].INDEX = INDEX
				rSUBJECT->DATA[nCOUNT].NAME_LAST = NAME_LAST
				rSUBJECT->DATA[nCOUNT].FACILITY = FACILITY
				rSUBJECT->DATA[nCOUNT].AMBULATORY = AMBULATORY
				rSUBJECT->DATA[nCOUNT].SEX = SEX
				rSUBJECT->DATA[nCOUNT].SPECIES = SPECIES
				rSUBJECT->DATA[nCOUNT].ATTEND_DOC = ATTEND_DOC
			ENDIF
		ELSE
			STAT = ALTERLIST(rSUBJECT->DATA, nCOUNT)
			rSUBJECT->DATA[nCOUNT].PERSON_ID = PERSON_ID
			rSUBJECT->DATA[nCOUNT].ENCNTR_ID = ENCNTR_ID
			rSUBJECT->DATA[nCOUNT].ENCNTR_TYPE_CD = ENCNTR_TYPE_CD
			rSUBJECT->DATA[nCOUNT].UNIQUE_ID = UNIQUE_ID
			rSUBJECT->DATA[nCOUNT].SUBJECT_ID = SUBJECT_ID
			rSUBJECT->DATA[nCOUNT].VISIT_ID = VISIT_ID
			rSUBJECT->DATA[nCOUNT].INDEX = INDEX
			rSUBJECT->DATA[nCOUNT].NAME_LAST = NAME_LAST
			rSUBJECT->DATA[nCOUNT].FACILITY = FACILITY
			rSUBJECT->DATA[nCOUNT].AMBULATORY = AMBULATORY
			rSUBJECT->DATA[nCOUNT].SEX = SEX
			rSUBJECT->DATA[nCOUNT].SPECIES = SPECIES
			rSUBJECT->DATA[nCOUNT].ATTEND_DOC = ATTEND_DOC
		ENDIF
	DETAIL
		X=0
	FOOT REPORT
		rSUBJECT->COUNT = nCOUNT
	WITH COUNTER
 
	IF (CURQUAL = 0)
		Set vnodata = 1
		Set vERROR_MSG = "No subjects qualified based on the criteria entered."
		GO TO PRINT_OUTPUT
	ENDIF
 
ELSE ; Based on individual listing
	Select into "NL:"
		PERSON_ID = E.PERSON_ID,
		ENCNTR_ID = E.ENCNTR_ID,
		ENCNTR_TYPE_CD = UAR_GET_CODE_DISPLAY(E.ENCNTR_TYPE_CD),
		UNIQUE_ID = PA.ALIAS,
		SUBJECT_ID = EA.ALIAS,
		VISIT_ID = EA2.ALIAS,
		INDEX = CNVTINT(EA.ALIAS),
		NAME_LAST = P.NAME_LAST,
		FACILITY = UAR_GET_CODE_DISPLAY(E.LOC_FACILITY_CD),
		AMBULATORY = UAR_GET_CODE_DISPLAY(E.LOC_NURSE_UNIT_CD),
		SEX = UAR_GET_CODE_DISPLAY(P.SEX_CD),
		SPECIES = UAR_GET_CODE_DISPLAY(P.SPECIES_CD),
		ATTEND_DOC = P2.NAME_FULL_FORMATTED
	From ENCOUNTER E, PERSON_ALIAS PA, ENCNTR_ALIAS EA, PERSON P, ENCNTR_ALIAS EA2, ENCNTR_PRSNL_RELTN EP, PERSON P2
	Plan E where E.ORGANIZATION_ID = CNVTREAL($PROTOCOL)
		AND E.PERSON_ID = $SUBJECT
	Join EA where E.ENCNTR_ID = EA.ENCNTR_ID
		AND EA.ENCNTR_ALIAS_TYPE_CD = cvFIN_NBR
		AND EA.ALIAS_POOL_CD = cvSUBJ_ID
		AND EA.ALIAS != " "
		AND EA.ACTIVE_IND = 1
	Join EA2 where E.ENCNTR_ID = EA2.ENCNTR_ID
		AND EA2.ENCNTR_ALIAS_TYPE_CD = cvVISIT_ID
		AND EA2.ALIAS_POOL_CD = cvENC_MATCH
		AND EA2.ALIAS != " "
		AND EA2.ACTIVE_IND = 1
	Join P where E.PERSON_ID = P.PERSON_ID
	Join PA where E.PERSON_ID = PA.PERSON_ID
		AND   PA.PERSON_ALIAS_TYPE_CD = cvMRN
		;AND   PA.ALIAS_POOL_CD = cvTATTOO									;5.0
		AND   PA.ACTIVE_IND = 1
		AND   PA.END_EFFECTIVE_DT_TM > CNVTDATETIME(CURDATE, CURTIME3)
	Join EP where E.ENCNTR_ID = EP.ENCNTR_ID
		AND EP.ENCNTR_PRSNL_R_CD = 1119
		AND EP.ACTIVE_IND = 1
	Join P2 where EP.PRSNL_PERSON_ID = P2.PERSON_ID
		AND P2.ACTIVE_IND = 1
	Order by INDEX, EA.ALIAS, PA.ALIAS
	HEAD REPORT
		nCOUNT = 0
	HEAD PA.ALIAS
		nCOUNT = nCOUNT + 1
		IF (nCOUNT > 1)
;				Remove duplicate person_id's due to person combines
			IF (rSUBJECT->DATA[nCOUNT-1].PERSON_ID = PERSON_ID)
				X=0
			ELSE
				STAT = ALTERLIST(rSUBJECT->DATA, nCOUNT)
				rSUBJECT->DATA[nCOUNT].PERSON_ID = PERSON_ID
				rSUBJECT->DATA[nCOUNT].ENCNTR_ID = ENCNTR_ID
				rSUBJECT->DATA[nCOUNT].ENCNTR_TYPE_CD = ENCNTR_TYPE_CD
				rSUBJECT->DATA[nCOUNT].UNIQUE_ID = UNIQUE_ID
				rSUBJECT->DATA[nCOUNT].SUBJECT_ID = SUBJECT_ID
				rSUBJECT->DATA[nCOUNT].VISIT_ID = VISIT_ID
				rSUBJECT->DATA[nCOUNT].INDEX = INDEX
				rSUBJECT->DATA[nCOUNT].NAME_LAST = NAME_LAST
				rSUBJECT->DATA[nCOUNT].FACILITY = FACILITY
				rSUBJECT->DATA[nCOUNT].AMBULATORY = AMBULATORY
				rSUBJECT->DATA[nCOUNT].SEX = SEX
				rSUBJECT->DATA[nCOUNT].SPECIES = SPECIES
				rSUBJECT->DATA[nCOUNT].ATTEND_DOC = ATTEND_DOC
			ENDIF
		ELSE
			STAT = ALTERLIST(rSUBJECT->DATA, nCOUNT)
			rSUBJECT->DATA[nCOUNT].PERSON_ID = PERSON_ID
			rSUBJECT->DATA[nCOUNT].ENCNTR_ID = ENCNTR_ID
			rSUBJECT->DATA[nCOUNT].ENCNTR_TYPE_CD = ENCNTR_TYPE_CD
			rSUBJECT->DATA[nCOUNT].UNIQUE_ID = UNIQUE_ID
			rSUBJECT->DATA[nCOUNT].SUBJECT_ID = SUBJECT_ID
			rSUBJECT->DATA[nCOUNT].VISIT_ID = VISIT_ID
			rSUBJECT->DATA[nCOUNT].INDEX = INDEX
			rSUBJECT->DATA[nCOUNT].NAME_LAST = NAME_LAST
			rSUBJECT->DATA[nCOUNT].FACILITY = FACILITY
			rSUBJECT->DATA[nCOUNT].AMBULATORY = AMBULATORY
			rSUBJECT->DATA[nCOUNT].SEX = SEX
			rSUBJECT->DATA[nCOUNT].SPECIES = SPECIES
			rSUBJECT->DATA[nCOUNT].ATTEND_DOC = ATTEND_DOC
		ENDIF
	DETAIL
		X=0
	FOOT REPORT
		rSUBJECT->COUNT = nCOUNT
	WITH COUNTER
 
	IF (CURQUAL = 0)
		Set vnodata = 1
		Set vERROR_MSG = "No subjects qualified based on the criteria entered."
		GO TO PRINT_OUTPUT
	ENDIF
ENDIF
 
 
;
; Collect the Protocol name and populate the Subject record
;
Select into "NL:"
	PROTOCOL = O.ORG_NAME
From ORGANIZATION		O
Plan O where O.ORGANIZATION_ID = CNVTREAL($PROTOCOL)
DETAIL
	rSUBJECT->PROTOCOL_NM = PROTOCOL
WITH COUNTER
 
;
; Collect the Printer name and populate the Subject record
;
IF (CNVTINT($PRINT_OPTION) = 1)
	IF (CNVTREAL($PRINTER) > 0)
		Select into "NL:"
			PRINTER = OD.NAME
		From OUTPUT_DEST OD
		Plan OD where OD.OUTPUT_DEST_CD = CNVTREAL($PRINTER)
		DETAIL
			rSUBJECT->PRINTER_NM = PRINTER
		WITH COUNTER
	ELSE
		Set rSUBJECT->PRINTER_NM = ""
		Set vnodata = 1
		Set vERROR_MSG = "Print option checked but no printer selected."
		GO TO PRINT_OUTPUT
	ENDIF
ELSE
	Set rSUBJECT->PRINTER_NM = ""
ENDIF
 
;
; Collect Login Location and populate Subject record
;	Excluded in release 2.0
;IF (CNVTINT($COLLECTYN) = 1)
;	IF (CNVTREAL($LOGIN) > 0)
;		Select into "NL:"
;			LOGIN_LOC = CV.Display
;		From CODE_VALUE CV
;		Plan CV where CV.CODE_VALUE = CNVTREAL($LOGIN)
;		DETAIL
;			rSUBJECT->LOGIN_LOC = LOGIN_LOC
;		WITH COUNTER
;	ELSE
;		Set rSUBJECT->LOGIN_LOC = ""
;		Set vnodata = 1
;		Set vERROR_MSG = "Collect Y/N option checked but no login location selected."
;		GO TO PRINT_OUTPUT
;	ENDIF
;ELSE
;	Set rSUBJECT->LOGIN_LOC = ""
;ENDIF
 
;
; Assign remaining fields to the Subject record
;
Set rSUBJECT->TMPT = $TIMEPOINT
;Set rSUBJECT->COLLECT_YN = CNVTINT($COLLECTYN)
 
;
; Adjust time based on offset value entered
;
IF (CNVTINT($OFFSET) != 0)
	Set temp1 = cnvtint(substring(13,2,trim($COLLECTION)))
	Set temp1 = temp1 + cnvtint($OFFSET)
	IF (temp1 < 0)
		Set vnodata = 1
		Set vERROR_MSG = "Value of collection time (>0) invalid due to time offset entered."
		GO TO PRINT_OUTPUT
	ELSEIF (temp1 > 23)
		Set vnodata = 1
		Set vERROR_MSG = "Value of collection time (>23) invalid due to time offset entered."
		GO TO PRINT_OUTPUT
	ELSEIF (temp1 < 10)
		Set temp2 = concat(substring(1,12,trim($COLLECTION)),"0",trim(cnvtstring(temp1)))
		Set temp2 = concat(temp2,substring(15,6,trim($COLLECTION)))
		Set rSUBJECT->COLLECT_DT_TM = temp2
	ELSE
		Set temp2 = concat(substring(1,12,trim($COLLECTION)),trim(cnvtstring(temp1)))
		Set temp2 = concat(temp2,substring(15,6,trim($COLLECTION)))
		Set rSUBJECT->COLLECT_DT_TM = temp2
	ENDIF
ELSE
	Set rSUBJECT->COLLECT_DT_TM = trim($COLLECTION)
ENDIF
 
;
; Error condition if multiple submissions run and Collect Date/Time value is lost
;
Set temp2 = findstring(":00",rSUBJECT->COLLECT_DT_TM,1)
IF (temp2 = 0)
	Set vnodata = 1
	Set vERROR_MSG = "Collection Date/Time missing.  Close the application and try again."
	GO TO PRINT_OUTPUT
ENDIF
 
IF (rSUBJECT->COLLECT_DT_TM = "")
	Set vnodata = 1
	Set vERROR_MSG = "Collection Date/Time missing.  Close the application and try again."
	GO TO PRINT_OUTPUT
ENDIF
 
/***********************************************************************
; Generate output file delimited by a pipe character ("|")
************************************************************************/
 
Set mesgdttm = cnvtstring(cnvtdatetime(curdate, curtime3))
Set vprotocol = trim(rSUBJECT->PROTOCOL_NM)
 
;call echorecord (rSUBJECT)
 
IF(CNVTINT($CONDITION) = 2) ; Submit Orders
SET OUTPUT = concat("cust_interfaces:orm/upload_", vprotocol, "_", mesgdttm,".txt")
; SET OUTPUT = concat("ccluserdir:orm/ormupload_",cnvtlower($OUTDEV),".txt")
; SET OUTPUT = concat("ccluserdir:orm/ormupload_",".txt")
 
Select Into VALUE(OUTPUT)
	UNIQUE_ID = rSUBJECT->DATA[d1.seq].UNIQUE_ID,
	SUBJECT_ID = rSUBJECT->DATA[d1.seq].SUBJECT_ID,
	VISIT_ID = rSUBJECT->DATA[d1.seq].VISIT_ID,
	NAME_LAST = rSUBJECT->DATA[d1.seq].NAME_LAST,
	PERSON_ID = rSUBJECT->DATA[d1.seq].PERSON_ID,
	SEX = rSUBJECT->DATA[d1.seq].SEX,
	SPECIES = rSUBJECT->DATA[d1.seq].SPECIES,
	DOSE_GROUP = rSUBJECT->DATA[d1.seq].ENCNTR_TYPE_CD,
	FACILITY = rSUBJECT->DATA[d1.seq].FACILITY,
	AMBULATORY = rSUBJECT->DATA[d1.seq].AMBULATORY,
	TEST_ORDER = rORDERS->DATA[d2.seq].ORDER_NM,
	TEST_SPEC = rORDERS->DATA[d2.seq].SPECIMEN_TYPE,
	ORDER_ID = rORDERS->DATA[d2.seq].ORDER_ID,
	ATTEND_DOC = rSUBJECT->DATA[d2.seq].ATTEND_DOC
From
	(dummyt d1 with seq = VALUE(rSUBJECT->COUNT)),
	(dummyt d2 with seq = VALUE(rORDERS->COUNT))
Plan d1
Join d2
 
Order by UNIQUE_ID, TEST_SPEC
;
; Message layout
; 1 Protocol Name, 2 Unique ID, 3 Subject ID, 4 Last Name, 5 Facility, 6 Ambulatory,
; 7 Species, 8 Sex, 9 Dose Group, 10 Test, 11 Specimen, 12 Printer, 13 Collect Date/Time,
; 14 Timepoint, 15 Person ID, 16 Order ID, 17 Visit ID, 18 Attending Physician, 19 Collect Y/N, 20 Log-in Locationp
;
DETAIL
	strngHldr = concat(trim(rSUBJECT->PROTOCOL_NM),"|",trim(UNIQUE_ID),"|",trim(SUBJECT_ID),"|")
	strngHldr = concat(strngHldr,trim(NAME_LAST),"|",trim(FACILITY),"|",trim(AMBULATORY),"|")
	strngHldr = concat(strngHldr,trim(SPECIES),"|",trim(SEX),"|",trim(DOSE_GROUP),"|",trim(TEST_ORDER),"|")
	strngHldr = concat(strngHldr,trim(TEST_SPEC),"|",trim(rSUBJECT->PRINTER_NM),"|")
	strngHldr = concat(strngHldr,trim(rSUBJECT->COLLECT_DT_TM),"|",trim(rSUBJECT->TMPT),"|")
	strngHldr = concat(strngHldr,trim(cnvtstring(cnvtint(PERSON_ID))),"|",trim(cnvtstring(cnvtint(ORDER_ID))))
	strngHldr = concat(strngHldr,"|",trim(cnvtupper(VISIT_ID)),"|",trim(ATTEND_DOC))
;	strngHldr = concat(strngHldr,"|",trim(cnvtstring(rSUBJECT->COLLECT_YN)))
;	strngHldr = concat(strngHldr,"|",trim(rSUBJECT->LOGIN_LOC))
	col 0 strngHldr
	row + 1
 
foot report
	call echo(strngHldr)
 
WITH format = variable, noheading, formfeed=none, maxrow=1, maxcol=32000, nullreport
 
ENDIF
 
 call echorecord (rSUBJECT)
#PRINT_OUTPUT
/***********************************************************************
; Generate report to screen
************************************************************************/
EXECUTE ReportRTL
%i cust_script:pfiz_batch_orders_v5_0.dvl
 
CALL InitializeReport(0)
SET _fEndDetail = RptReport->m_pageHeight - RptReport->m_marginBottom
SET	cPRINT_DATE = FORMAT(CNVTDATETIME(CURDATE, CURTIME3),"DD-MMM-YYYY HH:MM;;Q")
SET ORDER_CNT = rORDERS->COUNT
SET SUBJECT_CNT = rSUBJECT->COUNT
 
IF (SUBJECT_CNT > ORDER_CNT)
	SET REPORT_CNT = SUBJECT_CNT
ELSE
	SET REPORT_CNT = ORDER_CNT
ENDIF
 
IF (vnodata = 0)
	Select Into "NL:"
		UNIQUE_ID = rSUBJECT->DATA[d1.seq].UNIQUE_ID,
		SUBJECT_ID = rSUBJECT->DATA[d1.seq].SUBJECT_ID
	From
		(dummyt d1 with seq = VALUE(rSUBJECT->COUNT))
	Order by rSUBJECT->DATA[d1.seq].INDEX, rSUBJECT->DATA[d1.seq].SUBJECT_ID
 
	HEAD REPORT
		X = HeadReportSection(Rpt_Render)
	HEAD PAGE
  		if(curpage > 1)
    		X = PageBreak(0)
    		X = HeadPageSection(Rpt_Render)
  		endif
	DETAIL
  		if(_YOffset + DetailSection(Rpt_CalcHeight) > 8)
    		Break
  		endif
  		X = DetailSection(Rpt_Render)
	FOOT PAGE
  		X = FootPageSection(Rpt_Render)
	FOOT REPORT
  		X = 0
 
	WITH nocounter, dio= postscript, separator= " ", format, nullreport
 
	Select Into "NL:"
		ORDER_NM = rORDERS->DATA[d1.seq].ORDER_NM
	From
		(dummyt d1 with seq = VALUE(rORDERS->COUNT))
	Order by ORDER_NM
	HEAD REPORT
		Call PageBreak(0)
		X = OrderHeadSection(0)
	DETAIL
		X = OrderSection(0)
	FOOT PAGE
  		X = FootPageSection(Rpt_Render)
	FOOT REPORT
  		X = FootReportSection(Rpt_Render)
	WITH COUNTER
ELSE
	SET X = HeadReportSection(Rpt_Render)
	SET X = NoDataSection(Rpt_Render)
	SET X = FootReportSection(Rpt_Render)
ENDIF
 
SET X = FinalizeReport($OUTDEV)
 
end
go
 
