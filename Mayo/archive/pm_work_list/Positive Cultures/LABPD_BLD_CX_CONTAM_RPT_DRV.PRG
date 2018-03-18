drop program labpd_bld_cx_contam_rpt_drv go
create program labpd_bld_cx_contam_rpt_drv
 
prompt
	"Output to File/Printer/MINE" = "MINE"                  ;* Enter or select the printer or file name to send this report to.
	, "Start date time" = "01-JUL-2010 00:00:00"
	, "End date time" = "SYSDATE"
	, "Facility" = 0
	, "Nurse Unit" = 0
	, "Orderable" = VALUE(657701.00, 2921998.00)
	;<<hidden>>"Show Inactives" = 1
	;<<hidden>>"Filter Response List" = 0
	, "Response" = VALUE(4238575.00, 312304.00,312305.00)
 
with OUTDEV, begin_dt_tm, end_dt_tm, facility_cd, nurse_unit_cd, catalog_cd,
	resp_cd
 
if ($facility_cd != NULL)
  if ($nurse_unit_cd != NULL)
    set loc_parser_string = 2
  else
    set loc_parser_string = 1
  endif
else
  set loc_parser_string = 0
endif
 
declare total_bldcx = i4
declare percent = f8
declare y = i4
set     y = 0
set     fin_nbr_cd        = uar_get_code_by("MEANING", 319,"FIN NBR")
set     mrn_cd            = uar_get_code_by("MEANING", 319,"MRN")
%i labpd_bld_cx_contam_rpt.inc
 
/************************************
** get nurse unit stats
************************************/
select distinct into "nl:"
  nurse_unit = uar_get_code_display(mso.collect_loc_nurse_unit_cd)
  , mso.order_id
from
	mic_stat_task mst
	, mic_stat_order mso
 
plan mso where mso.catalog_cd in ($catalog_cd)
	         and mso.collect_dt_tm between cnvtdatetime($begin_dt_tm)
	                                   and cnvtdatetime($end_dt_tm)
           and ((loc_parser_string = 1 and mso.collect_loc_facility_cd = $facility_cd)
                or
                (loc_parser_string = 2 and mso.collect_loc_nurse_unit_cd = $nurse_unit_cd)
                or
                (loc_parser_string = 0 and 1 = 1))
join mst where mst.order_id = mso.order_id
	         and mst.task_class_flag = 5
	         and mst.task_type_flag in (9, 10)
order by nurse_unit, mso.collect_loc_nurse_unit_cd, mso.order_id
head report
  x = 0
  y = 0
head mso.collect_loc_nurse_unit_cd
  y = y + 1
  if ((mod(y, 10) = 1))
    stat = alterlist (contam->stats[1].units, (y + 9))
  endif
  z = 0
detail
  z = z + 1
  x = x + 1
  contam->stats[1].units[y].total_cnt = z
  contam->stats[1].units[y].unit_cd   = mso.collect_loc_nurse_unit_cd
  if (mso.collect_loc_nurse_unit_cd = 0)
    contam->stats[1].units[y].unit_disp = "*Not Specified"
  else
    contam->stats[1].units[y].unit_disp = uar_get_code_display(mso.collect_loc_nurse_unit_cd)
  endif
foot report
  stat = alterlist (contam->stats[1].units, y)
  total_bldcx = x
with nocounter
/************************************
** get phlebotomist stats
************************************/
select into "nl:"
  pr.name_full_formatted
  , mso.order_id
from
	mic_stat_task mst
	, mic_stat_order mso
	, dummyt d1
	, prsnl pr
 
plan mso where mso.catalog_cd in ($catalog_cd)
	         and mso.collect_dt_tm between cnvtdatetime($begin_dt_tm)
	                                   and cnvtdatetime($end_dt_tm)
           and ((loc_parser_string = 1 and mso.collect_loc_facility_cd = $facility_cd)
                or
                (loc_parser_string = 2 and mso.collect_loc_nurse_unit_cd = $nurse_unit_cd)
                or
                (loc_parser_string = 0 and 1 = 1))
join mst where mst.order_id = mso.order_id
	         and mst.task_class_flag = 5
	         and mst.task_type_flag in (9, 10)
join d1
join pr  where pr.person_id = mso.collect_prsnl_id
order by pr.name_full_formatted,mso.collect_prsnl_id, mso.order_id
 
head report
  x = 0
  y = 0
head mso.collect_prsnl_id
  y = y + 1
  if ((mod(y, 10) = 1))
    stat = alterlist (contam->stats[1].phlebs, (y + 9))
  endif
  z = 0
