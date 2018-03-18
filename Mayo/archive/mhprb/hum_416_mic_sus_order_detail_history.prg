/******************************************************
 12 June 2011...mrhine
   1. added reminder
   2. changed directory structure to c965 from prod
 
 
  note: be sure to clean up the dm_info table with this
select *
 from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_mic_sus_ord_detail"
go
 
delete from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_mic_sus_ord_detail"
 go
commit go
;002 04/12/12 kmcdaniel - rewritten for Mayo (416)
 *****************************************************/
drop program hum_mic_sus_ord_det_history:dba go
create program hum_mic_sus_ord_det_history:dba
 
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
set domain_info_name = trim("humedica_mic_sus_ord_detail")
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
 
	set print_file = concat("hum_mic_sus_ord_det_history_",dirdt,".dat")
	set hold_file = concat("/cerner/d_mhprd/ccluserdir/",print_file)
 
free set encounters
record encounters
(
  1 out_line                    = vc
  1 enc_cnt                     = i4
  1 qual[*]
	2 TASK_LOG_ID=VC
	2 DETAIL_SUS_SEQ=VC
	2 DETAIL_SUS_CD=VC
	2 DETAIL_TYPE_FLAG=VC
	2 PANEL_CD=VC
	2 COMMENT_SEQ=VC
	2 UPDT_CNT=VC
	2 UPDT_DT_TM=VC
	2 UPDT_ID=VC
	2 UPDT_TASK=VC
	2 UPDT_APPLCTX=VC
	2 STATUS_CD=VC
	)
 
select into value(print_file)
TASK_LOG_ID=cnvtstring(msod.task_log_id)
,DETAIL_SUS_SEQ=cnvtstring(msod.detail_sus_seq)
,DETAIL_SUS_CD=cnvtstring(msod.detail_sus_cd)
,DETAIL_TYPE_FLAG=cnvtstring(msod.detail_type_flag)
,PANEL_CD=cnvtstring(msod.panel_cd)
,COMMENT_SEQ=cnvtstring(msod.comment_seq)
,UPDT_CNT=cnvtstring(msod.updt_cnt)
,UPDT_DT_TM=format(msod.updt_dt_tm,"YYYYMMDDhhmmss;;d")
,UPDT_ID=cnvtstring(msod.updt_id)
,UPDT_TASK=cnvtstring(msod.updt_task)
,UPDT_APPLCTX=cnvtstring(msod.updt_applctx)
,STATUS_CD=cnvtstring(msod.status_cd)
 
from encounter enc
    ,mic_task_log mtl
    , mic_sus_order_detail msod
    , orders ord
plan ord where ord.orig_order_dt_tm between cnvtdatetime(beg_dt)
                            and cnvtdatetime(end_dt)
             and ord.product_id >= 0
             and ord.order_status_cd >= 0
             and ord.activity_type_cd >=0
             and ord.synonym_id >=0
join enc where enc.encntr_id = ord.encntr_id
	and enc.active_ind = 1
	and enc.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
join mtl where mtl.order_id = ord.order_id
join msod where msod.task_log_id = mtl.task_log_id
	and msod.detail_sus_seq >= 0
order by msod.task_log_id, msod.detail_sus_seq
 
head report
  head_line = build(
"TASK_LOG_ID",
"||DETAIL_SUS_SEQ",
"||DETAIL_SUS_CD",
"||DETAIL_TYPE_FLAG",
"||PANEL_CD",
"||COMMENT_SEQ",
"||UPDT_CNT",
"||UPDT_DT_TM",
"||UPDT_ID",
"||UPDT_TASK",
"||UPDT_APPLCTX",
"||STATUS_CD|"
)
 
col 0 head_line
row + 1
 
head msod.task_log_id
x=0
head msod.detail_sus_seq
   detail_line     = build(
TASK_LOG_ID
,'||',DETAIL_SUS_SEQ
,'||',DETAIL_SUS_CD
,'||',DETAIL_TYPE_FLAG
,'||',PANEL_CD
,'||',COMMENT_SEQ
,'||',UPDT_CNT
,'||',UPDT_DT_TM
,'||',UPDT_ID
,'||',UPDT_TASK
,'||',UPDT_APPLCTX
,'||',STATUS_CD
,'|')
 
  col 0, detail_line
  row + 1
detail
	abc = 0
 
with ;formfeed = none,
     maxrow = 1,
     nocounter,
     maxcol = 5000,
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
set outfile = concat("H416989_T",dirdt,"_E",edt,"_mic_sus_order_detail.txt")
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
