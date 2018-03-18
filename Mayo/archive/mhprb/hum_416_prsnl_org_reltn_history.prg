/******************************************************
  note: be sure to clean up the dm_info table with this
 
select *
 from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_prsnl_org_reltn"
go
 
delete from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_prsnl_org_reltn"
 go
commit go
;002 04/11/12 kmcdaniel - rewritten for Mayo (416)
 *****************************************************/
drop   program hum_prsnl_org_reltn_history:dba go
create program hum_prsnl_org_reltn_history:dba
 
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
set domain_info_name = trim("humedica_prsnl_org_reltn")
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
 
	set print_file = concat("hum_prsnl_org_reltn_history_",dirdt,".dat")
	set hold_file = concat("/cerner/d_mhprd/ccluserdir/",print_file)
 
/*******************************************
*  SELECTION CRITERIA
*******************************************/
 
call echo("get prsnl_org_reltns that qualify")
 
select into value(print_file)
   active_ind              = cnvtstring(por.active_ind)
  ,active_status_cd        = trim(cnvtstring(por.active_status_cd),3)
  ,active_status_dt_tm     = trim(format(por.active_status_dt_tm,"yyyyMMddhhmmss;;d"),3)
  ,active_status_prsnl_id  = trim(cnvtstring(por.active_status_prsnl_id),3)
  ,beg_effective_dt_tm     = trim(format(por.beg_effective_dt_tm,"yyyyMMddhhmmss;;d"),3)
  ,confid_level_cd         = trim(cnvtstring(por.confid_level_cd),3)
  ,end_effective_dt_tm     = trim(format(por.end_effective_dt_tm,"yyyyMMddhhmmss;;d"),3) ;20
  ,organization_id         = trim(cnvtstring(por.organization_id),3)
  ,person_id               = trim(cnvtstring(por.person_id),3)
  ,prsnl_org_reltn_id      = trim(cnvtstring(por.prsnl_org_reltn_id),3)
  ,rowid                   = trim(por.rowid,3)
  ,updt_applctx            = trim(cnvtstring(por.updt_applctx),3)
  ,updt_cnt                = trim(cnvtstring(por.updt_cnt),3)
  ,updt_dt_tm              = trim(format(por.updt_dt_tm,"yyyyMMddhhmmss;;d"),3)
  ,updt_id                 = trim(cnvtstring(por.updt_id),3)
  ,updt_task               = trim(cnvtstring(por.updt_task),3)
 
from  prsnl_org_reltn por
plan por where por.updt_dt_tm between cnvtdatetime(beg_dt)
	and cnvtdatetime(end_dt)
order by por.person_id, por.organization_id
 
  head report
  col+ 0
  "active_ind",
"||active_status_cd",
"||active_status_dt_tm",
"||active_status_prsnl_id",
"||beg_effective_dt_tm",
"||confid_level_cd",
"||end_effective_dt_tm",
"||organization_id",
"||person_id",
"||prsnl_org_reltn_id",
"||rowid",
"||updt_applctx",
"||updt_cnt",
"||updt_dt_tm",
"||updt_id",
"||updt_task|"
 
 row + 1
 
 
detail
 
;col + 0
rtxt = build(active_ind
,"||",active_status_cd
,"||",active_status_dt_tm
,"||",active_status_prsnl_id
,"||",beg_effective_dt_tm
,"||",confid_level_cd
,"||",end_effective_dt_tm
,"||",organization_id
,"||",person_id
,"||",prsnl_org_reltn_id
,"||",rowid
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
     nocounter,
     maxrow = 1,
     format = variable,
     maxcol = 32000,
;	 SEPARATOR="",
     append
 
   if (dtfnd = "Y")
      set dtfnd = "N"
      update into dm_info dm
      set dm.updt_dt_tm = cnvtdatetime(nxtmnth)
      where dm.info_domain="HUMEDICA"
      and dm.info_name = domain_info_name
 
      with nocounter
      commit
   endif
   set testdt = nxtmnth
 
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
set outfile = concat("H416989_T",dirdt,"_E",edt,"_prsnl_org_reltn.txt")
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
 
