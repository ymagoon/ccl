/*******************************************************************
Report Name: Dietary Report (medications)
Report Path:  /mayo/mhprd/prg/1_mchs_pha_dietary.prg
Report Description:  Displays patients on specific meds for various
				     facilities. Report is for Dietary offices
 
Created by:  Lisa Sword
Created date:  06/2011
 
Modified by:  Akcia - SE
Modified date:  07/11/12
Modifications:  efficiency changes for oracle 11 upgrade
Mod Num:  101 
*******************************************************************/
 
drop program 1_mchs_pha_dietary go
create program 1_mchs_pha_dietary
prompt
	"Output to File/Printer/MINE" = "MINE"
		, "Facility" = 0
 
with OUTDEV, facility
 
SET MaxSecs = 300
SELECT DISTINCT INTO $OUTDEV
	P.NAME_FULL_FORMATTED
	, AGE = CNVTAGE(P.BIRTH_DT_TM)
	, EA.ALIAS
	, E_LOC_FACILITY_DISP = UAR_GET_CODE_DESCRIPTION(E.LOC_FACILITY_CD)
	, E_LOC_NURSE_UNIT_DISP = UAR_GET_CODE_DISPLAY(E.LOC_NURSE_UNIT_CD)
	, E_LOC_ROOM_DISP = UAR_GET_CODE_DISPLAY(E.LOC_ROOM_CD)
	, O.ORDER_ID
	, O.CURRENT_START_DT_TM "@SHORTDATETIMENOSEC"
	, O_CATALOG_DISP = UAR_GET_CODE_DISPLAY(O.CATALOG_CD)
 
FROM
	ORDERS   O
	, ENCNTR_DOMAIN   E
	, PERSON   P
	, ENCNTR_ALIAS   EA
 
