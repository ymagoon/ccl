 
drop program humedica_bc_med_id_monthly:dba go
create program humedica_bc_med_id_monthly:dba
 
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
set print_file = concat("hum_zh_medication_identifier_",dirdt,".dat")
set hold_file = concat("$CCLUSERDIR/",print_file)
;set hold_file = concat("$CCLSCRATCH/",print_file)
set print_dir = "ccluserdir:"
set client_code = "H416989"
set file_ext = "_zh_medication_identifier.txt"
 
call echo("---- dump the med_identifier table ------")
 
record tmp
(
1 line_out = vc
1 qual [*]
 5 catalog_cd = vc
 5 item_id = vc
 5 synonym_id = vc
 5 med_identifier_type_cd = vc
 5 med_identifier_id = vc
 5 value = vc
 5 med_type_flag = vc
 5 active_ind = vc
 5 pharmacy_type_Cd = vc
)
 
select into "nl:"
ocir.med_identifier_id
from med_identifier ocir
plan ocir where ocir.med_identifier_id > 0
;	and ocir.active_ind = 1
head report
x=0
cnt = 0
head ocir.med_identifier_id
cnt = cnt+1
stat = alterlist(tmp->qual,cnt)
tmp->qual[cnt].item_id = cnvtstring(ocir.item_id)
;tmp->qual[cnt].catalog_cd = cnvtstring(ocir.catalog_cd)
;tmp->qual[cnt].synonym_id = cnvtstring(ocir.synonym_id)
tmp->qual[cnt].med_identifier_id = cnvtstring(ocir.med_identifier_id)
tmp->qual[cnt].pharmacy_type_Cd = cnvtstring(ocir.pharmacy_type_cd)
tmp->qual[cnt].med_identifier_type_cd = cnvtstring(ocir.med_identifier_type_cd)
tmp->qual[cnt].value = trim(ocir.value,3)
tmp->qual[cnt].med_type_flag = cnvtstring(ocir.med_type_flag)
tmp->qual[cnt].active_ind = cnvtstring(ocir.active_ind)
 
with nocounter
 
select into concat(print_dir,print_file)	;humedica_bc_medication_id
tmp->qual[d.seq].item_id
from (dummyt d with seq = value(size(tmp->qual,5)))
plan d
head report
x=0
tmp->line_out = build("ITEM_ID||MED_IDENTIFIER_ID||PHARMACY_TYPE_CD||",
"VALUE||MED_TYPE_FLAG||ACTIVE_IND||MED_IDENTIDIER_TYPE_CD|")
col 0 , tmp->line_out
row + 1
detail
tmp->line_out = build(tmp->qual[d.seq].item_id, '||',
;tmp->qual[d.seq].catalog_cd, '||',
tmp->qual[d.seq].MED_identifier_id, '||',
tmp->qual[d.seq].pharmacy_type_cd, '||',
tmp->qual[d.seq].value, '||',
tmp->qual[d.seq].med_type_flag, '||',
tmp->qual[d.seq].active_ind, '||',
tmp->qual[d.seq].med_identifier_type_cd, '|')
col 0 , tmp->line_out
row + 1
 
with formfeed = none,
     maxrow = 1,
     nocounter,
     maxcol = 8000,
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
 
