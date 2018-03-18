/****************************************************************************
Program:  1_mhs_pressure_ulcer
Created Date:  08/2009
 
Description:  Displays all non-discharged patients that have a
pressure ulcer.
Divided by Facility.
 
Modifications:
1-  PEL  - Modifed the report to correspond to form changes
2-
3-
*****************************************************************************/
/***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000 00/00/00 See above                                               *
 *001 10/20/11 Rob Banks            Modify to use DB2                  *
 *002 07/09/12 Akcia-SE				changes for efficiency for oracle upgrade
 *003 02/28/13 Akcia                Change mod 001 to lookup password in registry
 ******************** End of Modification Log **************************/
drop program 1_mhs_pressure_ulcer:dba go
create program 1_mhs_pressure_ulcer:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Facility (Multiple Selection)" = 0
 
with OUTDEV, fac
 
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
;;
 
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
 
SET MaxSecs = 6500
 
declare census_cd = f8 with protect, constant(uar_get_code_by("MEANING", 339, "CENSUS"))
declare wound_type_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY",72,"INCISIONWOUNDTYPE")) ;001
 
select  distinct into  $outdev
 patient_name =p.name_full_formatted,
 fin =ea.alias,
 facility = uar_get_code_description (e.loc_facility_cd),
 nurse_unit = uar_get_code_description (e.loc_nurse_unit_cd),
 room = uar_get_code_display (e.loc_room_cd),
 bed = uar_get_code_display (e.loc_bed_cd),
 reg_date = e.reg_dt_tm,
;001 event_title =c.event_title_text,
;001  event_disp = substring(1, 18, uar_get_code_display (cel.event_cd)),
 event_title = cEL.event_title_text,
/*  removing per CAB 34534  mbw
 event_disp = substring(1, 18,concat (trim(ce.event_title_text)," ",trim(ce.event_tag))), ;001
*/
;001 event_tag =c.event_tag,
;001  event_tag =cEL.event_tag,
  event_tag =cr.descriptor,
 relationship = uar_get_code_display (ep.encntr_prsnl_r_cd),
 attending_physician =pr.name_full_formatted,
 ;for no records msg
 rec_ind = decode(p.seq,1)
from ;( clinical_event  c ),
/*  removing per CAB 34534  mbw
( clinical_event ce ),
*/
  ce_coded_result cr,
( clinical_event cel),
( encounter  e ),
( person  p ),
( encntr_alias  ea ),
( encntr_prsnl_reltn  ep ),
( prsnl  pr )
;, (dummyt d1)
; 01.05.10
;,
;( nurse_unit nu ),
,( encntr_domain ed )
 
 
; 01.05.10
;plan nu
;where (expand(num, 1, size(facilities->qual,5), nu.loc_facility_cd,
;facilities->qual[num].facility_cd))
;and nu.end_effective_dt_tm > sysdate
;and nu.active_ind = 1
plan ed
 
where ed.loc_facility_cd = $FAC
 
;002  and ed.end_effective_dt_tm > sysdate
  and ed.end_effective_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00")		;002
  and ed.encntr_domain_type_cd+0 = census_cd
 
  and ed.active_ind+0 = 1
 
 
 
 
 
join e
 
where e.encntr_id = ed.encntr_id
 
; 856 = discharged
 
and e.encntr_status_cd != 856.00
and e.encntr_type_cd !=     3990509.00		; Dialysis
 
/*
join ed
where ed.loc_nurse_unit_cd = nu.location_cd
  and ed.encntr_domain_type_cd = census_cd
  and ed.end_effective_dt_tm+0 > sysdate
  and ed.active_ind = 1
 
 
join e
where e.encntr_id = ed.encntr_id
; 856 = discharged
and e.encntr_status_cd != 856.00
*/
;plan ( e
; != Discharged
;where (e.encntr_status_cd!= 856.00)
;and (e.loc_facility_cd in ($fac /*633867, 3186521, 3196529, 3196527, 3196531*/))
; )
 
