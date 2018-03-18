/*******************************************************************
 
Report Name:  Pneumovax Orders
Report Path:  /mayo/mhspd/prg/1_lm_eth_pneumococcal23.prg
Report Description:  Prints to LH pharmacy.  Displays yesterdays
						pneumococcal 23-valent vaccine and influenza virus
						vaccine, inactivated orders that are still in an ordered status.
 
Created by:  Eric Hendrickson
Created date:  09/2006
 
Modified by:   Mary Wiersgalla (LM)
Modified date: 06/2009
Modifications: Added facility logic
 
Modified by:    Mary Wiersgalla (LM)
Modified date:  11/02/2009
Modifications:  Limited to just Inpatients and non-Discharged patients  (CAB 10253)
 
Mod001:			Rob Banks
Modified Date:	10/21/2011
Modifications:	Modify to use DB2
 
Mod002:			Phil Landry
Modified Date:	07/05/2012
Modifications:	Modified to use more efficient indexes
 
Modified by:	Phil Landry Akcia
Modified date:	2/27/2013
Modifications:	Change mod for DB2 to lookup password in registry
Mod number:     003
 
*******************************************************************/
drop program 2_lm_eth_pneumococcal23_v2 go
create program 2_lm_eth_pneumococcal23_v2
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Facility Group" = ""
 
with OUTDEV, facility_grp
 
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
 
SET MaxSecs = 300
 
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
 
SELECT INTO $OUTDEV
	START_DT_TM = concat( format(O.CURRENT_START_DT_TM,'mm/dd/yy;;d'), " ",  format(O.CURRENT_START_DT_TM,'hh:mm;;m')),
	NAME = (P.NAME_FULL_FORMATTED),
	FACILITY = UAR_GET_CODE_DISPLAY( E.LOC_FACILITY_CD ),
	DEPT = UAR_GET_CODE_DISPLAY( E.LOC_NURSE_UNIT_CD ),
	ROOM = UAR_GET_CODE_DISPLAY( E.LOC_ROOM_CD ),
	STATUS = UAR_GET_CODE_DISPLAY( O.ORDER_STATUS_CD ),
	FIN = (EA.ALIAS),
	ORDER_NAME = (O.ORDER_MNEMONIC)
 
FROM
	ORDERS  O,
	PERSON  P,
	ENCOUNTER  E,
	ENCNTR_ALIAS  EA
 
;002 moved order select to top to allow report to drive off of orders
plan o
  where o.catalog_cd in (4760781,2760930)
	  AND O.ORDER_STATUS_CD = 2550  ; ORDERED
	  and o.catalog_type_cd =         2516.00 ;002 added catalog_type_cd
;	  and o.need_rx_verify_ind = 0
	  and o.activity_type_cd = 705             ;002 added activity_type_cd
	  and o.current_start_dt_tm between cnvtdatetime(curdate-1,0) and  cnvtdatetime(curdate-1,235959)
	  AND O.ACTIVE_IND = 1
 
 
;002 plan e
join e
 where e.encntr_status_cd+0 != 856		;discharged
 and e.encntr_type_cd =      309308.00   ;inpatients
 and e.encntr_id = o.encntr_id
  /* facility logic start */
 and (expand(num, 1, size(facilities->qual,5), e.loc_facility_cd,
 facilities->qual[num].facility_cd))
  /* facility logic end */
 
;002 Moved order to top
;;;join O where o.encntr_id = e.encntr_id
;;;; 4760781 = pneumococcal 23-valent vaccine
;;;and (O.CATALOG_CD = 4760781
;;;; 2760930 = influenza virus vaccine, inactivated
;;;  OR O.CATALOG_CD = 2760930)
;;;  AND O.ACTIVE_IND = 1
;;;  AND format(O.CURRENT_START_DT_TM,'mm/dd/yy;;d') = format(curdate-1,'mm/dd/yy;;d')
;;;  ; 2550 = ordered
;;;  AND O.ORDER_STATUS_CD = 2550
  JOIN P
  WHERE O.PERSON_ID = P.PERSON_ID
 
  JOIN EA
  WHERE O.ENCNTR_ID = EA.ENCNTR_ID
  AND EA.ACTIVE_IND = 1
  ; 1077 = FIN NBR
  AND ea.encntr_alias_type_cd = 1077
 
