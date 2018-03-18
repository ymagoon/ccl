/*******************************************************************
 
Report Name:  EKG Orders - Due Today 0600 - Tomorrow 0600
Report Path:  /mayo/mhprd/prg/1_lm_ekg_pending
Report Description: Displays EKG-CR and EKG-CR orders that are scheduled
					to be compelted today at 0600 - tomorrow at 0600.
					output is printed to the Card Rehab workroom printer.
Created by:  	Lisa Sword
Created date:   03/2010
 
Modified by:  Akcia - SE
Modified date:  07/12/12
Modifications:  efficiency changes for oracle upgrade
Mod Number:  101
*******************************************************************/
 
drop program 1_LM_ekg_pending go
create program 1_LM_ekg_pending
 
PROMPT	"Output to File/Printer/MINE" = MINE
WITH   OUTDEV

declare census_cd = f8 with protect, constant(uar_get_code_by("MEANING", 339, "CENSUS"))
declare hosp_outpat_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 339, "HOSPITALOUTPATIENT"))  ;101
declare emergency_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 339, "EMERGENCY"))  ;101
declare inpatient_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 339, "INPATIENT"))  ;101
declare observation_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 339, "OBSERVATION"))  ;101

 
SET MaxSecs = 1200
SELECT DISTINCT INTO $OUTDEV
	PA.ALIAS
	, P.NAME_FULL_FORMATTED
	, P_SEX_DISP = UAR_GET_CODE_DISPLAY(P.SEX_CD)
	, O_CATALOG_DISP = UAR_GET_CODE_DISPLAY(O.CATALOG_CD)
	, PR.NAME_FULL_FORMATTED
	, P.BIRTH_DT_TM
	, O.ORDER_ID
	, E_LOC_ROOM_DISP = UAR_GET_CODE_DISPLAY(E.LOC_ROOM_CD)
	, E_LOC_NURSE_UNIT_DISP = UAR_GET_CODE_DISPLAY(E.LOC_NURSE_UNIT_CD)
	, O.CURRENT_START_DT_TM "@SHORTDATETIMENOSEC"
	, OD.OE_FIELD_MEANING
	, OD.OE_FIELD_DISPLAY_VALUE
	, ODR.OE_FIELD_MEANING
	, ODR.OE_FIELD_DISPLAY_VALUE
 
FROM
    code_value cv,		;101
	nurse_unit nu,		;101
	encntr_domain ed,   ;101
	ORDERS   O
	, PERSON   P
	, PRSNL   PR
	, ENCOUNTER   E
	, PERSON_ALIAS   PA
	, ORDER_DETAIL   OD
;101	, DUMMYT   D1
	, ORDERS   ORD
	, ORDER_DETAIL   ODR
;101	, DUMMYT   D2
;101	, DUMMYT   D3

;start 101 
plan cv
where cv.code_set = 220
  and cv.cdf_meaning = "FACILITY"
  and cv.display_key = "EU*"
  and cv.active_ind = 1
  and cv.description = "*Hospital"
  
join nu
where nu.loc_facility_cd = cv.code_value 
  and nu.active_ind = 1
  and nu.end_effective_dt_tm > sysdate
  
join ed
where ed.loc_nurse_unit_cd = nu.location_cd 
  and ed.active_ind = 1
  and ed.end_effective_dt_tm > sysdate
  and ed.encntr_domain_type_cd = census_cd  
;end 101

join e where E.ENCNTR_ID = ed.ENCNTR_ID
  and E.DISCH_DT_TM = null
  and e.encntr_type_cd in (hosp_outpat_cd,emergency_cd,inpatient_cd,observation_cd)		;101

;101  plan o where O.CATALOG_CD in (3490583,3490669)						;EKG-RC and EKG-CR Orders
join o where o.encntr_id = e.encntr_id					;101
  and O.CATALOG_CD in (3490583,3490669)						;EKG-RC and EKG-CR Orders
  and O.CURRENT_START_DT_TM between CNVTDATETIME(CURDATE, 060000) and CNVTDATETIME(CURDATE+1, 055900)
  and O.ORDER_STATUS_CD in (2543,2546,2547,2548,2549,2550,643466,2551,2552,2553)	;active order statuses
  and o.active_ind = 1					;101
