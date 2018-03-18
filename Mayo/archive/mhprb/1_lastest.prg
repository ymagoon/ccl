/*******************************************************************
Report Name: EU Active Orders, Resp Care
Report Path:  /mayo/mhprd/1_lm_rtordersccl2
Report Description: Active RT orders for Luther
 
Created by:  Lisa Sword
Created date:  07/2010
 
Modified by:	L. Sword
Modified date:	03/18/2011
Modifications:	add the first 15 characters of the attending provider name,
				add the first 25 characters of the reason for visit,
				bold the patient name, repeat the patient room number
				 on the far right of the page.
 				04/20/2011
 				updated qualification to find last updated/active attending.
 
Mod001 by:		Rob Banks
Modified date:	10/25/2011
Modifications:	Modify to use DB2
 
Modified By: 	Lisa Sword
Modified date:	02/10/2012
Modifications:	exclude future and unschedule orders. CAB38203
 
Modified By: 	Lisa Sword
Modified date:	09/12/2012
Modifications:	Changes noted in CAB 44424.
 
Modified By: 	Akcia - SE
Modified date:	07/10/2012
Modifications:	efficiency changes for oracle upgrade
Mod number:  104
 
 *105 02/28/13 Akcia                Change mod 001 to lookup password in registry
 
*******************************************************************/
drop program 1_lastest go
create program 1_lastest
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Facilities:" = 0
 
with OUTDEV, facility
 
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
 
/*** Start 105 - New Code ****/
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
/*** END 105 - New Code ***/
 
declare hosp_outpat_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 339, "HOSPITALOUTPATIENT"))  ;101
declare emergency_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 339, "EMERGENCY"))  ;101
declare inpatient_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 339, "INPATIENT"))  ;101
declare observation_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 339, "OBSERVATION"))  ;101
 
SET MaxSecs = 900
 
SELECT  INTO $OUTDEV  ;DISTINCT
 	E_LOC_ROOM_DISP = UAR_GET_CODE_DISPLAY(E.LOC_ROOM_CD)
;104	, P.NAME_FULL_FORMATTED
	, O_CATALOG_DISP = UAR_GET_CODE_DISPLAY(O.CATALOG_CD)
;104	, OD.OE_FIELD_DISPLAY_VALUE
;104	, ODR.OE_FIELD_DISPLAY_VALUE
;104	, ODRDE.OE_FIELD_DISPLAY_VALUE
;104	, ODRDER.OE_FIELD_DISPLAY_VALUE
	, O_ORDER_STATUS_DISP = UAR_GET_CODE_DISPLAY(O.ORDER_STATUS_CD)
;104	, O.ORDER_ID
;104	, O.PERSON_ID
;104	, O.ENCNTR_ID
	, E_LOC_FACILITY_DISP = UAR_GET_CODE_DISPLAY(E.LOC_FACILITY_CD)
	, E_LOC_BUILDING_DISP = UAR_GET_CODE_DISPLAY(E.LOC_BUILDING_CD)
	, E_LOC_NURSE_UNIT_DISP = UAR_GET_CODE_DISPLAY(E.LOC_NURSE_UNIT_CD)
;104	, EN.REASON_FOR_VISIT
;104	, EN.ENCNTR_ID
	, EP_ENCNTR_PRSNL_R_DISP = UAR_GET_CODE_DISPLAY(EP.ENCNTR_PRSNL_R_CD)
;104	, EP.PRSNL_PERSON_ID
;104	, PR.NAME_FULL_FORMATTED
;104	, PRO.NOMENCLATURE_ID
;104	, PRO.PERSON_ID
;104	, PRO.ACTIVE_IND
;104	, PRO.END_EFFECTIVE_DT_TM
;104	, PRO_LIFE_CYCLE_STATUS_DISP = UAR_GET_CODE_DISPLAY(PRO.LIFE_CYCLE_STATUS_CD)
;104	, N.NOMENCLATURE_ID
;104	, PRO.ANNOTATED_DISPLAY
 
