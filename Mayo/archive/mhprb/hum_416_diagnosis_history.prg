/******************************************************
  note: be sure to clean up the dm_info table with this
 
select *
 from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_diagnosis"
go
 
delete from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_diagnosis"
 go
commit go
;002 04/11/12 kmcdaniel - rewritten for Client 416
 *****************************************************/
 
drop   program humedica_diagnosis_history:dba go
create program humedica_diagnosis_history:dba
 
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
set testdt = cnvtdatetime("01-JAN-2010 0000")
set end_run_date = cnvtdatetime("01-JAN-2012 0000")
set run_date = cnvtdatetime(curdate,curtime3)
 
declare domain_info_name = vc
set domain_info_name = trim("humedica_diagnosis")
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
 
	set print_file = concat("hum_diag_history_",dirdt,".dat")
	set hold_file = concat("/cerner/d_mhprd/ccluserdir/",print_file)
	set file_ext = "_diagnosis.txt"
 
/*******************************************
*  SELECTION CRITERIA
*******************************************/
 
free set encounters
record encounters
(
  1 out_line                    = vc
  1 enc_cnt                     = i4
  1 qual[*] ; 51 entries
    2 active_ind                 = vc
    2 active_status_cd           = vc
    2 active_status_dt_tm        = vc ;dq8
    2 active_status_prsnl_id     = vc
    2 attestation_dt_tm          = vc
    2 beg_effective_dt_tm        = vc ;dq8
    2 certainty_cd               = vc
    2 classification_cd          = vc
    2 clinical_diag_priority     = vc
    2 clinical_service_cd        = vc  ;10
 
    2 conditional_qual_cd        = vc
    2 confid_level_cd            = vc
    2 confirmation_status_cd     = vc
    2 contributor_system_cd      = vc
    2 diagnosis_display          = vc
    2 diagnosis_group            = vc
    2 diagnosis_id               = vc
    2 diagnostic_category_cd     = vc
    2 diag_class_cd              = vc
    2 diag_dt_tm                 = vc  ;20
 
    2 diag_ftdesc                = vc
    2 diag_note                  = vc
    2 diag_priority              = vc
    2 diag_prsnl_id              = vc
    2 diag_prsnl_name            = vc
    2 diag_type_cd               = vc
    2 encntr_id                  = vc
    2 encntr_slice_id            = vc
    2 end_effective_dt_tm        = vc
    2 hac_ind                    = vc  ;30
 
    2 laterality_cd              = vc
    2 long_blob_id               = vc
    2 mod_nomenclature_id        = vc
    2 nomenclature_id            = vc
    2 originating_nomenclature_id = vc
    2 person_id                  = vc
    2 present_on_admit_cd        = vc
    2 probability                = vc
    2 ranking_cd                 = vc
    2 reference_nbr              = vc  ;40
 
    2 rowid                      = vc
    2 seg_unique_key             = vc
    2 severity_cd                = vc
    2 severity_class_cd          = vc
    2 severity_ftdesc            = vc
    2 svc_cat_hist_id            = vc
    2 updt_applctx               = vc
    2 updt_cnt                   = vc
    2 updt_dt_tm                 = vc
    2 updt_id                    = vc ;50
 
    2 updt_task                  = vc
   )
 
select into value(print_file)
  active_ind              = cnvtstring(d.active_ind)
  ,active_status_cd        = cnvtstring(d.active_status_cd)
  ,active_status_dt_tm     = format(d.active_status_dt_tm,"yyyyMMddhhmmss;;d")
  ,active_status_prsnl_id  = cnvtstring(d.active_status_prsnl_id)
  ,attestation_dt_tm       = format(d.attestation_dt_tm,"yyyyMMddhhmmss;;d")
  ,beg_effective_dt_tm     = format(d.beg_effective_dt_tm,"yyyyMMddhhmmss;;d")
  ,certainty_cd            = cnvtstring(d.certainty_cd)
  ,classification_cd       = cnvtstring(d.classification_cd)
  ,clinical_diag_priority  = cnvtstring(d.clinical_diag_priority)
  ,clinical_service_cd     = cnvtstring(d.clinical_service_cd)     ;10
 
  ,conditional_qual_cd     = cnvtstring(d.conditional_qual_cd)
  ,confid_level_cd         = cnvtstring(d.confid_level_cd)
  ,confirmation_status_cd  = cnvtstring(d.confirmation_status_cd)
  ,contributor_system_cd   = cnvtstring(d.contributor_system_cd)
  ,diagnosis_display       = trim(d.diagnosis_display,3)
  ,diagnosis_group         = cnvtstring(d.diagnosis_group)
  ,diagnosis_id           = cnvtstring(d.diagnosis_id)
  ,diagnostic_category_cd = cnvtstring(d.diagnostic_category_cd)
  ,diag_class_cd          = cnvtstring(d.diag_class_cd)
  ,diag_dt_tm             = format(d.diag_dt_tm,"yyyyMMddhhmmss;;d") ;20
 
  ,diag_ftdesc            = trim(d.diag_ftdesc,3)
  ,diag_note              = trim(d.diag_note,3)
  ,diag_priority          = cnvtstring(d.diag_priority)
  ,diag_prsnl_id          = cnvtstring(d.diag_prsnl_id)
  ,diag_prsnl_name        = trim(d.diag_prsnl_name,3)
  ,diag_type_cd           = cnvtstring(d.diag_type_cd)
  ,encntr_id              = cnvtstring(d.encntr_id)
  ,encntr_slice_id        = cnvtstring(d.encntr_slice_id)
  ,end_effective_dt_tm    = format(d.end_effective_dt_tm,"yyyyMMddhhmmss;;d")
  ,hac_ind                = cnvtstring(d.hac_ind)                    ;30
 
  ,laterality_cd          = cnvtstring(d.laterality_cd)
  ,long_blob_id           = cnvtstring(d.long_blob_id)
  ,mod_nomenclature_id    = cnvtstring(d.mod_nomenclature_id)
  ,nomenclature_id        = cnvtstring(d.nomenclature_id)
  ,originating_nomenclature_id       = cnvtstring(d.originating_nomenclature_id)
  ,person_id               = cnvtstring(d.person_id)
  ,present_on_admit_cd     = cnvtstring(d.present_on_admit_cd)
  ,probability             = cnvtstring(d.probability)
  ,ranking_cd              = cnvtstring(d.ranking_cd)
  ,reference_nbr           = trim(d.reference_nbr,3)    ;40
 
  ,rowid                   = cnvtstring(d.rowid)
  ,seg_unique_key          = cnvtstring(d.seg_unique_key)
  ,severity_cd             = cnvtstring(d.severity_cd)
  ,severity_class_cd       = cnvtstring(d.severity_class_cd)
  ,severity_ftdesc         = trim(d.severity_ftdesc,3)
  ,svc_cat_hist_id         = cnvtstring(d.svc_cat_hist_id)
  ,updt_applctx            = cnvtstring(d.updt_applctx)
  ,updt_cnt                = cnvtstring(d.updt_cnt)
  ,updt_dt_tm              = format(d.updt_dt_tm,"yyyyMMddhhmmss;;d")
  ,updt_id                 = cnvtstring(d.updt_id)    ;50
  ,updt_task               = cnvtstring(d.updt_task)
 
