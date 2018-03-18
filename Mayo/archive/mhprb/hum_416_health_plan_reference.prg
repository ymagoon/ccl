 
drop program humedica_bc_health_plan:dba go
create program humedica_bc_health_plan:dba
 
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
set print_file = concat("hum_zh_insurance_health_plan_",dirdt,".dat")
set hold_file = concat("$CCLUSERDIR/",print_file)
;set hold_file = concat("$CCLSCRATCH/",print_file)
set print_dir = "ccluserdir:"
set client_code = "H416989"
set file_ext = "_zh_insurance_health_plan.txt"
 
call echo("------------ dump the health_plan table --------------")
 
record tmp
(
1 out_line = vc
1 qual [*]
 5 active_ind     = vc
 5 health_plan_id = vc
 5 plan_name      = vc
 5 plan_type_cd   = vc
 5 plan_desc      = vc
 5 financial_class_cd = vc
 5 plan_class_cd   = vc
 5 service_type_cd = vc
)
 
select into "nl:"
   hp.health_plan_id
from health_plan hp
plan hp where hp.health_plan_id > 0
;	and hp.active_ind = 1
head report
cnt = 0
head hp.health_plan_id
cnt = cnt+1
stat = alterlist(tmp->qual,cnt)
tmp->qual[cnt]->active_ind     = cnvtstring(hp.active_ind)
tmp->qual[cnt]->health_plan_id = cnvtstring(hp.health_plan_id)
tmp->qual[cnt]->plan_name      = trim(hp.plan_name,3)
tmp->qual[cnt]->plan_type_cd   = cnvtstring(hp.plan_type_cd)
tmp->qual[cnt]->plan_desc      = trim(hp.plan_desc,3)
tmp->qual[cnt]->financial_class_cd = cnvtstring(hp.financial_class_cd)
tmp->qual[cnt]->plan_class_cd      = cnvtstring(hp.plan_class_cd)
tmp->qual[cnt]->service_type_cd    = cnvtstring(hp.service_type_cd)
with nocounter
 
 
select into concat(print_dir,print_file)	;humedica_bc_health_plan
tmp->qual[d.seq].health_plan_id
from
   (dummyt d with seq = value(size(tmp->qual,5)))
plan d
head report
tmp->out_line = build("ACTIVE_IND||","HEALTH_PLAN_ID||","PLAN_NAME||","PLAN_TYPE_CD||","PLAN_DESC||",
"FINANCIAL_CLASS_CD||","PLAN_CLASS_CD||","SERVICE_TYPE_CD")
col 0 , tmp->out_line
row + 1
detail
tmp->out_line = build(
tmp->qual[d.seq].active_ind , '||"',
tmp->qual[d.seq].health_plan_id , '||"',
tmp->qual[d.seq].plan_name , '"||',
tmp->qual[d.seq].plan_type_cd, '||"',
tmp->qual[d.seq].plan_desc, '"||',
tmp->qual[d.seq].financial_class_cd, '||',
tmp->qual[d.seq].plan_class_cd, '||',
tmp->qual[d.seq].service_type_cd,'|')
col 0 , tmp->out_line
row + 1
with formfeed = none,
maxrow = 1,
nocounter,
maxcol = 5000,format = variable
 
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
set DCLCOM = concat("mkdir ",trim(newdir),"dictionaries/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = "$mhs_ops/humedica/cerner/dictionaries/"
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
 
