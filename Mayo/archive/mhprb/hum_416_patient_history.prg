/*****************************************************************************
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
;     004 10/10/11 kmcdaniel			rewrite to file instead of array
;  note: be sure to clean up the dm_info table with this
/****************************************************
select
 dm.info_domain,
 dm.info_name,
 dm.updt_dt_tm
 from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_patient"
go
 
delete from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_patient"
 go
commit go
;002 04/14/12 kmcdaniel - rewritten for Mayo (416)
****************************************************/
 
;Following code_sets are extracted 57,282,38,220(FACILITY),36,49,354,62,15
drop program hum_patient_history:dba go
create program hum_patient_history:dba
 
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
set CMRN_cd = uar_get_code_by("DISPLAYKEY",263,"CMRNMMI")
set SSN_cd = uar_get_code_by("DISPLAYKEY",4,"SSN")
set EMP_cd = uar_get_code_by("DISPLAYKEY",338,"EMPLOYER")
 
 
free set testdt
set testdt = cnvtdatetime("01-JAN-2009 0000")
set end_run_date = cnvtdatetime("01-JAN-2012 0000")
set run_date = cnvtdatetime(curdate,curtime3)
 
declare domain_info_name = vc
set domain_info_name = trim("humedica_patient")
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
 
	set print_file = concat("hum_patient_history_",dirdt,".dat")
	set hold_file = concat("/cerner/d_mhprd/ccluserdir/",print_file)
 
call echo("---------------------------")
call echo(build("start_date = ",format(startdt,"mm/dd/yyyy hh:mm;;d")))
call echo(build("end_date = ",format(enddt,"mm/dd/yyyy hh:mm;;d")))
call echo("----------write to array -----------------")
 
 
free set pat_reg
record pat_reg
(
  1 out_line                    = vc
  1 qual[*]
    2 person_id                 = vc
    2 mrn		        		= vc
    2 alias_pool_cd             = vc
    2 cmrn                      = vc
    2 species_cd                = vc
    2 ethnic_grp_cd             = vc
    2 facility                  = vc
    2 facility_cd               = i4
    2 first_name                = vc
    2 middle_name               = vc
    2 last_name                 = vc
    2 prev_fname                = vc
    2 prev_lname                = vc
    2 prev_mname                = vc
    2 birth_date                = vc
    2 gender                    = vc
    2 gender_cd                 = i4
    2 race                      = vc
    2 race_cd                   = i4
    2 marital_status            = vc
    2 marital_status_cd         = i4
    2 cause_of_death            = vc
    2 death_date                = vc
    2 language                  = vc
    2 language_cd               = i4
    2 religion                  = vc
    2 religion_cd               = i4
    2 address1                  = vc
    2 address2                  = vc
    2 address3                  = vc
    2 address4                  = vc
    2 city                      = vc
    2 state                     = vc
    2 country_cd                = i4
    2 state_cd                  = i4
    2 zip                       = vc
    2 country                   = vc
    2 updating_user             = i4
    2 fin_class                 = vc
    2 fin_class_cd              = i4
    2 first_encounter_date      = vc
    2 last_encounter_date       = vc
    2 last_update_date          = vc
    2 SSN                       = vc
;    2 employer                  = vc
;    2 emp_addr1                 = vc
;    2 emp_addr2                 = vc
;    2 emp_city                  = vc
;    2 emp_state                 = vc
;    2 emp_state_cd              = i4
;    2 emp_zip                   = vc
;    2 EMPL_STATUS_CD            = i4
 
)
 
 
 
/*******************************************
*  SELECTION CRITERIA
*******************************************/
 
call echo("get pat_reg that qualify")
 
