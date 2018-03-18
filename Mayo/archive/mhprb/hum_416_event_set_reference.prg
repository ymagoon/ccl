 
drop program hum_bc_event_set_monthly:dba go
create program hum_bc_event_set_monthly:dba
 
;**** BEGINNING OF PREAMBLE ****
;humedica_diag_extract_daily "nl:", "10-JUL-2012"
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
set print_file = concat("hum_zh_eventset_",dirdt,".dat")
set hold_file = concat("$CCLUSERDIR/",print_file)
;set hold_file = concat("$CCLSCRATCH/",print_file)
set print_dir = "ccluserdir:"
set client_code = "H416989"
set file_ext = "_zh_eventset.txt"
 
call echo("---------------dump the eventsets--------------")
 
free set bc_eventset
record bc_eventset
(
  1 out_line                 = vc
  1 qual[*]
    2 event_display          = vc
    2 event_code             = vc
    2 eventset_display       = vc
    2 eventset_code          = vc
    2 eventset_level         = vc
)
 
declare prevevent_cd = f8
set prevevent_cd = 0
 
select into "nl:"
   event_cd     = trim(substring(1,30,cv.display),3),
   event_set_cd = trim(substring(1,30,cv1.display),3)
from code_value cv, v500_event_set_explode ese, code_value cv1
plan ese where ese.event_cd > 0
 
join cv where cv.code_value = ese.event_cd
          and cv.active_ind > 0
join cv1 where cv1.code_value = ese.event_set_cd
           and cv1.active_ind > 0
order by ese.event_cd,ese.event_set_level
 
head report
   cnt = 0
 
detail
  cnt = cnt + 1
  stat = alterlist(bc_eventset->qual,cnt)
 
  bc_eventset->qual[cnt].event_display  = event_cd
  bc_eventset->qual[cnt].event_code     = cnvtstring(ese.event_cd)
  bc_eventset->qual[cnt].eventset_code  = event_set_cd
  bc_eventset->qual[cnt].eventset_display = cnvtstring(ese.event_set_cd)
  bc_eventset->qual[cnt].eventset_level  = cnvtstring(ese.event_set_level)
 
with nocounter
 
 
select into concat(print_dir,print_file)	;hum_bc_eventset
from
  (dummyt d with seq=value(size(bc_eventset->qual,5)))
  plan d
 
head report
  bc_eventset->out_line = build(
"EVENT DISPLAY"
,"||EVENT CODE"
,"||EVENT SET DISPLAY"
,"||EVENT SET CODE"
,"||EVENT SET LEVEL|"
)
 
col 0 bc_eventset->out_line
row + 1
 
detail
   bc_eventset->out_line     = build(
      bc_eventset->qual[d.seq].event_display
,'||',bc_eventset->qual[d.seq].event_code
,'||',bc_eventset->qual[d.seq].eventset_code
,'||',bc_eventset->qual[d.seq].eventset_display
,'||',bc_eventset->qual[d.seq].eventset_level
,'|')
 
  col 0, bc_eventset->out_line
  row + 1
 
 
with nocounter ;,NOFORMFEED
     ,maxrow = 1
     ,maxcol = 5000
;     ,seperator = " "
     ,format = variable
 
 
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
 
