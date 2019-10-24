/****************************************************************************************************************
										PROGRAM NAME HEADER
					 Purpose:	This CCL is used to generate the data behind the Census mPage
			Source File Name:	bc_mp_mvs_1.prg
				 Application:	mPages, PowerChart, Registration
	   	 Execution Locations:	PowerChart Organizer
				   Request #:	?????
			 Translated From:	Custom Development by MediView Solutions
			   Special Notes:
;****************************************************************************************************************
										MODIFICATION CONTROL LOG
;****************************************************************************************************************
	Mod	Date			Engineer					Description
	---	--------------	--------------------------	-------------------------------------------------------------
	1	03/10/2011		Edwin Hartman				Creation of the Census mPage CCL
;****************************************************************************************************************/

drop program bc_mp_mvs_1:dba go
create program bc_mp_mvs_1:dba

prompt 
	"Output to File/Printer/MINE" = "MINE"
	, "USERID" = ""
	, "WTSLOCATION" = ""
	, "Selected Facility" = 0
	, "Selected Nurse Unit" = 0
	, "Discharge Lookback" = 0
	, "LOAD_DATA" = 0
	, "SEL_PHYSICIAN" = 0
	, "SEL_PROV_GRP" = 0
	, "STARTUNIT" = ""
	, "STARTROOM" = ""
	, "STARTLASTINIT" = ""
	, "INCL_OUTPATIENT" = 0 

with OUTDEV, USERID, WTSLOCATION, SEL_FACILITY, SEL_NURSEUNIT, DISCHARGE, 
	LOAD_DATA, SEL_PHYSICIAN, SEL_PROV_GRP, STARTUNIT, STARTROOM, STARTLASTINIT, 
	INCL_OUTPATIENT

declare FACILITY_CV = f8
	with constant(uar_get_code_by("MEANING",222,"FACILITY")),protect
declare CENSUS_CV = f8
	with constant(uar_get_code_by("MEANING",339,"CENSUS")),protect
declare MRN_CV = f8
	with constant(uar_get_code_by("MEANING",4,"MRN")),protect
declare FIN_CV = f8
	with constant(uar_get_code_by("MEANING",319,"FIN NBR")),protect
declare ADMITDOC_CV = f8
	with constant(uar_get_code_by("MEANING",333,"ADMITDOC")),protect
declare ATTENDDOC_CV = f8
	with constant(uar_get_code_by("MEANING",333,"ATTENDDOC")),protect
declare CONSULTDOC_CV = f8
	with constant(uar_get_code_by("MEANING",333,"CONSULTDOC")),protect
declare COVERDOC_CV = f8
	with constant(uar_get_code_by("MEANING",333,"COVERDOC")),protect
declare COVERINGPHYSICIAN_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",333,"COVERINGPHYSICIAN")),protect
declare PHYSICIAN_GROUP_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",19189,"PROVIDERGROUP")),protect
declare AUTH_CV = f8
	with constant(uar_get_code_by("MEANING",8,"AUTH")),protect
declare PRIVACY_CV = f8
	with constant(uar_get_code_by("MEANING",67,"YES")),protect
declare ISOLATION_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",200,"ISOLATION")),protect
declare ORDERED_CV = f8
	with constant(uar_get_code_by("MEANING",6004,"ORDERED")),protect	
	
declare INPATIENT_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",71,"INPATIENT")),protect
declare OBSERVATION_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",71,"OBSERVATION")),protect
	
