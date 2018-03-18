/************************************************************************
          Date Written:       03/17/11
          Source file name:   mayo_mn_nourishment_labels.prg
          Object name:        mayo_mn_nourishment_labels
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
 *001 12/14/12 Akcia-se   add codes for New Prague					   *
 ***********************************************************************
 
  ******************  END OF ALL MODCONTROL BLOCKS  ********************/
 
drop program mayo_mn_nourishment_labels:dba go
create program mayo_mn_nourishment_labels:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Site" = ""
	, "Nourishment Time" = "A"
	, "Number of Labels" = 6
 
with OUTDEV, site, nourish_time, num_labels
 
 
declare census_cd = f8 with constant(uar_get_code_by("MEANING",339,"CENSUS"))
declare dietary_cd = f8 with constant(uar_get_code_by("MEANING",6000,"DIETARY"))
declare ordered_cd = f8 with constant(uar_get_code_by("MEANING",6004,"ORDERED"))
declare med_surg_nu_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"ALNHMEDSURG"))
declare spec_care_nu_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"ALNHSPECCARE"))
declare baby_place_nu_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"ALNHBABYPLACE"))
 
declare maqn_icu_nu_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"MAQNICU"))				;101
declare maqn_med_surg_nu_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"MAQNMEDSURG"))		;101
declare maqn_nurs_nu_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"MAQNNURSERY"))			;101
declare maqn_obst_nu_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"MAQNOBSTETRICS"))		;101
declare maqn_peds_nu_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",220,"MAQNPEDIATRICS"))		;101
 
declare nourish_oe_field_id = f8
 
declare nu_field1_cd = f8		;101
declare nu_field2_cd = f8		;101
declare nu_field3_cd = f8		;101
declare nu_field4_cd = f8		;101
declare nu_field5_cd = f8		;101
 
if ($site = "NP")													;101
	set nu_field1_cd = maqn_icu_nu_cd				;101
	set nu_field2_cd = maqn_med_surg_nu_cd		;101
	set nu_field3_cd = maqn_nurs_nu_cd			;101
	set nu_field4_cd = maqn_obst_nu_cd			;101
	set nu_field5_cd = maqn_peds_nu_cd			;101
else																			;101
	set nu_field1_cd = med_surg_nu_cd				;101
	set nu_field2_cd = spec_care_nu_cd		;101
	set nu_field3_cd = baby_place_nu_cd			;101
	set nu_field4_cd = -1			;101
	set nu_field5_cd = -1			;101
endif																			;101
 
select into "nl:"
from
oe_format_fields oef
where oef.label_text = "*Nourishment"
detail
if (oef.label_text = "AM Nourishment" and $nourish_time = "A")
  nourish_oe_field_id = oef.oe_field_id
elseif (oef.label_text = "PM Nourishment" and $nourish_time = "P")
  nourish_oe_field_id = oef.oe_field_id
elseif (oef.label_text = "HS Nourishment" and $nourish_time = "H")
  nourish_oe_field_id = oef.oe_field_id
endif
 
 
select into $outdev  ;"nl:"
birth_date = format(p.birth_dt_tm,"mm/dd/yy;;d"),
pat_name = substring(1,30,p.name_full_formatted),
room_bed = concat(trim(uar_get_code_display(ed.loc_room_cd),3),"-",trim(uar_get_code_display(ed.loc_bed_cd),3)),
todays_date = format(sysdate,"mm/dd/yy;;d")
,diet = if ($nourish_time = "A")
			concat("AM Nourishment - ",trim(od.oe_field_display_value,3))
	   elseif ($nourish_time = "P")
	   		concat("PM Nourishment - ",trim(od.oe_field_display_value,3))
	   elseif ($nourish_time = "H")
	   		concat("HS Nourishment - ",trim(od.oe_field_display_value,3))
	   endif
 
from
encntr_domain ed
;encounter e,
,orders o
,person p
,order_detail od
 
plan ed
;101  where ed.loc_nurse_unit_cd in (med_surg_nu_cd,spec_care_nu_cd,baby_place_nu_cd)
where ed.loc_nurse_unit_cd in (nu_field1_cd,nu_field2_cd,nu_field3_cd,nu_field4_cd,nu_field5_cd)			;101
  and ed.active_ind = 1
  and ed.encntr_domain_type_cd = census_cd
  and ed.end_effective_dt_tm > sysdate
 
join p
where p.person_id = ed.person_id
 
join o
where o.encntr_id = ed.encntr_id
  and o.catalog_type_cd = dietary_cd
  and o.active_ind = 1
  and o.order_status_cd+0 = ordered_cd
 
join od
where od.order_id = o.order_id
  and od.oe_field_id = nourish_oe_field_id
 
 
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
 
 
 with nocounter,DIO= 08, maxrow = 4000, maxcol = 1000, skipreport = 0, format,separator = " "
 
end go
