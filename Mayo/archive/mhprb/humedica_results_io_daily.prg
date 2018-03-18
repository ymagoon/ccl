/****************************************************/
drop program humedica_results_io_daily:dba go
create program humedica_results_io_daily:dba
 
prompt
	"Extract File (MINE = screen)" = "MINE"
	, "Begin Date" = "CURDATE"
 
with OUTDEV, s_beg ;, STARTDT
 
;**** BEGINNING OF PREAMBLE ****
;humedica_results_io_daily "nl:", "10-JUL-2012"
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
 
;this used in daily extract only
if(validate(request->batch_selection,"999") != "999")
	set stardt = cnvtdatetime(curdate-1,0)
	set endt = cnvtdatetime(curdate-1,235959)
else
	;$2 = "dd-mmmm-yyyy"
	set stardt = cnvtdatetime(cnvtdate2($2,"dd-mmm-yyyy"),0)
	set endt = cnvtdatetime(cnvtdate2($2,"dd-mmm-yyyy"),235959)
endif
 
call echo(build("prompt_date:",$2))
call echo(build("stardt_var:",stardt))
 
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
call echo(build("beg_dt = ",echo_beg_dt))
set end_dt = enddt
set echo_end_dt = format(end_dt,"dd/mmm/yyyy hh:mm;;d")
call echo(build("end_dt = ",echo_end_dt))
 
set prg_name = cnvtlower(trim(curprog))
call echo(concat("running script: ",prg_name))
 
;002 unique file logic - change for each script
DECLARE dclcom = C255
DECLARE newdir = C255
set print_file = concat("hum_bc_results_io_",dirdt,".dat")
set print_dir = ""
set hold_file = concat("$CCLUSERDIR/",print_file)
set file_ext = "_results_io.txt"
 
;*****  END OF PREAMBLE ****
 
/*******************************************
*  CODE VALUES
*******************************************/
 
declare ce_io_cd = f8 with constant(uar_get_code_by("MEANING",53,"IO"))
declare fin_cd = f8 with constant(uar_get_code_by("MEANING",319,"FIN NBR"))
 
call echo("------------- write to a file: no array use --------------")
 
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
,   event_tag          = cnvtstring(ceio.io_type_flag)
,   result_status_cd = cnvtstring(ce.result_status_cd)
,   result_value     = cnvtstring(ceio.io_volume,10,3)
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
  person p,
  encntr_alias ea,
  clinical_event ce,
  ce_intake_output_result ceio
 
plan ce
   where ce.updt_dt_tm between cnvtdatetime(beg_dt)
        and cnvtdatetime(end_dt)  and
        ce.valid_until_dt_tm +0 > cnvtdatetime(curdate,curtime3)
      ; and ce.result_val > " "
       and ce.event_class_cd +0 IN (ce_io_cd)
join ceio
	where ce.event_id = ceio.event_id
	and ceio.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
join e
where e.encntr_id = ce.encntr_id
    and e.active_ind+0 = 1
join p
  where p.person_id = e.person_id
join ea
  where ea.encntr_id = outerjoin(e.encntr_id)
    and ea.encntr_alias_type_cd+0 = outerjoin(fin_cd)
    and ea.end_effective_dt_tm+0 > outerjoin(cnvtdatetime(curdate,curtime3))
 
head report
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
 
    row + 1
 
detail
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
     ,filesort
     ,append
 
set newdir = "/"
set DCLCOM = concat("mkdir ",newdir,"humedica/mhprd/data/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = "/humedica/mhprd/data/"
set DCLCOM = concat("mkdir ",newdir,"cerner/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = "/humedica/mhprd/data/cerner/"
set DCLCOM = concat("mkdir ",trim(newdir),"daily/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = "/humedica/mhprd/data/cerner/daily/"
set DCLCOM = concat("mkdir ",trim(newdir),dir_date,"/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
free set outfile
set outfile = concat("H416989_T",dirdt,"_E",edt,file_ext)
set newfile = concat(trim(newdir),dir_date,"/",outfile)
 
;call echo(newdir)
;call echo(trim(hold_file))
;call echo(newfile)
;call echo(concat("mv ",trim(hold_file)," ",newfile))
 
set DCLCOM = concat("mv ",trim(hold_file)," ",newfile)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set DCLCOM = concat("gzip -9 ",newfile)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
;*************
 
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
