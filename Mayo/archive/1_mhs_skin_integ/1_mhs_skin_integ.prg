drop program 1_mhs_skin_integ:dba go
create program 1_mhs_skin_integ:dba
 
 
/****************************************************************************
Program:  1_mhs_skin_integ
Created by:  Mary Wiersgalla (LM)
Created Date:  11/2010
 
Description:
 
Modifications:
1-
2-
3-
*****************************************************************************/
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Facility" = 0
 
with OUTDEV, fac
 
SET MaxSecs = 1800
 
declare census_cd = f8 with protect, constant(uar_get_code_by("MEANING", 339, "CENSUS"))
 
 
select  distinct into  $outdev
 patient_name =p.name_full_formatted,
 fin =ea.alias,
 facility = uar_get_code_description (e.loc_facility_cd),
 nurse_unit = uar_get_code_display (e.loc_nurse_unit_cd),
 room = uar_get_code_display (e.loc_room_cd),
 bed = uar_get_code_display (e.loc_bed_cd),
 reg_date = e.reg_dt_tm,
 age = cnvtage(p.birth_dt_tm),
 event_tag =ce.result_val,
 relationship = uar_get_code_display (ep.encntr_prsnl_r_cd),
 attending_physician =pr.name_full_formatted,
 ;for no records msg
 rec_ind = decode(p.seq,1)
from
( clinical_event ce ),
( encounter  e ),
( person  p ),
( encntr_alias  ea ),
( encntr_prsnl_reltn  ep ),
( prsnl  pr ),
( nurse_unit nu ),
( encntr_domain ed )
 
 
; 12.10.09
plan nu
where nu.loc_facility_cd = ($fac)
and nu.end_effective_dt_tm > sysdate
and nu.active_ind = 1
 
join ed
where ed.loc_nurse_unit_cd = nu.location_cd
  and ed.encntr_domain_type_cd = census_cd
  and ed.end_effective_dt_tm+0 > sysdate
  and ed.active_ind = 1
 
 
join e  where ed.encntr_id = e.encntr_id
; != Discharged
and (e.encntr_status_cd!= 856.00)
 
 
join ( ep
; Attending Physician
where (ep.encntr_id=e.encntr_id) and (ep.encntr_prsnl_r_cd= 1119.00 ) and (ep.active_ind= 1 ) and (
ep.data_status_cd= 25 ) and (ep.end_effective_dt_tm > cnvtdatetime("30-DEC-2100")))
and ( pr
where (pr.person_id=ep.prsnl_person_id))
 
  join ( ea
; FIN
where (ea.encntr_id=e.encntr_id) and (ea.encntr_alias_type_cd = 1077.00 ))
 
 and ( p
where (p.person_id=e.person_id)
and p.name_last_key != "TESTPATIENT"
)
 
join ce
where ce.encntr_id=e.encntr_id
and (ce.event_title_text = "Braden Q Score" or ce.event_title_text = "Braden Score")
and ce.valid_until_dt_tm > cnvtdatetime("30-DEC-2100")
and ce.updt_dt_tm = (select max(c2.updt_dt_tm) from clinical_event c2
where c2.encntr_id = ce.encntr_id and (c2.event_title_text = "Braden Q Score"
or c2.event_title_text = "Braden Score")
and c2.valid_until_dt_tm > cnvtdatetime("30-DEC-2100")
)
 
 
order by
facility,
nurse_unit ,
 room,
 bed
 
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
 
 ;;call print ( calcpos ( 245 , ( y_pos + 27 ))),
 ;;"Luther Hospital" ,
 ;;row + 1 ,
 
 ; call print ( calcpos ( 245 , ( y_pos + 27 ))),
 ;facility,
 ;row + 1 ,
 
 call print ( calcpos ( 230 , ( y_pos + 37 ))),
 "Skin Integrity Risk" ,
 ;row + 1 ,
 y_pos =( y_pos + 80 )
head page
 
if ( ( curpage > 1 ) )  y_pos = 18
endif
,
 row + 1 ,
 "{f/1}{cpi/14}" ,
 
  call print ( calcpos ( 24 , ( y_pos + 2 ))),
 "Nurse Unit" ,
 
 call print ( calcpos ( 24 , ( y_pos + 11 ))),
 "Room/Bed" ,
 
 call print ( calcpos ( 120 , ( y_pos + 2 ))),
 "Patient" ,
 
 call print ( calcpos ( 120 , ( y_pos + 11 ))),
 "Age" ,
 
 call print ( calcpos ( 280, ( y_pos + 2 ))),
 "Reg Date" ,
 
 call print ( calcpos ( 280 , ( y_pos + 11 ))),
 "FIN" ,
 
 call print ( calcpos ( 360 , ( y_pos + 11 ))),
 "Attending Physician" ,
 
 call print ( calcpos ( 540 , ( y_pos + 11 ))),
 "Score" ,
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
 
 
;;;;;head  nurse_unit
 
