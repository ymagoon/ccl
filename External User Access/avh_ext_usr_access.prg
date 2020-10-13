/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  avh_ext_usr_access
 *
 *  Description:  Executed by the External User Access mPage.
 *
 *				  This program is used by External Users (currently only TeamHealth) to restrict
 *                access to patients they do not have relationships with.
 *  ---------------------------------------------------------------------------------------------
 *  Author:     	Yitzhak Magoon
 *  Contact:    	yithak.magoon@avhospital.org
 *  Creation Date:  10/06/2020
 *
 *  Testing:
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date        Author           Description & Requestor Information
 *  000    10/06/2020  Yitzhak Magoon   Initial Release
 *  001	   10/13/2020  Yitzhak Magoon	SR 432972088 Midwife relationships have end_effective_dt_tm
 *                                      being modified. Need to account for this so patients still pull
 *
 *  ---------------------------------------------------------------------------------------------
*/

drop program avh_ext_usr_access go
create program avh_ext_usr_access
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "prsnl_id" = 0
 
with OUTDEV, prsnl_id
 
record data (
  1 person_id = f8
  1 position_cd = f8
  1 name_full_formatted = vc
 
  1 pg [*]
    2 prsnl_group_id = f8
    2 prsnl_group_name = vc
 
  1 prsnl [*]
    2 prsnl_id = f8
    2 position_cd = f8
    2 name_full_formatted = vc
 
  1 pat_list [*]
    2 person_id     = f8
    2 encntr_id     = f8
    2 name          = vc
    2 mrn 		    = vc
    2 fin 		    = vc
    2 admit_dt_tm   = vc
    2 disch_dt_tm   = vc
)
 
set idx 				= 0
set ext_billing_pos_cd  = uar_get_code_by("DISPLAY_KEY",88,"EXTERNALBILLINGPHYSICIANOFFICE")
set dba_pos_cd 			= uar_get_code_by("DISPLAY_KEY",88,"DBA")
set provider_group_cd   = uar_get_code_by("MEANING",19189,"DCPTEAM")
 
set mrn_cd    			= uar_get_code_by("MEANING",4,"MRN")
set fin_cd     			= uar_get_code_by("MEANING",319,"FIN NBR")
set format_mdy 			= "mm/dd/yyyy;;d"
 
;relationships
set attending_rel_cd 	= uar_get_code_by("MEANING",333,"ATTENDDOC")
set admitting_rel_cd 	= uar_get_code_by("MEANING",333,"ADMITDOC")
set covering_rel_cd 	= uar_get_code_by("DISPLAY_KEY",333,"COVERINGPHYSICIAN")
set consulting_rel_cd   = uar_get_code_by("MEANING",333,"CONSULTDOC")
set pat_account_rel_cd  = uar_get_code_by("DISPLAY_KEY",333,"PATIENTACCOUNTINGREVIEW")
set midwife_rel_cd      = uar_get_code_by("DISPLAY_KEY",333,"MIDWIFE")
 
/****************************************
 * FIND USER INFO AND PROVIDER GROUP(S) *
 ****************************************/
 
select into "nl:"
from
  prsnl p
  , prsnl_group_reltn pgr
  , prsnl_group pg
plan p
  where p.person_id = $prsnl_id
    and p.active_ind = 1
join pgr
  where pgr.person_id = p.person_id
    and pgr.active_ind = 1
    and pgr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and pgr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
join pg
  where pg.prsnl_group_id = pgr.prsnl_group_id
    and pg.active_ind = 1
    and pg.prsnl_group_class_cd = provider_group_cd
    and pg.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3)
    and pg.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
order by
  p.name_full_formatted
  , pgr.prsnl_group_reltn_id
head report
  data->person_id = p.person_id
  data->position_cd = p.position_cd
  data->name_full_formatted = p.name_full_formatted
 
  pgCnt = 0
detail
  pgCnt = pgCnt + 1
 
  if (mod(pgCnt,10) = 1)
    stat = alterlist(data->pg, pgCnt + 10)
  endif
 
  data->pg[pgCnt].prsnl_group_id = pg.prsnl_group_id
  data->pg[pgCnt].prsnl_group_name = pg.prsnl_group_name
foot report
  stat = alterlist(data->pg, pgCnt)
with nocounter
 