join p where o.PERSON_ID = P.PERSON_ID
  and P.NAME_LAST_KEY != "TESTPATIENT"
join pr where PR.PERSON_ID = O.LAST_UPDATE_PROVIDER_ID

join pa where PA.PERSON_ID = P.PERSON_ID
  and PA.ALIAS_POOL_CD = 3844507									;Clinic MRN
  and PA.ACTIVE_IND = 1
  and PA.END_EFFECTIVE_DT_TM > CNVTDATETIME(CNVTDATE(12312099), 0)
;start  101
join od where OD.ORDER_ID = outerjoin(O.ORDER_ID) 
  and OD.OE_FIELD_MEANING = outerjoin("OTHER")
join ord where ORD.ENCNTR_ID = outerjoin(E.ENCNTR_ID)
  and ORD.CATALOG_CD = outerjoin(3512742.00)	 							;Patient isolation
  and ord.active_ind = outerjoin(1)								;101
join odr where ODR.ORDER_ID = outerjoin(ORD.ORDER_ID)
  and ODR.OE_FIELD_MEANING = outerjoin("ISOLATIONCODE")					; Type of isolation

;101 join d1
;101 join od where outerjoin (O.ORDER_ID) = OD.ORDER_ID
;101   and OD.OE_FIELD_MEANING = "OTHER"
;101 join d2
;101 join ord where ORD.ENCNTR_ID = E.ENCNTR_ID
;101   and ORD.CATALOG_CD = 3512742.00	 							;Patient isolation
;101 join d3
;101 join odr where ORD.ORDER_ID = ODR.ORDER_ID
;101   and ODR.OE_FIELD_MEANING = "ISOLATIONCODE"					; Type of isolation
;end 101
 
ORDER BY
	O_CATALOG_DISP
	, E_LOC_ROOM_DISP
	, PR.NAME_FULL_FORMATTED
	, O.CURRENT_START_DT_TM
 
Head Report
	y_pos = 18
 
	PrintPSHeader = 0
	COL 0, "{PS/792 0 translate 90 rotate/}"
	ROW + 1
SUBROUTINE OFFSET( yVal )
	CALL PRINT( FORMAT( y_pos + yVal, "###" ))
END
 
Head Page
	y_pos = 19
	IF ( PrintPSHeader )
		COL 0, "{PS/792 0 translate 90 rotate/}"
		ROW + 1
	ENDIF
	PrintPSHeader = 1
	ROW + 1, "{F/8}{CPI/11}"
	ROW + 1, CALL PRINT(CALCPOS(700,y_pos+0)) curdate
	ROW + 1, CALL PRINT(CALCPOS(700,y_pos+14)) "Page:  ", curpage  ";L"
	ROW + 1
	y_pos = y_pos + 39
 
Head O_CATALOG_DISP
 
	ROW + 1, "{F/9}{CPI/10}"
	CALL PRINT(CALCPOS(280,y_pos+0)) "EKG ORDERS: "
	CALL PRINT(CALCPOS(370,y_pos+0)) O_CATALOG_DISP
	ROW + 1
	ROW + 1, "{CPI/11}"
	CALL PRINT(CALCPOS(282,y_pos+12)) "Due Today at 0600 - Tomorrow at 0600"
	ROW + 1
	ROW + 1	y_val= 792-y_pos-89
	^{PS/newpath 1 setlinewidth   18 ^, y_val, ^ moveto  767 ^, y_val, ^ lineto stroke 18 ^, y_val, ^ moveto/}^
	CALL PRINT(CALCPOS(26,y_pos+47)) "ROOM"
	CALL PRINT(CALCPOS(26,y_pos+61)) "UNIT"
	CALL PRINT(CALCPOS(75,y_pos+47)) "NAME"
	CALL PRINT(CALCPOS(273,y_pos+47)) "MRN/HX#"
	CALL PRINT(CALCPOS(338,y_pos+47)) "DOB"
	CALL PRINT(CALCPOS(338,y_pos+61)) "ORDER #"
	CALL PRINT(CALCPOS(390,y_pos+47)) "GENDER"
	CALL PRINT(CALCPOS(447,y_pos+47)) "ORDERING PROVIDER"
	CALL PRINT(CALCPOS(447,y_pos+61)) "DX/SIGNS/SX/CONDITION"
	ROW + 1
	CALL PRINT(CALCPOS(663,y_pos+61)) "ISOLATION"
	CALL PRINT(CALCPOS(663,y_pos+47)) "ORDER DT/TM"
	ROW + 1
	y_pos = y_pos + 91
 
