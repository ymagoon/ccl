/*******************************************************************
Report Name: Inbox Results > 14 days old
Report Path: /mayo/mhprd/prg/1_MHS_resultsinbox_facility.prg
Report Description: Displays results for a specific site that
				have been in the inbox for greater than X days.
 
Created by:  Lisa Sword
Created date:  07/2009
 
Modified by:	Lisa Sword
Modified date:  01/2010, 02/2010
Modifications:	updated CEA.UPDT_DT_TM qualifier, CAB13681, CAB 13382
 				Added provider userid. Increased timeout to 15 minutes
				Include providers, active, no end effective, and have userid
				added prompt for results last updated # days ago
				03/2010 changed display from clinical event update_date to
				CEA update date.
				03/2010 removed order table qualification, added clinical
				event qualifications, to accomodate for results with no orders.
				4/2010 added qualification to exclude contrib system of
				powerchart. Ex; Results that are attached to
				med orders are not displayed on report (naloxone has required
				field of a resp rate, resp rate was showing in box, but with
				naloxone result name).
 
Mod001 by:		Rob Banks
Modified date:	10/25/2011
Modifications:	Modify to use DB2
 
Modified by:	Phil Landry Akcia
Modified date:	2/27/2013
Modifications:	Change mod for DB2 to lookup password in registry
Mod number:     003
 
*******************************************************************/
drop program 1_MHS_resultsinbox_facility go
create program 1_MHS_resultsinbox_facility
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Facility Group" = ""
	, "days" = 0
 
with OUTDEV, facility_grp, days
 
;;/*** START 001 ***/
;;;*********************************************************************
;;;*** If PROD / CERT then run as 2nd oracle instance to improve
;;;*** efficiency. Will auto Fail-over to Instance 1 if Instance 2 down.
;;;*********************************************************************
;;IF(CURDOMAIN = "PROD")
;;  FREE DEFINE oraclesystem
;;  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
;;ELSEIF(CURDOMAIN = "MHPRD")
;;  FREE DEFINE oraclesystem
;;  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
;;ELSEIF(CURDOMAIN="MHCRT")
;;  FREE DEFINE oraclesystem
;;  DEFINE oraclesystem 'v500/java4t2@mhcrtrpt'
;;ENDIF ;CURDOMAIN
;;;*** Write instance ccl ran in to the log file
;;;SET Iname = fillstring(10," ")
;;;SELECT INTO value("mayo_logfiles:mayo_instance2.log")
;;;  run_date = format(sysdate,";;q")
;;; ,Iname = substring(1,7,instance_name)
;;;FROM v$instance
;;;DETAIL
;;;  col  1 run_date
;;;  col +1 curprog
;;;  col +1 " *Instance="
;;;  col +1 Iname
;;;with nocounter
;;;   , format
;;;****************** End of INSTANCE 2 routine ************************
;;/*** END 001 ***/
 
/*** Start 003 - New Code ****/
;****************** Begin ORACLE INSTANCE 2 routine ****************
;*** If PROD / CERT then run as 2nd oracle instance to improve
;***   efficiency. Will auto Fail-over to Instance 1 if Instance 2 down.
;***   Then after at the end, set the program back to instance 1.
;******************************************************************************
 
;*** This section calls an O/S scritp that reads the current v500 password
;***   from the Millennium registry and stores it in a file named
;***   $CCLUSERDIR/dbinfo.dat
declare dcl_command = vc
declare dcl_size = i4
declare dcl_stat = i4
 
set dcl_command = "/mayo/procs/req_query.ksh"
set dcl_size = size(dcl_command)
set dcl_stat = 0
 
call dcl(dcl_command,dcl_size,dcl_stat)
 
;*** Next the password is read from the dbinfo.dat file to variable 'pass'.
FREE DEFINE RTL
DEFINE RTL IS "dbinfo.dat"
 
declare pass=vc
 
SELECT DISTINCT INTO "NL:"
  line = substring(1,30,R.LINE)   ; 9,9       10,9
FROM RTLT R
PLAN R
 
detail
 
if (line = "dbpw*")
  pass_in=substring(9,15,line)
  pass=trim(pass_in,3)
endif
 