select into value(print_file)
  person_id = cnvtstring(p.person_id),
  species_cd  = cnvtstring(p.species_cd),
  ethnic_grp_cd = cnvtstring(p.ethnic_grp_cd),
  first_name = substring(1,50,pn.name_first),
  middle_name = substring(1,50,pn.name_middle),
  last_name = substring(1,50,pn.name_last),
  prev_lname = substring(1,50,pn2.name_last),
  prev_fname = substring(1,50,pn2.name_first),
  prev_mname = substring(1,50,pn2.name_middle),
  birth_date = format(p.birth_dt_tm, "yyyymmddhhmmss;;d"),
  gender_cd = cnvtstring(p.sex_cd),
  race_cd  = cnvtstring(p.race_cd),
  marital_status_cd = cnvtstring(p.marital_type_cd),
  cause_of_death = substring(1,50,p.cause_of_death),
  death_date = format(p.deceased_dt_tm, "yyyymmddhhmmss;;d"),
  language_cd = cnvtstring(p.language_cd),
  religion_cd = cnvtstring(p.religion_cd),
  address1 = substring(1,20,adr2.street_addr),
  address2 = substring(1,20,adr2.street_addr2),
  address3 = substring(1,20,adr2.street_addr3),
  city = substring(1,20,adr2.city),
  state = substring(1,2,adr2.state),
  state_cd = cnvtstring(adr2.state_cd),
  zip = substring(1,10,adr2.zipcode),
  country = substring(1,30,adr2.country),
  country_cd  = cnvtstring(adr2.country_cd),
  updating_user = cnvtstring(p.updt_id),
  last_update_date = format(p.updt_dt_tm,"yyyymmddhhmmss;;d"),
  SSN = format(pa2.alias,"###-##-####")
 
from
  person p,
  person_name pn,
  person_name pn2,
  person_alias pa2,
  address adr2
plan p
  where p.updt_dt_tm between cnvtdatetime(beg_dt) and cnvtdatetime(end_dt)
join pn
  where pn.person_id = p.person_id and
        pn.active_ind+0 = 1 and
        pn.end_effective_dt_tm+0 > cnvtdatetime(curdate,curtime3) and
        pn.name_type_cd+0 = curr_name
 
join adr2
  where adr2.parent_entity_id = outerjoin(p.person_id) and
        adr2.active_ind+0 = outerjoin(1) and
        adr2.end_effective_dt_tm+0 > outerjoin(cnvtdatetime(curdate,curtime3))
        and adr2.address_type_cd = outerjoin(home_address_cd)
 
join pn2
  where pn2.person_id = outerjoin(p.person_id) and
        pn2.active_ind = outerjoin(1) and
        pn2.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3)) and
        pn2.name_type_cd = outerjoin(prev_name)
 
join pa2
  where pa2.person_id = outerjoin(p.person_id) and
        pa2.person_alias_type_cd+0 = outerjoin(SSN_cd) and
        pa2.active_ind + 0 = outerjoin(1) and
        pa2.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
 
order
 p.person_id
 
head report
 
  head_line     =  build(
    "INTERNAL_PERSON_ID||","SPECIES_CD||","ETHNICITY_GRP_CD||",
    "FIRST_NAME||","MIDDLE_NAME||","LAST_NAME||","PREVIOUS_FIRST_NAME||",
    "PREVIOUS_MIDDLE_NAME||","PREVIOUS_LAST_NAME||","BIRTH_DATE||",
    "GENDER||","RACE||","MARITIAL_STATUS||","CAUSE_OF_DEATH||",
    "DEATH_DATE||","PRIMARY_LANGUAGE||","RELIGIOUS_AFFILIATION||","ADDRESS_TYPE||",
    "ADDRESS_1||","ADDRESS_2||","ADDRESS_3||","CITY||","STATE||","STATE_CODE||",
    "ZIP||","COUNTRY||","COUNTRY_CODE||","UPDATING_USER||",
    "RECORD_LAST_UPDATE||","SOCIAL_SECURITY_NBR|")
 
  col 0, head_line
  row + 1
 
head p.person_id
	abc = 0
detail
	abc = 0
foot p.person_id
  rtxt2 = fillstring(3000,"")
  rtxt2 = build(
	person_id , '||',
	species_cd ,'||',
	ethnic_grp_cd ,'||',
	first_name,'||',
	middle_name,'||',
	last_name,'||',
	prev_fname,'||',
	prev_mname,'||',
	prev_lname,'||',
	birth_date,'||',
	gender_cd,'||',
	race_cd,'||',
	marital_status_cd,'||',
	cause_of_death,'||',
	death_date,'||',
	language_cd,'||',
	religion_cd, '||',
	'Home', '||',
	address1, '||',
	address2, '||',
	address3, '||',
	city, '||',
	state, '||',
	state_cd, '||',
	zip, '||',
	country, '||',
	country_cd, '||',
	updating_user, '||',
	last_update_date, '||',
	SSN ,'|')
 
  col +0 rtxt2
  row + 1
 
with nocounter,
     maxrow = 1,
     format = variable,
     maxcol = 5000,
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
set outfile = concat("H416989_T",dirdt,"_E",edt,"_patient.txt")
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
 
 
