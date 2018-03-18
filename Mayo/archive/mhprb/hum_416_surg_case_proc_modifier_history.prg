/******************************************************
 5 June 2011 - mrhine
     changed to a straight table dump/extract per Cathy and Adriana
 
;002 04/14/12 kmcdaniel - rewritten for Mayo (416)
 *****************************************************/
drop  program hum_surg_case_mod_history:dba go
create program hum_surg_case_mod_history:dba
 
 
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
set domain_info_name = trim("humedica_surg_case_mod")
 
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
 
	set print_file = concat("hum_surg_case_mod_history_",dirdt,".dat")
	set hold_file = concat("/cerner/d_mhprd/ccluserdir/",print_file)
 
   call echo("get ALL the surg_cases entries.")
 
 
select into value(print_file)
       active_ind                      = cnvtstring(scpm.active_ind)
,      active_status_cd                = cnvtstring(scpm.active_status_cd)
,      active_status_dt_tm             = format(scpm.active_status_dt_tm,"yyyyMMddhhmmss;;d")
,      active_status_prsnl_id          = cnvtstring(scpm.active_status_prsnl_id)
,      beg_effective_dt_tm             = format(scpm.beg_effective_dt_tm,"yyyyMMddhhmmss;;d")
,      create_applctx                  = cnvtstring(scpm.create_applctx)
,      create_dt_tm                    = format(scpm.create_dt_tm,"yyyyMMddhhmmss;;d")
,      create_prsnl_id                 = cnvtstring(scpm.create_prsnl_id)
,      create_task                     = cnvtstring(scpm.create_task)
,      end_effective_dt_tm             = format(scpm.end_effective_dt_tm,"yyyyMMddhhmmss;;d")
;10
,      modifier_cd                     = cnvtstring(scpm.modifier_cd)
,      modifier_seq                    = cnvtstring(scpm.modifier_seq)
,      rowid                           = cnvtstring(scpm.rowid)
,      surg_case_proc_id               = cnvtstring(scpm.surg_case_proc_id)
,      surg_case_proc_mod_id           = cnvtstring(scpm.surg_case_proc_mod_id)
,      updt_applctx                    = cnvtstring(scpm.updt_applctx)
,      updt_cnt                        = cnvtstring(scpm.updt_cnt)
,      updt_dt_tm                      = format(scpm.updt_dt_tm,"yyyyMMddhhmmss;;d")
,      updt_id                         = cnvtstring(scpm.updt_id)
,      updt_task                       = cnvtstring(scpm.updt_task)
 
from   surg_case_proc_modifier scpm
plan scpm
order by  scpm.surg_case_proc_id
 
head report
head_line = build(
   "active_ind"
,"||active_status_cd"
,"||active_status_dt_tm"
,"||active_status_prsnl_id"
,"||beg_effective_dt_tm"
,"||create_applctx"
,"||create_dt_tm"
,"||create_prsnl_id"
,"||create_task"
,"||end_effective_dt_tm"
; 10
,"||modifier_cd"
,"||modifier_seq"
,"||rowid"
,"||surg_case_proc_id"
,"||surg_case_proc_mod_id"
,"||updt_applctx"
,"||updt_cnt"
,"||updt_dt_tm"
,"||updt_id"
,"||updt_task|"
)
col 0	head_line
row + 1
 
detail
rtxt = build(
   active_ind
,"||",active_status_cd
,"||",active_status_dt_tm
,"||",active_status_prsnl_id
,"||",beg_effective_dt_tm
,"||",create_applctx
,"||",create_dt_tm
,"||",create_prsnl_id
,"||",create_task
,"||",end_effective_dt_tm
; 10
,"||",modifier_cd
,"||",modifier_seq
,"||",rowid
,"||",surg_case_proc_id
,"||",surg_case_proc_mod_id
,"||",updt_applctx
,"||",updt_cnt
,"||",updt_dt_tm
,"||",updt_id
,"||",updt_task
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
set outfile = concat("H416989_T",dirdt,"_E",edt,"_surg_case_mod.txt")
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
