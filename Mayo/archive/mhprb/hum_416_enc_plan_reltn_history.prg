/*******************************************
 
; 18 May 2011 mrhine
  1.  original select commented out. Modified the new select per adriana and cathy
 
  14 June 2011 mrhine
  note: be sure to clean up the dm_info table with this
 
  21 June 2011 kmcdaniel
  2.  change to write directly to file instead of array
      change from daily to monthly extract
 
  7 July 2011 mrhine
    1. converted to writing to file instead of array for history/catchup. Memory error!
       commented out all the stuff for later chopping
 
select *
 from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_enc_plan_reltn"
go
 
delete from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_enc_plan_reltn"
 go
commit go
;002 04/12/12 kmcdaniel - rewritten for Client 416
 *****************************************************/
drop   program hum_enc_plan_reltn_history:dba go
create program hum_enc_plan_reltn_history:dba
 
;*********************************************************************
;*** If PROD / CERT then run as 2nd oracle instance to improve
;*** efficiency. Will auto Fail-over to Instance 1 if Instance 2 down.
;*********************************************************************
IF(CURDOMAIN = "PROD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
ELSEIF(CURDOMAIN = "MHPRD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
ELSEIF(CURDOMAIN="MHCRT")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/java4t2@mhcrtrpt'
ENDIF ;CURDOMAIN
;********************************************************
 
free set testdt
set testdt = cnvtdatetime("01-JAN-2010 0000")
set end_run_date = cnvtdatetime("01-JAN-2012 0000")
set run_date = cnvtdatetime(curdate,curtime3)
 
declare domain_info_name = vc
set domain_info_name = trim("humedica_enc_plan_reltn")
declare month = vc
 
while (testdt < cnvtdatetime(end_run_date))
 
	if(testdt >= end_run_date) go to exit_program endif
 
   free set dtfnd
   set dtfnd = "N"
   declare mnth = vc
   declare yr = vc
   declare edt = vc
   declare startdt = f8
   declare enddt = f8
   declare nxtmnth = f8
 
   select into "nl:"
   dm.updt_dt_tm
   from dm_info dm
   where dm.info_domain = "HUMEDICA"
     and dm.info_name   = domain_info_name
   detail
    dtfnd = "Y"
    startdt = dm.updt_dt_tm
;	enddt = datetimefind(cnvtdatetime(startdt),"M", "E","E")
	enddt = cnvtdatetime(cnvtdate(startdt),235959)
    month = format(startdt,"MMM;;d")
	nxtmnth = cnvtdatetime(cnvtdate(enddt)+1,0)
    mnth = format(nxtmnth,"MMM;;d")
    yr = format(nxtmnth,"YYYY;;d")
    edt = concat("01-",mnth,"-",yr," 0000")
   with nocounter
 
   if (dtfnd = "N")
	set startdt = cnvtdatetime(testdt)
;	set enddt = datetimefind(cnvtdatetime(startdt),"M", "E","E")
	set enddt = cnvtdatetime(cnvtdate(startdt),235959)
    set month = format(startdt,"MMM;;d")
	set nxtmnth = cnvtdatetime(cnvtdate(enddt)+1,0)
    set mnth = format(nxtmnth,"MMM;;d")
    set yr = format(nxtmnth,"YYYY;;d")
    set edt = concat("01-",mnth,"-",yr," 0000")
      insert into dm_info dm
      set	dm.info_domain="HUMEDICA",
      		dm.info_name = domain_info_name,
			dm.updt_dt_tm = cnvtdatetime(nxtmnth)	;cnvtdatetime(enddt)
      with nocounter
      commit
   endif
 
   call echo(build("start_date = ",format(startdt,"mm/dd/yyyy hh:mm;;d")))
   call echo(build("end_date = ",format(enddt,"mm/dd/yyyy hh:mm;;d")))
 
   free set today
   declare today = f8
   declare edt = vc
   declare ydt = vc
   declare month = vc
   set today = cnvtdatetime(curdate,curtime3)
   set edt = format(today,"yyyymmdd;;d")
   set dirdt = format(startdt,"yyyymmdd;;d")
   set ydt = format(startdt,"yyyy;;d")
   set month = format(startdt,"mmm;;d")
   set beg_dt = startdt
   call echo(build("beg_dt = ",beg_dt))
   set end_dt = enddt
   call echo(build("end_dt = ",end_dt))
 
	set print_file = concat("hum_enc_plan_reltn_history_",dirdt,".dat")
	set hold_file = concat("/cerner/d_mhprd/ccluserdir/",print_file)
 
select into value(print_file)
   accept_assignment_cd    = cnvtstring(epr.accept_assignment_cd)
,   active_ind              = cnvtstring(epr.active_ind)
,   active_status_cd        = cnvtstring(epr.active_status_cd)
,   active_status_dt_tm     = format(epr.active_status_dt_tm,"yyyyMMddhhmmss;;d")
,   active_status_prsnl_id  = cnvtstring(epr.active_status_prsnl_id)
,   assign_benefits_cd     = cnvtstring(epr.assign_benefits_cd)
,   balance_type_cd        = cnvtstring(epr.balance_type_cd)
,   beg_effective_dt_tm    = format(epr.beg_effective_dt_tm,"yyyyMMddhhmmss;;d")
,   card_category_cd       = cnvtstring(epr.card_category_cd)
,   card_issue_nbr         = cnvtstring(epr.card_issue_nbr)           ;10
,   contributor_system_cd  = cnvtstring(epr.contributor_system_cd)
,   coord_benefits_cd      = cnvtstring(epr.coord_benefits_cd)
,   coverage_comments_long_text_id      = cnvtstring(epr.coverage_comments_long_text_id)
,   data_status_cd        = cnvtstring(epr.data_status_cd)
,   data_status_dt_tm    = format(epr.data_status_dt_tm,"yyyyMMddhhmmss;;d")
,   data_status_prsnl_id   = cnvtstring(epr.data_status_prsnl_id)
,   data_status_dt_tm     = format(epr.data_status_dt_tm,"yyyyMMddhhmmss;;d")
,   data_status_prsnl_id  = cnvtstring(epr.data_status_prsnl_id)
,   deduct_amt            = cnvtstring(epr.deduct_amt)
,   deduct_met_dt_tm      = format(epr.deduct_met_dt_tm,"yyyyMMddhhmmss;;d")       ;20
,   denial_reason_cd      = cnvtstring(epr.denial_reason_cd)
,   encntr_id             = cnvtstring(epr.encntr_id)
,   encntr_plan_reltn_id  = cnvtstring(epr.encntr_plan_reltn_id)
,   end_effective_dt_tm   = format(epr.end_effective_dt_tm,"yyyyMMddhhmmss;;d")
,   group_name           = trim(epr.group_name,3)
,   group_nbr            = trim(epr.group_nbr,3)
,   health_card_expiry_dt_tm = format(epr.health_card_expiry_dt_tm,"yyyyMMddhhmmss;;d")
,   health_card_issue_dt_tm  = format(epr.health_card_issue_dt_tm,"yyyyMMddhhmmss;;d")
,   health_card_nbr          = trim(epr.health_card_nbr,3)
,   health_card_province     = trim(epr.health_card_province,3)                  ;30
,   health_card_type         = trim(epr.health_card_type,3)
,   health_card_ver_code         = trim(epr.health_card_ver_code,3)
,   health_plan_id             = cnvtstring(epr.health_plan_id)
,   insured_card_name          = trim(epr.insured_card_name,3)
,   insured_card_name_first    = trim(epr.insured_card_name_first,3)
,   insured_card_name_last     = trim(epr.insured_card_name_last,3)
,   insured_card_name_middle   = trim(epr.insured_card_name_middle,3)
,   insured_card_name_suffix   = trim(epr.insured_card_name_suffix,3)
,   insur_source_info_cd       = cnvtstring(epr.insur_source_info_cd)
,   ins_card_copied_cd         = cnvtstring(epr.ins_card_copied_cd)
,   life_rsv_daily_ded_amt     = cnvtstring(epr.life_rsv_daily_ded_amt)           ;40
,   life_rsv_daily_ded_qual_cd = cnvtstring(epr.life_rsv_daily_ded_qual_cd)
,   life_rsv_days              = cnvtstring(epr.life_rsv_days)
,   life_rsv_remain_days       = cnvtstring(epr.life_rsv_remain_days)
,   member_nbr                 = trim(epr.member_nbr,3)
,   member_person_code         = trim(epr.member_person_code,3)
,   military_base_location     = trim(epr.military_base_location,3)
,   military_rank_cd           = cnvtstring(epr.military_rank_cd)
,   military_service_cd        = cnvtstring(epr.military_service_cd)
,   military_status_cd         = cnvtstring(epr.military_status_cd)
,   organization_id            = cnvtstring(epr.organization_id)                  ;50
,   orig_priority_seq          = cnvtstring(epr.orig_priority_seq)
,   person_id                  = cnvtstring(epr.person_id)
,   person_org_reltn_id       = cnvtstring(epr.person_org_reltn_id)
,   person_plan_reltn_id      = cnvtstring(epr.person_plan_reltn_id)
,   plan_class_cd             = cnvtstring(epr.plan_class_cd)
,   plan_type_cd              = cnvtstring(epr.plan_type_cd)
,   policy_nbr                = trim(epr.policy_nbr,3)
,   pricing_agency_cd         = cnvtstring(epr.pricing_agency_cd)
,   priority_seq              = cnvtstring(epr.priority_seq)
,   program_status_cd         = cnvtstring(epr.program_status_cd)                 ;60
,   prop_casualty_claim_nbr_txt   = trim(epr.prop_casualty_claim_nbr_txt,3)
,   rowid                     = cnvtstring(epr.rowid)
,   rx_plan_cob_seq          = cnvtstring(epr.rx_plan_cob_seq)
,   signature_dt_tm          = format(epr.signature_dt_tm,"yyyyMMddhhmmss;;d")
,   signature_on_file_cd     = cnvtstring(epr.signature_on_file_cd)
,   signature_source_cd      = cnvtstring(epr.signature_source_cd)
,   sponsor_person_org_reltn_id   = cnvtstring(epr.sponsor_person_org_reltn_id)
,   subscriber_type_cd       = cnvtstring(epr.subscriber_type_cd)
,   subs_member_nbr          = trim(epr.subs_member_nbr,3)
,   updt_applctx      = cnvtstring(epr.updt_applctx)                              ;70
,   updt_cnt          = cnvtstring(epr.updt_cnt)
,   updt_dt_tm        = format(epr.updt_dt_tm,"yyyyMMddhhmmss;;d")
,   updt_id           = cnvtstring(epr.updt_id)
,   updt_task         = cnvtstring(epr.updt_task)
,   verify_dt_tm        = format(epr.verify_dt_tm,"yyyyMMddhhmmss;;d")
,   verify_prsnl_id     = cnvtstring(epr.verify_prsnl_id)
,   verify_status_cd    = cnvtstring(epr.verify_status_cd)
 
from encounter e
     ,encntr_plan_reltn epr
plan e where e.updt_dt_tm between cnvtdatetime(beg_dt) and cnvtdatetime(end_dt)
join epr where epr.encntr_id = e.encntr_id
 
head report
 
  "accept_assignment_cd",
"||active_ind",
"||active_status_cd",
"||active_status_dt_tm",
"||active_status_prsnl_id",
"||assign_benefits_cd",
"||balance_type_cd",
"||beg_effective_dt_tm",
"||card_category_cd",
"||card_issue_nbr",
 
"||contributor_system_cd",
"||coord_benefits_cd",
"||coverage_comments_long_text_id",
"||data_status_cd",
"||data_status_dt_tm",
"||data_status_prsnl_id",
"||deduct_amt",
"||deduct_met_dt_tm",
"||denial_reason_cd",
"||encntr_id",
 
"||encntr_plan_reltn_id",
"||end_effective_dt_tm",
"||group_name",
"||group_nbr",
"||health_card_expiry_dt_tm",
"||health_card_issue_dt_tm",
"||health_card_nbr",
"||health_card_province",
"||health_card_type",
"||health_card_ver_code",
 
"||health_plan_id",
"||insured_card_name",
"||insured_card_name_first",
"||insured_card_name_last",
"||insured_card_name_middle",
"||insured_card_name_suffix",
"||insur_source_info_cd",
"||ins_card_copied_cd",
"||life_rsv_daily_ded_amt",
"||life_rsv_daily_ded_qual_cd",
 
"||life_rsv_days",
"||life_rsv_remain_days",
"||member_nbr",
"||member_person_code",
"||military_base_location",
"||military_rank_cd",
"||military_service_cd",
"||military_status_cd",
"||organization_id",
"||orig_priority_seq",
 
"||person_id",
"||person_org_reltn_id",
"||person_plan_reltn_id",
"||plan_class_cd",
"||plan_type_cd",
"||policy_nbr",
"||pricing_agency_cd",
"||priority_seq",
"||program_status_cd",
"||prop_casualty_claim_nbr_txt",
 
"||rowid",
"||rx_plan_cob_seq",
"||signature_dt_tm",
"||signature_on_file_cd",
"||signature_source_cd",
"||sponsor_person_org_reltn_id",
"||subscriber_type_cd",
"||subs_member_nbr",
"||updt_applctx",
"||updt_cnt",
"||updt_dt_tm",
"||updt_id",
"||updt_task|",
"||verify_dt_tm",
"||verify_prsnl_id",
"||verify_status_cd|"
 
row + 1
 
head epr.person_plan_reltn_id
 
rtxt = build(
       accept_assignment_cd
,'||', active_ind
,'||', active_status_cd
,'||', active_status_dt_tm
,'||', active_status_prsnl_id
,'||', assign_benefits_cd
,'||', balance_type_cd
,'||', beg_effective_dt_tm
,'||', card_category_cd
,'||', card_issue_nbr
 
,'||', contributor_system_cd
,'||', coord_benefits_cd
,'||', coverage_comments_long_text_id
,'||', data_status_cd
,'||', data_status_dt_tm
,'||', data_status_prsnl_id
,'||', deduct_amt
,'||', deduct_met_dt_tm
,'||', denial_reason_cd
,'||', encntr_id
 
,'||',encntr_plan_reltn_id
,'||',end_effective_dt_tm
,'||',group_name
,'||',group_nbr
,'||',health_card_expiry_dt_tm
,'||',health_card_issue_dt_tm
,'||',health_card_nbr
,'||',health_card_province
,'||',health_card_type
,'||',health_card_ver_code
 
,'||',health_plan_id
,'||',insured_card_name
,'||',insured_card_name_first
,'||',insured_card_name_last
,'||',insured_card_name_middle
,'||',insured_card_name_suffix
,'||',insur_source_info_cd
,'||',ins_card_copied_cd
,'||',life_rsv_daily_ded_amt
,'||',life_rsv_daily_ded_qual_cd
 
,'||',life_rsv_days
,'||',life_rsv_remain_days
,'||',member_nbr
,'||',member_person_code
,'||',military_base_location
,'||',military_rank_cd
,'||',military_service_cd
,'||',military_status_cd
,'||',organization_id
,'||',orig_priority_seq
 
,'||',person_id
,'||',person_org_reltn_id
,'||',person_plan_reltn_id
,'||',plan_class_cd
,'||',plan_type_cd
,'||',policy_nbr
,'||',pricing_agency_cd
,'||',priority_seq
,'||',program_status_cd
,'||',prop_casualty_claim_nbr_txt
 
,'||',rowid
,'||',rx_plan_cob_seq
,'||',signature_dt_tm
,'||',signature_on_file_cd
,'||',signature_source_cd
,'||',sponsor_person_org_reltn_id
,'||',subscriber_type_cd
,'||',subs_member_nbr
,'||',updt_applctx
,'||',updt_cnt
,'||',updt_dt_tm
,'||',updt_id
,'||',updt_task
,'||',verify_dt_tm
,'||',verify_prsnl_id
,'||',verify_status_cd
,'|')
 
  col 0 rtxt
  row + 1
 
with ;formfeed = none,
     maxrow = 1,
     nocounter,
     maxcol = 9000,
     format = variable
     ,append
 
   if (dtfnd = "Y")
      set dtfnd = "N"
      update into dm_info dm
      set dm.updt_dt_tm = cnvtdatetime(nxtmnth)	;cnvtdatetime(enddt)
      where dm.info_domain="HUMEDICA"
      and dm.info_name = domain_info_name
 
      with nocounter
      commit
   endif
   set testdt = nxtmnth	;enddt
 
declare dir_date = vc
set dir_date = trim(concat(format(run_date,"yyyy;;d"),format(run_date,"mm;;d")))
declare newdir = vc
declare LEN = i4
declare DCLCOM = vc
 
set newdir = concat("/humedica/mhprd/data/cerner")
set DCLCOM = concat("mkdir ",newdir)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = concat("/humedica/mhprd/data/cerner/historical")
set DCLCOM = concat("mkdir ",newdir)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = concat("/humedica/mhprd/data/cerner/historical/",dir_date)
set DCLCOM = concat("mkdir ",newdir)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
free set outfile
set outfile = concat("H416989_T",dirdt,"_E",edt,"_enc_plan_reltn.txt")
free set base
set base = concat(trim(newdir),"/")
 
free set newfile
declare newfile = vc
set newfile = concat(base,outfile)
set DCLCOM = concat("mv ",trim(hold_file)," ",newfile)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set DCLCOM = concat("gzip -9 ",newfile)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
endwhile
 
#exit_program
 
;****** After report put back to instance 1
IF(CURDOMAIN = "PROD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
ELSEIF(CURDOMAIN = "MHPRD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
ELSEIF(CURDOMAIN="MHCRT")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/java4t2@mhcrt1'
ENDIF ;CURDOMAIN
;******************************************
 
 
end
go