detail
  z = z + 1
  x = x + 1
  contam->stats[1].phlebs[y].total_cnt = z
  contam->stats[1].phlebs[y].phleb_id  = mso.collect_prsnl_id
  if (mso.collect_prsnl_id = 0)
    contam->stats[1].phlebs[y].name = "*Not Specified"
    contam->stats[1].phlebs[y].username = "*Not Specified"
  else
    contam->stats[1].phlebs[y].name = pr.name_full_formatted
    contam->stats[1].phlebs[y].username = pr.username
  endif
foot report
  stat = alterlist (contam->stats[1].phlebs, y)
with nocounter, outerjoin = d1
/************************************
** get contaminated stats
************************************/
select distinct into $OUTDEV
  pr.name_full_formatted
  , mso.order_id
  , mso.collect_prsnl_id
from
	mic_stat_task mst
	, mic_stat_report_response msrr
	, mic_stat_order mso
	, person p
	, encounter e
	, person p2
	, encntr_alias ea
	, prsnl pr
	, encntr_alias fin
	, prsnl pr2
	, order_laboratory ol
	, dummyt d1
	, dummyt d2
 
plan mso  where  mso.catalog_cd in ($catalog_cd)
	          and  mso.collect_dt_tm between cnvtdatetime($begin_dt_tm)
	                                     and cnvtdatetime($end_dt_tm)
           and ((loc_parser_string = 1 and mso.collect_loc_facility_cd = $facility_cd)
                or
                (loc_parser_string = 2 and mso.collect_loc_nurse_unit_cd = $nurse_unit_cd)
                or
                (loc_parser_string = 0 and 1 = 1))
join mst  where  mst.order_id = mso.order_id
	          and  mst.task_class_flag = 5
	          and  mst.task_type_flag in (9, 10)
join msrr where msrr.task_log_id = mst.task_log_id
	          and msrr.response_cd in ($resp_cd)
join ol   where   ol.order_id = mso.order_id
join p    where    p.person_id = mso.person_id
join p2   where  mso.order_provider_id = p2.person_id
join e    where    e.encntr_id = mso.encntr_id
join pr   where   pr.person_id = mso.collect_prsnl_id
join pr2  where  pr2.person_id = mso.receive_prsnl_id
join d1
join ea   where    ea.encntr_id = mso.encntr_id
            and    ea.encntr_alias_type_cd = mrn_cd
join d2
join fin  where  fin.encntr_id = mso.encntr_id
            and  fin.encntr_alias_type_cd = fin_nbr_cd
order by mso.collect_loc_nurse_unit_cd, mso.collect_prsnl_id, mso.order_id
 
head report
  x = 0
  z = 0
  p = 0
