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
 *001 10/20/11 Akcia	  add code to run on db2					   *
 ***********************************************************************
 
  ******************  END OF ALL MODCONTROL BLOCKS  ********************/
 
drop program mayo_mn_church_list_by_date:dba go
create program mayo_mn_church_list_by_date:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	;<<hidden>>"Facility Group" = ""
	, "Select Facilities" = 0
	, "Start Date" = CURDATE
	, "End Date" = CURDATE
 
with OUTDEV, facility, start_date, end_date

/*** START 001 ***/
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
;*** Write instance ccl ran in to the log file
;SET Iname = fillstring(10," ")
;SELECT INTO value("mayo_logfiles:mayo_instance2.log")
;  run_date = format(sysdate,";;q")
; ,Iname = substring(1,7,instance_name)
;FROM v$instance
;DETAIL
;  col  1 run_date
;  col +1 curprog
;  col +1 " *Instance="
;  col +1 Iname
;with nocounter
;   , format
;****************** End of INSTANCE 2 routine ************************
/*** END 001 ***/
 
declare ops_ind  				= c1 with noconstant("N")
set ops_ind = validate(request->batch_selection, "Z")
 
	if (ops_ind = "Z")
	  set beg_dt = $start_date
 
  	  set end_dt = $end_date
  	else
   	  set beg_dt = format($start_date, "mmddyyyy;;d")
	  set end_dt = format($end_date, "mmddyyyy;;d")
	endif
 call echo(beg_dt)
 call echo(end_dt)
declare census_cd = f8 with protect, constant(uar_get_code_by("MEANING", 339, "CENSUS"))
declare mrn_cd = f8 with protect, constant(uar_get_code_by("MEANING", 319, "MRN"))
declare catholic_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 49, "CATHOLIC"))
declare reg_do_not_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 49, "DONOTVISIT"))
declare church_not_seen_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 267, "NOTTOBESEENBYCLERGY"))
declare inpatient_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "INPATIENT"))
declare hosp_outpatient_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "HOSPITALOUTPATIENT"))
declare observation_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "OBSERVATION"))
 
;record data (
; 1 qual[*]
;   2 sort1 =
;)
execute ReportRtl
 
%i mhs_prg:mayo_mn_church_list_by_date.dvl
 
select into $outdev
sort1 = p.name_full_formatted,
sort2 = uar_get_code_display(ed.loc_room_cd),
sort3 = uar_get_code_display(ed.loc_bed_cd),
Pat_name = p.name_full_formatted,
religion =  uar_get_code_display(p.religion_cd),
church =  uar_get_code_display(pp.church_cd),
nurse_unit = uar_get_code_display(ed.loc_nurse_unit_cd),
room = uar_get_code_display(ed.loc_room_cd),
bed =  uar_get_code_display(ed.loc_bed_cd),
age = cnvtage(p.birth_dt_tm),
sex = uar_get_code_display(p.sex_cd),
mrn = cnvtalias(ea.alias,ea.alias_pool_cd),
type = uar_get_code_display(e.encntr_type_cd),
admit_date = format(e.reg_dt_tm,"mm/dd/yy;;d"),
facility = concat(trim(uar_get_code_display(ed.loc_facility_cd),3)," "),
date_range = concat("Date Range: ",format(cnvtdate($start_date),"mm/dd/yy;;d")," - ",format(cnvtdate($end_date),"mm/dd/yy;;d"))
from
encntr_domain ed,
encounter e,
person p,
person_patient pp,
encntr_alias ea
 
plan ed
where ed.loc_facility_cd = $facility
  and ed.encntr_domain_type_cd = census_cd
  and ed.active_ind = 1
  and ed.end_effective_dt_tm > sysdate
 
join e
where e.encntr_id = ed.encntr_id
  and e.reg_dt_tm between cnvtdatetime(cnvtdate(beg_dt),0) and  cnvtdatetime(cnvtdate(end_dt),235959)
  and e.encntr_type_cd in (inpatient_cd,hosp_outpatient_cd,observation_cd)
 
join p
where p.person_id = e.person_id
  ;and parser(religion_where_clause)
  and p.religion_cd != reg_do_not_cd
 
join pp
where pp.person_id = p.person_id
  and pp.church_cd != church_not_seen_cd
 
join ea
where ea.encntr_id = ed.encntr_id
  and ea.encntr_alias_type_cd = mrn_cd
  and ea.active_ind = 1
  and ea.end_effective_dt_tm > sysdate
 
order sort1, sort2, sort3
 
head report
call InitializeReport(0)
_fEndDetail = RptReport->m_pageWidth - RptReport->m_marginRight
nPAGE = 1
dumb_var = 0
cntr = 0
first_time = "Y"
first_time_cath = "Y"
 
head page
x = HeadPageSection(0)
first_time = "Y"
 
head sort1
if (first_time = "Y")
  x = ColumnHeaders(0)
  first_time = "N"
endif
 
detail
if (_YOffset + DetailSection(1,2.0,dumb_var) > _fEndDetail )
  call PageBreak(0)
  x = HeadPageSection(0)
  x = ColumnHeaders(0)
    first_time = "N"
endif
x = DetailSection(Rpt_Render,2.0,dumb_var)
 
with nocounter
call FinalizeReport($outdev)
 
 
/*** START 001 ***/
;*** After report put back to instance 1
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
/*** END 001 ***/
  
 
 end go
