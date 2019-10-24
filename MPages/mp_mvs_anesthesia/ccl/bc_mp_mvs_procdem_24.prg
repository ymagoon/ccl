drop program bc_mp_mvs_procdem_24:dba go
create program bc_mp_mvs_procdem_24:dba
/**************************************************************************************************
              Purpose: Displays the Procedure and Demographics
     Source File Name: bc_mp_mvs_procdem_24.PRG
              Analyst: MediView Solutions
          Application: PowerChart, SurgiNet
  Execution Locations: 
            Request #: 
      Translated From: 
        Special Notes:
**************************************************************************************************/
/**************************************************************************************************
  Mod  Date            Engineer                Description
   ---  --------------- ----------------------- ------------------------------------------------
    1   08/23/2011      MediView Solutions 	    Initial Release
    2   mm/dd/yyyy      Engineer Name           Initial Release
	3 	mm/dd/yyyy      FirstName LastName      Comments for first modification

**************************************************************************************************/

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "USERID" = 0
	, "PERSONID" = 0
	, "ENCNTRID" = 0
	, "OPTIONS" = "" 

with OUTDEV, USERID, PERSONID, ENCNTRID, OPTIONS

record proc_dem(
	1 person_id = f8
	1 encntr_id = f8
	1 cnt = i4
	1 proc[*]
		2 surg_case_id = f8
		2 procedure = vc
		2 surgeon = vc
		2 surg_date = vc
		2 primary = i1
	1 reason_for_visit = vc
	1 asa_class = vc
	1 arrival_date = vc
	1 attending = vc
	1 admitting = i1
	1 pcp = vc
	1 consultant_1 = vc
	1 consultant_2 = vc
	1 isolation = vc
	1 code_status = vc
	1 home_phone = vc
	1 contact_cnt = i4
	1 contact[*]
		2 name = vc
		2 relationship = vc
		2 phone = vc
)

declare ADMITDOC_333_CV = f8
	with constant(uar_get_code_by("MEANING",333,"ADMITDOC")),protect
declare ATTENDDOC_333_CV = f8
	with constant(uar_get_code_by("MEANING",333,"ATTENDDOC")),protect
declare CONSULTDOC_333_CV = f8
	with constant(uar_get_code_by("MEANING",333,"CONSULTDOC")),protect
declare PCPE_333_CV = f8
	with constant(uar_get_code_by("MEANING",333,"PCPE")),protect
declare ISOLATION_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",200,"ISOLATION")),protect
declare RESUSCITATIONSTATUS_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",200,"RESUSCITATIONSTATUS")),protect
declare ORDERED_CV = f8
	with constant(uar_get_code_by("MEANING",6004,"ORDERED")),protect
declare SNGCDASACLASS_72_VC = f8
	with constant(uar_get_code_by("DISPLAYKEY",72,"SNGCDASACLASS")),protect
DECLARE INERROR_8_CV		= f8 WITH Constant(uar_get_code_by("MEANING",8,"INERROR")),Protect
DECLARE MODIFIED_8_CV		= f8 WITH Constant(uar_get_code_by("MEANING",8,"MODIFIED")),Protect
DECLARE AUTH_8_CV      		= f8 WITH Constant(uar_get_code_by("MEANING",8,"AUTH")),Protect
DECLARE ACTV_48_CV      	= f8 WITH Constant(uar_get_code_by("MEANING",48,"ACTIVE")),Protect
				
set proc_dem->person_id = $PERSONID
set proc_dem->encntr_id = $ENCNTRID

select into 'nl:'
from surgical_case sc,
	surg_case_procedure scp,
	orders o,
	prsnl p
plan sc
	where sc.person_id = $PERSONID
	and sc.encntr_id = $ENCNTRID
	and sc.cancel_reason_cd = 0
join scp
	where scp.surg_case_id = sc.surg_case_id
join o
	where o.order_id = scp.order_id
