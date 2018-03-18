/************************************************************************
          Date Written:       04/28/11
          Source file name:   mayo_mn_30_day_readmission.prg
          Object name:        mayo_mn_30_day_readmission
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
 *001 08/14/13 Akcia-SE		add ops logic
 *002 09/13/13 Akcia-SE   add nurse_units to ignore (update to prompt as well)
 *003 12/11/14 Akcia-SE   add code for score and physician npi
 *004 12/16/14 Akcia	  add FIN
 ***********************************************************************
 
  ******************  END OF ALL MODCONTROL BLOCKS  ********************/
 
drop program mayo_mn_discharge_summary:dba go
create program mayo_mn_discharge_summary:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	;<<hidden>>"Facility Group" = ""
	, "Select Facilities" = 0
	, "Nurse Unit" = 0
	, "Start Date" = CURDATE
	, "End Date" = CURDATE
 
with OUTDEV, facility, nurse_unit, start_date, end_date
 
;start 001
declare ops_ind = c1 with noconstant("N")
set ops_ind =  validate(request->batch_selection, "Z")
 
if (ops_ind = "Z")
	set beg_dt = cnvtdatetime(cnvtdate($start_date),0)
  set end_dt = cnvtdatetime(cnvtdate($end_date),235959)
else
	set beg_dt = cnvtdatetime(curdate-1,0)
  set end_dt = cnvtdatetime(curdate-1,235959)
endif
;end 001
 
declare inpatient_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "INPATIENT"))
declare observation_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "OBSERVATION"))			;003
declare mrn_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 319, "MRN"))
declare fin_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 319, "FINNBR"))			;004
declare teach_eval_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "TEACHINGEVALUATION"))
declare disch_phone_call_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "HOSPITALDISCHARGEPHONECALL"))
declare prim_phys_cd = f8 with protect, constant(uar_get_code_by("MEANING", 331, "PCP"))
declare bh_nu1_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "AUHOPSYCH"))	;002
declare bh_nu2_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "LASFIPBH"))	;002
declare bh_nu3_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "FAFNLUTZWING"))	;002
declare bh_nu4_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MAIJMENTALHLT"))		;002
declare npi_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 263, "NPI"))			;003
declare high_risk_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "HIGHRISKFORREADMISSION"))				;003
declare inter_risk_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "INTERMEDIATERISKFORREADMISSION"))		;003
 
;if (reflect($nurse_unit) = "C1")
;  set nurse_unit_where = " 1 = 1 "
;else
;  set nurse_unit_where = " e.loc_nurse_unit_cd =  "
;endif
;
 
 
record data (
1 qual[*]
  2 person_id = f8
  2 disch_encntr_id = f8
  2 mrn = vc
  2 fin = vc    ;004
  2 pat_name = vc
  2 disch_date= vc
  2 score = vc
  2 nur_unit = vc
  2 prim_care_phys = vc
  2 prim_npi = c25		;003
  2 teach_back = c3
1 disch_tot = i2
1 teach_back_tot = i2
1 score_high = i2
1 score_med = i2
1 score_low = i2
)
 
record display (
1 qual[*]
  2 col_mrn = vc
  2 col_fin = vc		;004
  2 col_name = vc
  2 col_dis_dt = vc
  2 col_score = vc
  2 col_prim_phys = vc
  2 col_prim_npi = c25		;003
  2 col_unit = vc
  2 col_teach = vc
)
 
 
select if (reflect($nurse_unit) = "C1")
	plan e
;001	where e.disch_dt_tm between cnvtdatetime(cnvtdate($start_date),0) and cnvtdatetime(cnvtdate($end_date),235959)
	where e.disch_dt_tm between cnvtdatetime(cnvtdate(beg_dt),0) and cnvtdatetime(cnvtdate(end_dt),235959)	;001
	  and e.active_ind = 1
	  and e.end_effective_dt_tm > sysdate
;003 	  and e.encntr_type_cd = inpatient_cd
	  and e.encntr_type_cd in ( inpatient_cd,observation_cd)			;003
	  and e.loc_facility_cd = $facility
	  and e.loc_nurse_unit_cd > 0
	  and not e.loc_nurse_unit_cd in (bh_nu1_cd,bh_nu2_cd,bh_nu3_cd,bh_nu4_cd)			;002
 
	join p
	where p.person_id = e.person_id
 
	join ea
	where ea.encntr_id = e.encntr_id
	  and ea.end_effective_dt_tm > sysdate
	  and ea.active_ind = 1
	  and ea.encntr_alias_type_cd = mrn_cd
 
;start 004
	join ea1
	where ea1.encntr_id = e.encntr_id
	  and ea1.end_effective_dt_tm > sysdate
	  and ea1.active_ind = 1
	  and ea1.encntr_alias_type_cd = fin_cd
