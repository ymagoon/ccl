/****************************************************************************************************************
										PROGRAM NAME HEADER
					 Purpose:	This CCL is used to generate the patient detailed data for the Census mPage
			Source File Name:	bc_mp_mvs_2.prg
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
	1	04/05/2011		Edwin Hartman				Creation of the Census mPage CCL
;****************************************************************************************************************/

drop program bc_mp_mvs_2_cm:dba go
create program bc_mp_mvs_2_cm:dba

prompt 
	"Output to File/Printer/MINE" = "MINE"
	, "USERID" = ""
	, "WTSLOCATION" = ""
	, "PERSONID" = 0
	, "ENCNTRID" = 0 

with OUTDEV, USERID, WTSLOCATION, PERSONID, ENCNTRID

declare MRN_CV = f8
	with constant(uar_get_code_by("MEANING",4,"MRN")),protect
declare HISTMRN_CV = f8
	with constant(uar_get_code_by("MEANING",4,"HISTMRN")),protect
declare FIN_CV = f8
	with constant(uar_get_code_by("MEANING",319,"FIN NBR")),protect
declare ADMITDOC_CV = f8
	with constant(uar_get_code_by("MEANING",333,"ADMITDOC")),protect
declare ATTENDDOC_CV = f8
	with constant(uar_get_code_by("MEANING",333,"ATTENDDOC")),protect
declare CONSULTDOC_CV = f8
	with constant(uar_get_code_by("MEANING",333,"CONSULTDOC")),protect
declare AUTH_CV = f8
	with constant(uar_get_code_by("MEANING",8,"AUTH")),protect
declare ORDERED_CV = f8
	with constant(uar_get_code_by("MEANING",6004,"ORDERED")),protect	
	
record patient(
	1 user_id_f = f8
	1 person_id = f8
	1 encntr_id = f8
	1 fin_vc = vc
	1 mrn_vc = vc
	1 cpi_vc = vc
	1 religion_vc = vc
	1 los_vc = vc
	1 patient_type_vc = vc
	1 hospital_service_vc = vc
	1 attending_physician_vc = vc
	1 attending_physician_prsnl_id = f8
	1 physician_service_vc = vc
	1 insurance_cnt_i = i4
	1 insurance_vc = vc
	1 insurance[*]
		2 ins_name = vc
	1 admitting_physician_vc = vc
	1 consulting_phys_cnt_i = i4
	1 consulting_phys[*]
		2 phys_name_vc = vc
	1 discharged_i = i1
	1 discharge_dt_tm = dq8
)


		
select into 'nl:'
from encounter e,
	person p,
	encntr_prsnl_reltn epr_attend,
	prsnl prsnl_attend
plan e
	where e.encntr_id = $ENCNTRID
join p
	where p.person_id = e.person_id
join epr_attend
	where epr_attend.encntr_id = outerjoin(e.encntr_id)
	and epr_attend.encntr_prsnl_r_cd = outerjoin(ATTENDDOC_CV)
	and epr_attend.active_ind = outerjoin(1)
	and epr_attend.beg_effective_dt_tm < outerjoin(sysdate)
	and epr_attend.end_effective_dt_tm > outerjoin(sysdate)
join prsnl_attend
	where prsnl_attend.person_id = outerjoin(epr_attend.prsnl_person_id)
detail
	patient->person_id = e.person_id
	patient->encntr_id = e.encntr_id
	patient->religion_vc = uar_get_code_display(p.religion_cd)
	patient->los_vc = build(cnvtstring(round(datetimediff(sysdate, e.arrive_dt_tm, 1),1),6,1), " Day(s)")
	patient->patient_type_vc = uar_get_code_display(e.encntr_type_cd)
	patient->hospital_service_vc = uar_get_code_display(e.med_service_cd)
	
	if (prsnl_attend.person_id > 0.0)
		patient->attending_physician_vc = prsnl_attend.name_full_formatted
		patient->attending_physician_prsnl_id = prsnl_attend.person_id
	endif
	;if (e.disch_disposition_cd > 0.0)
	if (e.disch_dt_tm != NULL)
		patient->discharged_i = 1
		patient->discharge_dt_tm = e.disch_dt_tm
	endif
with nocounter
		
select into 'nl:'
from person_alias pa
plan pa
	where pa.person_id = patient->person_id
	and pa.person_alias_type_cd in (MRN_CV,HISTMRN_CV)
	and pa.beg_effective_dt_tm < sysdate
	and pa.end_effective_dt_tm > sysdate
	and pa.active_ind = 1
