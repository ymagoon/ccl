/*******************************************************************
 
Report Name:  Northland TDM
Report Path:  /mayo/mhspd/prg/1_lm_eth_barron_tdm.prg
Report Description:  Prints to Barron pharmacy.  Displays patients with TDM/WARF/etc.
 
Created by:  Eric Hendrickson
Created date:  11/2005
 
Modified by:  Akcia - SE
Modified date:  04/25/12
Modifications:  updates for efficiency
Modification num:  001
 
Modified by:
Modified date:
Modifications:
 
*******************************************************************/
 
 
drop program 1_lm_eth_barron_tdm go
create program 1_lm_eth_barron_tdm
 
prompt
	"Output to File/Printer/MINE" = "MINE"
 
with OUTDEV
 
/*** START 001 ***/
;*********************************************************************
;*** If PROD / CERT then run as 2nd oracle instance to improve
;*** efficiency. Will auto Fail-over to Instance 1 if Instance 2 down.
;*********************************************************************
IF(CURDOMAIN = "PROD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
ELSEIF(CURDOMAIN = "MHPRD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
ELSEIF(CURDOMAIN="MHCRT")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/java4t2@mhcrtrpt'
ENDIF ;CURDOMAIN
;*** Write instance ccl ran in to the log file
;SET Iname = fillstring(10," ")
;SELECT INTO value("mayo_logfiles:mayo_instance2.log")
;  run_date = format(sysdate,";;q")
; ,Iname = substring(1,7,instance_name)
;FROM v$instance
;DETAIL
;  col  1 run_date
;  col +1 curprog
;  col +1 " *Instance="
;  col +1 Iname
;with nocounter
;   , format
;****************** End of INSTANCE 2 routine ************************
/*** END 001 ***/
 
;SET MaxSecs = 1200
 
SELECT INTO $OUTDEV
	E_LOC_NURSE_UNIT_DISP = UAR_GET_CODE_DISPLAY( E.LOC_NURSE_UNIT_CD ),
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
   nurse_unit nu     		;001
   ,encntr_domain ed,			;001
	ORDERS  O,
	PERSON  P,
	ENCOUNTER  E,
	ENCNTR_ALIAS  EA,
	ORDER_DETAIL OD
 
/*002 start*/
plan nu
where nu.loc_facility_cd = 3196527
; 3196527 = EU Northland Hospital
  and nu.active_ind = 1
 
join ed
where ed.loc_nurse_unit_cd = nu.location_cd
  and ed.end_effective_dt_tm+0 > sysdate
  and ed.active_ind = 1
 
join o
where o.encntr_id = ed.encntr_id
 
;PLAN O
/*002 end*/
; 7264768 = TDM, 7264775 = WARF, 7264790 = WARF, 2921326 = Amikacin, 2921532 = Gentamicin,
; 2921796 = Tobramycin, 2921843 = Vancomycin, 2748946 = Amikacin, 2758928 = Gentamicin,
; 2770186 = Tobramycin, 2770944 = Vancomycin, 2771189 = WARF, 281181565 = Dabigatran
; 2762196 = Linezolid
;001  WHERE O.CATALOG_CD in ( 7264768, 7264775, 7264790, 2921326, 2921532,
and O.CATALOG_CD+0 in ( 7264768, 7264775, 7264790, 2921326, 2921532,2921796, 2921843, 2748946,
						2758928, 2770186, 2770944, 2771189, 281181565, 2762196)
  ; 2550 = Ordered
  AND O.ORDER_STATUS_CD+0 = 2550
  AND O.ACTIVE_IND = 1
JOIN E
WHERE O.ENCNTR_ID = E.ENCNTR_ID
  ; 3196527 = EU Northland Hospital
  ;AND E.loc_facility_cd = 3196527
  AND E.DISCH_DT_TM = null
JOIN P
WHERE O.PERSON_ID = P.PERSON_ID
 
JOIN EA
WHERE O.ENCNTR_ID = EA.ENCNTR_ID
   ; 683992 = FIN
  AND EA.ALIAS_POOL_CD = 683992
  and ea.end_effective_dt_tm > sysdate   ;001
  AND EA.ACTIVE_IND = 1
JOIN OD
WHERE OUTERJOIN(O.ORDER_ID) = OD.ORDER_ID
  AND OD.OE_FIELD_MEANING = outerjoin("FREETXTDOSE")
  AND OD.ACTION_SEQUENCE = OUTERJOIN(o.last_action_sequence)
 
ORDER BY	E_LOC_NURSE_UNIT_DISP,
	O.CATALOG_CD,
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
	HEADER = "TDM / WARF / Amikacin / Gentamicin / Tobramycin / Vancomycin / Dabigatran / Linezolid - Pharmacist"
	CALL PRINT(CALCPOS(20,y_pos+0)) HEADER
	ROW + 1, "{F/1}{CPI/14}"
	CALL PRINT(CALCPOS(270,y_pos+12)) curdate
	y_pos = y_pos + 25
 
Head E_LOC_NURSE_UNIT_DISP
	ROW + 1, "{F/1}{CPI/14}"
	CALL PRINT(CALCPOS(20,y_pos+0)) E_LOC_NURSE_UNIT_DISP
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
	FOOTER = "End TDM / WARF / Amikacin / Gentamicin / Tobramycin / Vancomycin / Dabigatran / Linezolid - Pharmacist"
	CALL PRINT(CALCPOS(20,y_pos+0)) FOOTER
 
WITH MAXCOL = 300, MAXROW = 500 , DIO= 08, NOHEADING, FORMAT= VARIABLE ;, TIME= VALUE( MaxSecs )
 
 /*** START 001 ***/
;*** After report put back to instance 1
IF(CURDOMAIN = "PROD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
ELSEIF(CURDOMAIN = "MHPRD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
ELSEIF(CURDOMAIN="MHCRT")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/java4t2@mhcrt1'
ENDIF ;CURDOMAIN
/*** END 001 ***/
END
GO
 
