/*** Modification log **
Mod     Date     Engineer                      Description
------- -------- ----------------------------- -------------------------------------------------
000     09/19/11 Akcia - SE                   New Report
*/
 
drop program mayo_mn_encntr_combine_report go
create program mayo_mn_encntr_combine_report
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Start Date" = CURDATE
	, "End Date" = CURDATE
	;<<hidden>>"Facility Group" = ""
	, "Facility" = 0
 
with OUTDEV, start_date, end_date, facility
 
;record data (
;1 qual[*]
;  2 old_patient_name = vc
;  2 new_patient_name = vc
;  2 old_mrn = vc
;  2 new_mrn = vc
;  2 new_fin = vc
;  2 old_fin = vc
;  2 new_encntr_type = vc
;  2 old_encntr_type = vc
;  2 combine_type = vc
;  2 combine_dt = vc
;  2 combined_by = vc
;)
 
declare fin_cd = f8 with protect, constant(uar_get_code_by("MEANING", 319, "FIN NBR"))
declare mrn_cd = f8 with protect, constant(uar_get_code_by("MEANING", 319, "MRN"))
declare facility_name  = vc ;with constant(uar_get_code_display($facility))
set facility_name = uar_get_code_description(cnvtreal($facility))
 
execute ReportRtl
 
%i mhs_prg:mayo_mn_encntr_combine_report.dvl
 
SELECT INTO "nl:"
old_name= p2.name_full_formatted,
new_patient_name =p1.name_full_formatted,
old_mrn = ea4.alias,
new_mrn = ea3.alias,
new_fin =ea1.alias,
old_fin =ea2.alias,
new_encntr_type =uar_get_code_display(e1.encntr_type_cd),
old_encntr_type =uar_get_code_display(e2.encntr_type_cd),
combine_type =uar_get_code_display(ec.combine_action_cd),
combine_dt =format(ec.cmb_dt_tm,"mm/dd/yy;;d"),
combined_by =  pl.name_full_formatted

FROM
	encntr_combine   ec
	, encounter   e1
	, encounter   e2
	, person   p1
	, person   p2
	, encntr_alias   ea1
	, encntr_alias   ea3
	, encntr_alias   ea2
	, encntr_alias   ea4
	, prsnl   pl
 
;code_value c1,
;code_value c2
plan ec
where ec.updt_dt_tm between cnvtdatetime(cnvtdate($start_date), 0)
                        and cnvtdatetime(cnvtdate($end_date),235959)
and ec.active_ind = 1
and ((ec.to_encntr_id in(select e.encntr_id from encounter e where e.encntr_id = ec.to_encntr_id
                             and e.loc_facility_cd = $facility))
     or (ec.from_encntr_id in(select e.encntr_id from encounter e where e.encntr_id = ec.from_encntr_id
 
                               and e.loc_facility_cd = $facility)))
 
join e1
where e1.encntr_id = ec.to_encntr_id
 
join e2
where e2.encntr_id = ec.from_encntr_id
 
join p1
where p1.person_id = e1.person_id
 
join p2
where p2.person_id = e2.person_id
 
join ea1
where ea1.encntr_id = e1.encntr_id
  and ea1.encntr_alias_type_cd = fin_cd
  and ea1.active_ind = 1
  and ea1.end_effective_dt_tm > sysdate
 
join ea3
where ea3.encntr_id = e1.encntr_id
  and ea3.encntr_alias_type_cd = mrn_cd
  and ea3.active_ind = 1
  and ea3.end_effective_dt_tm > sysdate
 
join ea2
where ea2.encntr_id = outerjoin(e1.encntr_id)
  and ea2.encntr_alias_type_cd = outerjoin(fin_cd)
  and ea2.active_ind = outerjoin(0)
  and ea2.end_effective_dt_tm > outerjoin(sysdate)
 
join ea4
where ea4.encntr_id = outerjoin(e1.encntr_id)
  and ea4.encntr_alias_type_cd = outerjoin(mrn_cd)
  and ea4.active_ind = outerjoin(0)
  and ea4.end_effective_dt_tm > outerjoin(sysdate)
 
join pl
where pl.person_id = outerjoin(ec.cmb_updt_id)
 
;join c1
;where c1.code_value = e1.contributor_system_cd
;
;join c2
;where c2.code_value = e2.contributor_system_cd
 
ORDER BY
	ea1.alias
head report
call InitializeReport(0)
_fEndDetail = RptReport->m_pageHeight - RptReport->m_marginTop   ;portrait
;_fEndDetail = RptReport->m_pageWidth - RptReport->m_marginRight  ;landscape
nPAGE = 1
dumb_var = 0
x = LayoutSection0(0)
 
detail
if (_YOffset + DetailSection(1) > _fEndDetail )
  call PageBreak(0)
 ; x = HeaderSection(0)
endif
x = DetailSection(0)
 
with nocounter, nullreport
 
call FinalizeReport($outdev)
 
 
 
;WITH nocounter  ;,skipreport = 1, format, separator = " "
 
 
 
;select into $outdev
;disp = data->qual[d.seq].old_patient_name
;from
;(dummyt d with seq = size(data->qual,5))
;
 
 
 
 
 end go
