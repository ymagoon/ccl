 
drop   program hum_nomen_extract_monthly:dba go
create program hum_nomen_extract_monthly:dba
 
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
set print_file = concat("hum_zh_nomenclature_",dirdt,".dat")
set hold_file = concat("$CCLUSERDIR/",print_file)
;set hold_file = concat("$CCLSCRATCH/",print_file)
set print_dir = "ccluserdir:"
set client_code = "H416989"
set file_ext = "_zh_nomenclature.txt"
 
call echo("get nomenclature_ids that qualify")
 
 
select distinct into concat(print_dir,print_file)	;hum_bc_nomenclature ;"nl:"
   active_ind              = cnvtstring(n.active_ind)
  ,nomenclature_id         = cnvtstring(n.nomenclature_id)
  ,active_status_cd        = trim(cnvtstring(n.active_status_cd),3)
  ,active_status_dt_tm     = trim(format(n.active_status_dt_tm,"yyyyMMddhhmmss;;d"),3)
  ,active_status_prsnl_id  = trim(cnvtstring(n.active_status_prsnl_id),3)
  ,beg_effective_dt_tm     = trim(format(n.beg_effective_dt_tm,"yyyyMMddhhmmss;;d"),3)
  ,cmti                    = trim(n.cmti,3)
  ,concept_cki             = trim(n.concept_cki,3)
  ,concept_identifier      = trim(n.concept_identifier,3)
  ,concept_source_cd       = trim(cnvtstring(n.concept_source_cd),3)
  ,contributor_system_cd   = trim(cnvtstring(n.contributor_system_cd),3)
 
  ,data_status_cd          = trim(cnvtstring(n.data_status_cd),3)
  ,data_status_dt_tm       = trim(format(n.data_status_dt_tm,"yyyyMMddhhmmss;;d"),3) ;20
  ,data_status_prsnl_id    = trim(cnvtstring(n.data_status_prsnl_id),3)
  ,disallowed_ind          = trim(cnvtstring(n.disallowed_ind),3)
  ,end_effective_dt_tm     = trim(format(n.end_effective_dt_tm,"yyyyMMddhhmmss;;d"),3) ;20
  ,language_cd             = trim(cnvtstring(n.language_cd),3)
  ,mnemonic                = trim(n.mnemonic,3)
  ,nom_ver_grp_id          = trim(cnvtstring(n.nom_ver_grp_id),3)
  ,primary_cterm_ind       = trim(cnvtstring(n.primary_cterm_ind),3)
 
  ,primary_vterm_ind       = trim(cnvtstring(n.primary_vterm_ind),3)
  ,principle_type_cd       = trim(cnvtstring(n.principle_type_cd),3)
  ,rowid                   = trim(n.rowid,3)
  ,short_string             = trim(n.short_string,3)
  ,source_identifier        = trim(n.source_identifier,3)
  ,source_identifier_keycap = trim(n.source_identifier_keycap,3)
  ,source_string            = trim(n.source_string,3)
  ,source_string_keycap     = trim(n.source_string_keycap,3)
  ,source_vocabulary_cd     = trim(cnvtstring(n.source_vocabulary_cd),3)
  ,string_identifier        = trim(n.string_identifier,3)
 
  ,string_source_cd         = trim(cnvtstring(n.string_source_cd),3)
  ,string_status_cd         = trim(cnvtstring(n.string_status_cd),3)
  ,term_id                  = trim(cnvtstring(n.term_id),3)
  ,updt_applctx             = trim(cnvtstring(n.updt_applctx),3)
  ,updt_cnt                 = trim(cnvtstring(n.updt_cnt),3)
  ,updt_dt_tm               = trim(format(n.updt_dt_tm,"yyyyMMddhhmmss;;d"),3)
  ,updt_id                  = trim(cnvtstring(n.updt_id),3)
  ,updt_task                = trim(cnvtstring(n.updt_task),3)
  ,vocab_axis_cd            = trim(cnvtstring(n.vocab_axis_cd),3)
 
from  nomenclature n
plan n ;where n.active_ind = 1
order by n.nomenclature_id
 
  head report
  col+ 0
  "active_ind",
"||nomenclature_id",
"||active_status_cd",
"||active_status_dt_tm",
"||active_status_prsnl_id",
"||beg_effective_dt_tm",
"||cmti",
"||concept_cki",
"||concept_identifier",
"||concept_source_cd",
"||contributor_system_cd",
;10
"||data_status_cd",
"||data_status_dt_tm",
"||data_status_prsnl_id",
"||disallowed_ind",
"||end_effective_dt_tm",
"||language_cd",
"||mnemonic",
;"||nomenclature_id",
"||nom_ver_grp_id",
"||primary_cterm_ind",
;20
"||primary_vterm_ind",
"||principle_type_cd",
"||rowid",
"||short_string",
"||source_identifier",
"||source_identifier_keycap",
"||source_string",
"||source_string_keycap",
"||source_vocabulary_cd",
"||string_identifier",
;30
"||string_source_cd",
"||string_status_cd",
"||term_id",
"||updt_applctx",
"||updt_cnt",
"||updt_dt_tm",
"||updt_id",
"||updt_task",
"||vocab_axis_cd|"
 
 row + 1
 
detail
 
;col + 0
rtxt = build(active_ind,"||",nomenclature_id,"||",active_status_cd,"||",active_status_dt_tm
,"||",active_status_prsnl_id
,"||",beg_effective_dt_tm
,"||",cmti
,"||",concept_cki
,"||",concept_identifier
,"||",concept_source_cd
,"||",contributor_system_cd
;10
,"||",data_status_cd
,"||",data_status_dt_tm
,"||",data_status_prsnl_id
,"||",disallowed_ind
,"||",end_effective_dt_tm
,"||",language_cd
,"||",mnemonic
,"||",nom_ver_grp_id
,"||",primary_cterm_ind
;20
,"||",primary_vterm_ind
,"||",principle_type_cd
,"||",rowid
,"||",short_string
,"||",source_identifier
,"||",source_identifier_keycap
,"||",source_string
,"||",source_string_keycap
,"||",source_vocabulary_cd
,"||",string_identifier
;30
,"||",string_source_cd
,"||",string_status_cd
,"||",term_id
,"||",updt_applctx
,"||",updt_cnt
,"||",updt_dt_tm
,"||",updt_id
,"||",updt_task
,"||",vocab_axis_cd
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
 