/*******************************************
 * FIND ALL USERS WITHIN PROVIDER GROUP(S) *
 *******************************************/
 
select into "nl:"
from
  prsnl_group pg
  , prsnl_group_reltn pgr
  , prsnl p
plan pg
  where expand(idx, 1, size(data->pg,5), pg.prsnl_group_id, data->pg[idx].prsnl_group_id)
    and pg.prsnl_group_id > 0
    and pg.prsnl_group_class_cd = provider_group_cd
    and pg.active_ind = 1
    and pg.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and pg.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
join pgr
  where pgr.prsnl_group_id = pg.prsnl_group_id
    and pgr.active_ind = 1
    and pgr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and pgr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
join p
  where p.person_id = pgr.person_id
    and p.active_ind = 1
;    and p.person_id != data->person_id ; don't return person executing mPage
head report
  pCnt = 0
detail
  pCnt = pCnt + 1
 
  if (mod(pCnt,10) = 1)
    stat = alterlist(data->prsnl, pCnt + 10)
  endif
 
  data->prsnl[pCnt].prsnl_id = p.person_id
  data->prsnl[pCnt].position_cd = p.position_cd
  data->prsnl[pCnt].name_full_formatted = p.name_full_formatted
foot report
  stat = alterlist(data->prsnl, pCnt)
with nocounter
 
/***********************************************
 * FIND ALL PATIENTS ASSOCIATED WITH PROVIDERS *
 ***********************************************/
 
select into "nl:"
from
  encntr_prsnl_reltn epr
  , person p
  , encounter   e
  , encntr_alias   ea
  , person_alias   pa
 
plan epr
  where expand(idx, 1, size(data->prsnl,5), epr.prsnl_person_id, data->prsnl[idx].prsnl_id)
    and epr.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3)
    ;begin 001
;    and epr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3) 
    and ((epr.encntr_prsnl_r_cd in (midwife_rel_cd,covering_rel_cd) 
      and epr.end_effective_dt_tm > cnvtdatetime(curdate - 90,curtime3)) 
      or epr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3))
    ;end 001
   
    and (epr.expire_dt_tm = null or epr.expire_dt_tm > cnvtdatetime(curdate - 90, 0)) ; look at records 90 days back
    and epr.active_ind = 1
    and epr.encntr_prsnl_r_cd in (attending_rel_cd
    							  , admitting_rel_cd
    							  , covering_rel_cd
    							  , consulting_rel_cd
    							  , pat_account_rel_cd
    							  , midwife_rel_cd)
join e
  where e.encntr_id = epr.encntr_id
    and e.active_ind = 1
    and e.encntr_id > 0
join p
  where p.person_id = e.person_id
    and p.active_ind = 1
join pa
  where pa.person_id = p.person_id
    and pa.person_alias_type_cd = mrn_cd
    and pa.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3)
    and pa.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
join ea
  where ea.encntr_id = e.encntr_id
    and ea.encntr_alias_type_cd = fin_cd
    and ea.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3)
    and ea.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
order by
  p.name_full_formatted
  , e.encntr_id
head report
  eCnt = 0
head e.encntr_id
  eCnt = eCnt + 1
 
  if (mod(eCnt,100) = 1)
    stat = alterlist(data->pat_list, eCnt + 100)
  endif
 
  data->pat_list[eCnt].person_id = p.person_id
  data->pat_list[eCnt].encntr_id = e.encntr_id
  data->pat_list[eCnt].name = p.name_full_formatted
  data->pat_list[eCnt].mrn = pa.alias
  data->pat_list[eCnt].fin = ea.alias
 
  if (e.inpatient_admit_dt_tm != null)
    data->pat_list[eCnt].admit_dt_tm = format(e.inpatient_admit_dt_tm,FORMAT_MDY)
  else
    data->pat_list[eCnt].admit_dt_tm = format(e.reg_dt_tm,FORMAT_MDY)
  endif
 
  data->pat_list[eCnt].disch_dt_tm = format(e.disch_dt_tm,FORMAT_MDY)
foot report
  stat = alterlist(data->pat_list, eCnt)
with time = 30
 
call echorecord(data)
 
set _memory_reply_string = cnvtrectojson(data,9,1)
 
call echo(cnvtrectojson(data,9,1))
 
end
go
  execute avh_ext_usr_access "MINE", 14023328.00 go
 
 
