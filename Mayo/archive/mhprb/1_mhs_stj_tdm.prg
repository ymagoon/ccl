/***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000 00/00/00 Unknown              Unknown                            *
 *001 11/29/11 Rob Banks            Modify to use DB2                  *
 *002 02/28/13 Akcia                Change mod 001 to lookup password in registry
 ******************** End of Modification Log **************************/
DROP PROGRAM 1_mhs_stj_tdm GO
CREATE PROGRAM 1_mhs_stj_tdm
 
PROMPT	"Output to File/Printer/MINE" = MINE
WITH   OUTDEV
 
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
 
/*** Start 002 - New Code ****/
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
/*** END 002 - New Code ***/
 
SET MaxSecs = 2000
 
SELECT INTO $OUTDEV
	E_LOC_NURSE_UNIT_DISP = UAR_GET_CODE_DISPLAY( E.LOC_NURSE_UNIT_CD ),
	E_LOC_FACILITY_DISP = UAR_GET_CODE_DISPLAY( E.LOC_FACILITY_CD ),
	P.NAME_FULL_FORMATTED,
	E_LOC_ROOM_DISP = UAR_GET_CODE_DISPLAY( E.LOC_ROOM_CD ),
	O.ORDER_ID,
	O_ORDER_STATUS_DISP = UAR_GET_CODE_DISPLAY( O.ORDER_STATUS_CD ),
	O_CATALOG_DISP = UAR_GET_CODE_DISPLAY( O.CATALOG_CD ),
	EA.ALIAS,
	OD.OE_FIELD_MEANING,
	OD.OE_FIELD_DISPLAY_VALUE,
	OD.ACTION_SEQUENCE
 
FROM
	ORDERS  O,
	PERSON  P,
	ENCOUNTER  E,
	ENCNTR_ALIAS  EA,
	ORDER_DETAIL OD,
	DM_FLAGS  D
 
PLAN O
; 7264768 = TDM, 7264775 = WARF, 7264790 = WARF, 2921326 = Amikacin, 2921532 = Gentamicin,
; 2921796 = Tobramycin, 2921843 = Vancomycin, 2748946 = Amikacin, 2758928 = Gentamicin,
; 2770186 = Tobramycin, 2770944 = Vancomycin, 2771189 = WARF, 281181565 = Dabigatran
WHERE O.CATALOG_CD in (7264768, 7264775, 7264790, 2921326, 2921532,
2921796, 2921843, 2748946, 2758928, 2770186, 2770944, 2771189, 281181565)
  ; 2550 = Ordered
  AND O.ORDER_STATUS_CD = 2550
  AND O.ACTIVE_IND = 1
JOIN P
WHERE O.PERSON_ID = P.PERSON_ID
JOIN E
WHERE O.ENCNTR_ID = E.ENCNTR_ID
  AND E.loc_facility_cd in (115041500); 115106031 = St. James Hospital
  AND E.loc_nurse_unit_cd  in (115105857, 115106031);  11510585 = med/surg  115106031 = nursery
  AND E.DISCH_DT_TM = null
JOIN EA
WHERE O.ENCNTR_ID = EA.ENCNTR_ID
  AND EA.encntr_alias_type_cd = 1077
  AND EA.ACTIVE_IND = 1
JOIN OD
WHERE OUTERJOIN(O.ORDER_ID) = OD.ORDER_ID
  AND OD.OE_FIELD_MEANING = outerjoin("FREETXTDOSE")
  AND OD.ACTION_SEQUENCE = OUTERJOIN(o.last_action_sequence)
JOIN D
WHERE D.TABLE_NAME = "ORDERS"
  AND D.COLUMN_NAME = "ORIG_ORD_AS_FLAG"
  AND O.ORIG_ORD_AS_FLAG = D.FLAG_VALUE
  AND D.definition = "Normal Order"
 
ORDER BY
	E_LOC_FACILITY_DISP,
	E_LOC_NURSE_UNIT_DISP,
	P.NAME_FULL_FORMATTED
 
 
Head Report
	m_NumLines = 0
%I cclsource:vccl_diortf.inc
	y_pos = 18
SUBROUTINE OFFSET( yVal )
	CALL PRINT( FORMAT( y_pos + yVal, "###" ))
END
 
Head Page
	y_pos = 36
	ROW + 1, "{F/5}{CPI/11}"
	CALL PRINT(CALCPOS(125,y_pos+0)) "TDM / WARF / Amikacin / Gentamicin / Tobramycin / Vancomycin / Dabigatran - Pharmacist"
	ROW + 1, "{F/1}{CPI/14}"
	CALL PRINT(CALCPOS(270,y_pos+12)) curdate
	y_pos = y_pos + 25
 
Head E_LOC_NURSE_UNIT_DISP
	ROW + 1, "{F/1}{CPI/14}"
	CALL PRINT(CALCPOS(20,y_pos+0)) E_LOC_FACILITY_DISP
	ROW + 1
	CALL PRINT(CALCPOS(20, y_pos+10))E_LOC_NURSE_UNIT_DISP
	ROW + 1
	CALL PRINT(CALCPOS(36,y_pos+24)) "Name"
	CALL PRINT(CALCPOS(216,y_pos+23)) "FIN Number"
	CALL PRINT(CALCPOS(288,y_pos+23)) "Person Room"
	CALL PRINT(CALCPOS(360,y_pos+23)) "Catalog Desc"
	ROW + 1
	y_pos = y_pos + 47
 
Head P.NAME_FULL_FORMATTED
	ROW + 1, "{F/0}{CPI/14}"
	CALL cclrtf_print( 0, 36, 0, 30, P.NAME_FULL_FORMATTED, 100, 1 )
 
	y_pos = y_pos + (m_NumLines * 12)
 
	ROW + 1
 
Detail
	if (( y_pos + 67) >= 792 ) y_pos = 0,  break endif
	ALIAS1 = SUBSTRING( 1, 10, EA.ALIAS ),
	E_LOC_ROOM_DISP1 = SUBSTRING( 1, 6, E_LOC_ROOM_DISP ),
	ROW + 1, "{F/0}{CPI/14}"
	CALL PRINT(CALCPOS(72,y_pos+0)) O.ORDER_ID
	CALL PRINT(CALCPOS(216,y_pos+0)) ALIAS1
	CALL PRINT(CALCPOS(288,y_pos+0)) E_LOC_ROOM_DISP1
	CALL PRINT(CALCPOS(361,y_pos+0)) O_CATALOG_DISP
	ROW + 1
	CALL PRINT(CALCPOS(88,y_pos+8))	OD.OE_FIELD_DISPLAY_VALUE
	y_pos = y_pos + 25
 
Foot P.NAME_FULL_FORMATTED
	y_pos = y_pos + 0
 
Foot E_LOC_NURSE_UNIT_DISP
	BREAK
 
Foot Report
	if (( y_pos + 64) >= 792 ) y_pos = 0 break
	else y_pos = y_pos + 36 endif
	ROW + 1, "{F/5}{CPI/11}"
	CALL PRINT(CALCPOS(130,y_pos+0)) "End TDM / WARF / Amikacin / Gentamicin / Tobramycin / Vancomycin / Dabigatran - Pharmacist"
 
WITH MAXCOL = 300, MAXROW = 500 , DIO= 08, NOHEADING, FORMAT= VARIABLE, TIME= MaxSecs
; m058077 06/08/2011, CAB 30254 - increased MaxSecs to 2000
 
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
 
/****Start 002 - New Code ***/
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
 
/***END 002 - New Code ***/
 
END
GO
