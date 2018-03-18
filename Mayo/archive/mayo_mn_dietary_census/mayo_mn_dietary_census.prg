/************************************************************************
          Date Written:       04/01/11
          Source file name:   mayo_mn_dietary_census.prg
          Object name:        mayo_mn_dietary_census
          Request #:
 
          Product:            ExploreMenu
          Product Team:
          HNA Version:        V500
          CCL Version:
 
          Program purpose:   dietary census report
 
          Tables read:
 
          Tables updated:     None
 
          Executing from:     Explorer Menu
 
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000 04/01/11 Akcia      initial release                              *
 *001 04/29/11 Akcia-SE   add 6 mont look back on HGB, add HT and WT   *
 *002 01/10/12 Akcia-SE   change diet name display based of of change to order setup
 *003 10/13/14 Akcia-SE   change prompt to show all hospitals, add RW & CA Nurse units
 *004 03/24/15 JTW M026751 Add RWHO MSP North and RWHO MSP South nurse units
 ***********************************************************************
 
  ******************  END OF ALL MODCONTROL BLOCKS  ********************/
 
drop program mayo_mn_dietary_census:dba go
create program mayo_mn_dietary_census:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Facility" = 0
 
with OUTDEV, facility
 
declare inerror_cd = f8 with protect, constant(uar_get_code_by("MEANING", 8, "INERROR"))
declare attending_cd = f8 with protect, constant(uar_get_code_by("MEANING", 333, "ATTENDDOC"))
declare diets_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 106, "DIETS"))
declare supplements_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 106, "SUPPLEMENTS"))
declare dietary_cd = f8 with constant(uar_get_code_by("MEANING",6000,"DIETARY"))
declare ordered_cd = f8 with constant(uar_get_code_by("MEANING",6004,"ORDERED"))
declare albumin_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "ALBUMINLVL"))
declare hgb_a1c_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "HGBA1C"))
declare braden_score_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "BRADENSCORE"))
declare braden_q_score_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "BRADENQSCORE"))
declare risk_fact_adult_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "NUTRITIONRISKFACTORSBYHISTORYADULT"))
declare risk_fact_peds_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "NUTRITIONRISKFACTORSBYHXPEDIATRIC"))
declare risk_fact_newborn_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "NUTRITIONRISKFACTORSBYHXNEWBORN"))
declare nutri_assess_adult_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "NUTRITIONASSESSMENTADULTFORM"))
declare nutri_assess_peds_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "NUTRITIONASSESSMENTPEDIATRICFORM"))
declare breakfast_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "BREAKFAST PERCENT"))
declare lunch_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "LUNCH PERCENT"))
declare dinner_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "DINNER PERCENT"))
declare au_icu_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"AUHOICU"))
declare au_med_surg_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"AUHOMEDSRGPD"))
declare au_psych_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"AUHOPSYCH"))
declare au_telemetry_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"AUHOTELEMETRY"))
declare au_womens_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"AUHOWOMENSSC"))
declare med_surg_nu_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"ALNHMEDSURG"))
declare spec_care_nu_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"ALNHSPECCARE"))
declare baby_place_nu_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"ALNHBABYPLACE"))
declare rwho_med_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"RWHOMEDSRGPD"))			;003
declare rwho_ob_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"RWHOOBSTETRICS"))			;003
declare rwho_icu_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"RWHOICU"))			;003
declare rwho_mspnorth_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"RWHOMSPNORTH"))			;004
declare rwho_mspsouth_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"RWHOMSPSOUTH"))			;004
declare camh_inpat_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"CAMHINPTOBSRV"))			;003
declare back_6_months = dq8 with constant(cnvtlookbehind("6,M"))  						;001
declare height_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",72,"HEIGHT"))  		;001
declare weight_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",72,"ACTUALWEIGHT"))	;001
 
;start 002
declare diet_type_id = f8
select
from
order_entry_fields oef
where oef.description = "Diet Type"
  and oef.catalog_type_cd = dietary_cd
detail
diet_type_id = oef.oe_field_id
with nocounter
 
;end 002
 
