/******************************************************
 5 June 2011 - mrhine
     changed to a straight table dump/extract per Cathy and Adriana
 
;002 04/14/12 kmcdaniel - rewritten for Mayo (416)
 *****************************************************/
drop  program hum_surg_case_history:dba go
create program hum_surg_case_history:dba
 
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
set end_run_date = cnvtdatetime("02-JAN-2009 0000")
set run_date = cnvtdatetime(curdate,curtime3)
 
declare domain_info_name = vc
set domain_info_name = trim("humedica_surg_case")
 
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
 
	set print_file = concat("hum_surg_case_history_",dirdt,".dat")
	set hold_file = concat("/cerner/d_mhprd/ccluserdir/",print_file)
 
   call echo("get ALL the surg_cases entries.")
 
 
select into value(print_file)
       active_ind                      = cnvtstring(sc.active_ind)
,      active_status_cd                = cnvtstring(sc.active_status_cd)
,      active_status_dt_tm             = format(sc.active_status_dt_tm,"yyyyMMddhhmmss;;d")
,      active_status_prsnl_id          = cnvtstring(sc.active_status_prsnl_id)
,      addl_supplies_ind               = cnvtstring(sc.addl_supplies_ind)
,      add_on_ind                      = cnvtstring(sc.add_on_ind)
,      anesth_prsnl_id                 = cnvtstring(sc.anesth_prsnl_id)
,      anesth_type_cd                  = cnvtstring(sc.anesth_type_cd)
,      appt_id                         = cnvtstring(sc.appt_id)
,      asa_class_cd                    = cnvtstring(sc.asa_class_cd)
; 10
,      cancel_dt_tm                    = format(sc.cancel_dt_tm,"yyyyMMddhhmmss;;d")
,      cancel_reason_cd                = cnvtstring(sc.cancel_reason_cd)
,      cancel_req_by_id                = cnvtstring(sc.cancel_req_by_id)
,      cancel_req_by_text              = trim(sc.cancel_req_by_text,3)
,      cancel_tz                       = cnvtstring(sc.cancel_tz)
,      case_level_cd                   = cnvtstring(sc.case_level_cd)
,      checkin_by_id                   = cnvtstring(sc.checkin_by_id)
,      checkin_dt_tm                   = format(sc.checkin_dt_tm,"yyyyMMddhhmmss;;d")
,      checkin_tz                      = cnvtstring(sc.checkin_tz)
,      create_applctx                  = cnvtstring(sc.create_applctx)
; 20
,      create_dt_tm                    = format(sc.create_dt_tm,"yyyyMMddhhmmss;;d")
,      create_prsnl_id                 = cnvtstring(sc.create_prsnl_id)
,      create_task                     = cnvtstring(sc.create_task)
,      curr_case_status_cd             = cnvtstring(sc.curr_case_status_cd)
,      curr_case_status_dt_tm          = format(sc.curr_case_status_dt_tm,"yyyyMMddhhmmss;;d")
,      dept_cd                         = cnvtstring(sc.dept_cd)
,      encntr_id                       = cnvtstring(sc.encntr_id)
,      inst_cd                         = cnvtstring(sc.inst_cd)
,      or_shift_cd                     = cnvtstring(sc.or_shift_cd)
,      pat_type_cd                     = cnvtstring(sc.pat_type_cd)
; 30
,      person_id                       = cnvtstring(sc.person_id)
,      postop_diag_text_id             = cnvtstring(sc.postop_diag_text_id)
,      preop_diag_text_id              = cnvtstring(sc.preop_diag_text_id)
,      rowid                           = cnvtstring(sc.rowid)
,      sched_anesth_prsnl_id           = cnvtstring(sc.sched_anesth_prsnl_id)
,      sched_case_nbr_locn_cd          = cnvtstring(sc.sched_case_nbr_locn_cd)
,      sched_case_type_cd              = cnvtstring(sc.sched_case_type_cd)
,      sched_cleanup_dur               = cnvtstring(sc.sched_cleanup_dur)
,      sched_dur                       = cnvtstring(sc.sched_dur)
,      sched_op_loc_cd                 = cnvtstring(sc.sched_op_loc_cd)
; 40
,      sched_or_shift_cd               = cnvtstring(sc.sched_or_shift_cd)
,      sched_pat_type_cd               = cnvtstring(sc.sched_pat_type_cd)
,      sched_qty                       = cnvtstring(sc.sched_qty)
,      sched_setup_dur                 = cnvtstring(sc.sched_setup_dur)
,      sched_start_day                 = cnvtstring(sc.sched_start_day)
,      sched_start_dt_tm               = format(sc.sched_start_dt_tm,"yyyyMMddhhmmss;;d")
,      sched_start_hour                = cnvtstring(sc.sched_start_hour)
,      sched_start_month               = cnvtstring(sc.sched_start_month)
,      sched_start_tz                  = cnvtstring(sc.sched_start_tz)
,      sched_surg_area_cd              = cnvtstring(sc.sched_surg_area_cd)
;50
,      sched_surg_specialty_id         = cnvtstring(sc.sched_surg_specialty_id)
,      sched_type_cd                   = cnvtstring(sc.sched_type_cd)
,      sch_event_id                    = cnvtstring(sc.sch_event_id)
,      surgeon_prsnl_id                = cnvtstring(sc.surgeon_prsnl_id)
,      surg_area_cd                    = cnvtstring(sc.surg_area_cd)
,      surg_case_id                    = cnvtstring(sc.surg_case_id)
,      surg_case_nbr_cnt              = cnvtstring(sc.surg_case_nbr_cnt)
,      surg_case_nbr_formatted         = trim(sc.surg_case_nbr_formatted,3)
,      surg_case_nbr_locn_cd           = cnvtstring(sc.surg_case_nbr_locn_cd)
,      surg_case_nbr_yr                = cnvtstring(sc.surg_case_nbr_yr)
; 60
,      surg_complete_qty               = cnvtstring(sc.surg_complete_qty)
,      surg_dur_min                    = cnvtstring(sc.surg_dur_min)
,      surg_op_loc_cd                  = cnvtstring(sc.surg_op_loc_cd)
,      surg_specialty_id               = cnvtstring(sc.surg_specialty_id)
,      surg_start_day                  = cnvtstring(sc.surg_start_day)
,      surg_start_dt_tm                = format(sc.surg_start_dt_tm,"yyyyMMddhhmmss;;d")
,      surg_start_hour                 = cnvtstring(sc.surg_start_hour)
,      surg_start_month                = cnvtstring(sc.surg_start_month)
,      surg_start_tz                   = cnvtstring(sc.surg_start_tz)
,      surg_stop_dt_tm                 = format(sc.surg_stop_dt_tm,"yyyyMMddhhmmss;;d")
;70
,      surg_stop_tz                    = cnvtstring(sc.surg_stop_tz)
,      turnover_dur                    = cnvtstring(sc.turnover_dur)
,      updt_applctx                    = cnvtstring(sc.updt_applctx)
,      updt_cnt                        = cnvtstring(sc.updt_cnt)
,      updt_dt_tm                      = format(sc.updt_dt_tm,"yyyyMMddhhmmss;;d")
,      updt_id                         = cnvtstring(sc.updt_id)
,      updt_task                       = cnvtstring(sc.updt_task)
,      updt_tz                       = cnvtstring(sc.updt_tz)
,      wound_class_cd                  = cnvtstring(sc.wound_class_cd)
 
