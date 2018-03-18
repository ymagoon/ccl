/****************************************************************************
Program:  mayo_mn_creatinine_trend_rpt
Created by:  Scott Easterhaus (Akcia)
Created Date:  10/2009
 
Description:  Get all creatinine results for current inpatients for a specific
site
 
Modifications:
001-make changes to increase efficiency of program
002-add code new prague
003-
*****************************************************************************/
drop program mayo_mn_creatinine_trend_rpt go
create program mayo_mn_creatinine_trend_rpt
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Facility Group" = ""
 
with OUTDEV, FACILITY_GRP
 
 
;declare variables
declare disp = vc
declare creatinine1_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "CREATININE"))
declare creatinine2_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "CREATININEMAYO"))
declare crcl_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "CRCLEARANCE"))
declare census_cd = f8 with protect, constant(uar_get_code_by("MEANING", 339, "CENSUS"))
declare fin_cd = f8 with protect, constant(uar_get_code_by("MEANING", 319, "FIN NBR"))
declare inpatient_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "INPATIENT"))
 
record facilities
( 1 qual[*]
	2 facility_cd = f8
)
 
record creat_codes			;001
( 1 qual[2]					;001
	2 event_cd = f8			;001
)
 
set creat_codes->qual[1]->event_cd =  creatinine1_cd		;001
set creat_codes->qual[2]->event_cd =  creatinine2_cd		;001
 
if ($FACILITY_GRP != "NP")										;102
	select into "nl:"
	 from code_value cv
	plan cv where cv.code_set = 220 and cv.cdf_meaning = "FACILITY"
	and cv.display_key = value(concat(trim($facility_grp,3),"*"))
 
	head report
		f_cnt = 0
	detail
		f_cnt = f_cnt + 1
		stat = alterlist(facilities->qual,f_cnt)
		facilities->qual[f_cnt].facility_cd = cv.code_value
 
 
	with nocounter
else																											;102
	set	stat = alterlist(facilities->qual,1)								;102
	set	facilities->qual[1].facility_cd =  535447694.00			;102
endif																											;102
declare num = i2
 
 
select into $outdev
 room = concat(trim(uar_get_code_display(e.loc_room_cd),3),"-",trim(uar_get_code_display(e.loc_bed_cd),3)),
 pat_name = substring(1,40,p.name_full_formatted),
 fin = cnvtalias(ea.alias,ea.alias_pool_cd),
 creat_dt_tm = format(ce.event_end_dt_tm,"mm/dd/yy hh:mm;;d"),
 creat_result = ce.result_val ;,
 
 
from
(dummyt d with seq = size(facilities->qual,5)),
nurse_unit nu,
encntr_domain ed,
encounter e,
(dummyt d1 with seq = 2),	;001
clinical_event ce,
person p,
encntr_alias ea
 
 
plan d
 
join nu
where nu.loc_facility_cd = facilities->qual[d.seq].facility_cd
  and nu.end_effective_dt_tm > sysdate
  and nu.active_ind = 1
 
join ed
where ed.loc_nurse_unit_cd = nu.location_cd
  and ed.encntr_domain_type_cd = census_cd
  and ed.end_effective_dt_tm > sysdate
  and ed.active_ind = 1
 
join e
where e.encntr_id = ed.encntr_id
  and e.encntr_type_cd = inpatient_cd
 
join p
where p.person_id = e.person_id
 
join ea
where ea.encntr_id = e.encntr_id
  and ea.encntr_alias_type_cd = fin_cd
  and ea.active_ind = 1
  and ea.end_effective_dt_tm > sysdate
 
join d1		;001
join ce
where ce.person_id = e.person_id
  and ce.event_cd = creat_codes->qual[d1.seq]->event_cd  ;001
  and ce.encntr_id+0 = e.encntr_id
  and ce.valid_until_dt_tm > sysdate
 
 
 
order nu.loc_facility_cd, nu.location_cd, room, ce.encntr_id, ce.event_end_dt_tm desc
 
 
head report
  ypos = 0
  ypos_inc = 0
	x_margin = 70
 	x_label = 50
 	x_data	= 100
 	x_mom = 305
  line = fillstring(99,"_")
  first_time = "Y"
  forced_break = "Y"
  first_page = "Y"
  creat_cnt = 0
 
head page
  ypos = 20
  row + 1
  "{f/8}{cpi/16}{lpi/10}", row + 1
 
  call print(calcpos(200, ypos)),"{cpi/10}{B}Creatinine Trend Report{ENDB}{cpi/14}", row + 1
  call print(calcpos(508, ypos)), "Page:", row + 1
  call print(calcpos(534, ypos)), curpage "##", row + 1
 
  ypos = ypos + 12
  disp = uar_get_code_display(nu.loc_facility_cd)
  call print(calcpos(230, ypos)) disp row + 1
  ypos = ypos + 10
  disp = uar_get_code_display(nu.location_cd)
  call print(calcpos(230, ypos)) disp row + 1
  ypos = ypos + 20
 call print(calcpos(300, ypos)),"Creatinine", row + 1
 call print(calcpos(370, ypos)),"Creatinine", row + 1
 call print(calcpos(425, ypos)),"CrCl", row + 1
 call print(calcpos(500, ypos)),"CrCl", row + 1
 ypos = ypos + 8
 call print(calcpos(60, ypos)),"Room", row + 1
 call print(calcpos(100, ypos)),"Patient Name", row + 1
 call print(calcpos(230, ypos)),"FIN #", row + 1
 call print(calcpos(300, ypos)),"Date/Time", row + 1
 call print(calcpos(375, ypos)),"Result", row + 1
 call print(calcpos(425, ypos)),"Date/Time", row + 1
 call print(calcpos(500, ypos)),"Result", row + 1
  ypos = ypos + 6
 call print(calcpos(60, ypos)),line, row + 1
  ypos = ypos + 12
 
 head nu.location_cd
 if (first_time = "N")
   break
 endif
 first_time = "N"
 
 head ce.encntr_id
  ypos = ypos + 6
 creat_cnt = 0
 call print(calcpos(60, ypos)), room, row + 1
 call print(calcpos(100, ypos)), Pat_name, row + 1
 call print(calcpos(230, ypos)),FIN, row + 1
 
 detail
 if (ypos + 20 > 670)
   break
 endif
 creat_cnt = creat_cnt + 1
 if (creat_cnt < 6)
   call print(calcpos(300, ypos)),creat_dt_tm, row + 1
   call print(calcpos(385, ypos)),creat_result, row + 1
 endif
 
 ypos = ypos + 10
 
 
with nocounter, dio=postscript, maxcol = 1000, maxrow = 3000
 
 
 end go
