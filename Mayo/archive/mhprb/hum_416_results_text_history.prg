/******************************************************
 10 June 2011...mrhine
   1. added reminder
   2. changed directory structure to year month not csv
 11 June 2011...mrhine
   1. removed array logic due to memory allocation errors.
      spool directly to file
 
 
  note: be sure to clean up the dm_info table with this
select *
 from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_results_text"
go
 
delete from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_results_text"
 go
commit go
;002 04/14/12 kmcdaniel - rewritten for Client 416
 *****************************************************/
drop program hum_results_text_history:dba go
create program hum_results_text_history:dba
 
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
 
/*******************************************
*  CODE VALUES
*******************************************/
declare mrn_alias_cd         = f8 with public, noconstant(0.0)
declare mrn_cmrn_cd          = f8 with public, noconstant(0.0)
set mrn_cmrn_cd = uar_get_code_by("DISPLAYKEY",263,"CMRNMMI")
 
free set testdt
set testdt = cnvtdatetime("01-JAN-2010 0000")
set end_run_date = cnvtdatetime("01-JAN-2012 0000")
set run_date = cnvtdatetime(curdate,curtime3)
 
declare domain_info_name = vc
set domain_info_name = trim("humedica_results_text")
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
   declare nxtweek = f8
 
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
 
	set print_file = concat("hum_results_text_history_",dirdt,".dat")
	set hold_file = concat("/cerner/d_mhprd/ccluserdir/",print_file)
	set file_ext = "_results_text.txt"
 
call echo("---------------------------")
call echo(build("start_date = ",format(startdt,"mm/dd/yyyy hh:mm;;d")))
call echo(build("end_date = ",format(enddt,"mm/dd/yyyy hh:mm;;d")))
call echo(build("Current Date = ",format(run_date,"mm/dd/yyyy hh:mm;;dm")))
call echo("----------write to array -----------------")
 
call echo("get results text for encounters that qualify")
 
select into value(print_file)
   person_id          = cnvtstring(e.person_id)
,   encntr_id         = e.encntr_id
,   org_id            = cnvtstring(e.organization_id)
,   facility_cd       = cnvtstring(e.loc_facility_cd)
,   fin_nbr            = trim(ea.alias,3)
,   encntr_id          = ce.encntr_id
,   disch_dt_tm        = format(e.disch_dt_tm,"YYYYMMDDhhmmss;;d")
,   event_cd           = cnvtstring(ce.event_cd)
,   clinical_event_id  = cnvtstring(ce.clinical_event_id)
,   clinsig_updt_dt_tm = format(ce.clinsig_updt_dt_tm,"YYYYMMDDhhmmss;;d")
;10
,   event_tag          = trim(ce.event_tag,3)
,   result_status_cd = cnvtstring(ce.result_status_cd)
,   result_value     = trim(ce.result_val,3)
,   result_units_cd  = cnvtstring(ce.result_units_cd)
,   normalcy_cd      = cnvtstring(ce.normalcy_cd)
,   resource_cd      = cnvtstring(ce.resource_cd)
,   normal_high      = cnvtstring(ce.normal_high)
,   normal_low       = cnvtstring(ce.normal_low)
,   order_id         = cnvtstring(ce.order_id)
,   catalog_cd       = cnvtstring(ce.catalog_cd)
;20
,   accession_nbr    = trim(ce.accession_nbr,3)
,   performed_id     = cnvtstring(ce.performed_prsnl_id)
,   performed_dt_tm  = format(ce.performed_dt_tm,"YYYYMMDDhhmmss;;d")
,   verified_id      = cnvtstring(ce.verified_prsnl_id)
,   verified_dt_tm   = format(ce.verified_dt_tm,"YYYYMMDDhhmmss;;d")
,   updt_dt_tm       = format(ce.updt_dt_tm,"YYYYMMDDhhmmss;;d")
 
 
from
  encounter e,
  encntr_alias ea,
  clinical_event ce
 
plan ce where ce.updt_dt_tm between cnvtdatetime(beg_dt)
	and cnvtdatetime(end_dt)
	and ce.valid_until_dt_tm +0 > cnvtdatetime(curdate,curtime3)
	and ce.result_val > " "
	and ce.event_class_cd +0 = 236 ;txt
join e where e.encntr_id = ce.encntr_id
	and e.active_ind = 1
	and e.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
join ea where e.encntr_id = ea.encntr_id
    and ea.encntr_alias_type_cd = 1077
    and ea.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
    and ea.active_ind = 1
order ce.updt_dt_tm
head report
head_line = build(
 "PATIENT_ID_INT||"
,"FACILITY_ID||"
,"ENCOUNTER_ID||"
,"ORGANIZATION_ID||"
,"ACCESSION||"
,"ORDER_ID||"
,"CATALOG_CD||"
,"EVENT_TAG||"
,"PERFORMED_BY_ID||"
,"PERFORMED_DT_TM||"
;10
,"VERIFIED_BY_ID||"
,"VERIFIED_DT_TM||"
,"DISCH_DT_TM||"
,"EVENT_CD||"
,"NORMALCY_CD||"
,"NORMAL_HIGH||"
,"NORMAL_LOW||"
,"RESULT_VALUE||"
,"RESULT_UNITS_CD||"
,"RESOURCE_CD||"
;20
,"CLINICAL_EVENT_ID||"
,"CLINSIG_UPDT_DT_TM||"
,"RESULT_STATUS_CD||"
,"UPDT_DT_TM|"
)
 
col 0	head_line
row + 1
 
head ce.updt_dt_tm
	abc = 0
detail
	abc = 0
foot ce.updt_dt_tm
   rtxt= build(
      person_id, '||',
      facility_cd, '||',
      fin_nbr, '||',
      org_id, '||',
      accession_nbr, '||',
      order_id, '||',
      catalog_cd, '||',
      event_tag,'||',
      performed_id,'||',
      performed_dt_tm , '||',
;10
      verified_id, '||',
      verified_dt_tm , '||',
      disch_dt_tm,'||',
      event_cd ,'||',
      normalcy_cd, '||',
      normal_high, '||',
      normal_low, '||',
      result_value , '||',
      result_units_cd , '||',
      resource_cd , '||',
;20
      clinical_event_id ,'||',
      clinsig_updt_dt_tm, '||',
      result_status_cd, '||',
      updt_dt_tm, '|')
 
    col +0 rtxt
    row + 1
 
with ;formfeed = none,
     maxrow = 1,
     nocounter,
     maxcol = 80000,
     format = variable
;     ,filesort
     ,append
 
;move dm_info update logic to follow extract
 
   if (dtfnd = "Y")
      set dtfnd = "N"
      update into dm_info dm
      set dm.updt_dt_tm = cnvtdatetime(nxtmnth)	;cnvtdatetime(enddt)
      where dm.info_domain="HUMEDICA" and dm.info_name = domain_info_name
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
set outfile = concat("H416989_T",dirdt,"_E",edt,file_ext)
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