;; begin age IF statement for NURSE_UNIT
;; is patient age greater than or equal to 18?  ;; is skin integrity score less than or equal to 14?
;; is patient age less than 18?  ;; is skin integrity score less than or equal to 21?
;;;;;if(((p.birth_dt_tm < cnvtlookbehind("18,Y"))
;;;;;and cnvtint(event_tag) <= 14) OR
;;;;;((p.birth_dt_tm >= cnvtlookbehind("18,Y"))
;;;;;and cnvtint(event_tag) <= 21))
 
;;;;;if ( (( y_pos + 77 )>= 792 ) )  y_pos = 0 , break
;;;;;endif
 
 
;;;;;, row + 1 , "{f/1}{cpi/13}" ,
;;;;; call print ( calcpos ( 24 , ( y_pos + 11 ))),
;;;;; facility , row + 1 , y_pos =( y_pos + 23 )
 
;;;;;, row + 1 , "{f/1}{cpi/13}" ,
;;;;; call print ( calcpos ( 24 , ( y_pos + 11 ))),
;;;;; nurse_unit , row + 1 , y_pos =( y_pos + 23 )
 
;;;;;endif
;; end age IF statemnet for NURSE_UNIT
 
detail
 
 ;for no records msg
if ((ROW + 2) >= maxrow) break endif
dcnt = dcnt +1
 
;; begin age IF statement for DETAILS
;; is patient age greater than or equal to 18?  ;; is skin integrity score less than or equal to 14?
;; is patient age less than 18?  ;; is skin integrity score less than or equal to 21?
if(((p.birth_dt_tm < cnvtlookbehind("18,Y"))
and cnvtint(event_tag) <= 14) OR
((p.birth_dt_tm >= cnvtlookbehind("18,Y"))
and cnvtint(event_tag) <= 21))
 
if ( (( y_pos + 97 )>= 792 ) )  y_pos = 0 , break
endif
,
 
 room1 = substring ( 1 ,  10 ,  room ),
 bed1 = substring ( 1 , 6 ,  bed ),
 loc = concat(trim(room1), "/", trim(bed1)) ,
 pt = substring(1,60,patient_name),
 at = substring(1,60,attending_physician),
 nurun = substring(1,60,nurse_unit),
 row + 1 ,
 "{f/0}{cpi/15}" ,
 
 call print ( calcpos ( 24 , ( y_pos + 2 ))),
 nurun,
 row + 1 ,
 
 call print ( calcpos ( 24 , ( y_pos + 11 ))),
 loc,
 row + 1 ,
 
 call print ( calcpos ( 120 , ( y_pos + 2 ))),
 pt ,
 row + 1 ,
 
  call print ( calcpos ( 120 , ( y_pos + 11 ))),
 age ,
 row + 1,
 
 call print ( calcpos ( 280 , ( y_pos + 2 ))),
 reg_date ,
 row + 1 ,
 
 call print ( calcpos ( 280 , ( y_pos + 11 ))),
 fin ,
 row + 1 ,
 
 call print ( calcpos ( 360 , ( y_pos + 11 ))),
 at ,
 row + 1 ,
 
 call print ( calcpos ( 540 , ( y_pos + 11 ))),
 event_tag ,
 
 y_pos =( y_pos + 30 )
 
;;;break
endif
;; end age IF statemnet for DETAILS
 
;;;;;foot   nurse_unit
 
 
;;;;; y_pos =( y_pos + 0 )
 
 
foot page
 y_pos = 726 ,
 row + 1 ,
 "{f/0}{cpi/14}" ,
 
 call print ( calcpos ( 20 , ( y_pos + 11 ))),
 "Skin Integrity Risk, page:" ,
 row + 1 ,
 
 call print ( calcpos ( 167 , ( y_pos + 11 ))),
 curpage
 with  maxcol = 300 , maxrow = 500 , dio = 08 , noheading , format = variable, TIME= VALUE( MaxSecs ), nullreport
  ,LANDSCAPE
 end go
 
 
 
 
