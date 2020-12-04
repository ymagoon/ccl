/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  avh_mpage_banner_bar
 *
 *  Description:  Script used by the BCC_PHYS_OC_CUSTOM rule in an EKS_EXEC_CCL_L template. 
 *				  This script gathers demographic information about the patient to be used in a 
 *			      banner bar in a EKS_ALERT_HTML_A template. 
 *
 *				  Info Gathered: name, age, sex, location, allergies, dob, fin, mrn, height, weight
 *  ---------------------------------------------------------------------------------------------
 *  Author:     Yitzhak Magoon
 *  Contact:    ymagoon@gmail.com
 *  Creation Date:  11/18/2020
 *
 *  Testing: execute avh_mpage_banner_bar <person_id>, <encntr_id> go 
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date      Author           Description & Requestor Information
 *  001    11/18/20  Yitzhak Magoon   Init release
 *  ---------------------------------------------------------------------------------------------
*/

drop program avh_mpage_banner_bar go
create program avh_mpage_banner_bar
 
record pt (
	1 name		= vc
	1 age		= vc
	1 sex		= vc
	1 location	= vc
	1 allergies	= vc
	1 dob		= vc
	1 fin		= vc
	1 mrn		= vc
	1 height	= vc
	1 weight	= vc
)
 
declare person_id = f8 with constant($1)
declare encntr_id = f8 with constant($2)
declare fin		  = f8 with constant(uar_get_code_by("MEANING", 319, "FIN NBR"))
declare mrn		  = f8 with constant(uar_get_code_by("MEANING", 319, "MRN"))
declare height	  = f8 with constant(uar_get_code_by("DISPLAY_KEY", 72, "HEIGHT")) ;fix later
declare weight	  = f8 with constant(uar_get_code_by("DISPLAY_KEY", 72, "WEIGHTDOSING"))
declare active    = f8 with constant(uar_get_code_by("MEANING", 12025, "ACTIVE"))
declare proposed  = f8 with constant(uar_get_code_by("MEANING", 12025, "PROPOSED"))
 
 
; get demographic and encounter information
select into "nl:"
from
  person p
  , encounter e
  , encntr_alias ea1
  , encntr_alias ea2
plan p
  where p.person_id = person_id
join e
  where e.person_id = p.person_id
    and e.encntr_id = encntr_id
join ea1
  where ea1.encntr_id = e.encntr_id
    and ea1.active_ind = 1
    and ea1.beg_effective_dt_tm <= cnvtdatetime(curdate, curtime3)
    and ea1.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
    and ea1.encntr_alias_type_cd = fin
join ea2
  where ea2.encntr_id = e.encntr_id
    and ea2.active_ind = 1
    and ea2.beg_effective_dt_tm <= cnvtdatetime(curdate, curtime3)
    and ea2.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
    and ea2.encntr_alias_type_cd = mrn
detail
  pt->name = p.name_full_formatted
  pt->age = cnvtage(p.birth_dt_tm)
  pt->sex = uar_get_code_display(p.sex_cd)
  pt->location = build2(trim(uar_get_code_display(e.loc_nurse_unit_cd)))
 
  ;add room if it exists
  if (e.loc_room_cd > 0)
    pt->location = build2(pt->location,"/",trim(uar_get_code_display(e.loc_room_cd)))
  endif
 
  ;add bed if it exists
  if (e.loc_bed_cd > 0)
    pt->location = build2(pt->location,"/",trim(uar_get_code_display(e.loc_bed_cd)))
  endif
 
  pt->dob = format(p.birth_dt_tm, "@SHORTDATE")
  pt->fin = ea1.alias
  pt->mrn = ea2.alias
with nocounter
 
; get allergies
select into "nl:"
from
  allergy a
  , nomenclature n
plan a
  where a.person_id = person_id
    and a.active_ind = 1
    and a.reaction_status_cd in (active, proposed)
join n
  where n.nomenclature_id	= a.substance_nom_id
detail
  pt->allergies = build2(pt->allergies, trim(n.source_string), ", ")
foot report
  pt->allergies = replace(pt->allergies,",","",2) ;remove last comma
with nocounter
 
; get height/weight
select into "nl:"
  ce.performed_dt_tm
  , ce.event_cd
from
  clinical_event	ce
where ce.person_id = person_id
  and ce.encntr_id = encntr_id
  and ce.event_cd in (height, weight)
order by
  ce.event_cd
  , ce.performed_dt_tm desc
head ce.event_cd
  if (ce.event_cd = height)
    pt->height = build2(trim(ce.result_val), " "
    				    , trim(uar_get_code_display(ce.result_units_cd))
    				    , " (", format(ce.performed_dt_tm, "@SHORTDATE"), ")"
    				    )
  elseif (ce.event_cd = weight)
    pt->weight = build2(trim(ce.result_val), " "
    				    , trim(uar_get_code_display(ce.result_units_cd))
    				    , " (", format(ce.performed_dt_tm, "@SHORTDATE"), ")"
    				    )
  endif
with nocounter
 
set log_misc1 = cnvtrectojson(pt,9,1)
call echo(cnvtrectojson(pt,9,1))
 
set retval = 100
 
call echorecord(pt)
set log_message = "Successfully ran"
 
end
go
 
;execute avh_cust_banner_bar 13952764.00, 117531822.00 go