;and (e.loc_facility_cd+0 =($fac /*633867, 3186521, 3196529, 3196527, 3196531*/))
; )
 
 
  join ( ep
; Attending Physician
where (ep.encntr_id=e.encntr_id) and (ep.encntr_prsnl_r_cd= 1119.00 ) and (ep.active_ind= 1 ) and (
ep.data_status_cd= 25 )
;002	and (ep.end_effective_dt_tm > cnvtdatetime("30-DEC-2100")))
and (ep.end_effective_dt_tm > sysdate))				;002
 
 and ( pr
where (pr.person_id=ep.prsnl_person_id))
 
  join ( ea
; FIN
where (ea.encntr_id=e.encntr_id)
and (ea.encntr_alias_type_cd = 1077.00 )
and (ea.active_ind = 1)							;002
and (ea.end_effective_dt_tm > sysdate))			;002
 
 and ( p
where (p.person_id=e.person_id)
)
 
 
join CEL
	WHERE cel.person_id = e.person_id 		;002
 	AND CEL.EVENT_CD = WOUND_TYPE_CD
	and CEL.ENCNTR_ID = E.ENCNTR_ID
;002 	AND CEL.VALID_UNTIL_DT_TM > CNVTDATETIME ("30-DEC-2100" )
 	AND CEL.VALID_UNTIL_DT_TM > sysdate					;002
 	AND CEL.UPDT_DT_TM = (SELECT MAX (C3.UPDT_DT_TM)
			FROM  CLINICAL_EVENT  C3
			 WHERE c3.person_id = cel.person_id        ;002
			 and C3.ENCNTR_ID = CEL.ENCNTR_ID
			 AND C3.EVENT_CD=CEL.EVENT_CD
;002			 AND C3.VALID_UNTIL_DT_TM > CNVTDATETIME ("30-DEC-2100" ) )
			 AND C3.VALID_UNTIL_DT_TM > sysdate )				;002
join CR
	WHERE CR.EVENT_ID=CEL.EVENT_ID
	AND CR.VALID_UNTIL_DT_TM> SYSDATE
	AND CR.DESCRIPTOR IN (
		"Pressure ulcer" ,
		"Pressure ulcer deep tissue injury" ,
		"Pressure ulcer mucosal" ,
		"Pressure ulcer stage I" ,
		"Pressure ulcer stage II" ,
		"Pressure ulcer stage III" ,
		"Pressure ulcer stage IV" ,
		"Pressure ulcer unstageable" )
/*  removing per CAB 34534  mbw
join ce
where ce.encntr_id = outerjoin(cel.encntr_id)
;001  and ce.event_title_text = "Skin Integrity" and ce.event_tag = "Not intact"
and ce.parent_event_id = outerjoin(cel.parent_event_id)
and ce.event_title_text = outerjoin("Wound Numbering") ; pel
and ce.valid_until_dt_tm > cnvtdatetime("30-DEC-2100")
;;and ce.updt_dt_tm = (select max(c2.updt_dt_tm) from clinical_event c2
;;where c2.encntr_id = ce.encntr_id and ;001 c2.event_title_text = "Skin Integrity"
;;                                      c2.event_title_text = "Wound Numbering"  ;001
;;and c2.valid_until_dt_tm > cnvtdatetime("30-DEC-2100")
;;)
*/
 
 
 