FROM
	ORDERS   O
	, PERSON   P
	, ENCNTR_DOMAIN   E
	, DUMMYT   D1
	, ORDER_DETAIL   OD
;104	, DUMMYT   D2
	, ORDER_DETAIL   ODR
	, ORDERS   ORD
;104	, DUMMYT   D7
	, ORDER_DETAIL   ODRDE
;104	, DUMMYT   D4
	, ORDER_DETAIL   ODRDER
	, ENCOUNTER   EN
;104	, DUMMYT   D3
	, ENCNTR_PRSNL_RELTN   EP
	, PRSNL   PR
;104	, DUMMYT   D5
;104	, PROBLEM   PRO
;104	, NOMENCLATURE   N
 
plan e
;014   where e.end_effective_dt_tm  > sysdate
   where e.end_effective_dt_tm  = cnvtdatetime("31-DEC-2100 00:00:00") ;104
   and e.loc_facility_cd = 633867   ;  $facility
   and e.encntr_domain_type_cd =  1139.00   ;Census
    and E.LOC_NURSE_UNIT_CD != 3186712		;EULH Cath Lab
	and E.LOC_NURSE_UNIT_CD != 3186713		;eulh dial-lh
	and E.LOC_NURSE_UNIT_CD != 633869 		;eulh ed
	and E.LOC_NURSE_UNIT_CD != 3186714		;eulh echo
	and E.LOC_NURSE_UNIT_CD != 7981985		;EULH No Location
	and E.LOC_NURSE_UNIT_CD != 3186722		;eulh radiology
	and E.LOC_NURSE_UNIT_CD != 3186727		;eulh surgictr
	and E.LOC_NURSE_UNIT_CD != 17447405		;eulh surgictrtp
 
;	and e.encntr_id in (92937846,92937855)
 
Join EN where EN.ENCNTR_ID = E.ENCNTR_ID
  and en.encntr_type_cd in (hosp_outpat_cd,emergency_cd,inpatient_cd,observation_cd)		;101
 
join o
   where O.ENCNTR_ID = En.ENCNTR_ID
and O.CATALOG_TYPE_CD IN (3422508)       ;RT_Cardiac Rehab_Echo
and O.ORDER_STATUS_CD+0 in (2547,2548,2549,2550,643466,2551) ; modified 02/10/2012 L.Sword
;104 and O.TEMPLATE_ORDER_ID+0 = 0       ; pull only parent orders
and o.template_order_flag in (0,1)			;104
and O.CATALOG_CD !=186728278		;RT O2/NIPPV/Vent Check
and O.CATALOG_CD !=25122889			;RT to Eval and Treat
and O.CATALOG_CD !=3490614 			;Echo orders...
and O.CATALOG_CD !=7467275            and O.CATALOG_CD !=7467277            and O.CATALOG_CD !=9630540
and O.CATALOG_CD !=9630622            and O.CATALOG_CD !=9630729            and O.CATALOG_CD !=9630796
and O.CATALOG_CD !=9630880            and O.CATALOG_CD !=9630931            and O.CATALOG_CD !=9631007
and O.CATALOG_CD !=9631043            and O.CATALOG_CD !=9631076            and O.CATALOG_CD !=9631113
and O.CATALOG_CD !=9631192            and O.CATALOG_CD !=9631270            and O.CATALOG_CD !=9631318
and O.CATALOG_CD !=9631344            and O.CATALOG_CD !=9631437            and O.CATALOG_CD !=9709747
and O.CATALOG_CD !=9709763            and O.CATALOG_CD !=9709778            and O.CATALOG_CD !=9709791
and O.CATALOG_CD !=9709808            and O.CATALOG_CD !=9709821            and O.CATALOG_CD !=9709836
and O.CATALOG_CD !=9709857            and O.CATALOG_CD !=10705789            and O.CATALOG_CD !=10705798
and O.CATALOG_CD !=10913693            and O.CATALOG_CD !=10913754            and O.CATALOG_CD !=15656336
and O.CATALOG_CD !=15656372            and O.CATALOG_CD !=22562529            and O.CATALOG_CD !=29542581
and O.CATALOG_CD !=29542584            and O.CATALOG_CD !=29542587            and O.CATALOG_CD !=39856591
and O.CATALOG_CD !=39856594            and O.CATALOG_CD !=39856597            and O.CATALOG_CD !=39856606
and O.CATALOG_CD !=43348406            and O.CATALOG_CD !=64928522            and O.CATALOG_CD !=64928529
and O.CATALOG_CD !=64928534            and O.CATALOG_CD !=64928539            and O.CATALOG_CD !=64928544
and O.CATALOG_CD !=64928549            and O.CATALOG_CD !=64928554            and O.CATALOG_CD !=76063998
and O.CATALOG_CD !=114139891            and O.CATALOG_CD !=114139900            and O.CATALOG_CD !=114940237
and O.CATALOG_CD !=114940249            and O.CATALOG_CD !=114940260            and O.CATALOG_CD !=114940283
and O.CATALOG_CD !=114940291            and O.CATALOG_CD !=138352862
and O.CATALOG_CD !=3490583	;EKG-CR
and O.CATALOG_CD !=28041938	;New RT Medication Order
 