record census(
	1 user_id_f = f8
	1 selected_facility_f = f8
	1 facility_cnt_i = i4
	1 facility[*]
		2 location_cd_f = f8
		2 display_vc = vc
	1 physician_cnt_i = i4
	1 physician_tmp[*]
		2 prsnl_id = f8
		2 physician_name = vc
	1 physician[*]
		2 prsnl_id = f8
		2 physician_name = vc
		2 is_attending = i1
	1 physician_group_cnt_i = i4
	1 physician_group_tmp[*]
		2 group_id = f8
		2 group_name = vc
	1 physician_group[*]
		2 group_id = f8
		2 group_name = vc
	1 selected_nurse_unit_f = f8
	1 nurse_unit_cnt_i = i4
	1 nurse_unit[*]
		2 location_cd_f = f8
		2 display_vc = vc
		2 display_key_vc = vc
	1 patient_cnt_i = i4
	1 patient[*]
		2 person_id = f8
		2 encntr_id = f8
		2 display = i1
		2 full_name_vc = vc
		2 first_name_vc = vc
		2 last_initial_vc = vc
		2 initial_vc = vc
		2 last_name_vc = vc
		2 date_of_birth_vc = vc
		2 sex_vc = vc
		2 privacy_i = i1
		2 admit_dt_tm_vc = vc
		2 discharged_i = i1
		2 discharge_dt_tm = dq8
		2 discharge_dt_tm_vc = vc
		2 location_cd = f8
		2 location_vc = vc
		2 room_bed_vc = vc
		2 unit_key = vc
		2 room_key = vc
		2 bed_id = i4
		2 attending_physician_vc = vc
		2 attending_physician_prsnl_id = f8
		2 physician_service_vc = vc
		2 physician_group_cnt_i = i4
		2 physician_group[*]
			3 group_id = f8
			3 group_name_vc = vc
		2 insurance_cnt_i = i4
		2 insurance_vc = vc
		2 insurance[*]
			3 ins_name = vc
		2 admitting_physician_vc = vc
		2 relationship_vc = vc
		2 pending_transfer_i = i1
		2 pending_discharge_i = i1
		2 isolation_vc = vc
		2 pp_planned = i4
		2 pp_init = i4
)

set census->selected_facility_f = cnvtreal($SEL_FACILITY)

select into 'nl:'
from v500.bc_org_view org
plan org
detail
	cnt = (census->facility_cnt_i + 1)
	census->facility_cnt_i = cnt
	stat = alterlist(census->facility, cnt)
	census->facility[cnt].location_cd_f = org.location_cd
	census->facility[cnt].display_vc = org.description
with nocounter

