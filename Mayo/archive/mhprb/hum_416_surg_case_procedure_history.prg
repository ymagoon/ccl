/******************************************************
 5 June 2011 - mrhine
     changed to a straight table dump/extract per Cathy and Adriana
 
;002 04/14/12 kmcdaniel - rewritten for Mayo (416)
 *****************************************************/
drop  program hum_surg_case_proc_history:dba go
create program hum_surg_case_proc_history:dba
 
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
set testdt = cnvtdatetime("01-JAN-2009 0000")
set end_run_date = cnvtdatetime("01-JAN-2012 0000")
set run_date = cnvtdatetime(curdate,curtime3)
 
declare domain_info_name = vc
set domain_info_name = trim("humedica_surg_case_proc")
 
   free set dtfnd
   set dtfnd = "N"
   declare mnth = vc
   declare yr = vc
   declare edt = vc
   declare startdt = f8
   declare enddt = f8
   declare nxtmnth = f8
   declare month = vc
 
 
	set startdt = cnvtdatetime(testdt)
	set enddt = datetimefind(cnvtdatetime(startdt),"M", "E","E")
    set month = format(startdt,"MMM;;d")
	set nxtmnth = cnvtdatetime(cnvtdate(enddt)+1,0)
    set mnth = format(nxtmnth,"MMM;;d")
    set yr = format(nxtmnth,"YYYY;;d")
    set edt = concat("01-",mnth,"-",yr," 0000")
 
   call echo(build("start_date = ",format(startdt,"mm/dd/yyyy hh:mm;;d")))
   call echo(build("end_date = ",format(enddt,"mm/dd/yyyy hh:mm;;d")))
 
   free set today
   declare today = f8
   declare edt = vc
   declare ydt = vc
   set today = cnvtdatetime(curdate,curtime3)
   set edt = format(today,"yyyymmdd;;d")
   set dirdt = format(startdt,"yyyymmdd;;d")
   set ydt = format(startdt,"yyyy;;d")
   set month = format(startdt,"mmm;;d")
   set beg_dt = startdt
   call echo(build("beg_dt = ",beg_dt))
   set end_dt = enddt
   call echo(build("end_dt = ",end_dt))
 
	set print_file = concat("hum_surg_case_proc_history_",dirdt,".dat")
	set hold_file = concat("/cerner/d_mhprd/ccluserdir/",print_file)
 
   call echo("get ALL the surg_cases_procedure entries.")
 
 
select into value(print_file)
       active_ind                      = cnvtstring(scp.active_ind)