and O.CATALOG_CD != 3490693.00  ;oxygen day   ; remove additional orders per TDevine 9/2012
and O.CATALOG_CD != 545870807.00  ; clin pulm inf
and O.CATALOG_CD != 545869607.00  ;day inter
and O.CATALOG_CD != 545876057.00  ;weaning elig
and O.CATALOG_CD != 549325970.00  ;weaning
and O.CATALOG_CD != 3490676.00    ;end-tidal CO2
 
 
;and O.CATALOG_CD !=3490693	;Oxygen/Day
;and O.CATALOG_CD !=3490703  ;Pulse Ox RT
 
JOIN P where O.PERSON_ID = P.PERSON_ID
and P.NAME_LAST_KEY != "TESTPATIENT"
 
JOIN ORD WHERE OUTERJOIN (O.ENCNTR_ID) = ORD.ENCNTR_ID
   AND ORD.CATALOG_CD = outerjoin(3512742)       ;Patient isolation order
 
/*104  not needed
;104  JOIN D5
join pro where pro.person_id = outerjoin (e.person_id)
;104	 and PRO.ACTIVE_IND = 1
;104	 and PRO.END_EFFECTIVE_DT_TM > sysdate+1
;104	 and PRO.LIFE_CYCLE_STATUS_CD = 3301
	 and PRO.ACTIVE_IND = outerjoin(1)  					;104
	 and PRO.END_EFFECTIVE_DT_TM > outerjoin(sysdate+1)  	;104
	 and PRO.LIFE_CYCLE_STATUS_CD = outerjoin(3301)			;104
 
 
join N where N.NOMENCLATURE_ID = outerjoin(PRO.NOMENCLATURE_ID)
;104	and N.SOURCE_VOCABULARY_CD =  1231
	and N.SOURCE_VOCABULARY_CD =  outerjoin(1231)				;104
104*/
 
;104JOIN D3																		;2/2011
Join EP  where ep.ENCNTR_ID = outerjoin(en.encntr_id)				;104
	and EP.ENCNTR_PRSNL_R_CD = outerjoin(1119)   ;admitting		;104
	and EP.PRSNL_PERSON_ID != outerjoin(0)		;104
	AND EP.END_EFFECTIVE_DT_TM > outerjoin(sysdate)      			;104 ;pull latest attending provider value
 
