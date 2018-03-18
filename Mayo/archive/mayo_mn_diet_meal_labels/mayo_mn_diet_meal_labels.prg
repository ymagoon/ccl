/************************************************************************
          Date Written:       03/17/11
          Source file name:   mayo_mn_diet_meal_labels.prg
          Object name:        mayo_mn_diet_meal_labels
          Request #:
 
          Product:            ExploreMenu
          Product Team:
          HNA Version:        V500
          CCL Version:
 
          Program purpose:   print labels for diet orders
 
          Tables read:
 
          Tables updated:     None
 
          Executing from:     Explorer Menu
 
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000 03/17/11 Akcia      initial release                              *
 *001 04/11/11 Akcia	  remove patients not in a bed					*
 *002 12/14/12 Akcia	  add nurse units for New Prague
 ***********************************************************************
 
  ******************  END OF ALL MODCONTROL BLOCKS  ********************/
 
drop program mayo_mn_diet_meal_labels:dba go
create program mayo_mn_diet_meal_labels:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Site" = ""
	, "Start Time" = CURTIME
	, "Number of Labels" = 6
 
with OUTDEV, site, start_time, num_labels
 
 
declare census_cd = f8 with constant(uar_get_code_by("MEANING",339,"CENSUS"))
declare dietary_cd = f8 with constant(uar_get_code_by("MEANING",6000,"DIETARY"))
declare ordered_cd = f8 with constant(uar_get_code_by("MEANING",6004,"ORDERED"))
declare med_surg_nu_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"ALNHMEDSURG"))
declare spec_care_nu_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"ALNHSPECCARE"))
declare baby_place_nu_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"ALNHBABYPLACE"))
declare diets_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",106,"DIETS"))    ;001
 
declare maqn_icu_nu_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"MAQNICU"))				;102
declare maqn_med_surg_nu_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"MAQNMEDSURG"))		;102
declare maqn_nurs_nu_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"MAQNNURSERY"))			;102
declare maqn_obst_nu_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"MAQNOBSTETRICS"))		;102
declare maqn_peds_nu_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"MAQNPEDIATRICS"))		;102
 
declare nu_field1_cd = f8		;102
declare nu_field2_cd = f8		;102
declare nu_field3_cd = f8		;102
declare nu_field4_cd = f8		;102
declare nu_field5_cd = f8		;102
 
if ($site = "NP")													;102
	set nu_field1_cd = maqn_icu_nu_cd				;102
	set nu_field2_cd = maqn_med_surg_nu_cd		;102
	set nu_field3_cd = maqn_nurs_nu_cd			;102
	set nu_field4_cd = maqn_obst_nu_cd			;102
	set nu_field5_cd = maqn_peds_nu_cd			;102
else																			;102
	set nu_field1_cd = med_surg_nu_cd				;102
	set nu_field2_cd = spec_care_nu_cd		;102
	set nu_field3_cd = baby_place_nu_cd			;102
	set nu_field4_cd = -1			;102
	set nu_field5_cd = -1			;102
endif
 
select
if ($start_time = 0)
from
encntr_domain ed,
encounter e,
person p,
orders o
 
	plan ed
;102  where ed.loc_nurse_unit_cd in (med_surg_nu_cd,spec_care_nu_cd,baby_place_nu_cd)
where ed.loc_nurse_unit_cd in (nu_field1_cd,nu_field2_cd,nu_field3_cd,nu_field4_cd,nu_field5_cd)			;102
	  and ed.active_ind = 1
	  and ed.encntr_domain_type_cd = census_cd
	  and ed.end_effective_dt_tm > sysdate
	  and ed.loc_bed_cd != 0				;001
 
	join e
	where e.encntr_id = ed.encntr_id
 
	join p
	where p.person_id = ed.person_id
 
	join o
	where o.encntr_id = outerjoin(ed.encntr_id)
	  and o.catalog_type_cd = outerjoin(dietary_cd)
	  and o.active_ind = outerjoin(1)
	  and o.order_status_cd+0 = outerjoin(ordered_cd)
      and o.activity_type_cd+0 = outerjoin(diets_cd)     ;001
      ;001 and o.activity_type_cd+0 = outerjoin(681598.00)
 
else
from
encntr_domain ed,
omf_location_hist_st olh,
person p,
orders o
 
	plan ed
	where ed.loc_nurse_unit_cd in (med_surg_nu_cd,spec_care_nu_cd,baby_place_nu_cd)
	  and ed.active_ind = 1
	  and ed.encntr_domain_type_cd = census_cd
	  and ed.end_effective_dt_tm > sysdate
	  and ed.loc_bed_cd != 0				;001
 
    join olh
    where olh.encntr_id = ed.encntr_id
      and olh.loc_nurse_unit_cd in (med_surg_nu_cd,spec_care_nu_cd,baby_place_nu_cd)
      and olh.beg_transaction_dt_tm between cnvtdatetime(curdate,$start_time)
	  								and cnvtdatetime(curdate,curtime2)
 
	join p
	where p.person_id = ed.person_id
 
	join o
	where o.encntr_id = outerjoin(ed.encntr_id)
	  and o.catalog_type_cd = outerjoin(dietary_cd)
	  and o.active_ind = outerjoin(1)
	  and o.order_status_cd+0 = outerjoin(ordered_cd)
      and o.activity_type_cd+0 = outerjoin(diets_cd)     ;001
      ;001 and o.activity_type_cd+0 = outerjoin(681598.00)
endif
into $outdev  ;"nl:"
start_test = $start_time,
ed.encntr_id ,
birth_date = format(p.birth_dt_tm,"mm/dd/yy;;d"),
pat_name = substring(1,30,p.name_full_formatted),
room_bed = concat(trim(uar_get_code_display(ed.loc_room_cd),3),"-",trim(uar_get_code_display(ed.loc_bed_cd),3)),
diet = substring(1,40,o.order_mnemonic),
todays_date = format(sysdate,"mm/dd/yy;;d")
 
 
 
 
 
order room_bed,pat_name,p.person_id
 
Head Report
	m_NumLines = 0
	y_pos = 0
 	COL 0, "{F/4}{cpi/12}"
	ROW + 1
    pat_label_cnt = 0
    label_cnt = 0
 
head page
y_pos = 40
label_cnt = 0
 
head p.person_id
pat_label_cnt = 0
 
detail
for (x = 1 to $num_labels)
  label_cnt = label_cnt + 1
  if (label_cnt > 20)
    break
    label_cnt = 1
  endif
  if (even(label_cnt) = 2)
	call print(calcpos(23,y_pos)) room_bed ,row + 1
	call print(calcpos(100,y_pos)) todays_date ,row + 1
	y_pos = y_pos + 12
	call print(calcpos(23,y_pos)) pat_name ,row + 1
	call print(calcpos(178,y_pos)) birth_date ,row + 1
	y_pos = y_pos + 24
    call print(calcpos(23,y_pos)) diet ,row + 1
    y_pos = y_pos - 36
  else
	call print(calcpos(333,y_pos)) room_bed ,row + 1
	call print(calcpos(410,y_pos)) todays_date ,row + 1
	y_pos = y_pos + 12
	call print(calcpos(333,y_pos)) pat_name ,row + 1
	call print(calcpos(488,y_pos)) birth_date ,row + 1
	y_pos = y_pos + 24
    call print(calcpos(333,y_pos)) diet ,row + 1
    y_pos = y_pos + 36
  endif
 
endfor
 
 
 with nocounter,DIO= 08, maxrow = 4000, maxcol = 1000,
 skipreport = 0, format,separator = " "  ;,maxrec = 4
 
end go