detail
	if (pa.person_alias_type_cd = MRN_CV)
		patient->mrn_vc = pa.alias
	else
		patient->cpi_vc = pa.alias
	endif
with nocounter

select into 'nl:'
from encntr_alias ea
plan ea
	where ea.encntr_id = patient->encntr_id
	and ea.encntr_alias_type_cd = FIN_CV
	and ea.beg_effective_dt_tm < sysdate
	and ea.end_effective_dt_tm > sysdate
	and ea.active_ind = 1
detail
	patient->fin_vc = ea.alias
with nocounter
			
select into 'nl:'
from encntr_prsnl_reltn epr,
	prsnl p
plan epr
	where epr.encntr_id = patient->encntr_id
	and epr.encntr_prsnl_r_cd = ADMITDOC_CV
	and epr.active_ind = 1
	and ((patient->discharged_i = 0
		and epr.beg_effective_dt_tm < sysdate
		and epr.end_effective_dt_tm > sysdate)
		or (patient->discharged_i = 1
		and epr.beg_effective_dt_tm < cnvtdatetime(patient->discharge_dt_tm)
		and epr.end_effective_dt_tm > cnvtdatetime(patient->discharge_dt_tm)))
	and epr.data_status_dt_tm = (select max(epr2.data_status_dt_tm)
							from encntr_prsnl_reltn epr2
							where epr2.encntr_id = epr.encntr_id
							and epr2.encntr_prsnl_r_cd = epr.encntr_prsnl_r_cd
							and epr2.active_ind = 1
							and ((patient->discharged_i = 0
							  and epr2.beg_effective_dt_tm < sysdate
							  and epr2.end_effective_dt_tm > sysdate)
							  or (patient->discharged_i = 1
							  and epr2.beg_effective_dt_tm < cnvtdatetime(patient->discharge_dt_tm)
							  and epr2.end_effective_dt_tm > cnvtdatetime(patient->discharge_dt_tm))))
join p
	where p.person_id = epr.prsnl_person_id
detail
	patient->admitting_physician_vc = p.name_full_formatted
with nocounter
			

		
select into 'nl:'
from encntr_plan_reltn epr,
	health_plan hp,
	org_plan_reltn opr,
	organization o,
	person p
plan epr
	where epr.encntr_id = patient->encntr_id
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
	ins_cnt = (patient->insurance_cnt_i + 1)
	patient->insurance_cnt_i = ins_cnt
	stat = alterlist(patient->insurance, ins_cnt)
	patient->insurance[ins_cnt].ins_name = o.org_name
with nocounter

if (patient->insurance_cnt_i > 0)	
	select into 'nl:'
	from (dummyt d1 with seq=patient->insurance_cnt_i)
	plan d1
	order by patient->insurance[d1.seq].ins_name
	detail
		if (d1.seq = 1)
			patient->insurance_vc = patient->insurance[d1.seq].ins_name
		else
			if (patient->insurance[d1.seq].ins_name !=
					patient->insurance[d1.seq - 1].ins_name)
				patient->insurance_vc = concat(trim(patient->insurance_vc),
					", ", trim(patient->insurance[d1.seq].ins_name))
			endif
		endif
	with nocounter
endif

select into 'nl:'
from encntr_prsnl_reltn epr,
	prsnl p
plan epr
	where epr.encntr_id = $ENCNTRID
	and epr.active_ind = 1
	and epr.encntr_prsnl_r_cd = CONSULTDOC_CV
	and ((patient->discharged_i = 0
		and epr.beg_effective_dt_tm < sysdate
		and epr.end_effective_dt_tm > sysdate)
	or (patient->discharged_i = 1
		and epr.beg_effective_dt_tm < cnvtdatetime(patient->discharge_dt_tm)
		and epr.end_effective_dt_tm > cnvtdatetime(patient->discharge_dt_tm)))
join p
	where p.person_id = epr.prsnl_person_id
order by epr.data_status_dt_tm desc
detail
	cnt = (patient->consulting_phys_cnt_i + 1)
	patient->consulting_phys_cnt_i = cnt
	stat = alterlist(patient->consulting_phys, cnt)
	patient->consulting_phys[cnt].phys_name_vc = concat(trim(p.name_last),
		", ", trim(p.name_first))
with nocounter

;call echorecord(patient)
call echojson(patient, $OUTDEV)

end
go