/*
JOIN D3																		;2/2011
;104  Join EP  where outerjoin (EN.ENCNTR_ID) = ep.encntr_id
Join EP  where EN.ENCNTR_ID = ep.encntr_id				;104
	and EP.ENCNTR_PRSNL_R_CD = 1119   ;admitting
	and EP.PRSNL_PERSON_ID != 0
	AND EP.END_EFFECTIVE_DT_TM     ;104    IN (SELECT	MAX(END_EFFECTIVE_DT_TM)
    = (SELECT	MAX(epmax.END_EFFECTIVE_DT_TM)					;104
	   		FROM  ENCNTR_PRSNL_RELTN   EPMAX
;104		WHERE EP.ENCNTR_PRSNL_RELTN_ID = EPMAX.ENCNTR_PRSNL_RELTN_ID  ;modified 4/20/2011, las
		WHERE epmax.encntr_id = ep.encntr_id ;104
		and EPMAX.ENCNTR_PRSNL_R_CD = 1119
		and EPMAX.ACTIVE_IND = 1
		and EPMAX.END_EFFECTIVE_DT_TM > CNVTDATETIME(CNVTDATE(12312099), 0))
 */
 
    join pr where outerjoin (EP.PRSNL_PERSON_ID) = PR.PERSON_ID
 
JOIN ODRDE WHERE ODRDE.ORDER_ID = outerjoin(ORD.ORDER_ID)			;104
AND ODRDE.OE_FIELD_MEANING = outerjoin("ISOLATIONCODE")  ; Type of isolation			;104
 
JOIN OD WHERE OD.ORDER_ID = outerjoin(O.ORDER_ID)			;104
AND OD.OE_FIELD_MEANING = outerjoin("FREQ")      ;frequency			;104
 
JOIN ODR WHERE ODR.ORDER_ID = outerjoin(O.ORDER_ID)			;104
AND ODR.OE_FIELD_MEANING = outerjoin("SCH/PRN")    ;PRN			;104
 
join d1			;104
JOIN ODRDER WHERE ODRDER.ORDER_ID = O.ORDER_ID			;104
and (ODRDER.OE_FIELD_MEANING = "SPECINX"    ;special instructions			;104
 OR  ODRDER.OE_FIELD_ID = 3596526.00)     ;enter verbatim order
 
 
 
 
 
 
 
 
 
 
 
;104  JOIN D7
;104  JOIN ODRDE WHERE ODRDE.ORDER_ID = ORD.ORDER_ID
;104  AND ODRDE.OE_FIELD_MEANING = "ISOLATIONCODE"  ; Type of isolation
;104      AND ODRDE.UPDT_DT_TM         ; pull latest isolation value
;104      IN (SELECT	MAX(UPDT_DT_TM) FROM	ORDER_DETAIL   ODRDEMAX
;104  		WHERE ODRDE.ORDER_ID = ODRDEMAX.ORDER_ID
;104  	  AND ODRDEMAX.OE_FIELD_MEANING = "ISOLATIONCODE")
;104  JOIN D1
;104  JOIN OD WHERE OUTERJOIN (O.ORDER_ID) = OD.ORDER_ID
;104  JOIN OD WHERE O.ORDER_ID = OD.ORDER_ID			;104
;104  AND OD.OE_FIELD_MEANING = "FREQ"      ;frequency
;104      AND OD.UPDT_DT_TM         ; pull latest freq
;104      IN (SELECT MAX(UPDT_DT_TM) FROM ORDER_DETAIL ODMAX
;104         WHERE OD.ORDER_ID = ODMAX.ORDER_ID
;104    AND ODMAX.OE_FIELD_MEANING = "FREQ" )
;104  JOIN D2
;104  JOIN ODR WHERE OUTERJOIN (O.ORDER_ID) = ODR.ORDER_ID
;104  JOIN ODR WHERE O.ORDER_ID = ODR.ORDER_ID			;104
;104  AND ODR.OE_FIELD_MEANING = "SCH/PRN"    ;PRN
;104      AND ODR.UPDT_DT_TM         ; pull latest PRN code
;104      IN (SELECT MAX(UPDT_DT_TM) FROM ORDER_DETAIL ODRMAX
;104         WHERE ODR.ORDER_ID = ODRMAX.ORDER_ID
;104    AND ODRMAX.OE_FIELD_MEANING = "SCH/PRN")
;104  JOIN D4
;104  JOIN ODRDER WHERE OUTERJOIN (O.ORDER_ID) = ODRDER.ORDER_ID
;104  JOIN ODRDER WHERE O.ORDER_ID = ODRDER.ORDER_ID			;104
;104  and ODRDER.OE_FIELD_MEANING = "SPECINX"     ;special instructions
;104      AND ODRDER.UPDT_DT_TM         ; pull latest SpecialInst code
;104      IN (SELECT MAX(UPDT_DT_TM) FROM ORDER_DETAIL ODRDERMAX
;104         WHERE ODRDER.ORDER_ID = ODRDERMAX.ORDER_ID
;104    AND ODRDERMAX.OE_FIELD_MEANING = "SPECINX" )
 