;;join cel
;;where cel.encntr_id=ce.encntr_id
;;;where cel.parent_event_id=ce.parent_event_id
;;and cel.parent_event_id=ce.parent_event_id  ;001
;;AND cel.event_cd = wound_type_cd ;001
;;;and cel.event_title_text = "Type" and cel.event_tag = "Pressure ulcer"
;;and cel.event_tag in   ("Pressure ulcer",						;001
;;						"Pressure ulcer deep tissue injury",	;001
;;						"Pressure ulcer mucosal",				;001
;;						"Pressure ulcer stage I",				;001
;;						"Pressure ulcer stage II",				;001
;;						"Pressure ulcer stage III",				;001
;;						"Pressure ulcer stage IV",				;001
;;						"Pressure ulcer unstageable")			;001
;;
;;and cel.valid_until_dt_tm > cnvtdatetime("30-DEC-2100")
;;and cel.updt_dt_tm = (select max(c3.updt_dt_tm) from clinical_event c3
;;where c3.encntr_id = cel.encntr_id and c3.event_title_text = "Type"
;;/*and c3.event_tag = "Pressure ulcer"*/
;;and c3.valid_until_dt_tm > cnvtdatetime("30-DEC-2100")
;;)
 
 
;001 join d1
;001
;001 join  c
;001
;001 where ;c.parent_event_id=cel.parent_event_id
;001 ;and c.event_title_text= "Pressure Ulcer Stage"   /*and (c.event_tag = "I" or c.event_tag = "II"
;001 ; or c.event_tag = "III" or c.event_tag = "IV" or c.event_tag = "Deep tissue injury"
;001 ; or c.event_tag = "Unable to stage/necrotic tissue" or c.event_tag = NULL)*/
;001 c.parent_event_id=ce.parent_event_id  ;001
;001 AND c.event_cd = wound_type_cd ;001
;001 ;and cel.event_title_text = "Type" and cel.event_tag = "Pressure ulcer"
;001 and c.event_tag in   ("Pressure ulcer",
;001 						"Pressure ulcer deep tissue injury",
;001 						"Pressure ulcer mucosal",
;001 						"Pressure ulcer stage I",
;001 						"Pressure ulcer stage II",
;001 						"Pressure ulcer stage III",
;001 						"Pressure ulcer stage IV",
;001 						"Pressure ulcer unstageable")
;001 and c.valid_until_dt_tm > cnvtdatetime("30-DEC-2100")
;001
;001 and c.updt_dt_tm = (select max(c4.updt_dt_tm) from clinical_event c4
;001 where c4.encntr_id = c.encntr_id and c4.event_title_text = "Pressure Ulcer Stage"
;001 and c4.valid_until_dt_tm > cnvtdatetime("30-DEC-2100")
;001 ;where c4.parent_event_id = c.parent_event_id and c4.event_title_text = "Type"
;001 ;and c4.event_tag = "Pressure ulcer"
;001 ;and c4.valid_until_dt_tm > cnvtdatetime("30-DEC-2100")
;001
;001  )
 
 
 
order by
facility,
nurse_unit ,
 room,
 bed
/*  removing per CAB 34534  mbw
 ,
 event_disp
 */
 
head report
 ;for no records msg
 dcnt = 0
 
 y_pos = 18 ,
 
 ;for no records msg
;ROW 20 COL 13 rec_ind
ROW 20 COL 32 IF ( rec_ind != 1 )
"No patients qualify for this report"
ENDIF
ROW + 2
 
 
 
subroutine   offset  ( yval  )
 
 call print ( format (( y_pos + yval ),  "###" ))
 
end ;subroutine
,
 row + 1 ,
 "{f/0}{cpi/14}" ,
 
 call print ( calcpos ( 20 , ( y_pos + 11 ))),
 "Run Date:" ,
 row + 1 ,
 
 call print ( calcpos ( 20 , ( y_pos + 27 ))),
 "Run Time:" ,
 row + 1 ,
 
 call print ( calcpos ( 83 , ( y_pos + 11 ))),
 curdate ,
 row + 1 ,
 
 call print ( calcpos ( 83 , ( y_pos + 27 ))),
 curtime ,
 row + 1 ,
 "{f/1}{cpi/09}" ,
 row + 1 ,
 
 ;call print ( calcpos ( 245 , ( y_pos + 27 ))),
 ;"Luther Hospital" ,
 ;row + 1 ,
 
 ; call print ( calcpos ( 245 , ( y_pos + 27 ))),
 ;facility,
 ;row + 1 ,
 
 call print ( calcpos ( 230 , ( y_pos + 37 ))),
 "Pressure Ulcer Stage" ,
 ;row + 1 ,
 y_pos =( y_pos + 80 )
head page
 
if ( ( curpage > 1 ) )  y_pos = 18
endif
,
 row + 1 ,
 "{f/1}{cpi/14}" ,
 
 call print ( calcpos ( 24 , ( y_pos + 11 ))),
 "Room/Bed" ,
 
 call print ( calcpos ( 70 , ( y_pos + 11 ))),
 "Patient" ,
 
 call print ( calcpos ( 200, ( y_pos + 2 ))),
 "Reg Date" ,
 
 call print ( calcpos ( 200 , ( y_pos + 11 ))),
 "FIN" ,
 
 call print ( calcpos ( 280 , ( y_pos + 11 ))),
 "Attending Physician" ,
 
 call print ( calcpos ( 435 , ( y_pos + 11 ))),
 "Stage" ,
 call print ( calcpos ( 435 , ( y_pos + 2 ))),
