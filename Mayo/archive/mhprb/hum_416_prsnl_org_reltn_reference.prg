/******************************************************
 01 Sept 2011...mrhine
    Get a straight dump of the PRSNL_ORG_RELTN table and schedule as a monthly dictionary pull in production
    Directory should reflect the month extracted.  H667594/Dictionaries/2011/AUG/filename
 
 *****************************************************/
drop   program hum_prsnl_org_reltn_reference:dba go
create program hum_prsnl_org_reltn_reference:dba
 
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
 
;prompt
;	"Extract File (MINE = screen)" = "MINE"
;;     , "Start Date (dd-mmm-yyyy)" = "CURDATE"
;
;with OUTDEV ;, STARTDT
;
declare startdt = f8
set stardt = cnvtdatetime(curdate,curtime3)
set startdt = cnvtdatetime(stardt)
set run_date = cnvtdatetime(curdate,curtime3)
 
declare month = vc
set month = format(startdt,"mmm;;d")
 
  /*******************************************
*  SELECTION CRITERIA
*******************************************/
;set enddt = cnvtdatetime(endt)
free set today
declare today = f8
declare edt = vc
declare ydt = vc
 
set today = cnvtdatetime(curdate,curtime3)
set edt = format(today,"yyyymmdd;;d")
set dirdt = format(startdt,"yyyymmdd;;d")
set ydt = format(startdt,"yyyy;;d")
set beg_dt = startdt
call echo(build("beg_dt = ",beg_dt))
 
set print_file = concat("hum_prsnl_org_reltn_ref_",dirdt,".dat")
set hold_file = concat("/cerner/d_mhprd/ccluserdir/",print_file)
 
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
 plan por
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
 
set newdir = concat("/humedica/mhprd/data/cerner/dictionaries")
set DCLCOM = concat("mkdir ",newdir)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = concat("/humedica/mhprd/data/cerner/dictionaries/",dir_date)
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
 