join p
	where p.person_id = scp.sched_primary_surgeon_id
detail
	cnt = proc_dem->cnt + 1
	proc_dem->cnt = cnt
	stat = alterlist(proc_dem->proc, cnt)
	proc_dem->proc[cnt].surg_case_id = sc.surg_case_id
	proc_dem->proc[cnt].procedure = o.order_mnemonic
	proc_dem->proc[cnt].surgeon = concat(trim(p.name_last),", ", trim(p.name_first))
	proc_dem->proc[cnt].surg_date = format(sc.sched_start_dt_tm, "mm/dd/yyyy;;q")
	proc_dem->proc[cnt].primary = scp.sched_primary_ind
with nocounter

select into 'nl:'
from encounter e
plan e
	where e.person_id = $PERSONID
	and e.encntr_id = $ENCNTRID
detail
	proc_dem->arrival_date = format(e.arrive_dt_tm, "mm/dd/yyyy;;q")
	proc_dem->reason_for_visit = e.reason_for_visit
with nocounter

select into 'nl:'
	sort_id = (if (epr.encntr_prsnl_r_cd = ADMITDOC_333_CV) "01" 
				else "02" endif)
from encntr_prsnl_reltn epr,
	prsnl p
plan epr
	where epr.encntr_id = $ENCNTRID
	and epr.active_ind = 1
	and epr.beg_effective_dt_tm < sysdate
	and epr.end_effective_dt_tm > sysdate
	and epr.encntr_prsnl_r_cd in  (ATTENDDOC_333_CV,
									ADMITDOC_333_CV)
join p
	where p.person_id = epr.prsnl_person_id
order by sort_id
detail
	proc_dem->attending = concat(trim(p.name_last), ", ", trim(p.name_first))
	if (epr.encntr_prsnl_r_cd = ADMITDOC_333_CV)
		proc_dem->admitting = 1
	else
		proc_dem->admitting = 0
	endif
with nocounter

select into 'nl:'
from encntr_prsnl_reltn epr,
	prsnl p
plan epr
	where epr.encntr_id = $ENCNTRID
	and epr.active_ind = 1
	and epr.beg_effective_dt_tm < sysdate
	and epr.end_effective_dt_tm > sysdate
	and epr.encntr_prsnl_r_cd = CONSULTDOC_333_CV
join p
	where p.person_id = epr.prsnl_person_id
order by epr.beg_effective_dt_tm desc
detail
	if (proc_dem->consultant_1 > "")
		proc_dem->consultant_2 = concat(trim(p.name_last), ", ", trim(p.name_first))
	else
		proc_dem->consultant_1 = concat(trim(p.name_last), ", ", trim(p.name_first))
	endif
with nocounter, maxrec = 2

select into 'nl:'
from encntr_prsnl_reltn epr,
	prsnl p
plan epr
	where epr.encntr_id = $ENCNTRID
	and epr.active_ind = 1
	and epr.beg_effective_dt_tm < sysdate
	and epr.end_effective_dt_tm > sysdate
	and epr.encntr_prsnl_r_cd = PCPE_333_CV
join p
	where p.person_id = epr.prsnl_person_id
order by epr.beg_effective_dt_tm desc
detail
	proc_dem->pcp = concat(trim(p.name_last), ", ", trim(p.name_first))
with nocounter, maxrec = 1

select into 'nl:'
from orders o,
	order_detail od
plan o
	where o.encntr_id = $ENCNTRID
	and o.person_id = $PERSONID
	and o.catalog_cd = ISOLATION_CV
	and o.active_ind = 1
	and o.order_status_cd = ORDERED_CV
join od
	where od.order_id = o.order_id
	and od.oe_field_meaning = "ISOLATIONCODE"
head o.order_id
	cnt = 0