with counter
 
;*** Now we are finished with the dbinfo.dat file and will delete it.
set dcl_command = ""
set dcl_command = "rm $CCLUSERDIR/dbinfo.dat"
set dcl_size = size(dcl_command)
set dcl_stat = 0
 
call dcl(dcl_command,dcl_size,dcl_stat)
 
declare system=vc
 
;*** This section redifines the OracleSystem variable pointing it to
;***   database instance 2 using the password read in above.
;*** This only applies to PRD and CRT, because they are the only domains
;***   that have multiple instance databases.
IF (curdomain = "MHPRD")
  Free define oraclesystem
  set system=build(concat('v500/', pass, '@mhprdrpt'))
  DEFINE oraclesystem system
ELSEIF (CURDOMAIN="MHCRT")
    FREE DEFINE oraclesystem
    set system=build(concat('v500/', pass, '@mhcrtrpt'))
    DEFINE oraclesystem system
ENDIF
/*** END 003 - New Code ***/
 
SET MaxSecs = 900
;pel SET  FROM_DATE =  CNVTDATETIME (CURDATE- 100 ,0)
SET  FROM_DATE =  CNVTDATETIME (CURDATE- 150 ,0) ; pel extened it out so it would run im mk1
SET  TO_DATE   =  CNVTDATETIME (CURDATE- ($days) ,0)
 
/* facility logic start */
record facilities
( 1 qual[*]
	2 facility_cd = f8
)
 
select into "nl:"
cv.* from code_value cv
plan cv where cv.code_set = 220 and cv.cdf_meaning = "FACILITY"
and cv.display_key = value(concat(trim($facility_grp,3),"*"))
 
head report
	f_cnt = 0
detail
	f_cnt = f_cnt + 1
	stat = alterlist(facilities->qual,f_cnt)
	facilities->qual[f_cnt].facility_cd = cv.code_value
 
with nocounter
declare num = i2
/* facility logic end */
 
SELECT DISTINCT INTO $OUTDEV
	DEPARTMENT = PA.ALIAS
	, PROVIDER = PE.NAME_FULL_FORMATTED
	, PATIENT = P.NAME_FULL_FORMATTED
	, RESULT = IF (C.CATALOG_CD = null AND C.EVENT_TITLE_TEXT = null) UAR_GET_CODE_DISPLAY(C.EVENT_CD)
		ELSEIF (C.CATALOG_CD = null and C.EVENT_CD = null) C.EVENT_TITLE_TEXT
		ELSEIF (C.CATALOG_CD = null) C.EVENT_TITLE_TEXT
		ELSEIF (C.EVENT_CD = 2700657) "FiO2"
		ELSE UAR_GET_CODE_DISPLAY(C.CATALOG_CD)
		ENDIF
	, ENCOUNTER_TYPE = UAR_GET_CODE_DISPLAY(E.ENCNTR_TYPE_CD)
	, RESULT_DATE = C.EVENT_END_DT_TM "@SHORTDATETIMENOSEC"
	, INBOX_UPDATE_DATE = CEA.UPDT_DT_TM "@SHORTDATETIMENOSEC"
	, FIN = EA.ALIAS
	, PE.USERNAME
;	, C_CONTRIBUTOR_SYSTEM_DISP = UAR_GET_CODE_DISPLAY(C.CONTRIBUTOR_SYSTEM_CD)
;	, C_ENTRY_MODE_DISP = UAR_GET_CODE_DISPLAY(C.ENTRY_MODE_CD)
;	, C.EVENT_ID			;used for testing
;	, C.ORDER_ID
;	, C.ENCNTR_ID
 
FROM
	CLINICAL_EVENT   C
	, PERSON   P
	, PRSNL   PE
	, ENCOUNTER   E
	, CE_EVENT_ACTION   CEA
;	, ORDERS   O
	, ENCNTR_ALIAS   EA
	, V500_EVENT_CODE   V
	, V500_EVENT_SET_EXPLODE   VE
	, PRSNL_ALIAS   PA
	, DUMMYT   D1
	, DUMMYT   D2
;	, DUMMYT   D3
 
