/************************************************************************
          Date Written:       04/28/11
          Source file name:   mayo_mn_church_list.prg
          Object name:        mayo_mn_church_list
          Request #:
 
          Program purpose:   church list report
 
          Executing from:     Explorer Menu
 
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000 04/28/11 Akcia      initial release                              *
 *001 10/20/11 Akcia	  add code to run against db2				   *
 *002 01/21/13 Akcia	  new display key for cahtolic code value      *
 *003 02/27/13 JTW        Change mod 001 to lookup password in registry*
 *004 05/24/13 Akcia-SE  add admit date, move fields around to make it fit
 *005 08/15/13 Akcia-SE  add swing bed encntr_type
 *006 04/28/14 Akcia-SE  new version for EU
 ***********************************************************************
 
  ******************  END OF ALL MODCONTROL BLOCKS  ********************/
 
drop program mayo_mn_church_list_eu:dba go
create program mayo_mn_church_list_eu:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Select Facilities" = 0
	, "Church Code" = 0
 
with OUTDEV, facility, church
 
 
 
declare dcl_command = vc
declare dcl_size = i4
declare dcl_stat = i4
 
set dcl_command = "/mayo/procs/req_query.ksh"
set dcl_size = size(dcl_command)
set dcl_stat = 0
 
call dcl(dcl_command,dcl_size,dcl_stat)
 
;*** Next the password is read from the dbinfo.dat file to variable 'pass'.
FREE DEFINE RTL
DEFINE RTL IS "dbinfo.dat"
 
declare pass=vc
 
SELECT DISTINCT INTO "NL:"
  line = substring(1,30,R.LINE)   ; 9,9       10,9
FROM RTLT R
PLAN R
 
detail
 
if (line = "dbpw*")
  pass_in=substring(9,15,line)
  pass=trim(pass_in,3)
endif
 
with counter
 
;*** Now we are finished with the dbinfo.dat file and will delete it.
set dcl_command = ""
set dcl_command = "rm $CCLUSERDIR/dbinfo.dat"
set dcl_size = size(dcl_command)
set dcl_stat = 0
 
call dcl(dcl_command,dcl_size,dcl_stat)
 
declare system=vc
 
;*** This section redifines the OracleSystem variable pointing it to
;***   database instance 2 using the password read in above.
;*** This only applies to PRD and CRT, because they are the only domains
;***   that have multiple instance databases.
IF (curdomain = "MHPRD")
  Free define oraclesystem
  set system=build(concat('v500/', pass, '@mhprdrpt'))
  DEFINE oraclesystem system
ELSEIF (CURDOMAIN="MHCRT")
    FREE DEFINE oraclesystem
    set system=build(concat('v500/', pass, '@mhcrtrpt'))
    DEFINE oraclesystem system
ENDIF
/*** END 003 - New Code ***/
 
declare census_cd = f8 with protect, constant(uar_get_code_by("MEANING", 339, "CENSUS"))
declare mrn_cd = f8 with protect, constant(uar_get_code_by("MEANING", 319, "MRN"))
declare catholic_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 49, "CATHOLICROMANCATHOLIC"))
declare reg_do_not_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 49, "DONOTVISIT"))
declare church_not_seen_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 267, "NOTTOBESEENBYCLERGY"))
declare inpatient_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "INPATIENT"))
declare hosp_outpatient_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "HOSPITALOUTPATIENT"))
declare swing_bed_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "SWINGBED"))		;005
declare observation_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "OBSERVATION"))
declare business_cd = f8 with protect, constant(uar_get_code_by("MEANING", 212, "BUSINESS"))
 
;set religion_where_clause = build(" p.religion_cd != ",value(reg_do_not_cd))
 
 
execute ReportRtl
 
%i mhs_prg:mayo_mn_church_list_eu.dvl
 