record data (
1 qual[*]
  2 facility = vc
  2 nurse_unit = vc
  2 room = vc
  2 bed = vc
  2 encntr_id = f8
  2 person_id = f8
  2 pat_name = vc
  2 age = vc
  2 admit_date = vc
  2 los = vc
  2 risks = vc
  2 braden_score = vc
  2 diagnosis = vc
  2 attending = vc
  2 height = vc   	;001
  2 weight = vc 	;001
  2 diet = vc
  2 spec_instruct = vc
  2 albumin = vc
  2 hgb_a1c = vc
  2 supplement = vc
  2 left1 = vc
  2 left2 = vc
  2 left3 = vc
  2 left1_type = c1  ;A = albumin, H= HGB, S= Supplement
  2 left2_type = c1
  2 left3_type = c1
  2 right1 = vc
  2 right2 = vc
  2 right3 = vc
  2 right1_type = c1  ;A = last Assessment, E = last eaten
  2 right2_type = c1
  2 right3_type = c1
)
 
select into "nl:"
ed.encntr_id,
nurse_unit = uar_get_code_display(r.loc_nurse_unit_cd),
room = uar_get_code_display(r.location_cd),
bed = uar_get_code_display(b.location_cd),
facility = uar_get_code_display(nu.loc_facility_cd)
from
nurse_unit nu,
room r,
bed b,
dummyt d,
encntr_domain ed
 
plan nu
where nu.loc_facility_cd = $facility ;24987324.00  ;
  and nu.active_ind = 1
  and nu.location_cd in (med_surg_nu_cd,spec_care_nu_cd,baby_place_nu_cd,au_icu_cd,
  								au_med_surg_cd,au_psych_cd,au_telemetry_cd,au_womens_cd,
  								rwho_med_cd,rwho_ob_cd,rwho_icu_cd,camh_inpat_cd,  ;003
  								rwho_mspnorth_cd,rwho_mspsouth_cd ;004
  								)
 
join r
where r.loc_nurse_unit_cd  = nu.location_cd
      ;and r.loc_nurse_unit_cd = 24990276.00  ;$location
 
  and r.active_ind = 1
  and r.end_effective_dt_tm > sysdate
 
join b
where b.loc_room_cd = r.location_cd
  and b.active_ind = 1
  and b.end_effective_dt_tm > sysdate
 
join d
join ed
where ed.loc_nurse_unit_cd = r.loc_nurse_unit_cd
  and ed.loc_bed_cd = b.location_cd
  and ed.loc_room_cd = r.location_cd
  and ed.active_ind = 1
  and ed.end_effective_dt_tm > sysdate
 
order  nurse_unit,room,bed
 
head report
cnt = 0
 
detail
cnt = cnt + 1
stat = alterlist(data->qual,cnt)
data->qual[cnt].encntr_id = ed.encntr_id
data->qual[cnt].person_id = ed.person_id
data->qual[cnt].nurse_unit = nurse_unit
data->qual[cnt].room = room
data->qual[cnt].bed = bed
data->qual[cnt].facility = facility
 
 
 with outerjoin=d
 
select into "nl:"  ;$outdev  ;
data->qual[d.seq].encntr_id,
p.name_full_formatted,
p.person_id,
e.encntr_id
from
(dummyt d with seq = size(data->qual,5)),
encounter e,
person p,
encntr_prsnl_reltn epr,
prsnl pl,
orders o,
order_detail od1,			;002
orders o1,
order_detail od
 
plan d
where data->qual[d.seq].encntr_id > 0
 
join e
where e.encntr_id = data->qual[d.seq].encntr_id
 
join p
where p.person_id = e.person_id
 
join epr
where epr.encntr_id = outerjoin(e.encntr_id)
  and epr.encntr_prsnl_r_cd = outerjoin(attending_cd)
  and epr.active_ind = outerjoin(1)
  and epr.end_effective_dt_tm > outerjoin(sysdate)
 
join pl
where pl.person_id = outerjoin(epr.prsnl_person_id)
 
join o
where o.encntr_id = outerjoin(e.encntr_id)
  and o.catalog_type_cd = outerjoin(dietary_cd)
  and o.active_ind = outerjoin(1)
  and o.order_status_cd+0 = outerjoin(ordered_cd)
  and o.activity_type_cd+0 = outerjoin(diets_cd)
 
join od1											;002
where od1.order_id = outerjoin(o.order_id)			;002
  and od1.oe_field_id = outerjoin(diet_type_id)			;002
 