from diagnosis d
plan d  where d.updt_dt_tm between cnvtdatetime(beg_dt)
	and cnvtdatetime(end_dt)
head report
head_line = build(
"active_ind",
"||active_status_cd",
"||active_status_dt_tm",
"||active_status_prsnl_id",
"||attestation_dt_tm",
"||beg_effective_dt_tm",
"||certainty_cd",
"||classification_cd",
"||clinical_diag_priority",
"||clinical_service_cd",
 
"||conditional_qual_cd",
"||confid_level_cd",
"||confirmation_status_cd",
"||contributor_system_cd",
"||diagnosis_display",
"||diagnosis_group",
"||diagnosis_id",
"||diagnostic_category_cd",
"||diag_class_cd",
"||diag_dt_tm",
 
"||diag_ftdesc",
"||diag_note",
"||diag_priority",
"||diag_prsnl_id",
"||diag_prsnl_name",
"||diag_type_cd",
"||encntr_id",
"||encntr_slice_id",
"||end_effective_dt_tm",
"||hac_ind",
 
"||laterality_cd",
"||long_blob_id",
"||mod_nomenclature_id",
"||nomenclature_id",
"||originating_nomenclature_id",
"||person_id",
"||present_on_admit_cd",
"||probability",
"||ranking_cd",
"||reference_nbr",
 
"||rowid",
"||seg_unique_key",
"||severity_cd",
"||severity_class_cd",
"||severity_ftdesc",
"||svc_cat_hist_id",
"||updt_applctx",
"||updt_cnt",
"||updt_dt_tm",
"||updt_id",
"||updt_task|")
 
col 0 head_line
row + 1
 
head d.diagnosis_id
detail_line = build(
      active_ind
,'||',active_status_cd
,'||',active_status_dt_tm
,'||',active_status_prsnl_id
,'||',attestation_dt_tm
,'||',beg_effective_dt_tm
,'||',certainty_cd
,'||',classification_cd
,'||',clinical_diag_priority
,'||',clinical_service_cd
 
,'||',conditional_qual_cd
,'||',confid_level_cd
,'||',confirmation_status_cd
,'||',contributor_system_cd
,'||',diagnosis_display
,'||',diagnosis_group
,'||',diagnosis_id
,'||',diagnostic_category_cd
,'||',diag_class_cd
,'||',diag_dt_tm
 
,'||',diag_ftdesc
,'||',diag_note
,'||',diag_priority
,'||',diag_prsnl_id
,'||',diag_prsnl_name
,'||',diag_type_cd
,'||',encntr_id
,'||',encntr_slice_id
,'||',end_effective_dt_tm
,'||',hac_ind
 
,'||',laterality_cd
,'||',long_blob_id
,'||',mod_nomenclature_id
,'||',nomenclature_id
,'||',originating_nomenclature_id
,'||',person_id
,'||',present_on_admit_cd
,'||',probability
,'||',ranking_cd
,'||',reference_nbr
 
,'||',rowid
,'||',seg_unique_key
,'||',severity_cd
,'||',severity_class_cd
,'||',severity_ftdesc
,'||',svc_cat_hist_id
,'||',updt_applctx
,'||',updt_cnt
,'||',updt_dt_tm
,'||',updt_id
,'||',updt_task
,'|' )
 
col 0	detail_line
row +1
 
detail
	abc = 0
 
with ;formfeed = none,
     maxrow = 1,
     nocounter,
     maxcol = 5000,
     format = variable,
     filesort,
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