select into $outdev
sort1 = uar_get_code_display(ed.loc_nurse_unit_cd),
sort2 = uar_get_code_display(ed.loc_room_cd),
sort3 = uar_get_code_display(ed.loc_bed_cd),
sort_name = "By Nurse Unit",
Pat_name = p.name_full_formatted,
religion =  uar_get_code_display(p.religion_cd),
church =  uar_get_code_display(pp.church_cd),
nurse_unit = uar_get_code_display(ed.loc_nurse_unit_cd),
room = uar_get_code_display(ed.loc_room_cd),
bed =  uar_get_code_display(ed.loc_bed_cd),
age = substring(1,5,cnvtage(p.birth_dt_tm)),
sex = substring(1,1,uar_get_code_display(p.sex_cd)),
admit_date = format(e.reg_dt_tm,"mm/dd/yy;;d"),
mrn = cnvtalias(ea.alias,ea.alias_pool_cd),
type = uar_get_code_display(e.encntr_type_cd),
facility_name = uar_get_code_display(ed.loc_facility_cd),
city_name = a.city
from
encntr_domain ed,
encounter e,
person p,
person_patient pp,
encntr_alias ea,
address a
 
plan ed
where ed.loc_facility_cd = $facility
  and ed.encntr_domain_type_cd = census_cd
  and ed.active_ind = 1
  and ed.end_effective_dt_tm > sysdate
 
join e
where e.encntr_id = ed.encntr_id
  and (e.encntr_type_cd in (inpatient_cd,observation_cd,swing_bed_cd) OR
        (e.encntr_type_cd = hosp_outpatient_cd and e.loc_bed_cd > 0))
 
join p
where p.person_id = e.person_id
  and p.name_last_key != "TESTPATIENT"
  and p.religion_cd != reg_do_not_cd
 
join pp
where pp.person_id = p.person_id
  and pp.church_cd = $church  ;!= church_not_seen_cd
 
join ea
where ea.encntr_id = ed.encntr_id
  and ea.encntr_alias_type_cd = mrn_cd
  and ea.active_ind = 1
  and ea.end_effective_dt_tm > sysdate
 
join a
where a.parent_entity_id = outerjoin(ed.loc_facility_cd)
  and a.parent_entity_name = outerjoin("LOCATION")
  and a.address_type_cd = outerjoin(business_cd)
  and a.active_ind = outerjoin(1)
  and a.end_effective_dt_tm > outerjoin(sysdate)
  and a.active_status_cd = outerjoin(188)
 
order sort1, sort2, sort3
 
head report
call InitializeReport(0)
_fEndDetail = RptReport->m_pageWidth - RptReport->m_marginRight
nPAGE = 1
dumb_var = 0
cntr = 0
first_time = "Y"
first_time_cath = "Y"
first_time_church = "Y"
 
head page
x = HeadPageSection(0)
first_time = "Y"
 
head sort1
 
sort1_display = concat("Nurse Unit:  ",trim(nurse_unit))
  if ((_YOffset + DetailSection(1,2.0,dumb_var) + sort1Section(1) + sort2Section(1) + ColumnHeaders(1) > _fEndDetail) )
    call PageBreak(0)
    x = HeadPageSection(0)
  endif
  if (first_time = "Y" )
    x = ColumnHeaders(0)
    first_time = "N"
  endif
  x = sort1Section(0)
 
;first_time = "N"
if (first_time = "Y")
  x = ColumnHeaders(0)
  first_time = "N"
endif
first_time_church = "N"
 
detail
if (_YOffset + DetailSection(1,2.0,dumb_var) > _fEndDetail )
  call PageBreak(0)
  x = HeadPageSection(0)
  x = ColumnHeaders(0)
    first_time = "N"
endif
x = DetailSection(Rpt_Render,2.0,dumb_var)
 
with nocounter, nullreport
call FinalizeReport($outdev)
 
 
IF (curdomain = "MHPRD")
  Free define oraclesystem
  set system=build(concat('v500/', pass, '@mhprd1'))
  DEFINE oraclesystem system
 
ELSEIF (CURDOMAIN="MHCRT")
    FREE DEFINE oraclesystem
    set system=build(concat('v500/', pass, '@mhcrt1'))
    DEFINE oraclesystem system
 
ENDIF
 
 end go
