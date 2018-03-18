 
drop program hum_bc_object_ident_monthly:dba go
create program hum_bc_object_ident_monthly:dba
 
;**** BEGINNING OF PREAMBLE ****
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
 
declare startdt = f8
declare enddt = f8
 
set stardt = cnvtdatetime(curdate-1,0)
set endt = cnvtdatetime(curdate-1,235959)
 
set startdt = cnvtdatetime(stardt)
set enddt = cnvtdatetime(endt)
free set today
declare today = f8
declare edt = vc
declare ydt = vc
 
declare month = vc
set month = format(startdt,"mmm;;d")
set dir_date = format(curdate,"yyyymm;;d")
 
set today = cnvtdatetime(curdate,curtime3)
set edt = format(today,"yyyymmdd;;d")
set dirdt = format(startdt,"yyyymmdd;;d")
set ydt = format(startdt,"yyyy;;d")
 
set beg_dt = startdt
set echo_beg_dt = format(beg_dt,"dd/mmm/yyyy hh:mm;;d")
set end_dt = enddt
set echo_end_dt = format(end_dt,"dd/mmm/yyyy hh:mm;;d")
 
 
;002 unique file logic
set print_file = concat("hum_zh_object_identifier_",dirdt,".dat")
set hold_file = concat("$CCLUSERDIR/",print_file)
;set hold_file = concat("$CCLSCRATCH/",print_file)
set print_dir = "ccluserdir:"
set client_code = "H416989"
set file_ext = "_zh_object_identifier.txt"
 
call echo("---- dump the object_identifier table ------")
 
 
select into concat(print_dir,print_file)	;humedica_bc_object_identifier
 
   active_ind              = cnvtstring(active_ind)
  ,active_status_cd        = trim(cnvtstring(active_status_cd),3)
  ,active_status_dt_tm     = trim(format(active_status_dt_tm,"yyyyMMddhhmmss;;d"),3)
  ,active_status_prsnl_id  = trim(cnvtstring(active_status_prsnl_id),3)
  ,identifier_id           = cnvtstring(identifier_id)
  ,object_id               = cnvtstring(object_id)
  ,object_type_cd          = trim(cnvtstring(object_type_cd),3)
  ,parent_entity_id        = cnvtstring(parent_entity_id)
  ,parent_entity_name      = trim(parent_entity_name,3)
  ,primary_ind             = cnvtstring(primary_ind)
;10
  ,primary_nbr_ind         = cnvtstring(primary_nbr_ind)
  ,rowid                   = trim(rowid,3)
  ,sequence                = trim(cnvtstring(sequence),3)
  ,updt_applctx            = trim(cnvtstring(updt_applctx),3)
  ,updt_cnt                = trim(cnvtstring(updt_cnt),3)
  ,updt_dt_tm              = trim(format(updt_dt_tm,"yyyyMMddhhmmss;;d"),3)
  ,updt_id                 = trim(cnvtstring(updt_id),3)
  ,updt_task               = trim(cnvtstring(updt_task),3)
  ,vendor_manf_cd          = trim(cnvtstring(vendor_manf_cd),3)
 
from object_identifier
 
order by identifier_id
 
head report
   col + 0
 
  "active_ind",
"||active_status_cd",
"||active_status_dt_tm",
"||active_status_prsnl_id",
"||identifier_id",
"||object_id",
"||object_type_cd",
"||parent_entity_id",
"||parent_entity_name",
"||primary_ind",
;10
"||primary_nbr_ind",
"||rowid",
"||sequence",
"||updt_applctx",
"||updt_cnt",
"||updt_dt_tm",
"||updt_id",
"||updt_task",
"||vendor_manf_cd|"
 
row+1
 
detail
rtxt = build(
  active_ind
,"||",active_status_cd
,"||",active_status_dt_tm
,"||",active_status_prsnl_id
,"||",identifier_id
,"||",object_id
,"||",object_type_cd
,"||",parent_entity_id
,"||",parent_entity_name
,"||",primary_ind
;10
,"||",primary_nbr_ind
,"||",rowid
,"||",sequence
,"||",updt_applctx
,"||",updt_cnt
,"||",updt_dt_tm
,"||",updt_id
,"||",updt_task
,"||",vendor_manf_cd
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
 
;****  BEGINNING OF POSTAMBLE ****
DECLARE LEN = I4
DECLARE dclcom = vc ;C255
DECLARE newdir = vc ;C255
 
set newdir = "$mhs_ops/"
set DCLCOM = concat("mkdir ",newdir,"humedica/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = "$mhs_ops/humedica/"
set DCLCOM = concat("mkdir ",newdir,"cerner/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir ="$mhs_ops/humedica/cerner/"
set DCLCOM = concat("mkdir ",trim(newdir),"daily/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = "$mhs_ops/humedica/cerner/daily/"
set DCLCOM = concat("mkdir ",trim(newdir),dir_date,"/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
free set outfile
set outfile = concat(client_code,"_T",dirdt,"_E",edt,file_ext)
 
set newfile = concat(trim(newdir),dir_date,"/",outfile)
 
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
 