if (census->selected_facility_f > 0.0)
	declare selected_unit_found_i = i1
	set selected_unit_found_i = 0

	select into 'nl:'
	from location_group lg_p,
		location_group lg,
		location l,
		code_value cv
	plan lg_p
		where lg_p.parent_loc_cd = census->selected_facility_f
		and lg_p.active_ind = 1
		and lg_p.beg_effective_dt_tm < sysdate
		and lg_p.end_effective_dt_tm > sysdate
		and lg_p.root_loc_cd = 0.0
	join lg
		where lg.parent_loc_cd = lg_p.child_loc_cd
		and lg.active_ind = 1
		and lg.beg_effective_dt_tm < sysdate
		and lg.end_effective_dt_tm > sysdate
		and lg.root_loc_cd = 0.0
	join l
		where l.location_cd = lg.child_loc_cd
		and l.beg_effective_dt_tm < sysdate
		and l.end_effective_dt_tm > sysdate
		and l.active_ind = 1
		and l.census_ind = 1
	join cv
		where cv.code_value = l.location_cd
	order by cv.display_key
	detail
		nu_cnt = (census->nurse_unit_cnt_i + 1)
		census->nurse_unit_cnt_i = nu_cnt
		stat = alterlist(census->nurse_unit, nu_cnt)
		census->nurse_unit[nu_cnt].location_cd_f = l.location_cd
		census->nurse_unit[nu_cnt].display_vc = concat(trim(cv.description), " [", trim(cv.display), "]")
		census->nurse_unit[nu_cnt].display_key_vc = trim(cv.display_key)
		if (cnvtreal($SEL_NURSEUNIT) = l.location_cd)
			selected_unit_found_i = 1
		endif
	with nocounter
	
	if ($SEL_NURSEUNIT < 1.0 or $SEL_NURSEUNIT = 999999)
		if ($DISCHARGE < 1)
			select into 'nl:'
			from (dummyt d1 with seq=census->nurse_unit_cnt_i),
				encntr_domain ed,
				encounter e
			plan d1
			join ed
				where ed.loc_nurse_unit_cd = census->nurse_unit[d1.seq].location_cd_f
				and ed.end_effective_dt_tm > sysdate
				and ed.active_ind +0 = 1
				and ed.encntr_domain_type_cd +0 = CENSUS_CV
			join e
				where e.encntr_id = ed.encntr_id
				and e.disch_dt_tm = NULL
				and ($INCL_OUTPATIENT = 1 or 
					($INCL_OUTPATIENT = 0
					and e.encntr_type_cd in (INPATIENT_CV,OBSERVATION_CV)))
			detail
				cnt = census->patient_cnt_i + 1
				census->patient_cnt_i = cnt
				stat = alterlist(census->patient, cnt)
				census->patient[cnt].encntr_id = ed.encntr_id
				census->patient[cnt].person_id = ed.person_id
				census->patient[cnt].discharged_i = 0
			with nocounter
		else
			select into 'nl:'
			from (dummyt d1 with seq=census->nurse_unit_cnt_i),
					encounter e
			plan d1
			join e
				where e.disch_dt_tm > cnvtlookbehind(build($DISCHARGE,"D"))
				and e.loc_nurse_unit_cd +0 = census->nurse_unit[d1.seq].location_cd_f
				and e.arrive_dt_tm +0 < sysdate
				and e.active_ind = 1
				and ($INCL_OUTPATIENT = 1 or 
					($INCL_OUTPATIENT = 0
					and e.encntr_type_cd in (INPATIENT_CV,OBSERVATION_CV)))
			detail
				cnt = census->patient_cnt_i + 1
				census->patient_cnt_i = cnt
				stat = alterlist(census->patient, cnt)
				census->patient[cnt].encntr_id = e.encntr_id
				census->patient[cnt].person_id = e.person_id
				census->patient[cnt].discharged_i = 1
				census->patient[cnt].discharge_dt_tm = e.disch_dt_tm
				census->patient[cnt].discharge_dt_tm_vc = format(e.disch_dt_tm, "mm/dd/yyyy hh:mm;;q")
			with nocounter
		endif
	else
		if ($DISCHARGE < 1)
			select into 'nl:'
			from encntr_domain ed,
				encounter e
			plan ed
				where ed.loc_nurse_unit_cd = $SEL_NURSEUNIT
				and ed.end_effective_dt_tm > sysdate
				and ed.active_ind +0 = 1
				and ed.encntr_domain_type_cd +0 = CENSUS_CV
			join e
				where e.encntr_id = ed.encntr_id
				and e.disch_dt_tm = NULL
				and ($INCL_OUTPATIENT = 1 or 
					($INCL_OUTPATIENT = 0
					and e.encntr_type_cd in (INPATIENT_CV,OBSERVATION_CV)))
			detail
				cnt = census->patient_cnt_i + 1
				census->patient_cnt_i = cnt
				stat = alterlist(census->patient, cnt)
				census->patient[cnt].encntr_id = ed.encntr_id
				census->patient[cnt].person_id = ed.person_id
				census->patient[cnt].discharged_i = 0
			with nocounter
		else
			select into 'nl:'
			from encounter e
			plan e
				where e.disch_dt_tm > cnvtlookbehind(build($DISCHARGE,"D"))
				and e.loc_nurse_unit_cd +0 = $SEL_NURSEUNIT
				and e.arrive_dt_tm +0 < sysdate
				and e.active_ind = 1
				and ($INCL_OUTPATIENT = 1 or 
					($INCL_OUTPATIENT = 0
					and e.encntr_type_cd in (INPATIENT_CV,OBSERVATION_CV)))
			detail
				cnt = census->patient_cnt_i + 1
				census->patient_cnt_i = cnt
				stat = alterlist(census->patient, cnt)
				census->patient[cnt].encntr_id = e.encntr_id
				census->patient[cnt].person_id = e.person_id
				census->patient[cnt].discharged_i = 1
				census->patient[cnt].discharge_dt_tm = e.disch_dt_tm
				census->patient[cnt].discharge_dt_tm_vc = format(e.disch_dt_tm, "mm/dd/yyyy hh:mm;;q")
			with nocounter
		endif	
	endif
	
	if (census->patient_cnt_i > 0)
		select into 'nl:'
		from (dummyt d1 with seq=census->patient_cnt_i),
			encntr_prsnl_reltn epr,
			prsnl p
		plan d1
		join epr
			where epr.encntr_id = census->patient[d1.seq].encntr_id
			and epr.encntr_prsnl_r_cd in (ADMITDOC_CV, CONSULTDOC_CV, ATTENDDOC_CV, 
									COVERDOC_CV, COVERINGPHYSICIAN_CV)
			and epr.active_ind = 1
			and ((census->patient[d1.seq].discharged_i = 0
				and epr.beg_effective_dt_tm < sysdate
				and epr.end_effective_dt_tm > sysdate)
			or (census->patient[d1.seq].discharged_i = 1
				and epr.beg_effective_dt_tm < cnvtdatetime(census->patient[d1.seq].discharge_dt_tm)
				and epr.end_effective_dt_tm > cnvtdatetime(census->patient[d1.seq].discharge_dt_tm)))
		;commented by V. Do to show all physicians relationship
		/*	and epr.data_status_dt_tm = (select max(epr2.data_status_dt_tm)
									from encntr_prsnl_reltn epr2
									where epr2.encntr_id = epr.encntr_id
									and epr2.encntr_prsnl_r_cd = epr.encntr_prsnl_r_cd
									and epr2.active_ind = 1
									and ((census->patient[d1.seq].discharged_i = 0
									  and epr2.beg_effective_dt_tm < sysdate
									  and epr2.end_effective_dt_tm > sysdate)
	  								    or (census->patient[d1.seq].discharged_i = 1
									  and epr2.beg_effective_dt_tm < cnvtdatetime(census->patient[d1.seq].discharge_dt_tm)
									  and epr2.end_effective_dt_tm > cnvtdatetime(census->patient[d1.seq].discharge_dt_tm))))
		*/ 
		join p
			where p.person_id = epr.prsnl_person_id
			and p.active_ind = 1
		order by p.name_last_key, p.name_first_key
		head p.person_id
			cnt = census->physician_cnt_i + 1
			census->physician_cnt_i = cnt
			stat = alterlist(census->physician, cnt)
			census->physician[cnt].prsnl_id = p.person_id
			census->physician[cnt].physician_name = p.name_full_formatted
			
			
		detail
			if ($SEL_PHYSICIAN > 0)
				if (p.person_id = $SEL_PHYSICIAN)
					census->patient[d1.seq].display = 1
				endif
			else
				census->patient[d1.seq].display = 1
			endif
			case (epr.encntr_prsnl_r_cd)
			of ATTENDDOC_CV:
				census->patient[d1.seq].attending_physician_prsnl_id = p.person_id
				census->patient[d1.seq].attending_physician_vc = p.name_full_formatted
				census->physician[cnt].is_attending = 1
			of ADMITDOC_CV:
				census->patient[d1.seq].admitting_physician_vc = p.name_full_formatted
			endcase
		with nocounter
	endif
	
	if (census->physician_cnt_i > 0)
		if ($SEL_PHYSICIAN > 0)
			select into 'nl:'
			from prsnl_group_reltn pgr,
				prsnl_group pg,
				code_value cv
			plan pgr
				where pgr.person_id = $SEL_PHYSICIAN
				and pgr.active_ind = 1
				and pgr.beg_effective_dt_tm < sysdate
				and pgr.end_effective_dt_tm > sysdate
			join pg
				where pg.prsnl_group_id = pgr.prsnl_group_id
				and pg.active_ind = 1
				and pg.beg_effective_dt_tm < sysdate
				and pg.end_effective_dt_tm > sysdate
				and pg.prsnl_group_class_cd = PHYSICIAN_GROUP_CV
			join cv
				where cv.code_value = pg.prsnl_group_type_cd
				and cv.cdf_meaning = "DCPTEAM"
			;order by pg.prsnl_group_name_key
			;head pg.prsnl_group_id
			;head pg.prsnl_group_name_key
			order by pg.prsnl_group_desc
			head pgr.prsnl_group_id
				cnt = census->physician_group_cnt_i + 1
				census->physician_group_cnt_i = cnt
				stat = alterlist(census->physician_group, cnt)
				census->physician_group[cnt].group_id = pg.prsnl_group_id
				census->physician_group[cnt].group_name = pg.prsnl_group_name
			with nocounter
		else
			select into 'nl:'
			from (dummyt d1 with seq=census->physician_cnt_i),
				prsnl_group_reltn pgr,
				prsnl_group pg
				, code_value cv
			plan d1
