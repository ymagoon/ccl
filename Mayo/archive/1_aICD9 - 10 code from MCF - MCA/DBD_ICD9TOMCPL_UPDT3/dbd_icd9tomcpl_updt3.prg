drop program dbd_icd9tomcpl_updt3 go
create program dbd_icd9tomcpl_updt3
prompt "Output to File/Printer/MINE" = "MINE"
 
with outdev
record NomId(
	1 qual[*]
		2 field1 = vc
		2 field2 = vc
		)
 
declare Idx = i4
free define rtl2
;define rtl2 is "mhs_prg:icd9tomcpl2.csv"
define rtl2 is "mhs_prg:snomedtomcpl.csv"
select into "nl:"
field1 = piece(r.line,",",1,"",0)
, field2 = piece(r.line,",",2,"",0)
 
from  rtl2t r
plan r
detail
	Idx = Idx+1
	stat = alterlist(NomId->qual,Idx)
	NomId->qual[Idx].field1 = field1
	NomId->qual[Idx].field2 = field2
 
with nocounter
 
record NomId2(
	1 qual[*]
		2 icd9nomid = f8
		2 mayonomid = f8
		2 icd9_cd = vc
		2 mayo_cd = vc
		)
declare Idx2 = i4
select into $outdev
icd9_cd = n.source_identifier
, icd9nomid = n.nomenclature_id
, mayo_cd = n2.source_identifier
, mayonomid = n2.nomenclature_id
from
	(dummyt d with seq = idx)
	, nomenclature n
	, nomenclature n2
plan d
join n
where n.source_identifier = NomId->qual[d.SEQ].field1
;and n.source_vocabulary_cd = (value(uar_get_code_by("DISPLAY",400,"ICD-9-CM")))
and n.source_vocabulary_cd = (value(uar_get_code_by("DISPLAY",400,"SNOMED CT")))
and n.source_identifier != ""
join n2
where n2.source_identifier = NomId->qual[d.SEQ].field2
and n2.source_vocabulary_cd = (value(uar_get_code_by("DISPLAY",400,"MAYO: Problem Search Terminology")))
and n2.end_effective_dt_tm > sysdate
order by icd9_cd
	, icd9nomid
	, mayo_cd
detail
	Idx2 = Idx2 + 1
	stat = alterlist(NomId2->qual, Idx2)
	NomId2->qual[Idx2].icd9nomid = icd9nomid
	NomId2->qual[Idx2].mayonomid = mayonomid
	NomId2->qual[Idx2].mayo_cd = mayo_cd
	NomId2->qual[Idx2].icd9_cd = icd9_cd
 
 
with nocounter
;call echorecord(NomId2)
;#endit
 
set enc_size = size(NomId2->qual,5)
set rec_cnt = 1
 
for (rec_cnt = 1 to enc_size)
	update into problem p
    set p.originating_nomenclature_id = NomId2->qual[rec_cnt].mayonomid
	, p.updt_applctx = 888.58609
	, p.updt_cnt = p.updt_cnt +1
	, p.updt_dt_tm = sysdate
	, p.updt_id = 13825979
	, p.updt_task = 2100013
	, p.active_status_prsnl_id = 13825979
	where p.problem_instance_id > 0
	and p.NOMENCLATURE_ID = NomId2->qual[rec_cnt].icd9nomid
	and p.person_id = (select pe.person_id from person pe where pe.deceased_dt_tm = null)
	and p.originating_nomenclature_id != (select n3.nomenclature_id from nomenclature n3
        where n3.source_vocabulary_cd = (value(uar_get_code_by("DISPLAY",400,"MAYO: Problem Search Terminology"))))
    and p.active_ind= 1
if(mod(rec_cnt,1) = 0)
commit
endif
 
endfor
 
;with nocounter
end
go
 