/*  removing per CAB 34534  mbw
 "Incision/Wound #" ,
*/
 row + 1 ,
 row + 1 ,
 y_val =(( 792 - y_pos )- 39 ),
 "{ps/newpath 2 setlinewidth   25 " ,
 y_val ,
 " moveto  574 " ,
 y_val ,
 " lineto stroke 25 " ,
 y_val ,
 " moveto/}" ,
 row + 1 ,
 y_pos =( y_pos + 31 )
 
 
/*HEAD  FACILITY
 
IF ( (( Y_POS + 78 )>= 792 ) )  Y_POS = 0 , BREAK
ENDIF
, ROW + 1 , "{F/1}{CPI/10}" , ROW + 1 ,
 CALL PRINT ( CALCPOS ( 33 , ( Y_POS + 11 ))), FACILITY , ROW + 1 , Y_POS =( Y_POS + 24 )
*/
 
head  nurse_unit
 
if ( (( y_pos + 77 )>= 792 ) )  y_pos = 0 , break
endif
 
, row + 1 , "{f/1}{cpi/13}" ,
 call print ( calcpos ( 24 , ( y_pos + 11 ))),
 facility , row + 1 , y_pos =( y_pos + 23 )
 
, row + 1 , "{f/1}{cpi/13}" ,
 call print ( calcpos ( 24 , ( y_pos + 11 ))),
 nurse_unit , row + 1 , y_pos =( y_pos + 23 )
detail
 
 ;for no records msg
if ((ROW + 2) >= maxrow) break endif
dcnt = dcnt +1
 
 
 
if ( (( y_pos + 97 )>= 792 ) )  y_pos = 0 , break
endif
,
 room1 = substring ( 1 ,  10 ,  room ),
 bed1 = substring ( 1 , 6 ,  bed ),
 loc = concat(trim(room1), "/", trim(bed1)) ,
 pt = substring(1,60,patient_name),
 at = substring(1,60,attending_physician),
 row + 1 ,
 "{f/0}{cpi/15}" ,
 
 call print ( calcpos ( 24 , ( y_pos + 11 ))),
 loc,
 row + 1 ,
 
 call print ( calcpos ( 70 , ( y_pos + 11 ))),
 pt ,
 row + 1 ,
 
 call print ( calcpos ( 200 , ( y_pos + 2 ))),
 reg_date ,
 row + 1 ,
 
 call print ( calcpos ( 200 , ( y_pos + 11 ))),
 fin ,
 row + 1 ,
 
 call print ( calcpos ( 280 , ( y_pos + 11 ))),
 at ,
 row + 1 ,
 
 call print ( calcpos ( 435 , ( y_pos + 11 ))),
 event_tag ,
 call print ( calcpos ( 435 , ( y_pos + 2 ))),
/*  removing per CAB 34534  mbw
 event_disp ,
*/
 
 y_pos =( y_pos + 30 )
 
foot   nurse_unit
 
;for no records msg
/*COL 29 IF ( dcnt = 0 )
"No patients qualify for this report"
ENDIF
ROW + 1*/
 
 
 y_pos =( y_pos + 0 )
 
/*FOOT   FACILITY
 Y_POS =( Y_POS + 0 )
 
IF(CURENDREPORT = 0)
		BREAK
		ENDIF
*/
foot page
 y_pos = 726 ,
 row + 1 ,
 "{f/0}{cpi/14}" ,
 
 call print ( calcpos ( 20 , ( y_pos + 11 ))),
 "Pressure Ulcer Stage, page:" ,
 row + 1 ,
 
 call print ( calcpos ( 167 , ( y_pos + 11 ))),
 curpage
 with  maxcol = 300 , maxrow = 500 , dio = 08 , noheading , format = variable, TIME= VALUE( MaxSecs ), nullreport
; , dontcare = c, dontcare = c4, outerjoin = d1
 
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