;				where census->physician[d1.seq].is_attending = 1
			join pgr
				where pgr.person_id = census->physician[d1.seq].prsnl_id
				and pgr.active_ind = 1
				and pgr.beg_effective_dt_tm < sysdate
				and pgr.end_effective_dt_tm > sysdate
			join pg
				where pg.prsnl_group_id = pgr.prsnl_group_id
				and pg.active_ind = 1
				and pg.beg_effective_dt_tm < sysdate
				and pg.end_effective_dt_tm > sysdate
				and pg.prsnl_group_class_cd = PHYSICIAN_GROUP_CV
			join cv
				where cv.code_value = pg.prsnl_group_type_cd
				and cv.cdf_meaning = "DCPTEAM"
			;order by pg.prsnl_group_name_key
			;head pg.prsnl_group_id
			;head pg.prsnl_group_name_key
			order by pg.prsnl_group_id
			head pg.prsnl_group_id
				cnt = census->physician_group_cnt_i + 1
				census->physician_group_cnt_i = cnt
				stat = alterlist(census->physician_group, cnt)
				census->physician_group[cnt].group_id = pg.prsnl_group_id
				census->physician_group[cnt].group_name = pg.prsnl_group_name
			with nocounter
		endif
	endif

	
	if ($LOAD_DATA = 1)
		if ($SEL_PROV_GRP > 0)
			select into 'nl:'
			from (dummyt d1 with seq=census->patient_cnt_i)
			plan d1
			detail
				census->patient[d1.seq].display = 0
			with nocounter
		endif
		select into 'nl:'
		from (dummyt d1 with seq=census->patient_cnt_i),
			encntr_prsnl_reltn epr,
			prsnl_group_reltn pgr,
			prsnl_group pg
		plan d1
		;	where census->patient[d1.seq].attending_physician_prsnl_id > 0
		join epr
			where epr.encntr_id = census->patient[d1.seq].encntr_id
			and epr.encntr_prsnl_r_cd in (ADMITDOC_CV, CONSULTDOC_CV, ATTENDDOC_CV, 
									COVERDOC_CV, COVERINGPHYSICIAN_CV)
			and epr.active_ind = 1
			and ((census->patient[d1.seq].discharged_i = 0
				and epr.beg_effective_dt_tm < sysdate
				and epr.end_effective_dt_tm > sysdate)
			or (census->patient[d1.seq].discharged_i = 1
				and epr.beg_effective_dt_tm < cnvtdatetime(census->patient[d1.seq].discharge_dt_tm)
				and epr.end_effective_dt_tm > cnvtdatetime(census->patient[d1.seq].discharge_dt_tm)))
		join pgr
		;	where pgr.person_id = census->patient[d1.seq].attending_physician_prsnl_id
			where pgr.person_id = epr.prsnl_person_id
			and pgr.active_ind = 1
			and pgr.beg_effective_dt_tm < sysdate
			and pgr.end_effective_dt_tm > sysdate
			join pg
			where pg.prsnl_group_id = pgr.prsnl_group_id
			and pg.active_ind = 1
			and pg.beg_effective_dt_tm < sysdate
			and pg.end_effective_dt_tm > sysdate
			and pg.prsnl_group_class_cd = PHYSICIAN_GROUP_CV
		head epr.encntr_id
			if ($SEL_PROV_GRP > 0)
				census->patient[d1.seq].display = 0
			endif
		detail
			cnt = census->patient[d1.seq].physician_group_cnt_i + 1
			census->patient[d1.seq].physician_group_cnt_i = cnt
			stat = alterlist(census->patient[d1.seq].physician_group, cnt)
			census->patient[d1.seq].physician_group[cnt].group_id = pg.prsnl_group_id
			census->patient[d1.seq].physician_group[cnt].group_name_vc = pg.prsnl_group_name