ORDER BY
	E_LOC_NURSE_UNIT_DISP
	, E_LOC_ROOM_DISP
	, P.NAME_FULL_FORMATTED
	, ODR.OE_FIELD_DISPLAY_VALUE
	, O_CATALOG_DISP
	, O.ORDER_ID
	, ODRDE.action_sequence desc
	, od.action_sequence desc
	, odr.action_sequence desc
	, odrder.action_sequence desc
 
;104	, O.ENCNTR_ID
;104	, O.PERSON_ID
 
Head Report
	m_NumLines = 0
%I cclsource:vccl_diortf.inc
	y_pos = 0
	PrintPSHeader = 0
	COL 0, "{PS/792 0 translate 90 rotate/}"
 
SUBROUTINE OFFSET( yVal )
	CALL PRINT( FORMAT( y_pos + yVal, "###" ))
END
 
Head Page
	y_pos = 14
	IF ( PrintPSHeader )
		COL 0, "{PS/792 0 translate 90 rotate/}"
		ROW + 1  	ENDIF
	PrintPSHeader = 1
	ROW + 1	y_val= 792-y_pos-55
		^{PS/newpath 1 setlinewidth   15 ^, y_val, ^ moveto  770 ^, y_val, ^ lineto stroke 15 ^, y_val, ^ moveto/}^
	ROW + 1, "{F/9}{CPI/11}"
 	CALL PRINT(CALCPOS(321,y_pos+0))  "ACTIVE ORDERS"
	CALL PRINT(CALCPOS(322,y_pos+11)) "Respiratory Care"
 	ROW + 1, "{F/8}{CPI/14}"
	CALL PRINT(CALCPOS(15,y_pos+25))  "RM#"
 	CALL PRINT(CALCPOS(15,y_pos+35))  "ISOLATION"
	CALL PRINT(CALCPOS(70,y_pos+25))  "NAME"
	CALL PRINT(CALCPOS(80,y_pos+35))  "ORDER"
	CALL PRINT(CALCPOS(245,y_pos+25)) "ATTENDING"
	CALL PRINT(CALCPOS(255,y_pos+35)) "FREQ"
	CALL PRINT(CALCPOS(305,y_pos+35)) "PRN"
	CALL PRINT(CALCPOS(340,y_pos+25)) "REASON FOR VISIT"
	CALL PRINT(CALCPOS(340,y_pos+35)) "SPECIAL INSTRUCTIONS"
	ROW + 1, "{CPI/14}"
	CALL PRINT(CALCPOS(709,y_pos+11)) "Page:"
	ROW + 1, CALL PRINT(CALCPOS(695,y_pos+0)) curdate
	ROW + 1, CALL PRINT(CALCPOS(715,y_pos+11)) curpage
	ROW + 1, CALL PRINT(CALCPOS(740,y_pos+0)) curtime
	ROW + 1
	y_pos = y_pos + 35
 
Head E_LOC_NURSE_UNIT_DISP
	if ((y_pos+72) >=612) break y_pos=65 endif
	y_pos = y_pos +12
	ROW + 1, "{CPI/14}"
	E_LOC_NURSE_UNIT_DISP = SUBSTRING( 1, 30, E_LOC_NURSE_UNIT_DISP ),
	CALL PRINT(CALCPOS(15,y_pos+1)) E_LOC_NURSE_UNIT_DISP
 
	y_pos = y_pos + 5
 
