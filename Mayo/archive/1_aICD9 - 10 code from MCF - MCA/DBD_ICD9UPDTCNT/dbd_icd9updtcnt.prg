drop program dbd_icd9updtcnt go
create program dbd_icd9updtcnt
prompt "Output to File/Printer/MINE" = "MINE"
 
with outdev
record NomId(
	1 qual[*]
		2 field1 = vc
			)
 
declare Idx = i4
free define rtl2
define rtl2 is "mhs_prg:icd9tomcpl2.csv"
;define rtl2 is "mhs_prg:snomedtomcpl.csv"
select into "nl:"
field1 = piece(r.line,",",1,"",0)
from  rtl2t r
plan r
detail
	Idx = Idx+1
	stat = alterlist(NomId->qual,Idx)
	NomId->qual[Idx].field1 = field1
with nocounter
 
select into $outdev ;"mhs_prg:mhprd_leftover_report.txt"
 
	code = n.source_identifier
;	,pe.name_full_formatted
	, display = n.source_string
	, freetext = p.problem_ftdesc
	, n.nomenclature_id
;	,n.concept_cki
	, source_vocabulary = uar_get_code_display(n.source_vocabulary_cd)
	, frequency = count(p.nomenclature_id)
from
	(dummyt d with seq = idx),
	nomenclature   n
	, problem   p
	, person   pe
plan d
;plan n
join n
where n.source_identifier = NomId->qual[d.SEQ].field1
and
;where
;n.source_vocabulary_cd != (value(uar_get_code_by("DISPLAY",400,"MAYO: Problem Search Terminology")))
;n.source_vocabulary_cd = (value(uar_get_code_by("DISPLAY",400,"SNOMED CT")))
; n.source_vocabulary_cd in (select code_value from code_value where code_set=400 and display="SNOMED*")
 n.source_vocabulary_cd = (value(uar_get_code_by("DISPLAY",400,"ICD-9-CM")))
; n.source_vocabulary_cd = (value(uar_get_code_by("DISPLAY",400,"PNED")))
; n.source_vocabulary_cd = (value(uar_get_code_by("DISPLAY",400,"Multum")))
; n.source_vocabulary_cd = (value(uar_get_code_by("DISPLAY",400,"Allergy")))
join p
	where p.nomenclature_id = n.nomenclature_id
	and p.originating_nomenclature_id != (select n3.nomenclature_id from nomenclature n3
        where n3.source_vocabulary_cd = (value(uar_get_code_by("DISPLAY",400,"MAYO: Problem Search Terminology"))))
    and p.active_ind= 1
join pe
	where pe.person_id = p.person_id
	and pe.deceased_dt_tm = null
group by
	n.source_vocabulary_cd
	, n.source_identifier
;	,n.concept_cki
	, n.source_string
	, p.problem_ftdesc
	, n.nomenclature_id
order
	n.source_vocabulary_cd
	, n.source_identifier
;	,n.concept_cki
	, n.source_string
	, p.problem_ftdesc
	, n.nomenclature_id
with counter, skipreport=1, separator=^ ^, format
end
go
 
