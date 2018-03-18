/*****************************************************************************
NOTE...these are old comments from the distant past...mrhine
 
        Source file name        hum_bc_anceta_patient.prg
        Object name:            hum_bc_anceta_patient
 
        Program purpose:        This extract will pull basic patient information
                                based on an admit range.
 
        Executing from:         OPS
 
        Special Notes:
 
******************************************************************************/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;     001 08/16/06 Akcia Inc.           Initial Creation
;     002 02/09/10 S&P consultants Inc. Additional Mods
;     003 07/16/11 mrhine, maxit        put in prod
;	  004 08/28/11 kmcdaniel, Korbrix	add beg_effect and updt date/time
;  note: be sure to clean up the dm_info table with this
/****************************************************
select
 dm.info_domain,
 dm.info_name,
 dm.updt_dt_tm
 from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_person_alias"
go
 
delete from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_person_alias"
 go
commit go
;002 04/12/12 kmcdaniel - rewritten for Mayo (416)
****************************************************/
;Following code_sets are extracted 57,282,38,220(FACILITY),36,49,354,62,15
drop program hum_palias_history:dba go
create program hum_palias_history:dba
 
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
set testdt = cnvtdatetime("01-JAN-2009 0000")
set end_run_date = cnvtdatetime("01-JAN-2012 0000")
set run_date = cnvtdatetime(curdate,curtime3)
 
declare domain_info_name = vc
set domain_info_name = trim("humedica_person_alias")
declare month = vc
 
/*******************************************
*  CODE VALUES
*******************************************/
 
declare home_address_cd = f8 with public, noconstant(0.0)
declare mrn_alias_cd = f8 with public, noconstant(0.0)
declare mrn_cmrn_cd = f8 with public, noconstant(0.0)
declare curr_name = f8 with public, noconstant(0.0)
declare prev_name = f8 with public, noconstant(0.0)
 
set home_address_cd = uar_get_code_by('DISPLAYKEY',212,'HOME')
set mnStat = uar_get_meaning_by_codeset(4,"MRN",1,mrn_alias_cd)
set mrn_cmrn_cd = uar_get_code_by("DISPLAYKEY",263,"CMRNMMI")
set curr_name = uar_get_code_by("DISPLAYKEY",213,"CURRENT")
set prev_name = uar_get_code_by("DISPLAYKEY",213,"PREVIOUS")
set CMRN = uar_get_code_by("DISPLAYKEY",263,"CMRNMMI")
set SSN = uar_get_code_by("DISPLAYKEY",4,"SSN")
set EMP = uar_get_code_by("DISPLAYKEY",338,"EMPLOYER")
 
free set pat_reg
record pat_reg
(
  1 out_line                    = vc
  1 qual[*]
    2 person_id                 = vc
    2 alias_pool_cd             = vc
    2 person_alias_type_cd = vc
    2 alias = vc
    2 active_ind = vc
    2 end_effective_dt_tm = vc
    2 beg_effective_dt_tm = vc
    2 updt_dt_tm = vc
)
 
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
 
	set print_file = concat("hum_enc_prnsl_reltn_history_",dirdt,".dat")
	set hold_file = concat("/cerner/d_mhprd/ccluserdir/",print_file)
 
call echo("---------------------------")
call echo(build("start_date = ",format(startdt,"mm/dd/yyyy hh:mm;;d")))
call echo(build("end_date = ",format(enddt,"mm/dd/yyyy hh:mm;;d")))
call echo("----------write to array -----------------")
 
 
select into value(print_file)
  person_id      = cnvtstring(p.person_id)
  ,alias_pool_cd     = cnvtstring(pa.alias_pool_cd)
  ,person_alias_type_cd = cnvtstring(pa.person_alias_type_cd)
  ,alias = trim(pa.alias,3)
  ,active_ind = cnvtstring(pa.active_ind)
  ,end_effective_dt_tm = format(pa.end_effective_dt_tm,"YYYYMMDDhhmmss;;d")
  ,beg_effective_dt_tm = format(pa.beg_effective_dt_tm,"YYYYMMDDhhmmss;;d")
  ,updt_dt_tm = format(pa.updt_dt_tm,"YYYYMMDDhhmmss;;d")
from
  person p,
  person_alias pa
 
plan p where p.updt_dt_tm between cnvtdatetime(beg_dt) and cnvtdatetime(end_dt)
join pa where pa.person_id = p.person_id
 
order
 p.person_id, pa.person_alias_id
 
head report
  head_line     =  build(
    "INTERNAL_PERSON_ID||",
    "ALIAS||",
    "ALIAS_POOL_CD||",
    "PERSON_ALIAS_TYPE_CD||",
    "END_EFFECTIVE_DT_TM||",
    "ACTIVE_IND||",
    "BEG_EFFECTIVE_DT_TM||",
    "UPDT_DT_TM|")
  col 0, head_line
  row + 1
head p.person_id
x=0
head pa.person_alias_id
  detail_line     = build(
person_id , '||',
alias, '||',
alias_pool_cd , '||',
person_alias_type_cd , '||',
end_effective_dt_tm , '||',
active_ind, '||',
beg_effective_dt_tm , '||',
updt_dt_tm , '|')
  col 0, detail_line
  row + 1
detail
	abc = 0
 
with formfeed = none,
     maxrow = 1,
     nocounter,
     maxcol = 5000,
     format = variable,
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
set outfile = concat("H416989_T",dirdt,"_E",edt,"_person_alias.txt")
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
 
 