,      active_status_cd                = cnvtstring(scp.active_status_cd)
,      active_status_dt_tm             = format(scp.active_status_dt_tm,"yyyyMMddhhmmss;;d")
,      active_status_prsnl_id          = cnvtstring(scp.active_status_prsnl_id)
,      anesth_type_cd                  = cnvtstring(scp.anesth_type_cd)
,      beg_effective_dt_tm             = format(scp.beg_effective_dt_tm,"yyyyMMddhhmmss;;d")
,      concurrent_ind                  = cnvtstring(scp.concurrent_ind)
,      create_applctx                  = cnvtstring(scp.create_applctx)
,      create_dt_tm                    = format(scp.create_dt_tm,"yyyyMMddhhmmss;;d")
,      create_prsnl_id                 = cnvtstring(scp.create_prsnl_id)
; 10
,      create_task                     = cnvtstring(scp.create_task)
,      dept_cd                         = cnvtstring(scp.dept_cd)
,      end_effective_dt_tm             = format(scp.end_effective_dt_tm,"yyyyMMddhhmmss;;d")
,      event_id                        = cnvtstring(scp.event_id)
,      inst_cd                         = cnvtstring(scp.inst_cd)
,      modifier                        = trim(scp.modifier,3)
,      order_id                        = cnvtstring(scp.order_id)
,      pick_list_chg_flag              = cnvtstring(scp.pick_list_chg_flag)
,      pref_card_id                    = cnvtstring(scp.pref_card_id)
,      primary_proc_ind                = cnvtstring(scp.primary_proc_ind)
; 20
,      primary_surgeon_id              = cnvtstring(scp.primary_surgeon_id)
,      proc_complete_qty               = cnvtstring(scp.proc_complete_qty)
,      proc_dur_min                    = cnvtstring(scp.proc_dur_min)
,      proc_end_dt_tm                  = format(scp.proc_end_dt_tm,"yyyyMMddhhmmss;;d")
,      proc_end_tz                     = cnvtstring(scp.proc_end_tz)
,      proc_start_day                  = cnvtstring(scp.proc_start_day)
,      proc_start_dt_tm                = format(scp.proc_start_dt_tm,"yyyyMMddhhmmss;;d")
,      proc_start_hour                 = cnvtstring(scp.proc_start_hour)
,      proc_start_month                = cnvtstring(scp.proc_start_month)
,      proc_start_tz                   = cnvtstring(scp.proc_start_tz)
; 30
,      proc_text                       = trim(scp.proc_text,3)
,      reporting_proc_ind              = cnvtstring(scp.reporting_proc_ind)
,      rowid                           = cnvtstring(scp.rowid)
,      sched_anesth_type_cd            = cnvtstring(scp.sched_anesth_type_cd)
,      sched_blood_product_req_ind     = cnvtstring(scp.sched_blood_product_req_ind)
,      sched_case_level_cd             = cnvtstring(scp.sched_case_level_cd)
,      sched_dur                       = cnvtstring(scp.sched_dur)
,      sched_frozen_section_req_ind    = cnvtstring(scp.sched_frozen_section_req_ind)
,      sched_implant_ind               = cnvtstring(scp.sched_implant_ind)
,      sched_modifier                  = trim(scp.sched_modifier,3)
; 40
,      sched_primary_ind               = cnvtstring(scp.sched_primary_ind)
,      sched_primary_surgeon_id        = cnvtstring(scp.sched_primary_surgeon_id)
,      sched_proc_cnt                  = cnvtstring(scp.sched_proc_cnt)
,      sched_qty                       = cnvtstring(scp.sched_qty)
,      sched_seq_num                   = cnvtstring(scp.sched_seq_num)
,      sched_spec_req_ind              = cnvtstring(scp.sched_spec_req_ind)
,      sched_surg_area_cd              = cnvtstring(scp.sched_surg_area_cd)
,      sched_surg_proc_cd              = cnvtstring(scp.sched_surg_proc_cd)
,      sched_surg_specialty_id         = cnvtstring(scp.sched_surg_specialty_id)
,      sched_ud1_cd                    = cnvtstring(scp.sched_ud1_cd)
 
; 50
,      sched_ud2_cd                    = cnvtstring(scp.sched_ud2_cd)
,      sched_ud3_cd                    = cnvtstring(scp.sched_ud3_cd)
,      sched_ud4_cd                    = cnvtstring(scp.sched_ud4_cd)
,      sched_ud5_cd                    = cnvtstring(scp.sched_ud5_cd)
,      sched_wound_class_cd            = cnvtstring(scp.sched_wound_class_cd)
,      sched_xray_ind                  = cnvtstring(scp.sched_xray_ind)
,      sched_xray_tech_ind             = cnvtstring(scp.sched_xray_tech_ind)
,      segment_header_id               = cnvtstring(scp.segment_header_id)
,      spec_not_collected_reason_cd    = cnvtstring(scp.spec_not_collected_reason_cd)
,      surg_area_cd                    = cnvtstring(scp.surg_area_cd)
; 60
,      surg_case_id                    = cnvtstring(scp.surg_case_id)
,      surg_case_proc_id               = cnvtstring(scp.surg_case_proc_id)
,      surg_proc_cd                    = cnvtstring(scp.surg_proc_cd)
,      surg_specialty_id               = cnvtstring(scp.surg_specialty_id)
,      synonym_id                      = cnvtstring(scp.synonym_id)
,      updt_applctx                    = cnvtstring(scp.updt_applctx)
,      updt_cnt                        = cnvtstring(scp.updt_cnt)
,      updt_dt_tm                      = format(scp.updt_dt_tm,"yyyyMMddhhmmss;;d")
,      updt_id                         = cnvtstring(scp.updt_id)
,      updt_task                       = cnvtstring(scp.updt_task)
;70
,      wound_class_cd                  = cnvtstring(scp.wound_class_cd)
 