;			call echo(build("SEL_PROV_GRP:",$SEL_PROV_GRP))
;			call echo(build("pg.prsnl_group_id:",pg.prsnl_group_id))
			if ($SEL_PROV_GRP > 0 and $SEL_PROV_GRP = pg.prsnl_group_id)
				call echo("setting display to true")
				call echo(build("encntr_id:", census->patient[d1.seq].encntr_id))
				call echo(build("pg.prsnl_group_id:", pg.prsnl_group_id))
				census->patient[d1.seq].display = 1
			endif
		with nocounter
		
		if ($SEL_PHYSICIAN > 0)
			select into 'nl:'
			from (dummyt d1 with seq=census->patient_cnt_i),
				encntr_prsnl_reltn epr
			plan d1
			join epr
				where epr.encntr_id = census->patient[d1.seq].encntr_id
				and epr.prsnl_person_id = $SEL_PHYSICIAN
				and ((census->patient[d1.seq].discharged_i = 0
				and epr.beg_effective_dt_tm < sysdate
				and epr.end_effective_dt_tm > sysdate)
			or (census->patient[d1.seq].discharged_i = 1
				and epr.beg_effective_dt_tm < cnvtdatetime(census->patient[d1.seq].discharge_dt_tm)
				and epr.end_effective_dt_tm > cnvtdatetime(census->patient[d1.seq].discharge_dt_tm)))
				and epr.active_ind = 1
			detail
				if (trim(census->patient[d1.seq].relationship_vc) > " ")
					census->patient[d1.seq].relationship_vc = concat(trim(census->patient[d1.seq].relationship_vc),
						", ", trim(uar_get_code_display(epr.encntr_prsnl_r_cd)))
				else
					census->patient[d1.seq].relationship_vc = trim(uar_get_code_display(epr.encntr_prsnl_r_cd))
				endif
			with nocounter
		endif
		
		select into 'nl:'
			room_sort = cnvtupper(uar_get_code_display(e.loc_room_cd)),
			bed_sort = cnvtupper(uar_get_code_display(e.loc_bed_cd))
		from (dummyt d1 with seq=census->patient_cnt_i),
			encounter e,
			person p, 
			code_value cv
		plan d1
			where census->patient[d1.seq].display = 1
		join e
			where e.encntr_id = census->patient[d1.seq].encntr_id
			and ($INCL_OUTPATIENT = 1 or 
				($INCL_OUTPATIENT = 0
				and e.encntr_type_cd in (INPATIENT_CV,OBSERVATION_CV)))
		join p
			where p.person_id = e.person_id
		join cv
			where cv.code_value = e.loc_nurse_unit_cd
		order by room_sort, bed_sort
		detail
			census->patient[d1.seq].person_id = e.person_id
			census->patient[d1.seq].encntr_id = e.encntr_id
			census->patient[d1.seq].full_name_vc = p.name_full_formatted
			census->patient[d1.seq].first_name_vc = trim(p.name_first)
			census->patient[d1.seq].last_initial_vc = trim(substring(1,5,trim(p.name_last_key)))
			census->patient[d1.seq].initial_vc = trim(substring(1,1,trim(p.name_middle)))
			census->patient[d1.seq].last_name_vc = trim(p.name_last)
			census->patient[d1.seq].location_cd = e.loc_bed_cd
			census->patient[d1.seq].location_vc = uar_get_code_display(e.loc_nurse_unit_cd)
			census->patient[d1.seq].room_bed_vc = uar_get_code_display(e.loc_room_cd)
			census->patient[d1.seq].unit_key = cv.display_key
			;census->patient[d1.seq].unit_key = census->nurse_unit[d1.seq].display_key_vc
			;census->patient[d1.seq].room_key = cv_room.display_key
			;census->patient[d1.seq].bed_id = bed_id
			if (e.loc_bed_cd != 0)
				census->patient[d1.seq].room_bed_vc = concat(census->patient[d1.seq].room_bed_vc,
					"/", uar_get_code_display(e.loc_bed_cd))
			endif
			census->patient[d1.seq].date_of_birth_vc = format(p.birth_dt_tm, "mm/dd/yyyy;;q")
			census->patient[d1.seq].sex_vc = uar_get_code_display(p.sex_cd)
			if (e.vip_cd = PRIVACY_CV)
				census->patient[d1.seq].privacy_i = 1
			endif
			census->patient[d1.seq].admit_dt_tm_vc = format(e.arrive_dt_tm, "mm/dd/yyyy hh:mm;;q")
		with nocounter
		
		select into 'nl:'
		from (dummyt d1 with seq=census->patient_cnt_i),
			encntr_plan_reltn epr,
			health_plan hp,
			org_plan_reltn opr,
			organization o,
			person p
		plan d1
			where census->patient[d1.seq].display = 1
		join epr
			where epr.encntr_id = census->patient[d1.seq].encntr_id
			and epr.active_ind = 1
			and epr.beg_effective_dt_tm < sysdate
			and epr.end_effective_dt_tm > sysdate
		join p
			where p.person_id = epr.person_id
		join hp
			where hp.health_plan_id = epr.health_plan_id
			and hp.active_ind = 1
			and hp.beg_effective_dt_tm < sysdate
			and hp.end_effective_dt_tm > sysdate
		join opr
			where opr.health_plan_id = hp.health_plan_id
			and opr.organization_id = epr.organization_id
			and opr.active_ind = 1
		join o
			where o.organization_id = opr.organization_id
		detail
			ins_cnt = (census->patient[d1.seq].insurance_cnt_i + 1)
			census->patient[d1.seq].insurance_cnt_i = ins_cnt
			stat = alterlist(census->patient[d1.seq].insurance, ins_cnt)
			census->patient[d1.seq].insurance[ins_cnt].ins_name = o.org_name
		with nocounter

		select into 'nl:'
		from (dummyt d1 with seq=census->patient_cnt_i),
			(dummyt d2 with seq=1)
		plan d1
			where census->patient[d1.seq].display = 1
			and maxrec(d2, census->patient[d1.seq].insurance_cnt_i)
		join d2
		order by census->patient[d1.seq].insurance[d2.seq].ins_name
		detail
			if (d2.seq = 1)
				census->patient[d1.seq].insurance_vc = census->patient[d1.seq].insurance[d2.seq].ins_name
			else
				if (census->patient[d1.seq].insurance[d2.seq].ins_name !=
						census->patient[d1.seq].insurance[d2.seq - 1].ins_name)
					census->patient[d1.seq].insurance_vc = concat(trim(census->patient[d1.seq].insurance_vc),
						", ", trim(census->patient[d1.seq].insurance[d2.seq].ins_name))
				endif
			endif
		with nocounter
		
		select into 'nl:'
		from (dummyt d1 with seq=census->patient_cnt_i),
			prsnl_group_reltn pgr,
			prsnl_group pg
		plan d1
			where census->patient[d1.seq].display = 1
			and census->patient[d1.seq].attending_physician_prsnl_id > 0.0
		join pgr
			where pgr.person_id = census->patient[d1.seq].attending_physician_prsnl_id
			and pgr.active_ind = 1
			and pgr.beg_effective_dt_tm < sysdate
			and pgr.end_effective_dt_tm > sysdate
		join pg
			where pg.prsnl_group_id = pgr.prsnl_group_id
			and pg.active_ind = 1
			and pg.prsnl_group_class_cd = 0.0
			and pg.beg_effective_dt_tm < sysdate
			and pg.end_effective_dt_tm > sysdate
		detail
			census->patient[d1.seq].physician_service_vc = pg.prsnl_group_name
		with nocounter
	endif
endif

;added by v. do

IF (CENSUS->patient_cnt_i > 0)
		SELECT pw.encntr_id, status = uar_get_code_display(pw.pw_status_cd), total_pp = count(pw.pw_status_cd)
		FROM 	(DUMMYT   D1  WITH SEQ = VALUE(SIZE(CENSUS->patient, 5))),
				pathway pw
		PLAN D1
		JOIN PW
		WHERE pw.encntr_id =   CENSUS->patient[D1.SEQ].encntr_id ;    41995048.00
	  		and pw.pw_status_cd in (996990.00,996991.00) ;996990 = initiaed & 996990 = planned

			  and pw.active_ind = 1 ;active
		GROUP BY pw.encntr_id,  pw.pw_status_cd

		HEAD pw.encntr_id
				cnt = 0
		DETAIL
			if (pw.pw_status_cd = 996990.00)
				CENSUS->patient[D1.SEQ].pp_init = total_pp
			endif
			if (pw.pw_status_cd = 996991.00)
				CENSUS->patient[D1.SEQ].pp_planned = total_pp
			endif
with format



ENDIF ;end added by v. do

;call echorecord(census)
call echojson(census, $OUTDEV)

end
go