from   surgical_case sc
plan sc
order by  sc.surg_case_id
head report
	head_line = build(
   "active_ind"
,"||active_status_cd"
,"||active_status_dt_tm"
,"||active_status_prsnl_id"
,"||addl_supplies_ind"
,"||add_on_ind"
,"||anesth_prsnl_id"
,"||anesth_type_cd"
,"||appt_id"
,"||asa_class_cd"
; 10
,"||cancel_dt_tm"
,"||cancel_reason_cd"
,"||cancel_req_by_id"
,"||cancel_req_by_text"
,"||cancel_tz"
,"||case_level_cd"
,"||checkin_by_id"
,"||checkin_dt_tm"
,"||checkin_tz"
,"||create_applctx"
; 20
,"||create_dt_tm"
,"||create_prsnl_id"
,"||create_task"
,"||curr_case_status_cd"
,"||curr_case_status_dt_tm"
,"||dept_cd"
,"||encntr_id"
,"||inst_cd"
,"||or_shift_cd"
,"||pat_type_cd"
; 30
,"||person_id"
,"||postop_diag_text_id"
,"||preop_diag_text_id"
,"||rowid"
,"||sched_anesth_prsnl_id"
,"||sched_case_nbr_locn_cd"
,"||sched_case_type_cd"
,"||sched_cleanup_dur"
,"||sched_dur"
,"||sched_op_loc_cd"
 
; 40
,"||sched_or_shift_cd"
,"||sched_pat_type_cd"
,"||sched_qty"
,"||sched_setup_dur"
,"||sched_start_day"
,"||sched_start_dt_tm"
,"||sched_start_hour"
,"||sched_start_month"
,"||sched_start_tz"
,"||sched_surg_area_cd"
; 50
,"||sched_surg_specialty_id"
,"||sched_type_cd"
,"||sch_event_id"
,"||surgeon_prsnl_id"
,"||surg_area_cd"
,"||surg_case_id"
,"||surg_case_nbr_cnt"
,"||surg_case_nbr_formatted"
,"||surg_case_nbr_locn_cd"
,"||surg_case_nbr_yr"
; 60
,"||surg_complete_qty"
,"||surg_dur_min"
,"||surg_op_loc_cd"
,"||surg_specialty_id"
,"||surg_start_day"
,"||surg_start_dt_tm"
,"||surg_start_hour"
,"||surg_start_month"
,"||surg_start_tz"
,"||surg_stop_dt_tm"
; 70
,"||surg_stop_tz"
,"||turnover_dur"
,"||updt_applctx"
,"||updt_cnt"
,"||updt_dt_tm"
,"||updt_id"
,"||updt_task"
,"||updt_tz"
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
,"||",addl_supplies_ind
,"||",add_on_ind
,"||",anesth_prsnl_id
,"||",anesth_type_cd
,"||",appt_id
,"||",asa_class_cd
; 10
,"||",cancel_dt_tm
,"||",cancel_reason_cd
,"||",cancel_req_by_id
,"||",cancel_req_by_text
,"||",cancel_tz
,"||",case_level_cd
,"||",checkin_by_id
,"||",checkin_dt_tm
,"||",checkin_tz
,"||",create_applctx
; 20
,"||",create_dt_tm
,"||",create_prsnl_id
,"||",create_task
,"||",curr_case_status_cd
,"||",curr_case_status_dt_tm
,"||",dept_cd
,"||",encntr_id
,"||",inst_cd
,"||",or_shift_cd
,"||",pat_type_cd
; 30
,"||",person_id
,"||",postop_diag_text_id
,"||",preop_diag_text_id
,"||",rowid
,"||",sched_anesth_prsnl_id
,"||",sched_case_nbr_locn_cd
,"||",sched_case_type_cd
,"||",sched_cleanup_dur
,"||",sched_dur
,"||",sched_op_loc_cd
 
; 40
,"||",sched_or_shift_cd
,"||",sched_pat_type_cd
,"||",sched_qty
,"||",sched_setup_dur
,"||",sched_start_day
,"||",sched_start_dt_tm
,"||",sched_start_hour
,"||",sched_start_month
,"||",sched_start_tz
,"||",sched_surg_area_cd
; 50
,"||",sched_surg_specialty_id
,"||",sched_type_cd
,"||",sch_event_id
,"||",surgeon_prsnl_id
,"||",surg_area_cd
,"||",surg_case_id
,"||",surg_case_nbr_cnt
,"||",surg_case_nbr_formatted
,"||",surg_case_nbr_locn_cd
,"||",surg_case_nbr_yr
; 60
,"||",surg_complete_qty
,"||",surg_dur_min
,"||",surg_op_loc_cd
,"||",surg_specialty_id
,"||",surg_start_day
,"||",surg_start_dt_tm
,"||",surg_start_hour
,"||",surg_start_month
,"||",surg_start_tz
,"||",surg_stop_dt_tm
; 70
,"||",surg_stop_tz
,"||",turnover_dur
,"||",updt_applctx
,"||",updt_cnt
,"||",updt_dt_tm
,"||",updt_id
,"||",updt_task
,"||",updt_tz
 
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
set outfile = concat("H416989_T",dirdt,"_E",edt,"_surg_case.txt")
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