Head P.NAME_FULL_FORMATTED
	if ((y_pos+72) >=612) break y_pos=65 endif
	y_pos = y_pos +5
	OE_FIELD_DISPLAY_VALUE1 = SUBSTRING( 1, 11, ODRDE.OE_FIELD_DISPLAY_VALUE ),
	E_LOC_ROOM_DISP1 = SUBSTRING( 1, 8, E_LOC_ROOM_DISP ),
	NAME_FULL_FORMATTED1 = SUBSTRING( 1, 28, P.NAME_FULL_FORMATTED ),
	ATTENDING = SUBSTRING( 1, 15,PR.NAME_FULL_FORMATTED  ),
	REASONFORVISIT = SUBSTRING( 1, 25, EN.REASON_FOR_VISIT ),
	ROW + 1, "{F/9}{CPI/14}"
	CALL PRINT(CALCPOS(15,y_pos+1)) E_LOC_ROOM_DISP1
	CALL PRINT(CALCPOS(15,y_pos+12)) OE_FIELD_DISPLAY_VALUE1		;isol
	CALL PRINT(CALCPOS(65,y_pos+1)) NAME_FULL_FORMATTED1
	CALL PRINT(CALCPOS(245,y_pos+1)) ATTENDING
	CALL PRINT(CALCPOS(340,y_pos+1)) REASONFORVISIT
	CALL PRINT(CALCPOS(750,y_pos+1)) E_LOC_ROOM_DISP1
	ROW + 1, "{F/8}{CPI/14}"
	y_pos = y_pos + 25
;	y_pos = y_pos + 12 ;added space below the patient name per TDevine, 9/2012 lsword
 
;104 Detail
head o.order_id 		;104
	if ((y_pos+72) >=612) break y_pos=65 endif
	O_CATALOG_DISP1 = SUBSTRING( 1, 90, O_CATALOG_DISP ),
	OE_FIELD_DISPLAY_VALUE3 = SUBSTRING( 1, 9, OD.OE_FIELD_DISPLAY_VALUE ),
	OE_FIELD_DISPLAY_VALUE4 = SUBSTRING( 1, 4, ODR.OE_FIELD_DISPLAY_VALUE ),
	OE_FIELD_DISPLAY_VALUE5 = SUBSTRING( 1, 90, ODRDER.OE_FIELD_DISPLAY_VALUE ),  ;spec inst
	ROW + 1, "{CPI/14}"
	CALL PRINT(CALCPOS(80,y_pos+1)) O_CATALOG_DISP1				;order
	CALL PRINT(CALCPOS(255,y_pos+1)) OE_FIELD_DISPLAY_VALUE3	;freq
	CALL PRINT(CALCPOS(305,y_pos+1)) OE_FIELD_DISPLAY_VALUE4	;prn
	CALL PRINT(CALCPOS(340,y_pos+1)) OE_FIELD_DISPLAY_VALUE5	;spec inst
	row+1
	y_pos = y_pos + 12
 
Foot P.NAME_FULL_FORMATTED
	y_pos = y_pos + 12  ;added space below list of orders per TDevine, 9/2012 lsword
	ROW + 1	y_val= 792-y_pos-15
	^{PS/newpath 1 setlinewidth   15 ^, y_val, ^ moveto  770 ^, y_val, ^ lineto stroke 15 ^, y_val, ^ moveto/}^
 
Foot E_LOC_NURSE_UNIT_DISP
	y_pos = y_pos + 0
	BREAK
 
WITH MAXCOL = 300, MAXROW = 500,
outerjoin = d1,			;104
;104  DONTCARE =ODRDE,DONTCARE =OD,DONTCARE =ODR, DONTCARE=EP, DONTCARE=PRO,OUTERJOIN = D4,
LANDSCAPE, DIO = 08, NOHEADING, FORMAT= VARIABLE, TIME= VALUE( MaxSecs ), NULLREPORT
 
 
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
 
 
/****Start 105 - New Code ***/
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
 
/***END 105 - New Code ***/
END
GO