from   surg_case_procedure scp
plan scp
order by  scp.surg_case_id
head report
head_line = build(
   "active_ind"
,"||active_status_cd"
,"||active_status_dt_tm"
,"||active_status_prsnl_id"
,"||anesth_type_cd"
,"||beg_effective_dt_tm"
,"||concurrent_ind"
,"||create_applctx"
,"||create_dt_tm"
,"||create_prsnl_id"
; 10
,"||create_task"
,"||dept_cd"
,"||end_effective_dt_tm"
,"||event_id"
,"||inst_cd"
,"||modifier"
,"||order_id"
,"||pick_list_chg_flag"
,"||pref_card_id"
,"||primary_proc_ind"
; 20
,"||primary_surgeon_id"
,"||proc_complete_qty"
,"||proc_dur_min"
,"||proc_end_dt_tm"
,"||proc_end_tz"
,"||proc_start_day"
,"||proc_start_dt_tm"
,"||proc_start_hour"
,"||proc_start_month"
,"||proc_start_tz"
; 30
,"||proc_text"
,"||reporting_proc_ind"
,"||rowid"
,"||sched_anesth_type_cd"
,"||sched_blood_product_req_ind"
,"||sched_case_level_cd"
,"||sched_dur"
,"||sched_frozen_section_req_ind"
,"||sched_implant_ind"
,"||sched_modifier"
 
; 40
,"||sched_primary_ind"
,"||sched_primary_surgeon_id"
,"||sched_proc_cnt"
,"||sched_qty"
,"||sched_seq_num"
,"||sched_spec_req_ind"
,"||sched_surg_area_cd"
,"||sched_surg_proc_cd"
,"||sched_surg_specialty_id"
,"||sched_ud1_cd"
; 50
,"||sched_ud2_cd"
,"||sched_ud3_cd"
,"||sched_ud4_cd"
,"||sched_ud5_cd"
,"||sched_wound_class_cd"
,"||sched_xray_ind"
,"||sched_xray_tech_ind"
,"||segment_header_id"
,"||spec_not_collected_reason_cd"
,"||surg_area_cd"
; 60
,"||surg_case_id"
,"||surg_case_proc_id"
,"||surg_proc_cd"
,"||surg_specialty_id"
,"||synonym_id"
,"||updt_applctx"
,"||updt_cnt"
,"||updt_dt_tm"
,"||updt_id"
,"||updt_task"
;70
,"||wound_class_cd|"
)
col 0	head_line
row + 1
 
detail
rtxt = build(
   active_ind
,"||",active_status_cd
,"||",active_status_dt_tm
,"||",active_status_prsnl_id
,"||",anesth_type_cd
,"||",beg_effective_dt_tm
,"||",concurrent_ind
,"||",create_applctx
,"||",create_dt_tm
,"||",create_prsnl_id
; 10
,"||",create_task
,"||",dept_cd
,"||",end_effective_dt_tm
,"||",event_id
,"||",inst_cd
,"||",modifier
,"||",order_id
,"||",pick_list_chg_flag
,"||",pref_card_id
,"||",primary_proc_ind
; 20
,"||",primary_surgeon_id
,"||",proc_complete_qty
,"||",proc_dur_min
,"||",proc_end_dt_tm
,"||",proc_end_tz
,"||",proc_start_day
,"||",proc_start_dt_tm
,"||",proc_start_hour
,"||",proc_start_month
,"||",proc_start_tz
; 30
,"||",proc_text
,"||",reporting_proc_ind
,"||",rowid
,"||",sched_anesth_type_cd
,"||",sched_blood_product_req_ind
,"||",sched_case_level_cd
,"||",sched_dur
,"||",sched_frozen_section_req_ind
,"||",sched_implant_ind
,"||",sched_modifier
; 40
,"||",sched_primary_ind
,"||",sched_primary_surgeon_id
,"||",sched_proc_cnt
,"||",sched_qty
,"||",sched_seq_num
,"||",sched_spec_req_ind
,"||",sched_surg_area_cd
,"||",sched_surg_proc_cd
,"||",sched_surg_specialty_id
,"||",sched_ud1_cd
; 50
,"||",sched_ud2_cd
,"||",sched_ud3_cd
,"||",sched_ud4_cd
,"||",sched_ud5_cd
,"||",sched_wound_class_cd
,"||",sched_xray_ind
,"||",sched_xray_tech_ind
,"||",segment_header_id
,"||",spec_not_collected_reason_cd
,"||",surg_area_cd
; 60
,"||",surg_case_id
,"||",surg_case_proc_id
,"||",surg_proc_cd
,"||",surg_specialty_id
,"||",synonym_id
,"||",updt_applctx
,"||",updt_cnt
,"||",updt_dt_tm
,"||",updt_id
,"||",updt_task
;70
,"||",wound_class_cd
,"|"
)
 
  col +0 rtxt
  row + 1
 
with ;formfeed = none,
     maxrow = 1,
     nocounter,
     maxcol = 8000,
     format = variable,
     append
 
 
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
set outfile = concat("H416989_T",dirdt,"_E",edt,"_surg_case_proc.txt")
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