;end 004
 
	join ppr
	where ppr.person_id = outerjoin(p.person_id)
	  and ppr.active_ind = outerjoin(1)
	  and ppr.end_effective_dt_tm > outerjoin(sysdate)
	  and ppr.person_prsnl_r_cd = outerjoin(prim_phys_cd)
 
  join p1
  where p1.person_id = outerjoin(ppr.prsnl_person_id)
 
;start 003
join pa1
where pa1.person_id = outerjoin(ppr.prsnl_person_id)
  and pa1.alias_pool_cd = outerjoin(npi_cd)
  and pa1.active_ind = outerjoin(1)
  and pa1.end_effective_dt_tm > outerjoin(sysdate)
;end 003
 
 
endif
 
 
into "nl:"
from
encounter e,
person p,
encntr_alias ea,
encntr_alias ea1,		;004
person_prsnl_reltn ppr,
prsnl_alias pa1,		;003
person p1
 
	plan e
;001	where e.disch_dt_tm between cnvtdatetime(cnvtdate($start_date),0) and cnvtdatetime(cnvtdate($end_date),235959)
	where e.disch_dt_tm between cnvtdatetime(cnvtdate(beg_dt),0) and cnvtdatetime(cnvtdate(end_dt),235959)	;001
	  and e.active_ind = 1
	  and e.end_effective_dt_tm > sysdate
;003 	  and e.encntr_type_cd = inpatient_cd
	  and e.encntr_type_cd in ( inpatient_cd,observation_cd)			;003
	  and e.loc_facility_cd = $facility
	  and e.loc_nurse_unit_cd = $nurse_unit
 
join p
where p.person_id = e.person_id
 
join ea
where ea.encntr_id = e.encntr_id
  and ea.end_effective_dt_tm > sysdate
  and ea.active_ind = 1
  and ea.encntr_alias_type_cd = mrn_cd
 
;start 004
	join ea1
	where ea1.encntr_id = e.encntr_id
	  and ea1.end_effective_dt_tm > sysdate
	  and ea1.active_ind = 1
	  and ea1.encntr_alias_type_cd = fin_cd
;end 004
 
	join ppr
	where ppr.person_id = outerjoin(p.person_id)
	  and ppr.active_ind = outerjoin(1)
	  and ppr.end_effective_dt_tm > outerjoin(sysdate)
	  and ppr.person_prsnl_r_cd = outerjoin(prim_phys_cd)
 
  join p1
  where p1.person_id = outerjoin(ppr.prsnl_person_id)
 
;start 003
join pa1
where pa1.person_id = outerjoin(ppr.prsnl_person_id)
  and pa1.alias_pool_cd = outerjoin(npi_cd)
  and pa1.active_ind = outerjoin(1)
  and pa1.end_effective_dt_tm > outerjoin(sysdate)
;end 003
 
 
order p.name_full_formatted
 
head report
cnt = 0
 
detail
cnt = cnt + 1
stat = alterlist(data->qual,cnt)
data->qual[cnt].person_id  = e.person_id
data->qual[cnt].disch_encntr_id  = e.encntr_id
data->qual[cnt].mrn  = cnvtalias(ea.alias,ea.alias_pool_cd)
data->qual[cnt].fin  = cnvtalias(ea1.alias,ea1.alias_pool_cd)
data->qual[cnt].pat_name = p.name_full_formatted
data->qual[cnt].disch_date = format(e.disch_dt_tm,"mm/dd/yy hh:mm;;d")
data->qual[cnt].nur_unit = uar_get_code_display(e.loc_nurse_unit_cd)
data->qual[cnt].prim_care_phys = p1.name_full_formatted
data->qual[cnt].teach_back = "No"
data->qual[cnt].prim_npi = pa1.alias			;003
data->disch_tot = data->disch_tot + 1
 
with nocounter
 
select into "nl:"
from
(dummyt d with seq = size(data->qual,5)),
clinical_event ce,
ce_coded_result ccr
 
plan d
 
join ce
where ce.person_id = data->qual[d.seq].person_id
  and ce.event_cd = teach_eval_cd
  and ce.encntr_id = data->qual[d.seq].disch_encntr_id
  and ce.valid_until_dt_tm > sysdate
  and not ce.result_status_cd in (28.00,29.00,30.00,31.00)
 
join ccr
where ccr.event_id = ce.event_id
  and ccr.valid_until_dt_tm > sysdate
  and ccr.descriptor = "Able to teach back"
 
order d.seq
 
head d.seq
data->qual[d.seq].teach_back = "Yes"
data->teach_back_tot = data->teach_back_tot + 1
 
with nocounter
 
;start 003
select into "nl:"
from
(dummyt d with seq = size(data->qual,5)),
clinical_event ce
 
plan d
 