detail
  x = x + 1
  z = z + 1
  p = p + 1
  if ((mod(x, 10) = 1))
    stat = alterlist (contam->rec, (x + 9))
  endif
  contam->rec[x].accession = cnvtacc(mso.accession_nbr)
  contam->rec[x].coll_facility_cd = mso.collect_loc_facility_cd
  contam->rec[x].coll_facility_disp = uar_get_code_display(mso.collect_loc_facility_cd)
  contam->rec[x].coll_nurse_unit_cd = mso.collect_loc_nurse_unit_cd
  if (mso.collect_loc_nurse_unit_cd = 0)
    contam->rec[x].coll_nurse_unit_disp = "*Not Specified"
  else
    contam->rec[x].coll_nurse_unit_disp = uar_get_code_display(mso.collect_loc_nurse_unit_cd)
  endif
  contam->rec[x].coll_source_cd = mso.source_cd
  contam->rec[x].coll_source_disp = uar_get_code_display(mso.source_cd)
  contam->rec[x].drawn_dt_tm = mso.collect_dt_tm
  contam->rec[x].drawn_user_full_name = pr.name_full_formatted
  contam->rec[x].drawn_user_id = mso.collect_prsnl_id
  contam->rec[x].drawn_user_name = pr.username
  contam->rec[x].enc_class_cd = e.encntr_class_cd
  contam->rec[x].enc_class_disp = uar_get_code_display(e.encntr_class_cd)
  contam->rec[x].enc_confid_level_cd = e.confid_level_cd
  contam->rec[x].enc_confid_level_disp = uar_get_code_display(e.confid_level_cd)
  contam->rec[x].enc_fin_class_cd = e.financial_class_cd
  contam->rec[x].enc_fin_class_disp = uar_get_code_display(e.financial_class_cd)
  contam->rec[x].enc_med_srv_cd = e.med_service_cd
  contam->rec[x].enc_med_srv_disp = uar_get_code_display(e.med_service_cd)
  contam->rec[x].enc_type_cd = e.encntr_type_cd
  contam->rec[x].enc_type_disp = uar_get_code_display(e.encntr_type_cd)
  contam->rec[x].enc_class_cd = e.encntr_class_cd
  contam->rec[x].enc_class_disp = uar_get_code_display(e.encntr_class_cd)
  contam->rec[x].fin = cnvtalias(fin.alias,fin.alias_pool_cd)
  contam->rec[x].inlab_dt_tm = mso.receive_dt_tm
  contam->rec[x].inlab_user_full_name = pr2.name_full_formatted
  contam->rec[x].inlab_user_id = mso.receive_prsnl_id
  contam->rec[x].inlab_user_name = pr2.username
  contam->rec[x].organism_cd = mst.organism_cd
  contam->rec[x].organism_disp = uar_get_code_display(mst.organism_cd)
  contam->rec[x].priority_cd = ol.report_priority_cd
  contam->rec[x].priority_disp = uar_get_code_display(ol.report_priority_cd)
  contam->rec[x].pt_bed_cd = e.loc_bed_cd
  contam->rec[x].pt_bed_disp = uar_get_code_display(e.loc_bed_cd)
  contam->rec[x].pt_birth_dt_tm = p.birth_dt_tm
  contam->rec[x].pt_facility_cd = e.loc_facility_cd
  contam->rec[x].pt_facility_disp = uar_get_code_display(e.loc_facility_cd)
  contam->rec[x].pt_full_name = p.name_full_formatted
  contam->rec[x].pt_mrn = cnvtalias(ea.alias,ea.alias_pool_cd)
  contam->rec[x].pt_nurse_unit_cd = e.loc_nurse_unit_cd
  contam->rec[x].pt_nurse_unit_disp = uar_get_code_display(e.loc_nurse_unit_cd)
  contam->rec[x].pt_room_cd = e.loc_room_cd
  contam->rec[x].pt_room_disp = uar_get_code_display(e.loc_room_cd)
  contam->rec[x].pt_sex_cd = p.sex_cd
  contam->rec[x].pt_sex_disp = uar_get_code_display(p.sex_cd)
  contam->rec[x].rslt_dt_tm = mst.result_dt_tm

foot report
  contam->stats[1].contam_cnt = x
  contam->stats[1].total_cnt  = total_bldcx
  contam->stats[1].percent    = round( (x * 100.0) / (total_bldcx * 1.0),4)
  stat = alterlist(contam->rec,x)
with format, separator= value(^ ^), outerjoin = d1, outerjoin = d2
 
select into "nl:"
  nurse_unit_cd = contam->stats[1].units[d1.seq].unit_cd
from
(dummyt d1 with seq = value(size(contam->stats[1].units,5)))
, (dummyt d2 with seq = value(size(contam->rec,5)))
plan d1
join d2 where contam->rec[d2.seq].coll_nurse_unit_cd = contam->stats[1].units[d1.seq].unit_cd
order by nurse_unit_cd
head nurse_unit_cd
  x = 0
detail
  x = x + 1
  contam->stats[1].units[d1.seq].contam_cnt = x
with nocounter
 
select into "nl:"
  phleb_id = contam->stats[1].phlebs[d1.seq].phleb_id
from
(dummyt d1 with seq = value(size(contam->stats[1].phlebs,5)))
, (dummyt d2 with seq = value(size(contam->rec,5)))
plan d1
join d2 where contam->rec[d2.seq].drawn_user_id = contam->stats[1].phlebs[d1.seq].phleb_id
order by phleb_id
head phleb_id
  x = 0
detail
  x = x + 1
  contam->stats[1].phlebs[d1.seq].contam_cnt = x
with nocounter
 
select into "nl:"
  phleb_id = contam->stats[1].phlebs[d1.seq].phleb_id
from (dummyt d1 with seq = value(size(contam->stats[1].phlebs,5)))
order by phleb_id
head phleb_id
  contam->stats[1].phlebs[d1.seq].percent = round( (contam->stats[1].phlebs[d1.seq].contam_cnt * 100.0) /
                                                   (contam->stats[1].phlebs[d1.seq].total_cnt * 1.0),4)
with nocounter
 
select into "nl:"
  nurse_unit_cd = contam->stats[1].units[d1.seq].unit_cd
from (dummyt d1 with seq = value(size(contam->stats[1].units,5)))
order by nurse_unit_cd
head nurse_unit_cd
  contam->stats[1].units[d1.seq].percent = round( (contam->stats[1].units[d1.seq].contam_cnt * 100.0) /
                                                   (contam->stats[1].units[d1.seq].total_cnt * 1.0),4)
with nocounter
 
;call echorecord(contam)
end go