detail
	if (cnt > 0)
		proc_dem->isolation = concat(trim(proc_dem->isolation),
			", ", trim(od.oe_field_display_value))
	else
		proc_dem->isolation = trim(od.oe_field_display_value)
	endif
	cnt = (cnt + 1)
with nocounter

select into 'nl:'
from orders o,
	order_detail od
plan o
	where o.encntr_id = $ENCNTRID
	and o.person_id = $PERSONID
	and o.catalog_cd = RESUSCITATIONSTATUS_CV
	and o.active_ind = 1
	and o.order_status_cd = ORDERED_CV
join od
	where od.order_id = o.order_id
	and od.oe_field_meaning = "RESUSCITATIONSTATUS"
head o.order_id
	cnt = 0
detail
	if (cnt > 0)
		proc_dem->code_status = concat(trim(proc_dem->code_status),
			", ", trim(od.oe_field_display_value))
	else
		proc_dem->code_status = trim(od.oe_field_display_value)
	endif
	cnt = (cnt + 1)
with nocounter
select into 'nl:'
from clinical_event ce
plan ce
	where ce.person_id = $PERSONID
	and ce.encntr_id +0 = $ENCNTRID
	and ce.event_cd = SNGCDASACLASS_72_VC
	AND ce.valid_until_dt_tm >= CNVTDATETIME(curdate, curtime3)
	AND ce.event_end_dt_tm < CNVTDATETIME(curdate,curtime3)
	AND ce.record_status_cd = ACTV_48_CV 
	AND ce.result_status_cd +0 IN ( AUTH_8_CV ,MODIFIED_8_CV )
	AND CNVTUPPER(ce.event_title_text) != "DATE\TIME CORRECTION"
	and not exists(select ce1.event_id
					from clinical_event ce1
					where ce1.person_id = ce.person_id
					and ce1.encntr_id +0 = ce.encntr_id
					and ce1.event_cd = ce.event_cd
					and ce1.valid_from_dt_tm < sysdate
					and ce1.valid_until_dt_tm > sysdate
					and ce1.event_end_dt_tm < sysdate
					and ce1.event_end_dt_tm > ce.event_end_dt_tm
					and ce1.record_status_cd = ACTV_48_CV
					and ce1.result_status_cd in (AUTH_8_CV,MODIFIED_8_CV)
					and cnvtupper(ce1.event_title_text) != "DATE\TIME CORRECTION")
detail
	proc_dem->asa_class = ce.result_val
with nocounter

select into 'nl:'
from phone p
plan p
	where p.parent_entity_name = "PERSON"
	and p.parent_entity_id = $PERSONID
	and p.active_ind = 1
	and p.beg_effective_dt_tm < sysdate
	and p.end_effective_dt_tm > sysdate
detail
	proc_dem->home_phone = p.phone_num
with nocounter

select into 'nl:'
from encntr_person_reltn epr,
	person p,
	phone ph
plan epr
	where epr.encntr_id = $ENCNTRID
	and epr.active_ind = 1
	and epr.beg_effective_dt_tm < sysdate
	and epr.end_effective_dt_tm > sysdate
join p
	where p.person_id = epr.related_person_id
join ph
	where ph.parent_entity_name = "PERSON"
	and ph.parent_entity_id = p.person_id
	and ph.active_ind = 1
	and ph.beg_effective_dt_tm < sysdate
	and ph.end_effective_dt_tm > sysdate
head epr.related_person_id
	call echo(build("person_id:",epr.related_person_id))
	cnt = proc_dem->contact_cnt + 1
	proc_dem->contact_cnt = cnt
	stat = alterlist(proc_dem->contact, cnt)
	proc_dem->contact[cnt].name = p.name_full_formatted
	proc_dem->contact[cnt].relationship = uar_get_code_display(epr.related_person_reltn_cd)
	proc_dem->contact[cnt].phone = ph.phone_num
with nocounter

call echorecord(proc_dem)
call echojson(proc_dem, $OUTDEV)
end
go