Detail
	if (( y_pos + 89) >= 612 ) y_pos = 0,  break endif
	E_LOC_ROOM_DISP1 = SUBSTRING( 1, 6, E_LOC_ROOM_DISP ),
	NAME_FULL_FORMATTED1 = SUBSTRING( 1, 30, P.NAME_FULL_FORMATTED ),
	ALIAS1 = SUBSTRING( 1, 10, PA.ALIAS ),
	P_SEX_DISP1 = SUBSTRING( 1, 6, P_SEX_DISP ),
	NAME_FULL_FORMATTED2 = SUBSTRING( 1, 30, PR.NAME_FULL_FORMATTED ),
	OE_FIELD_DISPLAY_VALUE1 = SUBSTRING( 1, 50, OD.OE_FIELD_DISPLAY_VALUE ),
	OE_FIELD_DISPLAY_VALUE2 = SUBSTRING( 1, 12, ODR.OE_FIELD_DISPLAY_VALUE ),
	E_LOC_NURSE_UNIT_DISP1 = SUBSTRING( 1, 20, E_LOC_NURSE_UNIT_DISP ),
	ROW + 1, "{F/9}{CPI/11}"
	CALL PRINT(CALCPOS(26,y_pos+0)) E_LOC_ROOM_DISP1
	CALL PRINT(CALCPOS(75,y_pos+0)) NAME_FULL_FORMATTED1
	ROW + 1, "{F/8}"
	CALL PRINT(CALCPOS(26,y_pos+17)) E_LOC_NURSE_UNIT_DISP1
	CALL PRINT(CALCPOS(273,y_pos+0)) ALIAS1
	CALL PRINT(CALCPOS(338,y_pos+0)) P.BIRTH_DT_TM
	ROW + 1,
	orderid =cnvtint( O.ORDER_ID )
	CALL PRINT(CALCPOS(338,y_pos+17)) orderid ";L"
	CALL PRINT(CALCPOS(400,y_pos+0)) P_SEX_DISP1
	CALL PRINT(CALCPOS(447,y_pos+17)) OE_FIELD_DISPLAY_VALUE1
	CALL PRINT(CALCPOS(447,y_pos+0)) NAME_FULL_FORMATTED2
	CALL PRINT(CALCPOS(663,y_pos+0)) O.CURRENT_START_DT_TM
	ROW + 1, CALL PRINT(CALCPOS(663,y_pos+17)) OE_FIELD_DISPLAY_VALUE2
	y_pos = y_pos + 50
 
Foot O_CATALOG_DISP
	ROW + 1, CALL PRINT(CALCPOS(22,y_pos+2)) "Total:"
	ROW + 1, "{F/8}{CPI/11}"
	count = cnvtint(count( O.ORDER_ID ))
	ROW + 1, CALL PRINT(CALCPOS(59,y_pos+2)) 	count
	y_pos = y_pos + 25
	BREAK
 
WITH MAXREC = 500, MAXCOL = 300, MAXROW = 500, OUTERJOIN = D1, DONTCARE =OD,
OUTERJOIN = D2, DONTCARE =ORD,OUTERJOIN = D3, DONTCARE =ODR,
LANDSCAPE, DIO= 08, NOHEADING, FORMAT= VARIABLE, TIME= VALUE( MaxSecs )
 
 
END
GO
 
