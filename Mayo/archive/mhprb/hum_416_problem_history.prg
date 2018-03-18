/******************************************************
  note: be sure to clean up the dm_info table with this
select *
 from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_problem"
go
 
delete from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_problem"
 go
commit go
;002 04/14/12 kmcdaniel - rewritten for Mayo (416)
 *****************************************************/
drop program hum_problem_history:dba go
create program hum_problem_history:dba
 
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
 
/*******************************************
*  CODE VALUES
*******************************************/
 
declare mrn_alias_cd = f8 with public, noconstant(0.0)
declare mrn_cmrn_cd = f8 with public, noconstant(0.0)
 
free set testdt
set testdt = cnvtdatetime("01-JAN-2009 0000")
set end_run_date = cnvtdatetime("01-JAN-2012 0000")
set run_date = cnvtdatetime(curdate,curtime3)
 
declare domain_info_name = vc
set domain_info_name = trim("humedica_problem")
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
 
	set print_file = concat("hum_problem_history_",dirdt,".dat")
	set hold_file = concat("/cerner/d_mhprd/ccluserdir/",print_file)
 
call echo("---------------------------")
call echo(build("start_date = ",format(startdt,"mm/dd/yyyy hh:mm;;d")))
call echo(build("end_date = ",format(enddt,"mm/dd/yyyy hh:mm;;d")))
call echo("----------write to array -----------------")
 
 
free set problem
record problem
(
  1 out_line                             = vc
  1 out_file                             =vc
  1 qual[*]
;    2 encntr_id                       = f8
    2 person_id                       = vc
    2 mrn                             = vc
;    2 facility                        = vc
;    2 org_id                          = vc
;    2 facility_cd                     = i4
;    2 fin_nbr                         = vc
    2 problem_id                      = vc
    2 problem_instance_id             = vc
    2 freetext_problem                = vc
    2 nomenclature_id                 = vc
    2 source_vocabulary_cd            = vc
    2 source_string                   = vc
    2 source_identifier               = vc
    2 principle_type_cd               = vc
    2 classification_cd               = vc
    2 confirmation_status_cd          = vc
    2 life_cycle_status_cd            = vc
    2 life_cycle_dt_tm                = vc
    2 onset_dt_tm                     = vc
    2 course_cd                       = vc
    2 cancel_reason_cd                = vc
    2 end_effective_dt_tm             = vc
    2 active_ind                      = vc
    2 updt_dt_tm                      = vc
 
)
 
 
select into value(print_file)
  person_id = cnvtstring(prb.person_id)
  ,mrn = trim(pa.alias,3)
    ,problem_id                      = cnvtstring(prb.problem_id)
    ,problem_instance_id             = cnvtstring(prb.problem_instance_id)
    ,freetext_problem                = trim(prb.problem_ftdesc,3)
    ,nomenclature_id                 = cnvtstring(prb.nomenclature_id)
    ,source_vocabulary_cd            = cnvtstring(nom.source_vocabulary_cd)
    ,source_string                   = trim(substring(1,100,nom.source_string),3)
    ,source_identifier               = trim(nom.source_identifier,3)
    ,principle_type_cd               = cnvtstring(nom.principle_type_cd)
    ,classification_cd               = cnvtstring(prb.classification_cd)
    ,confirmation_status_cd          = cnvtstring(prb.confirmation_status_cd)
    ,life_cycle_status_cd            = cnvtstring(prb.life_cycle_status_cd)
    ,life_cycle_dt_tm                = format(prb.life_cycle_dt_tm,"yyyyMMddhhmmss;;d")
    ,onset_dt_tm                     = format(prb.onset_dt_tm,"yyyyMMddhhmmss;;d")
    ,course_cd                       = cnvtstring(prb.course_cd)
    ,cancel_reason_cd                = cnvtstring(prb.cancel_reason_cd)
    ,active_ind                      = cnvtstring(prb.active_ind)
    ,end_effective_dt_tm             = format(prb.end_effective_dt_tm,"yyyyMMddhhmmss;;d")
    ,updt_dt_tm                      = format(prb.updt_dt_tm,"yyyyMMddhhmmss;;d")
 
from
  person p,
  person_alias pa,
  problem prb,
  nomenclature nom
plan prb where prb.updt_dt_tm between cnvtdatetime(beg_dt) and cnvtdatetime(end_dt)
    and prb.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
join p where p.person_id = prb.person_id
join pa where pa.person_id = p.person_id
    and pa.person_alias_type_cd+0 = 10
    and pa.end_effective_dt_tm+0 > cnvtdatetime(curdate,curtime3)
join nom where nom.nomenclature_id = outerjoin(prb.nomenclature_id)
 
head report
    head_line = build(
    "PATIENT_ID_INTERNAL||",
    "PROBLEM_ID||",
    "PROBLEM_INSTANCE_ID||",
    "FREETEXT_PROBLEM||",
    "NOMENCLATURE_ID||",
    "SOURCE_VOCABULARY_CD||",
    "SOURCE_STRING||",
    "SOURCE_IDENTIFIER||",
    "PRINCIPLE_TYPE_CD||",
    "CLASSIFICATION_CD||",
    "CONFIRMATION_STATUS_CD||",
    "LIFE_CYCLE_STATUS_CD||",
    "LIFE_CYCLE_DT_TM||",
    "ONSET_DT_TM||",
    "COURSE_CD||",
    "CANCEL_REASON_CD||",
    "END_EFFECTIVE_DT_TM||",
    "ACTIVE_IND||",
    "UPDT_DT_TM|")
 
    col 0, head_line
    row + 1
 
head prb.problem_id
  abc = 0
detail
	abc = 0
foot prb.problem_id
    detail_line     =     build(
    person_id, '||',
    problem_id ,'||',
    problem_instance_id       , '||',
    freetext_problem          , '||',
    nomenclature_id           , '||',
    source_vocabulary_cd      , '||',
    source_string             , '||',
    source_identifier         , '||',
    principle_type_cd         , '||',
    classification_cd         , '||',
    confirmation_status_cd    , '||',
    life_cycle_status_cd      , '||',
    life_cycle_dt_tm          , '||',
    onset_dt_tm               , '||',
    course_cd                 , '||',
    cancel_reason_cd          , '||',
    end_effective_dt_tm       , '||',
    active_ind                , '||',
    updt_dt_tm                ,'|'
                                  )
 
    col 0, detail_line
    row + 1
 
with ;formfeed = none,
     maxrow = 1,
     nocounter,
     maxcol = 32000,
     format = variable,
     append
 
 
   if (dtfnd = "Y")
      set dtfnd = "N"
      update into dm_info dm
      set dm.updt_dt_tm = cnvtdatetime(nxtmnth)	;cnvtdatetime(enddt)
      where dm.info_domain="HUMEDICA"
      and dm.info_name = domain_info_name
      with nocounter
      commit
   endif
 
   set testdt = nxtmnth	;enddt
 
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
set outfile = concat("H416989_T",dirdt,"_E",edt,"_problem.txt")
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