join o1
where o1.encntr_id = outerjoin(e.encntr_id)
  and o1.catalog_type_cd = outerjoin(dietary_cd)
  and o1.active_ind = outerjoin(1)
  and o1.order_status_cd+0 = outerjoin(ordered_cd)
  and o1.activity_type_cd+0 = outerjoin(supplements_cd)
 
join od
where od.order_id = outerjoin(o1.order_id)
  and od.oe_field_meaning = outerjoin("DIETARYSUPP")
 
 
order d.seq
 
head report														;002
cnt = 0															;002
 
head d.seq														;002
data->qual[d.seq].admit_date = format(e.reg_dt_tm,"mm/dd/yy;;d")
data->qual[d.seq].pat_name = p.name_full_formatted
data->qual[d.seq].age = substring(1,5,cnvtage(p.birth_dt_tm))
data->qual[d.seq].attending = pl.name_full_formatted
data->qual[d.seq].diagnosis = e.reason_for_visit
data->qual[d.seq].los = cnvtstring(datetimediff(sysdate,e.reg_dt_tm),11,2)
data->qual[d.seq].supplement = od.oe_field_display_value
cnt = 0
 
detail
cnt = cnt + 1
if (o.hna_order_mnemonic = "Diet")							;002
  if (cnt = 1)												;002
  	data->qual[d.seq].diet = od1.oe_field_display_value		;002
  else														;002
    data->qual[d.seq].diet = concat(trim(data->qual[d.seq].diet,3),", ",od1.oe_field_display_value)		;002
  endif														;002
else														;002
  data->qual[d.seq].diet = o.hna_order_mnemonic				;002
endif														;002
 
with nocounter
 
;get risks
select into "nl:"
from
(dummyt d with seq = size(data->qual,5)),
clinical_event ce
 
plan d
where data->qual[d.seq].encntr_id > 0
 
join ce
where ce.encntr_id = data->qual[d.seq].encntr_id
  and ce.task_assay_cd in (risk_fact_adult_cd,risk_fact_peds_cd,risk_fact_newborn_cd)
  and ce.view_level = 1
  and ce.valid_until_dt_tm > sysdate
  and ce.result_status_cd != inerror_cd
 
order d.seq, ce.event_end_dt_tm desc
 
head d.seq
data->qual[d.seq].risks = ce.result_val
 
with nocounter
 
;get last assessment
select into "nl:"
from
(dummyt d with seq = size(data->qual,5)),
clinical_event ce
 
plan d
where data->qual[d.seq].encntr_id > 0
 
join ce
where ce.encntr_id = data->qual[d.seq].encntr_id
  and ce.event_cd in (nutri_assess_adult_cd,nutri_assess_peds_cd)
  and ce.view_level = 1
  and ce.valid_until_dt_tm > sysdate
  and ce.result_status_cd != inerror_cd
 
order d.seq, ce.event_end_dt_tm desc
 
head d.seq
  data->qual[d.seq].right1 = format(ce.event_end_dt_tm,"mm/dd/yy hh:mm;;d")
  data->qual[d.seq].right1_type = "A"
 
with nocounter
 
;get last eaten
select into "nl:"
from
(dummyt d with seq = size(data->qual,5)),
clinical_event ce
 
plan d
where data->qual[d.seq].encntr_id > 0
 
join ce
where ce.encntr_id = data->qual[d.seq].encntr_id
  and ce.task_assay_cd in (breakfast_cd,lunch_cd,dinner_cd)
  and ce.view_level = 1
  and ce.valid_until_dt_tm > sysdate
  and ce.result_status_cd != inerror_cd
 
order d.seq, ce.event_end_dt_tm desc
 
head report
if (data->qual[d.seq].right1 > " ")
  data->qual[d.seq].right2 = concat(trim(ce.result_val,3),"%  ",format(ce.event_end_dt_tm,"mm/dd/yy hh:mm;;d"))
  data->qual[d.seq].right2_type = "E"
else
  data->qual[d.seq].right1 = concat(trim(ce.result_val,3),"%  ",format(ce.event_end_dt_tm,"mm/dd/yy hh:mm;;d"))
  data->qual[d.seq].right1_type = "E"
endif
 
;data->qual[d.seq].risks = ce.result_val
 
with nocounter
 
;get albumin, braden score
; get height and weight also  ;001
select into "nl:"
from
(dummyt d with seq = size(data->qual,5)),
clinical_event ce
 
plan d
where data->qual[d.seq].encntr_id > 0
 