PLAN  CEA 												;records on CEA display in inbox
WHERE CEA.ACTION_TYPE_CD =     103.00 					;order
	AND (CEA.UPDT_DT_TM>= CNVTDATETIME ( FROM_DATE ))	; results updated more then 40 days in the past
	AND (CEA.UPDT_DT_TM<= CNVTDATETIME ( TO_DATE ))		; results updated X days ago or more
 
JOIN C WHERE CEA.EVENT_ID = C.EVENT_ID
 AND C.RECORD_STATUS_CD =  188.00							;Active
 AND C.VALID_UNTIL_DT_TM > CNVTDATETIME(CNVTDATE( 12312099 ), 0)	;pulls only the last valid row
 AND C.VIEW_LEVEL > 0										;viewable only
 AND C.PUBLISH_FLAG > 0										;published only
 AND C.EVENT_CLASS_CD not in (232,228)						;not meds or immunizations
 AND C.EVENT_CD not in (39931306,2700541,26150140,4506876)
				 ;not meds that show as event class NUM,not powerchart result for FIO2,
 AND C.CONTRIBUTOR_SYSTEM_CD != 469							;powerchart
 
JOIN V WHERE V.EVENT_CD = C.EVENT_CD
JOIN VE WHERE V.EVENT_CD = VE.EVENT_CD						;event_cds not connected to parents
															;are not on the VE table, they do not display in the inbox
JOIN E  WHERE E.encntr_id = C.encntr_id
  /* facility logic start */
  and (expand(num, 1, size(facilities->qual,5), e.loc_facility_cd,
  facilities->qual[num].facility_cd))
  /* facility logic end */
 
;JOIN D3
;JOIN  O WHERE OUTERJOIN (C.ORDER_ID) = O.ORDER_ID
;	AND O.ACTIVITY_TYPE_CD !=705									;not pharmacy orders
 
JOIN PE WHERE PE.PERSON_ID = CEA.ACTION_PRSNL_ID
	and PE.ACTIVE_IND = 1
	and PE.END_EFFECTIVE_DT_TM > CNVTDATETIME(CNVTDATE( 12302100 ), 0)
	and PE.USERNAME   > " "
JOIN P  WHERE P.PERSON_ID = C.PERSON_ID
 
JOIN D2
JOIN EA WHERE EA.ENCNTR_ID = E.ENCNTR_ID         AND EA.ENCNTR_ALIAS_TYPE_CD = 1077     ;FIN attached to EA
 
JOIN D1
JOIN PA WHERE OUTERJOIN (PE.PERSON_ID) = PA.PERSON_ID         and PA.ALIAS_POOL_CD = 75153977
 
ORDER BY
	DEPARTMENT
	, PROVIDER
	, PATIENT
	, RESULT_DATE
	, RESULT
	, 0
 
WITH TIME = VALUE( MaxSecs ), FORMAT, SKIPREPORT = 1, Separator = " ",
OUTERJOIN = D1, DONTCARE = PA,OUTERJOIN = D2, DONTCARE = EA   ;,
;OUTERJOIN = D3, DONTCARE = O
 
;;/*** START 001 ***/
;;;*** After report put back to instance 1
;;IF(CURDOMAIN = "PROD")
;;  FREE DEFINE oraclesystem
;;  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
;;ELSEIF(CURDOMAIN = "MHPRD")
;;  FREE DEFINE oraclesystem
;;  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
;;ELSEIF(CURDOMAIN="MHCRT")
;;  FREE DEFINE oraclesystem
;;  DEFINE oraclesystem 'v500/java4t2@mhcrt1'
;;ENDIF ;CURDOMAIN
;;/*** END 001 ***/
 
/****Start 003 - New Code ***/
;*** Restore the OracleSystem variable to its normal definition pointing
;***   to instance 1.
IF (curdomain = "MHPRD")
  Free define oraclesystem
  set system=build(concat('v500/', pass, '@mhprd1'))
  DEFINE oraclesystem system
 
ELSEIF (CURDOMAIN="MHCRT")
    FREE DEFINE oraclesystem
    set system=build(concat('v500/', pass, '@mhcrt1'))
    DEFINE oraclesystem system
 
ENDIF
 
/***END 003 - New Code ***/
 
END
GO