join ce
where ce.person_id = data->qual[d.seq].person_id
  and ce.event_cd in (high_risk_cd,inter_risk_cd)
  and ce.encntr_id = data->qual[d.seq].disch_encntr_id
  and ce.valid_until_dt_tm > sysdate
  and not ce.result_status_cd in (28.00,29.00,30.00,31.00)
  and ce.view_level = 1
  and ce.event_tag != "overwritten"
 
order d.seq, ce.event_end_dt_tm desc
 
head d.seq
 
case (ce.event_cd)
  of high_risk_cd:  data->qual[d.seq].score = ce.result_val
  					data->score_high = data->score_high + 1
  of inter_risk_cd:  data->qual[d.seq].score = ce.result_val
  					data->score_med = data->score_med + 1
endcase
 
with nocounter
;end 003
 
 
declare dcnt = i4
 
set dcnt = 4
set stat = alterlist(display->qual,dcnt)
set display->qual[1].col_mrn = "Discharge Summary Report"
set display->qual[2].col_mrn = concat(format(cnvtdate($start_date),"mm/dd/yy;;d")," - ",format(cnvtdate($end_date),"mm/dd/yy;;d"))
set display->qual[4].col_mrn = "MRN"
set display->qual[4].col_fin = "FIN"			;004
set display->qual[4].col_name = "Name"
set display->qual[4].col_dis_dt = "Discharge Date"
set display->qual[4].col_score = "Score"
set display->qual[4].col_unit = "Unit"
set display->qual[4].col_prim_phys = "Primary Physician"
set display->qual[4].col_teach = "Teach Back"
set display->qual[4].col_prim_npi = "Primary Physician NPI"			;003
 
for (x = 1 to size(data->qual,5))
  set dcnt = dcnt + 1
  set stat = alterlist(display->qual,dcnt)
  set display->qual[dcnt].col_mrn = data->qual[x].mrn
  set display->qual[dcnt].col_fin = data->qual[x].fin			;004
  set display->qual[dcnt].col_name = data->qual[x].pat_name
  set display->qual[dcnt].col_dis_dt = data->qual[x].disch_date
  set display->qual[dcnt].col_score = data->qual[x].score
  set display->qual[dcnt].col_unit = data->qual[x].nur_unit
  set display->qual[dcnt].col_prim_phys = data->qual[x].prim_care_phys
  set display->qual[dcnt].col_prim_npi = data->qual[x].prim_npi			;003
  set display->qual[dcnt].col_teach = data->qual[x].teach_back
endfor
 
set dcnt = dcnt + 8
set stat = alterlist(display->qual,dcnt)
set dcnt = dcnt - 6
set display->qual[dcnt].col_mrn = "Total Discharged Patients for the Period:"
;004  set display->qual[dcnt].col_name = cnvtstring(data->disch_tot)
set display->qual[dcnt].col_fin = cnvtstring(data->disch_tot)			;004
set dcnt = dcnt + 1
set display->qual[dcnt].col_mrn = "Total Discharged Patients Receiving Teach-Back:"
;004  set display->qual[dcnt].col_name = cnvtstring(data->teach_back_tot)
set display->qual[dcnt].col_fin = cnvtstring(data->teach_back_tot)			;004
set dcnt = dcnt + 1
set display->qual[dcnt].col_mrn = "Score Range Totals: High:"
;004  set display->qual[dcnt].col_name = cnvtstring(data->score_high)
set display->qual[dcnt].col_fin = cnvtstring(data->score_high)			;004
set dcnt = dcnt + 1
set display->qual[dcnt].col_mrn = "Medium:"
;004  set display->qual[dcnt].col_name = cnvtstring(data->score_med)
set display->qual[dcnt].col_fin = cnvtstring(data->score_med)			;004
set dcnt = dcnt + 1
set display->qual[dcnt].col_mrn = "Low:"
;004  set display->qual[dcnt].col_name = cnvtstring(data->disch_tot-(data->score_high+data->score_med))
set display->qual[dcnt].col_fin = cnvtstring(data->disch_tot-(data->score_high+data->score_med))			;004
 
 
 
select into $outdev
column1 = substring(1,50,display->qual[d.seq].col_mrn),
column2 = substring(1,50,display->qual[d.seq].col_fin),		;004
column3 = substring(1,50,display->qual[d.seq].col_name),
column4 = substring(1,50,display->qual[d.seq].col_dis_dt),
column5 = substring(1,50,display->qual[d.seq].col_score) ,
column6 = substring(1,50,display->qual[d.seq].col_unit),
column7 = substring(1,50,display->qual[d.seq].col_prim_phys),
column8 = substring(1,50,display->qual[d.seq].col_prim_npi),		;003
column9 = substring(1,50,display->qual[d.seq].col_teach)
 
from
(dummyt d with seq = size(display->qual,5))
 
with format, separator = " "
 
end go
 
 
 
 
 
 
