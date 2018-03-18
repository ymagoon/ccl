drop program mayo_mn_h1n1_daily_rpt go
create program mayo_mn_h1n1_daily_rpt
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
 
with OUTDEV
 
 
 
;declare variables
declare h1n1_1_id = f8
declare h1n1_2_id = f8
declare attending_cd = f8 with protect, constant(uar_get_code_by("MEANING", 333, "ATTENDDOC"))
 
;declare record structure
record counts (
1 facility[*]
  2 total_cnt = i2
  2 name = vc
  2 nurse_unit[*]
    3 name = vc
    3 cnt = i2
  2 provider[*]
  	3 name = vc
  	3 cnt = i2
  2 prov_detail[*]
    3 prov_name = vc
)
 
record nomen
(1 qual[*]
	2 nomen_id = f8
)
 
;get nomenclature ids
select into "nl:"
from
nomenclature n
 
plan n
where n.source_identifier in ("488.1","487.1")
  and n.active_ind = 1
  and n.end_effective_dt_tm > sysdate
 
head report
ncnt = 0
 
detail
ncnt = ncnt + 1
stat = alterlist(nomen->qual,ncnt)
nomen->qual[ncnt]->nomen_id = n.nomenclature_id
 
with nocounter
 
 
;get counts
select into $outdev  ;
d.diagnosis_id,
d.diag_priority,
dlk = uar_get_code_display(d.diag_type_cd),
elh.encntr_loc_hist_id,
facility = uar_get_code_display(elh.loc_facility_cd),
nurse_unit = uar_get_code_display(elh.loc_nurse_unit_cd),
provider = substring(1,40,pl.name_full_formatted)
 
 
from
(dummyt d1 with seq = size(nomen->qual,5)),
diagnosis d,
encntr_loc_hist elh,
encntr_prsnl_reltn epr,
prsnl pl
 
plan d1
 
join d
where d.nomenclature_id = nomen->qual[d1.seq].nomen_id
  and d.active_ind = 1
  and d.end_effective_dt_tm > sysdate
  and d.beg_effective_dt_tm > cnvtdatetime(curdate-1,curtime)
 
join elh
where elh.encntr_id = d.encntr_id
  and elh.beg_effective_dt_tm+0 < d.beg_effective_dt_tm
  and elh.end_effective_dt_tm+0 > d.beg_effective_dt_tm
  and elh.active_ind = 1
 
join epr
where epr.encntr_id = d.encntr_id
  and epr.encntr_prsnl_r_cd = attending_cd
  and epr.active_ind = 1
  and epr.end_effective_dt_tm > sysdate
 
join pl
where pl.person_id = epr.prsnl_person_id
 
order facility, nurse_unit, pl.name_full_formatted
 
head report
fcnt = 0
ucnt = 0
pcnt = 0
fac_cnt = 0
loc_cnt = 0
line = fillstring(80,"_")
 
head page
  ypos = 20
  row + 1
  "{f/8}{cpi/16}{lpi/10}", row + 1
 
  call print(calcpos(250, ypos)),"{cpi/10}{B}H1N1 Daily Report{ENDB}{cpi/14}", row + 1
  call print(calcpos(508, ypos)), "Page:", row + 1
  call print(calcpos(534, ypos)), curpage "##", row + 1
 ypos = ypos + 12
 disp = concat("Run Date ",format(cnvtdatetime(curdate-1,curtime),"mm/dd/yy hh:mm;;d")," - ",
 					format(cnvtdatetime(curdate,curtime),"mm/dd/yy hh:mm;;d")
)
 call print(calcpos(220, ypos)),disp, row + 1
 
 
 ypos = ypos + 20
 
 
 ;disp = concat("{B}Facility:{ENDB}")
 call print(calcpos(60, ypos)),"{B}Facility", row + 1
 
 ;ypos = ypos + 16
; if (ypos + 50 > 680)
;   break
; endif
 call print(calcpos(150, ypos)),"Location", row + 1
 call print(calcpos(260, ypos)),"Provider", row + 1
 call print(calcpos(410, ypos)),"Count{ENDB}", row + 1
 ypos = ypos + 6
 call print(calcpos(60, ypos)),line, row + 1
 ypos = ypos + 12
 
head facility
 if (ypos + 50 > 650)
   break
 endif
fac_cnt = 0
 call print(calcpos(60, ypos)),facility, row + 1
 
head nurse_unit
 loc_cnt = 0
 call print(calcpos(150, ypos)),nurse_unit, row + 1
 
head pl.name_full_formatted
 call print(calcpos(260, ypos)),provider, row + 1
 
foot pl.name_full_formatted
disp = cnvtstring(count(d.encntr_id))
loc_cnt = loc_cnt + count(d.encntr_id)
 call print(calcpos(420, ypos)),disp, row + 1
 ypos = ypos + 12
 
foot nurse_unit
 call print(calcpos(150, ypos)),"{B}Loc Total: ",loc_cnt,"{ENDB}", row + 1
 ypos = ypos + 13
 fac_cnt = fac_cnt + loc_cnt
 
foot facility
 call print(calcpos(100, ypos)),"{B}Facility Total: ",fac_cnt,"{ENDB}", row + 1
 ypos = ypos + 18
 
 
 
with nocounter, dio=postscript, maxcol = 1000, maxrow = 3000
 
end
go
 