plan e where e.LOC_FACILITY_CD = $facility
    and e.encntr_domain_type_cd = 1139										;101
    and e.active_ind = 1													;101
    and e.end_effective_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00")		;101
	and E.LOC_NURSE_UNIT_CD in (
24993165, ;LASF 3 Surgical NURSEUNIT
24993378, ;LASF 7 Medical NURSEUNIT
35356287, ;LASF 9 MedSurg NURSEUNIT
24993229, ;LASF Fam Brthpl NURSEUNIT
24993132, ;LASF ICU/CCU NURSEUNIT
24993335, ;LASF IP BH NURSEUNIT
24989266, ;LASF L&D NURSEUNIT
25049446, ;LASF NICUNurser NURSEUNIT
25049445, ;LASF Nursery NURSEUNIT
24992966, ;LASH Med/Surg NURSEUNIT
24989176, ;LASH Obstetrics AMBULATORY
24992005, ;LCMC Conc Care NURSEUNIT
24995148, ;LCMC ED AMBULATORY
24991979, ;LCMC General NURSEUNIT
24992002, ;LCMC Hospice NURSEUNIT
79864326, ;LCMC Hospital AMBULATORY
79865274, ;LCMC IV Therapy AMBULATORY
79865894, ;LCMC Misc Serv AMBULATORY
31158534, ;LCMC Nursery NURSEUNIT
79866229, ;LCMC OB OP AMBULATORY
99222966, ;LCMC Observatio AMBULATORY
24991974, ;LCMC Obstetrics NURSEUNIT
97571013, ;LCMC OutVisit AMBULATORY
79867669, ;LCMC SameDaySrg AMBULATORY
79867406, ;LCMC Swing Bed AMBULATORY
11004055, ;EUBL Med/Surg NURSEUNIT
683731, ;EULH CCU A NURSEUNIT
2864662, ;EULH Labor/Delv NURSEUNIT
3186603, ;EULH Med Tele NURSEUNIT
3186634, ;EULH IntermCare NURSEUNIT
3186645, ;EULH Neur/Ped B NURSEUNIT
3186674, ;EULH Neuro IC NURSEUNIT
3186681, ;EULH Med/Surg A NURSEUNIT
7284841, ;EULH Med/Surg B NURSEUNIT
10697808, ;EULH Neur/Ped A NURSEUNIT
28026679, ;EULH CCU C NURSEUNIT
28026680, ;EULH CCU B NURSEUNIT
43199228, ;EULH ED OBS NURSEUNIT
172221055, ;EULH South-3rd NURSEUNIT
172222695, ;EULH North-3rd NURSEUNIT
172223946, ;EULH South-4th NURSEUNIT
172225126, ;EULH North-4th NURSEUNIT
177886319, ;EULH FBC IsoNur NURSEUNIT
177890657, ;EULH FBC Nursry NURSEUNIT
177892486, ;EULH FBC WH NURSEUNIT
177893453, ;EULH FBC Labor NURSEUNIT
177894544, ;EULH FBC T/P/Rc NURSEUNIT
179653105, ;EULH FBC SpCare NURSEUNIT
11004457, ;EUBH Med/Surg NURSEUNIT
11004474, ;EUBH Observatio AMBULATORY
11004489, ;EUBH Obstetrics NURSEUNIT
11003800, ;EUOH Inpatient NURSEUNIT
11906847, ;EUOH Observatio AMBULATORY
24992054, ;MAIJ 2nd Md/Srg NURSEUNIT
24992129, ;MAIJ 3rd Md/Srg NURSEUNIT
24992350, ;MAIJ 4th Md/Srg NURSEUNIT
24992033, ;MAIJ ICU NURSEUNIT
24992392, ;MAIJ Newborn NURSEUNIT
24992519, ;MAIJ Ped Nrsry NURSEUNIT
24992479, ;MAIJ Ped/Med/Sg NURSEUNIT
115105857, ;MAJH Med/Surg NURSEUNIT
24992526, ;MASH Med/Surg NURSEUNIT
68877347, ;MAWH Inpatients AMBULATORY
117873631, ;FAFH  Med/Surg NURSEUNIT
117872572, ;FAFH 2 Central NURSEUNIT
24992606, ;FAFH Crit Care NURSEUNIT
117874870, ;FAFH Observatio AMBULATORY
24992690, ;FAFH Obstetrics NURSEUNIT
24992613, ;FAFH Pat Care NURSEUNIT
24991944, ;CAMH Inpt/Obsrv NURSEUNIT
24991641, ;AUHO ICU NURSEUNIT
24991660, ;AUHO Med/Srg/Pd NURSEUNIT
24991748, ;AUHO Psych NURSEUNIT
24991776, ;AUHO Telemetry NURSEUNIT
24991802, ;AUHO Women's SC NURSEUNIT
24990409, ;ALNH Baby Place NURSEUNIT
24990276, ;ALNH Med/Surg NURSEUNIT
24990469, ;ALNH Spec Care NURSEUNIT
24991894, ;MERH Fam Birth NURSEUNIT
24991856, ;MERH M/S N Star NURSEUNIT
24991881, ;MERH M/S Sunris NURSEUNIT
24991843, ;MERH M/S Sunset NURSEUNIT
24991925) ;MERH SC NURSEUNIT
 
join o where E.ENCNTR_ID = O.ENCNTR_ID
	and O.CATALOG_CD+0 IN (2766436,2768632,2761381,2762196,2771189,2770419,2761392,7264790,7264775,12656694)
	;and O.DEPT_STATUS_CD+0 = 9328			;ordered
	and o.order_status_cd+0 = 2550			;ordered  
;101  and O.TEMPLATE_ORDER_ID+0 = 0			;template order only
    and o.template_order_flag in (0,1)			;101
	and O.ORIG_ORD_AS_FLAG = 0				;inpatient meds only
join ea where EA.ENCNTR_ID = O.ENCNTR_ID
	and EA.ENCNTR_ALIAS_TYPE_CD = 1077    ;FIN
	and ea.end_effective_dt_tm > sysdate		;101
	and ea.active_ind = 1						;101