ORDER BY	FACILITY,
	DEPT
 
Head Report
	m_NumLines = 0
%I cclsource:vccl_diortf.inc
	y_pos = 18
 
	PrintPSHeader = 0
	COL 0, "{PS/792 0 translate 90 rotate/}"
	ROW + 1
SUBROUTINE OFFSET( yVal )
	CALL PRINT( FORMAT( y_pos + yVal, "###" ))
END
 
Head Page
	y_pos = 36
 
	IF ( PrintPSHeader )
		COL 0, "{PS/792 0 translate 90 rotate/}"
		ROW + 1
	ENDIF
	PrintPSHeader = 1
	ROW + 1, "{F/1}{CPI/11}"
	CALL PRINT(CALCPOS(335,y_pos+0)) "Pneumovax and Influenza Orders"
	ROW + 1
	ROW + 1, "{F/0}{CPI/16}"
	CALL PRINT(CALCPOS(241,y_pos+18)) "*This report pulls yesterdays orders that are still in an ordered status*"
	ROW + 1
	y_pos = y_pos + 39
 
Head FACILITY
	if (( y_pos + 77) >= 612 ) y_pos = 0,  break endif
	ROW + 1, "{F/1}{CPI/13}"
	CALL PRINT(CALCPOS(20,y_pos+0)) FACILITY
	ROW + 1
	y_pos = y_pos + 23
 
Head DEPT
	if (( y_pos + 150) >= 612 ) y_pos = 0,  break endif
	ROW + 1, "{F/1}{CPI/14}"
	CALL PRINT(CALCPOS(20,y_pos+0)) DEPT
	ROW + 1, "{F/0}"
	CALL PRINT(CALCPOS(20,y_pos+16)) "{U}Room{ENDU}"
	CALL PRINT(CALCPOS(54,y_pos+16)) "{U}Patient Name{ENDU}"
	CALL PRINT(CALCPOS(276,y_pos+16)) "{U}FIN#{ENDU}"
	CALL PRINT(CALCPOS(342,y_pos+16)) "{U}Order Date/Time{ENDU}"
	CALL PRINT(CALCPOS(432,y_pos+16)) "{U}Order Name{ENDU}"
	CALL PRINT(CALCPOS(648,y_pos+16)) "{U}Status{ENDU}"
	ROW + 1
	y_pos = y_pos + 27
 
Detail
	if (( y_pos + 97) >= 612 ) y_pos = 0,  break endif
	ROOM1 = SUBSTRING( 1, 6, ROOM ),
 
	STATUS1 = SUBSTRING( 1, 10, STATUS ),
	ROW + 1, "{F/0}{CPI/14}"
	CALL PRINT(CALCPOS(20,y_pos+0)) ROOM1
	ROW + 1, CALL PRINT(CALCPOS(55,y_pos+0))  NAME
	ROW + 1, CALL PRINT(CALCPOS(275,y_pos+0))  FIN
	ROW + 1, CALL PRINT(CALCPOS(342,y_pos+0))  START_DT_TM
	ROW + 1, CALL PRINT(CALCPOS(432,y_pos+0))  ORDER_NAME
	ROW + 1, CALL PRINT(CALCPOS(648,y_pos+0)) STATUS1
	y_pos = y_pos + 13
 
Foot DEPT
	y_pos = y_pos + 24
 
Foot FACILITY
	if (( y_pos + 67) >= 612 ) y_pos = 0,  break endif
 
	ROW + 1	y_val= 792-y_pos-10
	^{PS/newpath 2 setlinewidth   34 ^, y_val, ^ moveto  757 ^, y_val, ^ lineto stroke 34 ^, y_val, ^ moveto/}^
	y_pos = y_pos + 13
 
Foot Page
	y_pos = 546
	ROW + 1, "{F/0}{CPI/14}"
	ROW + 1, CALL PRINT(CALCPOS(348,y_pos+0)) curpage
	ROW + 1, CALL PRINT(CALCPOS(360,y_pos+0)) "Page:"
 
WITH MAXCOL = 300, MAXROW = 500 , LANDSCAPE, DIO= 08, NOHEADING, FORMAT= VARIABLE, TIME= VALUE( MaxSecs )
 
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
 
end
go