join ce
where ce.encntr_id = data->qual[d.seq].encntr_id
;001  and ce.event_cd in (albumin_cd,braden_score_cd,braden_q_score_cd)
  and ce.event_cd in (albumin_cd,braden_score_cd,braden_q_score_cd,height_cd,weight_cd)    ;001
  and ce.view_level = 1
  and ce.valid_until_dt_tm > sysdate
  and ce.result_status_cd != inerror_cd
 
order d.seq, ce.event_cd, ce.event_end_dt_tm desc
 
head d.seq
col + 1
 
head ce.event_cd
if (ce.event_cd = albumin_cd)
  data->qual[d.seq].left1 = ce.result_val
  data->qual[d.seq].left1_type = "A"
elseif (ce.event_cd in (braden_score_cd,braden_q_score_cd))
  data->qual[d.seq].braden_score = ce.result_val
elseif (ce.event_cd = height_cd)																				;001
  data->qual[d.seq].height = concat(trim(ce.result_val,3),"  ",uar_get_code_display(ce.result_units_cd))		;001
elseif (ce.event_cd = weight_cd)																				;001
  data->qual[d.seq].weight = concat(trim(cnvtstring(cnvtreal(ce.result_val),11,2),3),"  ",						;001
  										uar_get_code_display(ce.result_units_cd))								;001
endif
 
with nocounter
 
;get hgb
select into "nl:"
from
(dummyt d with seq = size(data->qual,5)),
clinical_event ce
 
plan d
where data->qual[d.seq].person_id > 0
 
join ce
where ce.person_id = data->qual[d.seq].person_id
  and ce.event_cd = hgb_a1c_cd
  and ce.event_end_dt_tm > cnvtdatetime(back_6_months)    ;001
  and ce.view_level = 1
  and ce.valid_until_dt_tm > sysdate
  and ce.result_status_cd != inerror_cd
 
order d.seq, ce.event_cd, ce.event_end_dt_tm desc
 
head d.seq
col + 1
 
head ce.event_cd
if (data->qual[d.seq].left1 > " ")
  data->qual[d.seq].left2 = ce.result_val
  data->qual[d.seq].left2_type = "H"
else
  data->qual[d.seq].left1 = ce.result_val
  data->qual[d.seq].left1_type = "H"
endif
with nocounter
 
for (x=1 to size(data->qual,5))
 if (data->qual[x].supplement > " ")
	if (data->qual[x].left1 > " ")
	  if (data->qual[x].left2 > " ")
	    set data->qual[x].left3 = data->qual[x].supplement
	    set data->qual[x].left3_type = "S"
	  else
	    set data->qual[x].left2 = data->qual[x].supplement
	    set data->qual[x].left2_type = "S"
	  endif
	else
	  set data->qual[x].left1 = data->qual[x].supplement
	  set data->qual[x].left1_type = "S"
	endif
  endif
endfor
call echorecord(data)
 
execute ReportRtl
 
%i mhs_prg:mayo_mn_dietary_census.dvl
 set facility_cd = $facility
select into "nl:"
nurse_unit = data->qual[d.seq].nurse_unit,
room = data->qual[d.seq].room,
bed = data->qual[d.seq].bed ,
facility_name = data->qual[d.seq].facility
from
(dummyt d with seq = size(data->qual,5))
 
order nurse_unit, room, bed
 
head report
call InitializeReport(0)
_fEndDetail = RptReport->m_pageWidth - RptReport->m_marginRight
nPAGE = 1
dumb_var = 0
cntr = 0
first_time = "Y"
 
head page
x = HeadPageSection(0)
 
head nurse_unit
if (first_time = "N")
  call PageBreak(0)
  x = HeadPageSection(0)
endif
first_time = "N"
 
detail
cntr = d.seq
if (_YOffset + DetailSection(1,7.0,dumb_var) + LayoutSection1(1) + LayoutSection2(1) + LayoutSection3(1) > _fEndDetail )
  call PageBreak(0)
  x = HeadPageSection(0)
endif
x = DetailSection(Rpt_Render,7.0,dumb_var)			;002
;002 x = DetailSection(0)
x = LayoutSection1(0)
x = LayoutSection2(0)
x = LayoutSection3(0)
x = BlankSection(0)
 
with nocounter
call FinalizeReport($outdev)
 
 
 end go
