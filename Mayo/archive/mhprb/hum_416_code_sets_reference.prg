 
drop   program hum_code_sets_extract_monthly:dba go
create program hum_code_sets_extract_monthly:dba
 
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
set print_file = concat("hum_zh_codeset_",dirdt,".dat")
set hold_file = concat("$CCLUSERDIR/",print_file)
;set hold_file = concat("$CCLSCRATCH/",print_file)
set print_dir = "ccluserdir:"
set client_code = "H416989"
set file_ext = "_zh_codeset.txt"
 
call echo("get dm_code_sets  that qualify")
 
free set dm_code_set
record dm_code_set
(
  1 out_line                             = vc
  1 out_file                             = vc
  1 qual[*]
    2 code_value                         = vc
    2 code_set                           = vc
    2 description                        = vc
)
 
select distinct into "nl:"
  cv.code_value
 ,dcs.code_set
 ,dcs.description
 ,cv.display
 
from code_value cv
    ,dm_code_set dcs
 
plan cv where cv.code_value > 0
;          and cv.active_ind
join dcs where dcs.code_set = cv.code_set
           and dcs.description > " "
order by dcs.code_set
head report
  cnt = 0
head cv.code_set
  cnt = cnt + 1
  stat = alterlist(dm_code_set->qual, cnt)
  dm_code_set->qual[cnt].code_value                = cnvtstring(cv.code_value)
  dm_code_set->qual[cnt].code_set                  = cnvtstring(dcs.code_set)
  dm_code_set->qual[cnt].description               = trim(dcs.description,3)
foot report
  stat = alterlist(dm_code_set->qual, cnt)
with counter,format=variable,maxcol=20000
 
 
select into concat(print_dir,print_file)	;hum_bc_dm_code_set
from
  (dummyt d with seq=value(size(dm_code_set->qual,5)))
plan d
head report
    quote = char(34)
    dm_code_set->out_line     = build("code_set||", "description|")
    col 0, dm_code_set->out_line
    row + 1
detail
    dm_code_set->out_line     =     build(
    dm_code_set->qual[d.seq].code_set ,'||',
    dm_code_set->qual[d.seq].description  ,'|')
    col 0 dm_code_set->out_line
    row + 1
with ;formfeed = none,
     maxrow = 1,
     nocounter,
     maxcol = 5000,
     format = variable
 
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
 
