/******************************************************
 12 June 2011...mrhine
   1. added reminder
   2. changed directory structure to c965 from prod
 
 
  note: be sure to clean up the dm_info table with this
select *
 from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_mic_task_log"
go
 
delete from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_mic_task_log"
 go
commit go
;002 04/12/12 kmcdaniel - rewritten for Mayo (416)
 *****************************************************/
drop program hum_mic_task_log_history:dba go
create program hum_mic_task_log_history:dba
 
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
set domain_info_name = trim("humedica_mic_task_log")
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
 
	set print_file = concat("hum_mic_task_log_history_",dirdt,".dat")
	set hold_file = concat("/cerner/d_mhprd/ccluserdir/",print_file)
 
free set encounters
record encounters
(
  1 out_line                    = vc
  1 enc_cnt                     = i4
  1 qual[*]
5 TASK_LOG_ID                      =VC
5 ORDER_ID                         =VC
5 CATALOG_CD                       =VC
5 CORRECTED_IND                    =VC
5 TASK_DISPLAY_ORDER               =VC
5 TASK_TECH_ID                     =VC
5 TASK_CD                          =VC
5 TASK_QUAL                        =VC
5 TASK_CLASS_FLAG                  =VC
5 TASK_TYPE_FLAG                   =VC
5 TASK_STATUS_CD                   =VC
5 TASK_DT_TM                       =VC
5 TASK_LOCATION_CD                 =VC
5 ORGANISM_CD                      =VC
5 ORGANISM_QUAL                    =VC
5 OBSERVATION                      =VC
5 Q_SCORE                          =VC
5 CHARTABLE_IND                    =VC
5 ABNORMAL_IND                     =VC
5 POSITIVE_IND                     =VC
5 COMMENT_IND                      =VC
5 REQUEUE_IND                      =VC
5 EXPEDITE_IND                     =VC
5 UPDT_CNT                         =VC
5 UPDT_DT_TM                       =VC
5 UPDT_ID                          =VC
5 UPDT_TASK                        =VC
5 UPDT_APPLCTX                     =VC
5 INSTR_ID_NBR                     =VC
5 INSTR_RESOURCE_CD                =VC
5 LONG_TEXT_ID                     =VC
)
 
select into value(print_file)
TASK_LOG_ID                      =cnvtstring(mtl.task_log_id)
,ORDER_ID                         =cnvtstring(mtl.order_id)
,CATALOG_CD                       =cnvtstring(mtl.catalog_cd)
,CORRECTED_IND                    =cnvtstring(mtl.corrected_ind)
,TASK_DISPLAY_ORDER               =cnvtstring(mtl.task_display_order)
,TASK_TECH_ID                     =cnvtstring(mtl.task_tech_id)
,TASK_CD                          =cnvtstring(mtl.task_cd)
,TASK_QUAL                        =cnvtstring(mtl.task_qual)
,TASK_CLASS_FLAG                  =cnvtstring(mtl.task_class_flag)
,TASK_TYPE_FLAG                   =cnvtstring(mtl.task_type_flag)
,TASK_STATUS_CD                   =cnvtstring(mtl.task_status_cd)
,TASK_DT_TM                       =format(mtl.task_dt_tm,"YYYYMMDDhhmmss;;d")
,TASK_LOCATION_CD                 =cnvtstring(mtl.task_location_cd)
,ORGANISM_CD                      =cnvtstring(mtl.organism_cd)
,ORGANISM_QUAL                    =cnvtstring(mtl.organism_qual)
,OBSERVATION                      =trim(mtl.observation,3)
,Q_SCORE                          =cnvtstring(mtl.q_score)
,CHARTABLE_IND                    =cnvtstring(mtl.chartable_ind)
,ABNORMAL_IND                     =cnvtstring(mtl.abnormal_ind)
,POSITIVE_IND                     =cnvtstring(mtl.positive_ind)
,COMMENT_IND                      =cnvtstring(mtl.comment_ind)
,REQUEUE_IND                      =cnvtstring(mtl.requeue_ind)
,EXPEDITE_IND                     =cnvtstring(mtl.expedite_ind)
,UPDT_CNT                         =cnvtstring(mtl.updt_cnt)
,UPDT_DT_TM                       =format(mtl.updt_dt_tm,"YYYYMMDDhhmmss;;d")
,UPDT_ID                          =cnvtstring(mtl.updt_id)
,UPDT_TASK                        =cnvtstring(mtl.updt_task)
,UPDT_APPLCTX                     =cnvtstring(mtl.updt_applctx)
,INSTR_ID_NBR                     =cnvtstring(mtl.instr_id_nbr)
,INSTR_RESOURCE_CD                =cnvtstring(mtl.instr_resource_cd)
,LONG_TEXT_ID                     =cnvtstring(mtl.long_text_id)
 
from encounter enc
    ,mic_task_log mtl
    ,orders ord
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
 
head report
  head_line = build(
"TASK_LOG_ID",
"||ORDER_ID",
"||CATALOG_CD",
"||CORRECTED_IND",
"||TASK_DISPLAY_ORDER",
"||TASK_TECH_ID",
"||TASK_CD",
"||TASK_QUAL",
"||TASK_CLASS_FLAG",
"||TASK_TYPE_FLAG",
"||TASK_STATUS_CD",
"||TASK_DT_TM",
"||TASK_LOCATION_CD",
"||ORGANISM_CD",
"||ORGANISM_QUAL",
"||OBSERVATION",
"||Q_SCORE",
"||CHARTABLE_IND",
"||ABNORMAL_IND",
"||POSITIVE_IND",
"||COMMENT_IND",
"||REQUEUE_IND",
"||EXPEDITE_IND",
"||UPDT_CNT",
"||UPDT_DT_TM",
"||UPDT_ID",
"||UPDT_TASK",
"||UPDT_APPLCTX",
"||INSTR_ID_NBR",
"||INSTR_RESOURCE_CD",
"||LONG_TEXT_ID|"
)
 
col 0 head_line
row + 1
 
head mtl.task_log_id
   detail_line     = build(
TASK_LOG_ID
,'||',ORDER_ID
,'||',CATALOG_CD
,'||',CORRECTED_IND
,'||',TASK_DISPLAY_ORDER
,'||',TASK_TECH_ID
,'||',TASK_CD
,'||',TASK_QUAL
,'||',TASK_CLASS_FLAG
,'||',TASK_TYPE_FLAG
,'||',TASK_STATUS_CD
,'||',TASK_DT_TM
,'||',TASK_LOCATION_CD
,'||',ORGANISM_CD
,'||',ORGANISM_QUAL
,'||',OBSERVATION
,'||',Q_SCORE
,'||',CHARTABLE_IND
,'||',ABNORMAL_IND
,'||',POSITIVE_IND
,'||',COMMENT_IND
,'||',REQUEUE_IND
,'||',EXPEDITE_IND
,'||',UPDT_CNT
,'||',UPDT_DT_TM
,'||',UPDT_ID
,'||',UPDT_TASK
,'||',UPDT_APPLCTX
,'||',INSTR_ID_NBR
,'||',INSTR_RESOURCE_CD
,'||',LONG_TEXT_ID
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
set outfile = concat("H416989_T",dirdt,"_E",edt,"_mic_task_log.txt")
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