;se join cv1 where E.LOC_NURSE_UNIT_CD = CV1.CODE_VALUE
;se	and CV1.CDF_MEANING = "NURSEUNIT"  	    ;excluding ambulatory locations
join p where P.PERSON_ID = O.PERSON_ID
 
ORDER BY
	E_LOC_NURSE_UNIT_DISP
	, E_LOC_ROOM_DISP
 
Head Report
	y_pos = 18
	PrintPSHeader = 0
	ROW + 1
 
SUBROUTINE OFFSET( yVal )
	CALL PRINT( FORMAT( y_pos + yVal, "###" ))
END
	ROW + 1, "{F/9}{CPI/12}"
	title = concat(trim("Dietary Report (medications) -")," ", UAR_GET_CODE_DESCRIPTION(E.LOC_FACILITY_CD))
    Date = format(sysdate, "MM/DD/YYYY HH:MM;;D")
	ROW + 1, CALL PRINT(CALCPOS(20,y_pos+8)) title
	ROW + 1, "{F/8}{CPI/14}"  CALL PRINT(CALCPOS(500,y_pos+8)) Date
	y_pos = y_pos + 30
 
Head Page
	if (curpage > 1)  y_pos = 18 endif
	PrintPSHeader = 1
 
	CALL PRINT(CALCPOS(20,y_pos+10)) "Nurse Unit"
	CALL PRINT(CALCPOS(105,y_pos+10)) "Room"
	CALL PRINT(CALCPOS(150,y_pos+10)) "Patient Name"
	CALL PRINT(CALCPOS(305,y_pos+10)) "Age"
	CALL PRINT(CALCPOS(350,y_pos+10)) "FIN"
	CALL PRINT(CALCPOS(400,y_pos+10)) "Start Date/Time"
	CALL PRINT(CALCPOS(470,y_pos+10)) "Medication Order"
	ROW + 1	y_val= 792-y_pos-35
	^{PS/newpath 1 setlinewidth   20 ^, y_val, ^ moveto  585 ^, y_val, ^ lineto stroke 20 ^, y_val, ^ moveto/}^
	ROW + 1
	y_pos = y_pos + 18
 
Detail
	if (( y_pos + 60) >= 612 ) y_pos = 0,  break endif
	E_LOC_NURSE_UNIT_DISP1 = SUBSTRING( 1, 15, E_LOC_NURSE_UNIT_DISP ),
	E_LOC_ROOM_DISP1       = SUBSTRING( 1, 8,  E_LOC_ROOM_DISP ),
	NAME_FULL_FORMATTED1   = SUBSTRING( 1, 25, P.NAME_FULL_FORMATTED ),
	ALIAS1                 = SUBSTRING( 1, 15, EA.ALIAS ),
	MED_ORDER			   = SUBSTRING( 1, 77, O_CATALOG_DISP),
;	ORDERID                = O.ORDER_ID ,
 
	         CALL PRINT(CALCPOS(20,y_pos+11))  E_LOC_NURSE_UNIT_DISP1
	ROW + 1, CALL PRINT(CALCPOS(105,y_pos+11)) E_LOC_ROOM_DISP1
	         CALL PRINT(CALCPOS(150,y_pos+11)) NAME_FULL_FORMATTED1
	ROW + 1, CALL PRINT(CALCPOS(300,y_pos+11)) AGE
	ROW + 1, CALL PRINT(CALCPOS(350,y_pos+11)) ALIAS1
	         CALL PRINT(CALCPOS(400,y_pos+11)) O.CURRENT_START_DT_TM
	ROW + 1, CALL PRINT(CALCPOS(470,y_pos+11)) MED_ORDER
;	ROW + 1, CALL PRINT(CALCPOS(575,y_pos+11)) ORDERID
	y_pos = y_pos + 12
 
WITH MAXREC = 100, MAXCOL = 300, MAXROW = 500, DIO= 08, NOHEADING, FORMAT= VARIABLE, TIME= VALUE( MaxSecs )
 
 
END
GO
